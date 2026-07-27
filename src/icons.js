/* أيقونات SVG بسيطة (stroke) — Simple inline SVG icon set */
const P = {
  code: '<path d="M9 7 4 12l5 5M15 7l5 5-5 5"/>',
  coffee: '<path d="M4 9h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"/><path d="M17 10h2.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 2v2M12 2v2"/>',
  brain: '<path d="M9.5 4a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 5 9c0 1 .5 1.8 1.2 2.3M9.5 4A2.5 2.5 0 0 1 12 6.5v11M9.5 4c1 0 1.9.6 2.3 1.4M6.2 11.3A2.5 2.5 0 0 0 7 16c.4 1.2 1.5 2 2.8 2M14.5 4A2.5 2.5 0 0 1 17 6.5 2.5 2.5 0 0 1 19 9c0 1-.5 1.8-1.2 2.3M17.8 11.3A2.5 2.5 0 0 1 17 16c-.4 1.2-1.5 2-2.8 2"/>',
  star: '<path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 16.9 6.6 19.6l1.2-6L3.3 9.4l6.1-.8Z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.6M21 20a6 6 0 0 0-4.5-5.8"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  gate: '<path d="M4 21V6l8-3 8 3v15"/><path d="M4 21h16M9 21v-6a3 3 0 0 1 6 0v6"/>',
  sofa: '<path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M2 13a2 2 0 0 1 2 2v3h16v-3a2 2 0 0 1 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2v1H6v-1a2 2 0 0 0-2-2 2 2 0 0 0-2 2Z"/><path d="M6 18v2M18 18v2"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 3 2 3H5"/>',
  trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M12 14v6"/>',
  map: '<path d="m9 4 6 2 6-2v14l-6 2-6-2-6 2V6l6-2Z"/><path d="M9 4v14M15 6v14"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  rotate: '<path d="M21 12a9 9 0 1 1-3-6.7M21 4v4h-4"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  hand: '<path d="M18 11V6.5a1.5 1.5 0 0 0-3 0V10M15 10V4.5a1.5 1.5 0 0 0-3 0V10M12 10V6a1.5 1.5 0 0 0-3 0v6M9 12l-1.5-2a1.5 1.5 0 0 0-2.5 1.6L7 18a6 6 0 0 0 5.4 3.9c3 0 5.6-2 5.6-5.4V11"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
}

export function icon(name, size = 24, cls = '') {
  const body = P[name] || P.info
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`
}
