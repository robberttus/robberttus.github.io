import React, { useEffect, useMemo, useRef, useState } from 'react';

const NAV_H = 56; // Matches h-14 header (56px)
const EDGE_PAD = 14;
const RAIL_W = 44;
const MINOR_PCT = 1;
const LABEL_PCT = 10;
const MAJOR_LEN = 12;
const MINOR_LEN = 6;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function getRulerMap(vh: number, edgePad: number) {
  const base = NAV_H + edgePad;
  const span = Math.max(1, vh - NAV_H - 2 * edgePad);
  return {
    base,
    span,
    drift: (progress: number) => base - progress * (NAV_H + 2 * edgePad),
  };
}

interface RulerScrollbarProps {
  activePage: string;
}

export const RulerScrollbar: React.FC<RulerScrollbarProps> = ({ activePage }) => {
  const [geom, setGeom] = useState({ docH: 0, vh: 0, vw: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ticksWrapperRef = useRef<HTMLDivElement | null>(null);
  const tickRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tickLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tickLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bracketRef = useRef<HTMLDivElement | null>(null);
  const needleRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);
  const digitColRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  const stateRef = useRef({
    geom: { docH: 0, vh: 0, vw: 0 },
    lastY: 0,
    vel: 0,
    prevPct: -1,
    prevDigits: [-1, -1, -1],
    readoutAbove: false,
    zoomIntent: false,
    zoomP: 0,
    dragging: false,
    dragStartY: 0,
    dragMoved: 0,
    ghostActive: false,
    ghostY: 0,
    zoomTimer: 0 as unknown as number,
  });

  // Track document and viewport dimensions
  useEffect(() => {
    const updateGeom = () => {
      const next = {
        docH: document.documentElement.scrollHeight,
        vh: window.innerHeight,
        vw: window.innerWidth,
      };
      stateRef.current.geom = next;
      setGeom((prev) =>
        prev.docH === next.docH && prev.vh === next.vh && prev.vw === next.vw ? prev : next
      );
    };

    updateGeom();
    const tId = window.setTimeout(updateGeom, 60);
    const ro = new ResizeObserver(updateGeom);
    ro.observe(document.body);
    window.addEventListener('resize', updateGeom);
    return () => {
      window.clearTimeout(tId);
      ro.disconnect();
      window.removeEventListener('resize', updateGeom);
    };
  }, [activePage]);

  // Generate ruler ticks from 0% to 100%
  const ticks = useMemo(() => {
    if (!geom.docH) return [];
    const list: { pct: number; docY: number; major: boolean; alpha: number }[] = [];
    for (let p = 0; p <= 100 + 1e-6; p += MINOR_PCT) {
      const pct = Math.round(p * 100) / 100;
      const major = Math.abs(pct % LABEL_PCT) < 1e-6;
      list.push({
        pct,
        docY: (pct / 100) * geom.docH,
        major,
        alpha: major ? 0.72 : 0.28,
      });
    }
    tickRowRefs.current.length = list.length;
    tickLineRefs.current.length = list.length;
    tickLabelRefs.current.length = list.length;
    return list;
  }, [geom.docH]);

  // 60fps animation loop matching ArtCraft's ruler physics
  useEffect(() => {
    if (!geom.docH) return;
    let rafId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1) || 0.016;
      lastTime = now;

      const st = stateRef.current;
      const { docH, vh } = st.geom;
      if (vh > 0) {
        const scrollY = window.scrollY;
        const maxScroll = Math.max(1, docH - vh);
        const progress = clamp01(scrollY / maxScroll);

        // Exponentially smoothed scroll velocity
        const instVel = (scrollY - st.lastY) / dt;
        st.lastY = scrollY;
        st.vel += (instVel - st.vel) * (1 - Math.exp(-8 * dt));

        const map = getRulerMap(vh, EDGE_PAD);
        const drift = map.drift(progress);

        if (ticksWrapperRef.current) {
          ticksWrapperRef.current.style.transform = `translate3d(0, ${-scrollY + drift}px, 0)`;
        }

        // Needle position
        const needleY = map.base + progress * map.span;
        if (needleRef.current) {
          needleRef.current.style.transform = `translate3d(0, ${needleY}px, 0)`;
        }

        // Flip percentage readout above needle when near bottom
        const shouldBeAbove = needleY > vh - 28;
        if (readoutRef.current && shouldBeAbove !== st.readoutAbove) {
          st.readoutAbove = shouldBeAbove;
          readoutRef.current.style.top = shouldBeAbove ? '-15px' : '4px';
        }

        // Update 3-digit rolling odometer
        const pctInt = Math.round(progress * 100);
        if (pctInt !== st.prevPct) {
          st.prevPct = pctInt;
          containerRef.current?.setAttribute('aria-valuenow', String(pctInt));
          const padded = String(pctInt).padStart(3, '0');
          for (let i = 0; i < 3; i++) {
            const d = padded.charCodeAt(i) - 48;
            if (d !== st.prevDigits[i]) {
              st.prevDigits[i] = d;
              const colEl = digitColRefs.current[i];
              if (colEl) {
                colEl.style.transform = `translateY(${-d}em)`;
              }
            }
          }
        }

        // Smooth interpolation for hover/drag zoom map
        const targetZoom = st.zoomIntent || st.dragging ? 1 : 0;
        st.zoomP += (targetZoom - st.zoomP) * (1 - Math.exp(-10 * dt));
        if (targetZoom === 0 && st.zoomP < 0.001) st.zoomP = 0;
        if (targetZoom === 1 && st.zoomP > 0.999) st.zoomP = 1;
        const zoomP = st.zoomP;

        // Viewport bracket in zoom mode
        if (bracketRef.current) {
          const bracketTop = map.base + (scrollY / docH) * map.span;
          const bracketH = Math.max(12, (vh / docH) * map.span);
          bracketRef.current.style.transform = `translate3d(0, ${bracketTop}px, 0)`;
          bracketRef.current.style.height = `${bracketH}px`;
          bracketRef.current.style.opacity = String(zoomP);
        }

        // Ghost crosshair line on hover
        if (ghostRef.current) {
          if (st.ghostActive) {
            ghostRef.current.style.transform = `translate3d(0, ${st.ghostY}px, 0)`;
            ghostRef.current.style.opacity = String(0.35 * (0.3 + 0.7 * zoomP));
          } else {
            ghostRef.current.style.opacity = '0';
          }
        }

        // Update individual ticks (zoom interpolation + velocity wave flare)
        const focusDocY = progress * docH;
        const velFactor = clamp01(Math.abs(st.vel) / 2400);
        const velRadius = 180;

        for (let i = 0; i < ticks.length; i++) {
          const t = ticks[i];
          const unzoomedY = t.docY - scrollY + drift;
          const zoomedY = map.base + (t.pct / 100) * map.span;

          const rowEl = tickRowRefs.current[i];
          if (rowEl) {
            rowEl.style.transform =
              zoomP > 0 ? `translate3d(0, ${zoomP * (zoomedY - unzoomedY)}px, 0)` : '';
          }

          const lineEl = tickLineRefs.current[i];
          if (lineEl) {
            const dist = Math.abs(t.docY - focusDocY);
            if (dist < velRadius) {
              const falloff = 1 - dist / velRadius;
              const boost = velFactor * falloff * falloff;
              lineEl.style.transform = `scaleX(${1 + 1.15 * boost})`;
              lineEl.style.opacity = String(Math.min(1, t.alpha + 0.55 * boost));
            } else {
              lineEl.style.transform = 'scaleX(1)';
              lineEl.style.opacity = String(t.alpha);
            }
          }
        }
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [geom.docH, ticks]);

  const scrollToClientY = (clientY: number, smooth: boolean) => {
    const { docH, vh } = stateRef.current.geom;
    if (!vh || docH <= vh) return;
    const map = getRulerMap(vh, EDGE_PAD);
    const ratio = clamp01((clientY - map.base) / map.span);
    const targetY = ratio * Math.max(1, docH - vh);
    window.scrollTo({
      top: targetY,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  const setZoomIntentDelayed = (intent: boolean) => {
    const st = stateRef.current;
    window.clearTimeout(st.zoomTimer);
    st.zoomTimer = window.setTimeout(
      () => {
        st.zoomIntent = intent;
      },
      intent ? 40 : 140
    );
  };

  if (!geom.docH) return null;

  return (
    <>
      <div
        ref={containerRef}
        role="scrollbar"
        aria-controls="main"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-label="Pagina scrollpositie"
        className="fixed inset-y-0 right-0 z-40 cursor-crosshair select-none overflow-hidden"
        style={{ width: RAIL_W }}
        onClick={(e) => {
          if (stateRef.current.dragMoved <= 4) {
            scrollToClientY(e.clientY, true);
          }
        }}
        onPointerEnter={() => setZoomIntentDelayed(true)}
        onPointerLeave={() => {
          stateRef.current.ghostActive = false;
          if (!stateRef.current.dragging) {
            setZoomIntentDelayed(false);
          }
        }}
        onPointerMove={(e) => {
          const st = stateRef.current;
          const map = getRulerMap(st.geom.vh, EDGE_PAD);
          const clampedY = Math.max(map.base, Math.min(map.base + map.span, e.clientY));
          st.ghostActive = true;
          st.ghostY = clampedY;
          if (st.dragging) {
            st.dragMoved = Math.max(st.dragMoved, Math.abs(e.clientY - st.dragStartY));
            scrollToClientY(clampedY, false);
          }
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          const st = stateRef.current;
          st.dragStartY = e.clientY;
          st.dragMoved = 0;
          st.dragging = true;
          st.zoomIntent = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          scrollToClientY(e.clientY, false);
        }}
        onPointerUp={(e) => {
          const st = stateRef.current;
          if (!st.dragging) return;
          st.dragging = false;
          const rect = containerRef.current?.getBoundingClientRect();
          if (
            !rect ||
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          ) {
            st.ghostActive = false;
            setZoomIntentDelayed(false);
          }
        }}
        onPointerCancel={() => {
          stateRef.current.dragging = false;
          stateRef.current.ghostActive = false;
          setZoomIntentDelayed(false);
        }}
      >
        {/* Feathered dark frost backdrop along the right edge */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(10, 10, 10, 0.65)',
            maskImage:
              'linear-gradient(to left, black 35%, rgba(0,0,0,0.6) 65%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to left, black 35%, rgba(0,0,0,0.6) 65%, transparent 100%)',
          }}
        />

        {/* Tick Marks Container */}
        <div
          ref={ticksWrapperRef}
          aria-hidden="true"
          className="absolute inset-x-0 top-0"
          style={{ height: geom.docH }}
        >
          {ticks.map((t, idx) => (
            <div
              key={t.pct}
              ref={(el) => {
                tickRowRefs.current[idx] = el;
              }}
              className="absolute inset-x-0"
              style={{ top: t.docY, height: 0 }}
            >
              <span
                ref={(el) => {
                  tickLineRefs.current[idx] = el;
                }}
                className="absolute right-0 top-0 block bg-[#e8e6e1]"
                style={{
                  width: t.major ? MAJOR_LEN : MINOR_LEN,
                  height: 1,
                  opacity: t.alpha,
                  transformOrigin: 'right center',
                }}
              />
              {t.major && (
                <span
                  ref={(el) => {
                    tickLabelRefs.current[idx] = el;
                  }}
                  className="absolute -translate-y-1/2 font-mono-tech text-[#e8e6e1]"
                  style={{
                    right: MAJOR_LEN + 4,
                    top: 0,
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    opacity: 0.55,
                  }}
                >
                  {t.pct}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Viewport Bracket (visible on hover / drag zoom) */}
        <div
          ref={bracketRef}
          aria-hidden="true"
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="absolute inset-0 bg-[#ffa600]" style={{ opacity: 0.14 }} />
          <span
            className="absolute inset-x-0 top-0 block bg-[#ffa600]"
            style={{ height: 1, opacity: 0.65 }}
          />
          <span
            className="absolute inset-x-0 bottom-0 block bg-[#ffa600]"
            style={{ height: 1, opacity: 0.65 }}
          />
        </div>

        {/* Glowing Orange Needle & 3-Digit Odometer Readout */}
        <div
          ref={needleRef}
          aria-hidden="true"
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ height: 0 }}
        >
          <span
            className="absolute inset-x-0 block bg-[#ffa600]"
            style={{
              top: 0,
              height: 1.5,
              boxShadow: '0 0 8px #ffa600',
            }}
          />
          <span
            ref={readoutRef}
            className="absolute right-1 whitespace-nowrap font-mono-tech font-medium text-[#ffa600]"
            style={{
              top: 4,
              fontSize: 9,
              letterSpacing: '0.08em',
            }}
          >
            <span className="ruler-digits">
              {[0, 1, 2].map((colIndex) => (
                <span
                  key={colIndex}
                  ref={(el) => {
                    digitColRefs.current[colIndex] = el;
                  }}
                  className="ruler-digit-col"
                >
                  {'0123456789'.split('').map((digit) => (
                    <span key={digit}>{digit}</span>
                  ))}
                </span>
              ))}
            </span>
            <span style={{ marginLeft: 1.5 }}>%</span>
          </span>
        </div>
      </div>

      {/* Hover Crosshair Ghost Line */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 right-0 z-40"
        style={{ width: RAIL_W, height: 0, opacity: 0, top: 0 }}
      >
        <div
          className="absolute right-0 block bg-[#ffa600]"
          style={{ top: -0.5, width: RAIL_W, height: 1 }}
        />
      </div>
    </>
  );
};
