export type PageId = 'home' | 'contact' | 'games' | 'projects';

export function assetUrl(path: string): string {
  const clean = path.replace(/^\/+/, '');
  if (
    typeof window !== 'undefined' &&
    window.location.hostname.endsWith('github.io') &&
    (window as unknown as { __ghBundleLoaded?: boolean }).__ghBundleLoaded
  ) {
    return `/public/${clean}`;
  }
  return `/${clean}`;
}

export interface ProjectItem {
  id: string;
  index: string;
  name: string;
  urlLabel: string;
  href: string;
  desc?: string;
  category: 'tools' | 'webapps' | 'educatie';
}

export interface BananaGameItem {
  id: string;
  index: string;
  title: string;
  genre: 'Actie' | 'Puzzel' | 'Arcade';
  href: string;
}

export const SITE_CONTENT = {
  brand: 'Robbe Sonck',
  siteTitle: 'De website van Robbe Sonck',
  welcomeTitle: 'Welkom!',
  welcomeFull: 'Welkom op de website van Robbe Sonck!',
  contact: {
    title: 'Contact',
    subtitle: 'Vul hier het contactformulier in.',
    fields: {
      name: 'Je naam',
      email: 'Je e-mailadres',
      subject: 'Onderwerp',
      message: 'Je bericht (optioneel)',
      submit: 'Verzenden',
    },
  },
  games: {
    title: 'Games',
    description:
      'Op Banana Games speel je de leukste online spellen, van actie tot puzzels, en beleef je eindeloos speelplezier.',
    cta: 'Ga naar Banana Games',
    externalUrl: 'https://sites.google.com/view/bestbananagames/home',
  },
  projects: {
    label: 'Portfolio',
    title: 'Projects',
    headingPrefix: 'My',
    headingAccent: 'Projects',
    description: 'Een collectie van wat ik gemaakt heb.',
    cta: 'Ga naar Projects',
  },
  footer: {
    copyright: '©2026 De website van Robbe Sonck',
    note: 'Locally hosted · Always evolving',
  },
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'de-bron-tielt-menu',
    index: '01',
    name: 'De Bron Tielt Menu',
    urlLabel: 'de-bron-tielt-menu/',
    href: 'https://www.robbesonck.be/projects/de-bron-tielt-menu/',
    desc: 'Digitaal menu voor schoolrestaurant De Bron in Tielt.',
    category: 'webapps',
  },
  {
    id: 'qr-code-generator',
    index: '02',
    name: 'QR Code Generator',
    urlLabel: 'qr-code-generator/',
    href: 'https://www.robbesonck.be/projects/qr-code-generator/',
    desc: 'Genereer snel en gratis QR-codes voor links, tekst of wifi.',
    category: 'tools',
  },
  {
    id: 'time',
    index: '03',
    name: 'Time',
    urlLabel: 'time/',
    href: 'https://www.robbesonck.be/projects/time/',
    category: 'tools',
  },
  {
    id: 'lively-backgrounds',
    index: '04',
    name: 'Lively Backgrounds',
    urlLabel: 'lively-backgrounds/',
    href: 'https://www.robbesonck.be/projects/lively-backgrounds/',
    desc: 'Stel deze url in als achtergrond in Lively Wallpapers. Klik in de linkerbovenhoek om de achtergrond aan te passen.',
    category: 'webapps',
  },
  {
    id: 'whois',
    index: '05',
    name: 'Whois',
    urlLabel: '/whois/',
    href: 'https://www.robbesonck.be/whois/',
    category: 'tools',
  },
  {
    id: 'prime-number-calculator',
    index: '06',
    name: 'Priemgetal Calculator',
    urlLabel: 'prime-number-calculator/',
    href: 'https://www.robbesonck.be/projects/prime-number-calculator/',
    desc: 'Berekent of een groot getal een priemgetal is.',
    category: 'tools',
  },
  {
    id: 'pse',
    index: '07',
    name: 'PSE',
    urlLabel: 'pse.robbesonck.be',
    href: 'https://pse.robbesonck.be',
    category: 'educatie',
  },
  {
    id: 'conjugo',
    index: '08',
    name: 'Conjugo',
    urlLabel: 'conjugo.robbesonck.be',
    href: 'https://conjugo.robbesonck.be',
    desc: 'Franse werkwoorden oefenen.',
    category: 'educatie',
  },
  {
    id: 'wordclock',
    index: '09',
    name: 'Woordklok',
    urlLabel: 'wordclock/',
    href: 'https://www.robbesonck.be/projects/wordclock/',
    category: 'webapps',
  },
  {
    id: 'music-lab',
    index: '10',
    name: 'Music Lab',
    urlLabel: 'music-lab/',
    href: 'https://www.robbesonck.be/projects/music-lab/',
    category: 'educatie',
  },
  {
    id: 'url-encoder',
    index: '11',
    name: 'URL encoder/decoder',
    urlLabel: 'url-encoder/',
    href: 'https://www.robbesonck.be/projects/url-encoder/',
    desc: 'Versleutelt/ontsleutelt % url versleutelingen',
    category: 'tools',
  },
  {
    id: 'pixel-canvas',
    index: '12',
    name: '100x100 Pixel Canvas',
    urlLabel: 'sonck.eu',
    href: 'https://sonck.eu',
    desc: 'Je kan elke 5 minuten de kleur van een pixel veranderen op een 100x100 grid.',
    category: 'webapps',
  },
  {
    id: 'gemini-api-pricing-calculator',
    index: '13',
    name: 'Gemini API Pricing Calculator',
    urlLabel: 'gemini-api-pricing-calculator/',
    href: 'https://www.robbesonck.be/projects/gemini-api-pricing-calculator',
    desc: 'Een interactieve calculator om de prijzen van tools in Google AI Studio te berekenen.',
    category: 'tools',
  },
];

export const BANANA_GAMES_HIGHLIGHTS: BananaGameItem[] = [
  {
    id: 'block-blast',
    index: '01',
    title: 'Block Blast',
    genre: 'Puzzel',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: '1v1-lol',
    index: '02',
    title: '1v1.LOL',
    genre: 'Actie',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: '2048',
    index: '03',
    title: '2048',
    genre: 'Puzzel',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: 'slope',
    index: '04',
    title: 'Slope',
    genre: 'Arcade',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: 'drive-mad',
    index: '05',
    title: 'Drive Mad',
    genre: 'Actie',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: 'tunnel-rush',
    index: '06',
    title: 'Tunnel Rush',
    genre: 'Arcade',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: 'subway-surfers',
    index: '07',
    title: 'Subway Surfers',
    genre: 'Arcade',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: 'wordle',
    index: '08',
    title: 'Wordle',
    genre: 'Puzzel',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: 'paper-io-2',
    index: '09',
    title: 'Paper.io 2',
    genre: 'Arcade',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: 'retro-bowl',
    index: '10',
    title: 'Retro Bowl',
    genre: 'Actie',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: 'townscaper',
    index: '11',
    title: 'Townscaper',
    genre: 'Puzzel',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
  {
    id: 'banana-dash',
    index: '12',
    title: 'Banana Dash',
    genre: 'Arcade',
    href: 'https://sites.google.com/view/bestbananagames/home',
  },
];

export const MARQUEE_ITEMS = [
  'De website van Robbe Sonck',
  'Welkom!',
  'Banana Games',
  'De Bron Tielt Menu',
  'QR Code Generator',
  'Priemgetal Calculator',
  'Conjugo',
  'Woordklok',
  'Music Lab',
  '100x100 Pixel Canvas',
  'Gemini API Pricing Calculator',
];
