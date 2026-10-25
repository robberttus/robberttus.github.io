import React, { useState, useEffect, useMemo } from 'react';
import {
  PageId,
  SITE_CONTENT,
  PROJECTS,
  BANANA_GAMES_HIGHLIGHTS,
  assetUrl,
} from './data/siteData';
import { GamesVisualCard, ProjectsVisualCard } from './components/VisualCanvas';
import { ContactFormSection } from './components/ContactFormSection';
import { RulerScrollbar } from './components/RulerScrollbar';
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Home,
  Gamepad2,
  FolderGit2,
  Mail,
  Menu,
  X,
} from 'lucide-react';

function getPageFromLocation(): PageId {
  const hash = window.location.hash.replace('#', '').replace(/^\/+|\/+$/g, '').toLowerCase();
  if (hash === 'contact' || hash === 'games' || hash === 'projects' || hash === 'home') {
    return hash as PageId;
  }
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (path === 'contact' || path === 'games' || path === 'projects') {
    return path as PageId;
  }
  return 'home';
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(() => getPageFromLocation());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState<'all' | 'tools' | 'webapps' | 'educatie'>('all');
  const [gameFilter, setGameFilter] = useState<'Alle' | 'Actie' | 'Puzzel' | 'Arcade'>('Alle');

  useEffect(() => {
    const syncFromUrl = () => {
      setActivePage(getPageFromLocation());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, []);

  const navigateTo = (page: PageId) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    try {
      window.history.pushState(null, '', targetPath);
    } catch {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formattedUpdateDate = useMemo(() => {
    const d = new Date();
    return `updated ${d.toLocaleDateString('nl-BE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}`;
  }, []);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) => {
      const matchesCategory = projectFilter === 'all' || p.category === projectFilter;
      const q = projectSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.urlLabel.toLowerCase().includes(q) ||
        (p.desc && p.desc.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [projectFilter, projectSearch]);

  const filteredGames = useMemo(() => {
    if (gameFilter === 'Alle') return BANANA_GAMES_HIGHLIGHTS;
    return BANANA_GAMES_HIGHLIGHTS.filter((g) => g.genre === gameFilter);
  }, [gameFilter]);

  const navItems: { id: PageId; label: string; href: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', href: '/', icon: <Home className="w-3.5 h-3.5 text-[#ffa600]" /> },
    { id: 'contact', label: 'Contact', href: '/contact', icon: <Mail className="w-3.5 h-3.5 text-[#ffa600]" /> },
    { id: 'games', label: 'Games', href: '/games', icon: <Gamepad2 className="w-3.5 h-3.5 text-[#ffa600]" /> },
    { id: 'projects', label: 'Projects', href: '/projects', icon: <FolderGit2 className="w-3.5 h-3.5 text-[#ffa600]" /> },
  ];

  const heroBgUrl = assetUrl('images/hero-bg.jpeg');
  const contactBgUrl = assetUrl('images/contact-bg.jpg');
  const projectsBgUrl = assetUrl('images/projects.png');
  const logoUrl = assetUrl('images/logo.png');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e6e1] flex flex-col studio-grid-bg">
      {/* ArtCraft Ruler Scrollbar */}
      <RulerScrollbar activePage={activePage} />

      {/* =========================================================
          TOP BAR HEADER
          With transparent homepage background image, original logo,
          and navigation links (no top-right CTA button)
      ========================================================= */}
      <header className="sticky top-0 left-0 z-50 w-full border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-md relative overflow-hidden">
        {/* Subtle transparent background of the homepage image inside the header */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('${heroBgUrl}')` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/75 to-[#0a0a0a]/90"
        />

        <div className="relative z-10 mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-8 border-x border-[#1f1f1f] px-6 md:px-10">
          {/* Brand Zone with original logo (r.png) */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="flex items-center gap-3 font-display text-base font-bold tracking-tight text-white hover:text-[#ffa600] transition-colors whitespace-nowrap shrink-0"
          >
            <img
              src={logoUrl}
              alt="Robbe Sonck logo"
              className="h-8 w-auto object-contain"
            />
            <span>Robbe Sonck</span>
          </a>

          {/* Navigation Links (Home, Contact, Games, Projects) */}
          <nav aria-label="Hoofdmenu" className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(item.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`hud-label py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'border-[#ffa600] text-[#ffa600]'
                      : 'border-transparent text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger (only visible on small screens) */}
          <div className="flex items-center md:hidden shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center border border-[#262626] bg-[#0a0a0a]/80 text-[#e8e6e1] hover:border-[#ffa600] hover:text-[#ffa600] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="relative z-10 md:hidden border-t border-[#1f1f1f] bg-[#0a0a0a]/95 px-6 py-4">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(item.id);
                    }}
                    className={`hud-label py-2 transition-colors ${
                      isActive ? 'text-[#ffa600]' : 'text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* =========================================================
          MAIN PAGE VIEWS
      ========================================================= */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            {/* HERO / HEADER BANNER SECTION — With transparent version of original homepage image */}
            <section className="relative border-b border-[#1f1f1f]">
              <div className="relative mx-auto max-w-[1280px] border-x border-[#1f1f1f] px-6 py-20 md:px-10 md:py-28 lg:py-32 overflow-hidden">
                {/* Crosshair ticks at section corners */}
                <span aria-hidden="true" className="tick -top-[5px] -left-[6px]" />
                <span aria-hidden="true" className="tick -top-[5px] -right-[5px]" />

                {/* Transparent original homepage hero image background */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
                  style={{ backgroundImage: `url('${heroBgUrl}')` }}
                />
                {/* Measured dark gradient & subtle orange glow over the background image */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/60 to-[#0a0a0a]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 38%, rgba(255, 166, 0, 0.16), rgba(255, 166, 0, 0.03) 45%, transparent 70%)',
                  }}
                />

                <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
                  <p className="hud-label text-[#ffa600]">robbesonck.be · {SITE_CONTENT.welcomeTitle}</p>

                  {/* Monumental Display Wordmark (ArtCraft style) */}
                  <div
                    aria-label="ROBBE SONCK"
                    className="mt-5 select-none font-display text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-extrabold tracking-[-0.04em] leading-[0.95] text-white"
                  >
                    ROBBE <span className="text-[#ffa600]">SONCK</span>
                  </div>

                  {/* Original website headline & welcome message */}
                  <h1 className="mt-8 font-display text-2xl sm:text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-white max-w-2xl">
                    {SITE_CONTENT.siteTitle}{' '}
                    <span className="font-serif-italic font-normal text-[#ffa600]">
                      — {SITE_CONTENT.welcomeTitle}
                    </span>
                  </h1>

                  <p className="mt-4 max-w-md text-base sm:text-lg leading-relaxed text-[#d1d5db]">
                    {SITE_CONTENT.welcomeFull}
                  </p>

                  {/* Hero CTA Buttons: Primary = Contact, Secondary = Projects & Games */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigateTo('contact')}
                      className="inline-flex h-12 items-center justify-center gap-2 bg-[#ffa600] px-7 font-mono-tech text-[11px] font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors duration-150 hover:bg-[#ffb733] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {SITE_CONTENT.contact.title}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('projects')}
                      className="inline-flex h-12 items-center justify-center gap-2 border border-[#383838] bg-[#0a0a0a]/85 px-6 font-mono-tech text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-150 hover:border-[#ffa600] hover:text-[#ffa600] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {SITE_CONTENT.projects.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('games')}
                      className="inline-flex h-12 items-center justify-center gap-2 border border-[#383838] bg-[#0a0a0a]/85 px-6 font-mono-tech text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-150 hover:border-[#ffa600] hover:text-[#ffa600] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {SITE_CONTENT.games.title}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 01: GAMES & PROJECTS SPLIT SHOWCASE (With original homepage images) */}
            <section className="relative border-b border-[#1f1f1f]">
              <div className="relative mx-auto max-w-[1280px] border-x border-[#1f1f1f]">
                <span aria-hidden="true" className="tick -top-[5px] -left-[6px]" />
                <span aria-hidden="true" className="tick -top-[5px] -right-[5px]" />

                {/* Sticky Section Eyebrow */}
                <div className="sticky top-14 z-30 border-b border-[#1f1f1f] bg-[#0a0a0a]/85 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4 px-6 py-3 md:px-10">
                    <p className="hud-label text-[#9ca3af]">
                      <span className="text-[#ffa600]">01</span>
                      <span aria-hidden="true" className="mx-2 text-[#6b7280]">
                        /
                      </span>
                      Games & Projects
                    </p>
                    <p className="hud-label hidden text-[#6b7280] sm:block">
                      {SITE_CONTENT.siteTitle}
                    </p>
                  </div>
                </div>

                {/* 2-Column Architectural Grid */}
                <div className="grid gap-px bg-[#1f1f1f] md:grid-cols-2">
                  {/* Card 01: Games */}
                  <article className="bg-[#0a0a0a] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-4 border-b border-[#1f1f1f] px-6 py-3 md:px-8">
                        <p className="hud-label text-[#9ca3af]">{SITE_CONTENT.games.title}</p>
                        <p className="hud-label text-[#ffa600]">01</p>
                      </div>
                      <div
                        onClick={() => navigateTo('games')}
                        className="cursor-pointer border-b border-[#1f1f1f]"
                      >
                        <GamesVisualCard />
                      </div>
                      <div className="px-6 py-8 md:px-8">
                        <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-white">
                          {SITE_CONTENT.games.title}
                        </h2>
                        <p className="mt-3 max-w-xl text-base leading-relaxed text-[#9ca3af]">
                          {SITE_CONTENT.games.description}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-8 md:px-8 flex flex-wrap items-center gap-3">
                      <a
                        href={SITE_CONTENT.games.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 items-center justify-center gap-2 bg-[#ffa600] px-5 font-mono-tech text-[11px] font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:bg-[#ffb733] whitespace-nowrap shrink-0"
                      >
                        {SITE_CONTENT.games.cta}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => navigateTo('games')}
                        className="inline-flex h-11 items-center justify-center gap-2 border border-[#383838] bg-[#0a0a0a] px-5 font-mono-tech text-[11px] font-medium uppercase tracking-[0.12em] text-[#e8e6e1] transition-colors hover:border-[#ffa600] hover:text-[#ffa600] whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Open Games pagina
                      </button>
                    </div>
                  </article>

                  {/* Card 02: Projects */}
                  <article className="bg-[#0a0a0a] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-4 border-b border-[#1f1f1f] px-6 py-3 md:px-8">
                        <p className="hud-label text-[#9ca3af]">{SITE_CONTENT.projects.title}</p>
                        <p className="hud-label text-[#ffa600]">02</p>
                      </div>
                      <div
                        onClick={() => navigateTo('projects')}
                        className="cursor-pointer border-b border-[#1f1f1f]"
                      >
                        <ProjectsVisualCard />
                      </div>
                      <div className="px-6 py-8 md:px-8">
                        <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-white">
                          {SITE_CONTENT.projects.title}
                        </h2>
                        <p className="mt-3 max-w-xl text-base leading-relaxed text-[#9ca3af]">
                          {SITE_CONTENT.projects.description}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-8 md:px-8 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => navigateTo('projects')}
                        className="inline-flex h-11 items-center justify-center gap-2 bg-[#ffa600] px-5 font-mono-tech text-[11px] font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:bg-[#ffb733] whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {SITE_CONTENT.projects.cta}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* SECTION 02: PROJECTS PREVIEW GRID */}
            <section className="relative border-b border-[#1f1f1f]">
              <div className="relative mx-auto max-w-[1280px] border-x border-[#1f1f1f]">
                <span aria-hidden="true" className="tick -top-[5px] -left-[6px]" />
                <span aria-hidden="true" className="tick -top-[5px] -right-[5px]" />

                <div className="sticky top-14 z-30 border-b border-[#1f1f1f] bg-[#0a0a0a]/85 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4 px-6 py-3 md:px-10">
                    <p className="hud-label text-[#9ca3af]">
                      <span className="text-[#ffa600]">02</span>
                      <span aria-hidden="true" className="mx-2 text-[#6b7280]">
                        /
                      </span>
                      {SITE_CONTENT.projects.label} · {SITE_CONTENT.projects.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateTo('projects')}
                      className="hud-label text-[#ffa600] hover:underline cursor-pointer"
                    >
                      Alle {PROJECTS.length} bekijken →
                    </button>
                  </div>
                </div>

                <div className="grid gap-px bg-[#1f1f1f] md:grid-cols-2 lg:grid-cols-3">
                  {PROJECTS.slice(0, 6).map((project) => (
                    <a
                      key={project.id}
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-[#0a0a0a] p-6 md:p-8 flex flex-col justify-between transition-colors hover:bg-[#111111]"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs font-mono-tech text-[#6b7280]">
                          <span className="text-[#ffa600]">{project.index}</span>
                          <span>{project.urlLabel}</span>
                        </div>
                        <h3 className="mt-4 font-display text-xl font-semibold text-white group-hover:text-[#ffa600] transition-colors">
                          {project.name}
                        </h3>
                        {project.desc && (
                          <p className="mt-2 text-sm leading-relaxed text-[#9ca3af]">
                            {project.desc}
                          </p>
                        )}
                      </div>
                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#1f1f1f]">
                        <span className="hud-label text-[#6b7280] group-hover:text-white transition-colors">
                          Open project
                        </span>
                        <span className="font-mono-tech text-[#6b7280] group-hover:text-[#ffa600] group-hover:translate-x-1 transition-all">
                          →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 03: CONTACT (Exact from robbesonck.be homepage) */}
            <section className="relative border-b border-[#1f1f1f]">
              <div className="relative mx-auto max-w-[1280px] border-x border-[#1f1f1f]">
                <span aria-hidden="true" className="tick -top-[5px] -left-[6px]" />
                <span aria-hidden="true" className="tick -top-[5px] -right-[5px]" />

                <div className="sticky top-14 z-30 border-b border-[#1f1f1f] bg-[#0a0a0a]/85 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4 px-6 py-3 md:px-10">
                    <p className="hud-label text-[#9ca3af]">
                      <span className="text-[#ffa600]">03</span>
                      <span aria-hidden="true" className="mx-2 text-[#6b7280]">
                        /
                      </span>
                      {SITE_CONTENT.contact.title}
                    </p>
                    <p className="hud-label hidden text-[#6b7280] sm:block">
                      {SITE_CONTENT.contact.subtitle}
                    </p>
                  </div>
                </div>

                <div className="grid gap-px bg-[#1f1f1f] lg:grid-cols-[1fr_1.4fr]">
                  <div className="bg-[#0a0a0a] p-6 md:p-10 lg:p-12 flex flex-col justify-between">
                    <div>
                      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white">
                        {SITE_CONTENT.contact.title}
                      </h2>
                      <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#9ca3af]">
                        {SITE_CONTENT.contact.subtitle}
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-[#1f1f1f] flex flex-col gap-2 text-xs font-mono-tech text-[#6b7280]">
                      <span>robbesonck.be/contact</span>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] p-6 md:p-10 lg:p-12">
                    <ContactFormSection compact />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* =========================================================
            PAGE: CONTACT (/contact)
        ========================================================= */}
        {activePage === 'contact' && (
          <section className="relative border-b border-[#1f1f1f]">
            <div className="relative mx-auto max-w-[1280px] border-x border-[#1f1f1f]">
              <span aria-hidden="true" className="tick -top-[5px] -left-[6px]" />
              <span aria-hidden="true" className="tick -top-[5px] -right-[5px]" />

              {/* Eyebrow */}
              <div className="border-b border-[#1f1f1f] bg-[#0a0a0a]/85 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 px-6 py-3 md:px-10">
                  <p className="hud-label text-[#9ca3af]">
                    <span className="text-[#ffa600]">01</span>
                    <span aria-hidden="true" className="mx-2 text-[#6b7280]">
                      /
                    </span>
                    {SITE_CONTENT.contact.title}
                  </p>
                  <p className="hud-label text-[#6b7280]">robbesonck.be/contact</p>
                </div>
              </div>

              {/* Page Header Banner — With transparent original contact background image */}
              <div className="relative overflow-hidden border-b border-[#1f1f1f] px-6 py-16 md:px-10 md:py-24">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
                  style={{ backgroundImage: `url('${contactBgUrl}')` }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/60 to-[#0a0a0a]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 45%, rgba(255, 166, 0, 0.16), rgba(255, 166, 0, 0.03) 45%, transparent 70%)',
                  }}
                />

                <div className="relative z-10">
                  <p className="hud-label text-[#ffa600]">{SITE_CONTENT.siteTitle}</p>
                  <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.035em] text-white">
                    {SITE_CONTENT.contact.title}
                  </h1>
                  <p className="mt-4 max-w-xl text-lg text-[#d1d5db]">
                    {SITE_CONTENT.contact.subtitle}
                  </p>
                </div>
              </div>

              {/* Form Split */}
              <div className="grid gap-px bg-[#1f1f1f] lg:grid-cols-[1fr_1.6fr]">
                <div className="bg-[#0a0a0a] p-6 md:p-10 flex flex-col justify-between gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="hud-label text-[#ffa600]">Website</p>
                      <p className="mt-2 font-display text-lg font-medium text-white">
                        {SITE_CONTENT.siteTitle}
                      </p>
                      <p className="mt-1 text-sm text-[#9ca3af]">{SITE_CONTENT.welcomeFull}</p>
                    </div>

                    <div className="pt-6 border-t border-[#1f1f1f]">
                      <p className="hud-label text-[#6b7280]">Pagina&apos;s</p>
                      <div className="mt-3 flex flex-col gap-2.5 text-sm">
                        <button
                          type="button"
                          onClick={() => navigateTo('home')}
                          className="text-left text-[#9ca3af] hover:text-[#ffa600] transition-colors cursor-pointer"
                        >
                          → Home
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('games')}
                          className="text-left text-[#9ca3af] hover:text-[#ffa600] transition-colors cursor-pointer"
                        >
                          → Games (Banana Games)
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('projects')}
                          className="text-left text-[#9ca3af] hover:text-[#ffa600] transition-colors cursor-pointer"
                        >
                          → Projects ({PROJECTS.length})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] p-6 md:p-10">
                  <ContactFormSection />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE: GAMES (/games)
        ========================================================= */}
        {activePage === 'games' && (
          <section className="relative border-b border-[#1f1f1f]">
            <div className="relative mx-auto max-w-[1280px] border-x border-[#1f1f1f]">
              <span aria-hidden="true" className="tick -top-[5px] -left-[6px]" />
              <span aria-hidden="true" className="tick -top-[5px] -right-[5px]" />

              {/* Eyebrow */}
              <div className="border-b border-[#1f1f1f] bg-[#0a0a0a]/85 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 px-6 py-3 md:px-10">
                  <p className="hud-label text-[#9ca3af]">
                    <span className="text-[#ffa600]">01</span>
                    <span aria-hidden="true" className="mx-2 text-[#6b7280]">
                      /
                    </span>
                    {SITE_CONTENT.games.title} · Banana Games
                  </p>
                  <p className="hud-label text-[#6b7280]">robbesonck.be/games</p>
                </div>
              </div>

              {/* Hero Split for Games */}
              <div className="grid gap-px bg-[#1f1f1f] lg:grid-cols-2 items-stretch">
                <div className="bg-[#0a0a0a] p-6 md:p-10 lg:p-14 flex flex-col justify-between">
                  <div>
                    <p className="hud-label text-[#ffa600]">Online Spellen</p>
                    <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.035em] text-white">
                      {SITE_CONTENT.games.title}
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#9ca3af]">
                      {SITE_CONTENT.games.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#1f1f1f] flex flex-wrap items-center gap-4">
                    <a
                      href={SITE_CONTENT.games.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center justify-center gap-2.5 bg-[#ffa600] px-7 font-mono-tech text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a0a0a] transition-colors hover:bg-[#ffb733] whitespace-nowrap shrink-0"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      {SITE_CONTENT.games.cta}
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8">
                  <a
                    href={SITE_CONTENT.games.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-[#1f1f1f] hover:border-[#ffa600] transition-colors"
                  >
                    <GamesVisualCard />
                  </a>
                </div>
              </div>

              {/* Filterable Banana Games Highlights */}
              <div className="border-t border-[#1f1f1f] bg-[#0a0a0a] px-6 py-4 md:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono-tech text-[#9ca3af]">
                  <span className="text-[#ffa600]">Banana Games</span>
                  <span aria-hidden="true">·</span>
                  <span>Populaire spellen op Banana Games</span>
                </div>

                {/* Interactive Filter Controls */}
                <div className="flex flex-wrap items-center gap-1 bg-[#111111] p-1 border border-[#1f1f1f]">
                  {(['Alle', 'Actie', 'Puzzel', 'Arcade'] as const).map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => setGameFilter(genre)}
                      className={`px-3 py-1.5 font-mono-tech text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        gameFilter === genre
                          ? 'bg-[#ffa600] text-[#0a0a0a] font-bold'
                          : 'text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-px bg-[#1f1f1f] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-[#1f1f1f]">
                {filteredGames.map((game) => (
                  <a
                    key={game.id}
                    href={game.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-[#0a0a0a] p-6 flex flex-col justify-between transition-colors hover:bg-[#111111]"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono-tech text-[#6b7280]">
                        <span className="text-[#ffa600]">{game.index}</span>
                        <span>{game.genre}</span>
                      </div>
                      <h2 className="mt-4 font-display text-lg font-semibold text-white group-hover:text-[#ffa600] transition-colors">
                        {game.title}
                      </h2>
                    </div>
                    <div className="mt-6 pt-3 border-t border-[#1f1f1f] flex items-center justify-between text-xs font-mono-tech text-[#6b7280] group-hover:text-[#e8e6e1]">
                      <span>Speel op Banana Games</span>
                      <span className="text-[#ffa600] group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE: PROJECTS (/projects)
            Exact 13 projects from robbesonck.be/projects/
        ========================================================= */}
        {activePage === 'projects' && (
          <section className="relative border-b border-[#1f1f1f]">
            <div className="relative mx-auto max-w-[1280px] border-x border-[#1f1f1f]">
              <span aria-hidden="true" className="tick -top-[5px] -left-[6px]" />
              <span aria-hidden="true" className="tick -top-[5px] -right-[5px]" />

              {/* Eyebrow */}
              <div className="border-b border-[#1f1f1f] bg-[#0a0a0a]/85 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 px-6 py-3 md:px-10">
                  <p className="hud-label text-[#9ca3af]">
                    <span className="text-[#ffa600]">01</span>
                    <span aria-hidden="true" className="mx-2 text-[#6b7280]">
                      /
                    </span>
                    {SITE_CONTENT.projects.label}
                  </p>
                  <p className="hud-label text-[#6b7280]">{formattedUpdateDate}</p>
                </div>
              </div>

              {/* Header Banner matching robbesonck.be/projects with transparent projects image */}
              <div className="relative overflow-hidden border-b border-[#1f1f1f] px-6 py-16 md:px-10 md:py-24">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
                  style={{ backgroundImage: `url('${projectsBgUrl}')` }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/60 to-[#0a0a0a]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 45%, rgba(255, 166, 0, 0.16), rgba(255, 166, 0, 0.03) 45%, transparent 70%)',
                  }}
                />

                <div className="relative z-10">
                  <p className="hud-label text-[#ffa600]">{SITE_CONTENT.siteTitle}</p>
                  <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.035em] text-white">
                    {SITE_CONTENT.projects.headingPrefix} {SITE_CONTENT.projects.headingAccent}
                  </h1>
                  <p className="mt-4 max-w-xl text-lg text-[#d1d5db]">
                    {SITE_CONTENT.projects.description}
                  </p>
                </div>
              </div>

              {/* Meta & Interactive Filter Toolbar */}
              <div className="border-b border-[#1f1f1f] bg-[#070707] px-6 py-4 md:px-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3 font-mono-tech text-xs text-[#9ca3af]">
                  <span>
                    <strong className="text-[#ffa600] font-semibold">
                      {filteredProjects.length}
                    </strong>{' '}
                    projects
                  </span>
                  <span aria-hidden="true" className="text-[#383838]">
                    ·
                  </span>
                  <span className="text-[#6b7280]">{formattedUpdateDate}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Interactive Category Filter Buttons */}
                  <div className="flex items-center gap-1 bg-[#111111] p-1 border border-[#1f1f1f]">
                    {(
                      [
                        { id: 'all', label: 'Alle (13)' },
                        { id: 'tools', label: 'Tools' },
                        { id: 'webapps', label: 'Web Apps' },
                        { id: 'educatie', label: 'Educatie' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setProjectFilter(tab.id)}
                        className={`px-3 py-1.5 font-mono-tech text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          projectFilter === tab.id
                            ? 'bg-[#ffa600] text-[#0a0a0a] font-bold'
                            : 'text-[#9ca3af] hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#6b7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Zoek project..."
                      aria-label="Zoek project"
                      className="w-full sm:w-56 border border-[#262626] bg-[#0a0a0a] pl-8 pr-3 py-1.5 font-mono-tech text-xs text-white placeholder-[#6b7280] focus:border-[#ffa600] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Projects List / Architectural 1px Stack */}
              {filteredProjects.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="font-mono-tech text-sm text-[#9ca3af]">
                    Geen projecten gevonden voor &ldquo;{projectSearch}&rdquo;.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectSearch('');
                      setProjectFilter('all');
                    }}
                    className="mt-4 inline-flex h-9 items-center justify-center border border-[#ffa600] px-4 font-mono-tech text-xs text-[#ffa600] hover:bg-[#ffa600] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                  >
                    Filter wissen
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#1f1f1f]">
                  {filteredProjects.map((project) => (
                    <a
                      key={project.id}
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-6 bg-[#0a0a0a] px-6 py-6 md:px-10 md:py-7 transition-colors hover:bg-[#141414]"
                    >
                      <div className="flex items-start sm:items-center gap-5 md:gap-8 min-w-0">
                        <span className="font-mono-tech text-xs text-[#ffa600] tracking-widest pt-1 sm:pt-0 shrink-0">
                          {project.index}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h2 className="font-display text-lg sm:text-xl font-bold tracking-[-0.01em] text-white group-hover:text-[#ffa600] transition-colors">
                              {project.name}
                            </h2>
                            <span className="font-mono-tech text-xs text-[#6b7280]">
                              {project.urlLabel}
                            </span>
                          </div>
                          {project.desc && (
                            <p className="mt-1.5 text-sm leading-relaxed text-[#9ca3af] max-w-2xl">
                              {project.desc}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="font-mono-tech text-lg text-[#6b7280] transition-all duration-150 group-hover:translate-x-1.5 group-hover:text-[#ffa600] shrink-0">
                        →
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* =========================================================
          FOOTER — 2-column architectural footer (Brand + Pagina's with icons)
      ========================================================= */}
      <footer className="border-t border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1280px] border-x border-[#1f1f1f]">
          <div className="grid gap-px bg-[#1f1f1f] md:grid-cols-2">
            {/* Brand column with logo */}
            <div className="bg-[#0a0a0a] p-6 md:p-10">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('home');
                }}
                className="inline-flex items-center gap-3 font-display text-lg font-bold tracking-tight text-white hover:text-[#ffa600] transition-colors"
              >
                <img
                  src={logoUrl}
                  alt="Robbe Sonck logo"
                  className="h-8 w-auto object-contain"
                />
                <span>Robbe Sonck</span>
              </a>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#9ca3af]">
                {SITE_CONTENT.welcomeFull}
              </p>
            </div>

            {/* Pagina's met icoontjes */}
            <nav aria-label="Footer navigatie" className="bg-[#0a0a0a] p-6 md:p-10">
              <p className="hud-label text-[#6b7280]">Pagina&apos;s</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                {navItems.map((item) => (
                  <li key={`footer-${item.id}`}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(item.id);
                      }}
                      className={`inline-flex items-center gap-2 transition-colors ${
                        activePage === item.id
                          ? 'text-[#ffa600] font-medium'
                          : 'text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center justify-between border-t border-[#1f1f1f] px-6 py-4 md:px-10">
            <p className="hud-label text-[#6b7280]">{SITE_CONTENT.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
