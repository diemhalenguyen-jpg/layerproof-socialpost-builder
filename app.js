// ============ LOGO DATA URL (avoids tainted canvas on export) ============
var LOGO_DATA_URL = 'logo.svg'; // fallback; replaced below once loaded
fetch('logo.svg')
  .then(function(r) { return r.blob(); })
  .then(function(blob) {
    var reader = new FileReader();
    reader.onload = function(e) { LOGO_DATA_URL = e.target.result; };
    reader.readAsDataURL(blob);
  })
  .catch(function() {});

// ============ STATE ============
var DEFAULT_SLIDE = function(layout) {
  return {
    layout: layout || 'cover',
    line1: 'AI GETS FACTS WRONG', line2: 'IN YOUR REPORT',
    size1: 32, size2: 26,
    body: '', bodyColor: '#ffffff', bodySize: 16,
    bullets: [], bulletColor: '#FF589B', bulletSize: 15,
    stat: '', url: '',
    iconIdx: 0, iconScale: 100,
    image: null, imgScale: 80, imgY: 55, imgRadius: 8
  };
};

var state = {
  blog: '',
  hooks: [],
  selectedHook: -1,
  posts: { thread: [], single: '', threads: [], instagram: '' },
  carouselPlan: [],
  swipeLabel: 'Swipe for more',
  mode: 'single',
  ratio: 'square',
  slides: [DEFAULT_SLIDE('cover')],
  currentSlide: 0,
  iconSet: 0,
};

// ============ ICONS LIBRARY (grouped by topic) ============
var iconSets = [
  { topic: 'Business', icons: [
    '<svg viewBox="0 0 64 64" fill="none"><rect x="14" y="8" width="36" height="48" rx="4" stroke="#FF589B" stroke-width="3"/><path d="M24 22h16M24 30h16M24 38h10" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/><circle cx="44" cy="44" r="10" fill="#FFDE42" stroke="#000" stroke-width="2"/><path d="M42 44l2 2 4-4" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="10" y="14" width="44" height="36" rx="4" stroke="#FF589B" stroke-width="3"/><path d="M10 24h44" stroke="#FF589B" stroke-width="3"/><circle cx="18" cy="19" r="2" fill="#ff4444"/><circle cx="24" cy="19" r="2" fill="#FFDE42"/><circle cx="30" cy="19" r="2" fill="#00c853"/><path d="M20 34h24M20 40h16" stroke="#FF589B" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 8L56 20v24L32 56 8 44V20L32 8z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M32 32V56M32 32L8 20M32 32l24-12" stroke="#FF589B" stroke-width="2"/><circle cx="32" cy="32" r="4" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M12 52V20l12-8h28v40H12z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M12 20h12V12" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M22 32h20M22 38h20M22 44h14" stroke="#FF589B" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#FF589B" stroke-width="3"/><path d="M32 18v14l10 6" stroke="#FF589B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="32" r="3" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M20 12h24v16c0 8-5 14-12 14S20 36 20 28V12z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M20 18H12v4c0 4 3 7 8 8M44 18h8v4c0 4-3 7-8 8" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/><path d="M26 42v6M38 42v6M20 48h24" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="10" y="16" width="44" height="38" rx="4" stroke="#FF589B" stroke-width="3"/><path d="M10 28h44" stroke="#FF589B" stroke-width="2.5"/><path d="M22 10v12M42 10v12" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><rect x="20" y="34" width="8" height="6" rx="1" fill="#FFDE42"/><rect x="32" y="34" width="8" height="6" rx="1" fill="#FF589B" opacity="0.5"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#FF589B" stroke-width="3"/><circle cx="32" cy="32" r="13" stroke="#FF589B" stroke-width="2"/><circle cx="32" cy="32" r="5" fill="#FFDE42"/><path d="M32 10v8M32 46v8M10 32h8M46 32h8" stroke="#FF589B" stroke-width="2" stroke-linecap="round" opacity="0.6"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="12" y="22" width="40" height="30" rx="4" stroke="#FF589B" stroke-width="3"/><path d="M24 22v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M12 36h40" stroke="#FFDE42" stroke-width="2.5"/><rect x="26" y="32" width="12" height="8" rx="2" fill="#FFDE42" opacity="0.5"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M10 50L24 32l8 10 10-14 12 8" stroke="#FF589B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 26l8 4-4 8" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 54h48" stroke="#FF589B" stroke-width="2" opacity="0.5"/></svg>',
  ]},
  { topic: 'Data', icons: [
    '<svg viewBox="0 0 64 64" fill="none"><rect x="10" y="36" width="8" height="18" rx="2" fill="#FF589B"/><rect x="22" y="28" width="8" height="26" rx="2" fill="#FF589B"/><rect x="34" y="18" width="8" height="36" rx="2" fill="#FFDE42"/><rect x="46" y="24" width="8" height="30" rx="2" fill="#FF589B"/><path d="M8 56h48" stroke="#FF589B" stroke-width="2"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="20" stroke="#FF589B" stroke-width="3"/><path d="M32 12a20 20 0 0 1 17.3 30L32 32V12z" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M10 48L22 34l10 8 10-16 12 6" stroke="#FF589B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="22" cy="34" r="3" fill="#FFDE42"/><circle cx="32" cy="42" r="3" fill="#FFDE42"/><circle cx="42" cy="26" r="3" fill="#FFDE42"/><path d="M8 56h48" stroke="#FF589B" stroke-width="2"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="8" width="48" height="48" rx="6" stroke="#FF589B" stroke-width="3"/><path d="M8 20h48" stroke="#FF589B" stroke-width="2"/><rect x="14" y="26" width="16" height="10" rx="2" fill="#FFDE42" opacity="0.8"/><rect x="14" y="40" width="10" height="10" rx="2" fill="#FF589B" opacity="0.5"/><rect x="34" y="26" width="16" height="24" rx="2" stroke="#FF589B" stroke-width="2"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M16 48l8-16 8 8 8-20 8 12" stroke="#FF589B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M48 32l-6-2 2 6" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 52h40" stroke="#FF589B" stroke-width="2"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="20" rx="18" ry="8" stroke="#FF589B" stroke-width="3"/><path d="M14 20v24c0 4.4 8.1 8 18 8s18-3.6 18-8V20" stroke="#FF589B" stroke-width="3"/><path d="M14 32c0 4.4 8.1 8 18 8s18-3.6 18-8" stroke="#FFDE42" stroke-width="2" stroke-dasharray="3 2"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M10 14h44l-16 18v18l-12-6V32L10 14z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M18 22h28M26 32h12" stroke="#FFDE42" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="16" cy="14" r="5" stroke="#FFDE42" stroke-width="2.5"/><circle cx="48" cy="14" r="5" stroke="#FF589B" stroke-width="2.5"/><circle cx="16" cy="50" r="5" stroke="#FF589B" stroke-width="2.5"/><circle cx="48" cy="50" r="5" stroke="#FFDE42" stroke-width="2.5"/><circle cx="32" cy="32" r="6" fill="#FF589B" opacity="0.3" stroke="#FF589B" stroke-width="2"/><path d="M21 14h22M48 19v26M43 50H21M16 19v26" stroke="#FF589B" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M10 54V10M10 54h48" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="38" r="4" fill="#FFDE42"/><circle cx="30" cy="22" r="4" fill="#FFDE42"/><circle cx="40" cy="30" r="4" fill="#FFDE42"/><circle cx="48" cy="18" r="4" fill="#FF589B" opacity="0.7"/><circle cx="18" cy="46" r="3" fill="#FF589B" opacity="0.5"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="10" width="48" height="44" rx="4" stroke="#FF589B" stroke-width="3"/><path d="M8 24h48M8 38h48M26 10v44M42 10v44" stroke="#FF589B" stroke-width="2"/><rect x="26" y="24" width="16" height="14" fill="#FFDE42" opacity="0.4"/></svg>',
  ]},
  { topic: 'Security', icons: [
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 8L12 18v16c0 14 20 22 20 22s20-8 20-22V18L32 8z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M26 34l4 4 8-8" stroke="#FFDE42" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="28" r="16" stroke="#FF589B" stroke-width="3"/><path d="M20 50c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="28" r="5" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="18" y="26" width="28" height="24" rx="4" stroke="#FF589B" stroke-width="3"/><path d="M22 26v-6a10 10 0 0 1 20 0v6" stroke="#FF589B" stroke-width="3"/><circle cx="32" cy="38" r="3" fill="#FFDE42"/><path d="M32 41v5" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#FF589B" stroke-width="3"/><path d="M22 32l6 6 14-14" stroke="#FFDE42" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 12l-4 8h8l-4 8" stroke="#FFDE42" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="38" r="16" stroke="#FF589B" stroke-width="3"/><path d="M26 38h12M32 32v12" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="22" cy="26" r="12" stroke="#FFDE42" stroke-width="3"/><path d="M30 32l24 20" stroke="#FF589B" stroke-width="4" stroke-linecap="round"/><path d="M46 42l6 2-2 6" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M10 32c4-10 12-16 22-16s18 6 22 16c-4 10-12 16-22 16S14 42 10 32z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="32" r="6" fill="#FFDE42"/><circle cx="32" cy="32" r="3" fill="#000"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M14 10h36v30H14z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M22 24h20M22 30h14" stroke="#FF589B" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="50" r="8" stroke="#FFDE42" stroke-width="2.5"/><path d="M29 50l2 3 5-5" stroke="#FFDE42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 42v-4M36 42v-4" stroke="#FFDE42" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="10" y="20" width="44" height="9" rx="2" stroke="#FF589B" stroke-width="2.5"/><rect x="10" y="33" width="44" height="9" rx="2" stroke="#FF589B" stroke-width="2.5"/><rect x="18" y="22" width="8" height="5" rx="1" fill="#FF589B" opacity="0.5"/><rect x="30" y="35" width="8" height="5" rx="1" fill="#FF589B" opacity="0.5"/><path d="M32 10v10M32 42v12" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 50c-2-3-4-6-4-10s2-7 4-8 4 4 4 8-2 7-4 10z" stroke="#FFDE42" stroke-width="2.5"/><path d="M44 44c-3-2-7-3-10-2s-5 4-4 6 5 3 8 2 7-3 6-6z" stroke="#FFDE42" stroke-width="2.5"/><path d="M20 44c3-2 7-3 10-2s5 4 4 6-5 3-8 2-7-3-6-6z" stroke="#FFDE42" stroke-width="2.5"/><circle cx="32" cy="22" r="10" stroke="#FF589B" stroke-width="3"/><path d="M32 18v4l3 3" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ]},
  { topic: 'AI / Tech', icons: [
    '<svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="30" rx="18" ry="14" stroke="#FF589B" stroke-width="3"/><path d="M22 36c-4 4-2 12 4 14M42 36c4 4 2 12-4 14" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/><circle cx="26" cy="28" r="2.5" fill="#FFDE42"/><circle cx="38" cy="28" r="2.5" fill="#FFDE42"/><path d="M28 34c2 2 6 2 8 0" stroke="#FFDE42" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 10c-10 0-18 8-18 18 0 6 3 11 8 14v8h20v-8c5-3 8-8 8-14 0-10-8-18-18-18z" stroke="#FF589B" stroke-width="3"/><path d="M26 50h12M28 54h8" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="28" r="4" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="16" y="16" width="32" height="24" rx="4" stroke="#FF589B" stroke-width="3"/><path d="M16 44h32" stroke="#FF589B" stroke-width="3"/><path d="M28 48v6M36 48v6M24 54h16" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/><path d="M24 28h4M28 28v4M36 28h4M36 28v4" stroke="#FFDE42" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="10" stroke="#FF589B" stroke-width="3"/><circle cx="32" cy="32" r="3" fill="#FFDE42"/><path d="M32 12v8M32 44v8M12 32h8M44 32h8M18 18l6 6M40 40l6 6M46 18l-6 6M24 40l-6 6" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M20 20h24v24H20z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M28 20v-8M36 20v-8M28 44v8M36 44v8M20 28h-8M20 36h-8M44 28h8M44 36h8" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="32" r="5" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="12" cy="20" r="4" fill="#FF589B"/><circle cx="12" cy="44" r="4" fill="#FF589B"/><circle cx="32" cy="12" r="4" fill="#FFDE42"/><circle cx="32" cy="32" r="4" fill="#FFDE42"/><circle cx="32" cy="52" r="4" fill="#FFDE42"/><circle cx="52" cy="26" r="4" fill="#FF589B"/><circle cx="52" cy="46" r="4" fill="#FF589B"/><path d="M16 20l12-6M16 44l12 6M16 20l12 12M16 44l12-10M36 13l12 12M36 32l12-6M36 32l12 12M36 51l12-6" stroke="#FF589B" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="12" width="48" height="40" rx="6" stroke="#FF589B" stroke-width="3"/><path d="M8 24h48" stroke="#FF589B" stroke-width="2.5"/><path d="M22 36l-6 4 6 4" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 36l6 4-6 4" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 30l4 16" stroke="#FF589B" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M44 40H20a14 14 0 1 1 4-27 16 16 0 1 1 24 20" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><path d="M32 48V36M26 44l6-8 6 8" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M8 32c2-10 4-20 6-10s4 20 6 10 4-20 6-10 4 20 6 10 4-20 6-10 4 20 6 10" stroke="#FFDE42" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 42c4-6 8-12 12-6s8 12 12 6 8-12 12-6 8 12 12 6" stroke="#FF589B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="18" y="6" width="28" height="52" rx="6" stroke="#FF589B" stroke-width="3"/><path d="M28 54h8" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/><path d="M28 16h8" stroke="#FFDE42" stroke-width="2" stroke-linecap="round"/><rect x="22" y="22" width="20" height="24" rx="2" fill="#FF589B" opacity="0.1" stroke="#FF589B" stroke-width="1.5"/></svg>',
  ]},
  { topic: 'Alert', icons: [
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 10L6 54h52L32 10z" stroke="#FFDE42" stroke-width="3" stroke-linejoin="round"/><path d="M32 28v12" stroke="#FFDE42" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="46" r="2.5" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#FF589B" stroke-width="3"/><path d="M32 20v16" stroke="#FFDE42" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="44" r="2.5" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#FF589B" stroke-width="3"/><path d="M22 22l20 20M42 22L22 42" stroke="#ff4444" stroke-width="3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="12" y="20" width="40" height="28" rx="4" stroke="#FF589B" stroke-width="3"/><path d="M32 30v6" stroke="#FFDE42" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="40" r="2" fill="#FFDE42"/><path d="M24 20l8-8 8 8" stroke="#FF589B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M14 32h36" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><path d="M32 14v36" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="32" r="8" fill="none" stroke="#FFDE42" stroke-width="3"/><circle cx="32" cy="32" r="2" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 8v4M14 48h36M26 48a6 6 0 0 0 12 0" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><path d="M22 44V28c0-6 4.5-12 10-12s10 6 10 12v16" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><ellipse cx="32" cy="44" rx="14" ry="3" stroke="#FF589B" stroke-width="2.5"/><circle cx="46" cy="14" r="6" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M14 10v44" stroke="#FFDE42" stroke-width="3" stroke-linecap="round"/><path d="M14 12h32l-8 12 8 12H14" fill="#FFDE42" fill-opacity="0.2" stroke="#FFDE42" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 10c-6 8-10 14-6 22 2 4 6 6 10 4s4-8 2-14c4 4 8 10 6 18-2 8-8 14-12 14s-10-6-12-14c-4-14 4-24 12-30z" stroke="#FFDE42" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="46" r="4" fill="#FF589B"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#FF589B" stroke-width="3"/><path d="M18 32h28" stroke="#FF589B" stroke-width="4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 8l6 5h8l3 8 6 5-2 8 2 8-6 5-3 8h-8l-6 5-6-5h-8l-3-8-6-5 2-8-2-8 6-5 3-8h8z" stroke="#FFDE42" stroke-width="3" stroke-linejoin="round"/><path d="M32 26v10" stroke="#FF589B" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="42" r="2.5" fill="#FF589B"/></svg>',
  ]},
  { topic: 'People', icons: [
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="24" cy="20" r="8" stroke="#FF589B" stroke-width="3"/><path d="M10 46c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><circle cx="44" cy="22" r="6" stroke="#FFDE42" stroke-width="2.5"/><path d="M34 46c0-6 4.5-11 10-11s10 4 10 11" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="22" r="10" stroke="#FF589B" stroke-width="3"/><path d="M14 52c0-9.9 8.1-18 18-18s18 8.1 18 18" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><path d="M42 30l4 4 8-8" stroke="#FFDE42" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="20" cy="20" r="7" stroke="#FF589B" stroke-width="2.5"/><circle cx="44" cy="20" r="7" stroke="#FF589B" stroke-width="2.5"/><circle cx="32" cy="38" r="7" stroke="#FFDE42" stroke-width="2.5"/><path d="M20 27c0 5 4 9 12 11M44 27c0 5-4 9-12 11" stroke="#FF589B" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M10 42c0-8 9-14 22-14s22 6 22 14v4H10v-4z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="20" r="10" stroke="#FF589B" stroke-width="3"/><path d="M50 24l4 4-4 4" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="28" r="12" stroke="#FF589B" stroke-width="3"/><path d="M14 54c0-9.9 8.1-18 18-18s18 8.1 18 18" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><path d="M32 22v6l4 4" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="12" width="36" height="28" rx="8" stroke="#FF589B" stroke-width="3"/><path d="M16 40l-6 10 10-6" stroke="#FF589B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 26h20M16 32h14" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 52C22 44 10 36 10 24a12 12 0 0 1 22-6 12 12 0 0 1 22 6c0 12-12 20-22 28z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M32 28v8" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M10 36c0-4 4-8 10-10l12-2 12 2c6 2 10 6 10 10v4H10v-4z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M20 26l2 2 4-8" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 24l2 2 4-8" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="22" cy="16" r="6" stroke="#FF589B" stroke-width="2.5"/><circle cx="42" cy="16" r="6" stroke="#FF589B" stroke-width="2.5"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 10l5 10 11 2-8 8 2 12-10-5-10 5 2-12-8-8 11-2z" stroke="#FFDE42" stroke-width="3" stroke-linejoin="round"/><path d="M20 44l-10 10M44 44l10 10" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="14" r="6" stroke="#FFDE42" stroke-width="2.5"/><circle cx="14" cy="44" r="6" stroke="#FF589B" stroke-width="2.5"/><circle cx="50" cy="44" r="6" stroke="#FF589B" stroke-width="2.5"/><path d="M28 20l-10 18M36 20l10 18M22 44h20" stroke="#FF589B" stroke-width="2" stroke-linecap="round"/></svg>',
  ]},
  { topic: 'Finance', icons: [
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#FF589B" stroke-width="3"/><path d="M32 18v4M32 42v4M24 26c0-2.2 3.6-4 8-4s8 1.8 8 4-3.6 4-8 4-8 1.8-8 4 3.6 4 8 4 8-1.8 8-4" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="12" width="48" height="40" rx="6" stroke="#FF589B" stroke-width="3"/><path d="M8 24h48" stroke="#FF589B" stroke-width="2.5"/><rect x="14" y="30" width="12" height="8" rx="2" fill="#FFDE42"/><path d="M32 32h14M32 38h10" stroke="#FF589B" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M16 50L28 30l8 12 8-18 8 6" stroke="#FF589B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="28" cy="30" r="3" fill="#FFDE42"/><circle cx="36" cy="42" r="3" fill="#FFDE42"/><path d="M10 54h44" stroke="#FF589B" stroke-width="2"/><path d="M48 28l4-4 4 4" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M32 8l6 12 14 2-10 10 2 14-12-6-12 6 2-14L12 22l14-2z" stroke="#FFDE42" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="32" r="6" fill="#FF589B" opacity="0.6"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="16" y="30" width="8" height="22" rx="2" fill="#FF589B"/><rect x="28" y="20" width="8" height="32" rx="2" fill="#FFDE42"/><rect x="40" y="12" width="8" height="40" rx="2" fill="#FF589B"/><path d="M14 56h38" stroke="#FF589B" stroke-width="2"/><path d="M14 10l36 14" stroke="#FFDE42" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 3"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#FFDE42" stroke-width="3"/><circle cx="32" cy="32" r="13" stroke="#FF589B" stroke-width="2" stroke-dasharray="3 2"/><path d="M32 22v4M32 38v4M27 26c0-1.6 2.2-3 5-3s5 1.4 5 3-2.2 3-5 3-5 1.4-5 3 2.2 3 5 3 5-1.4 5-3" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="20" width="48" height="34" rx="6" stroke="#FF589B" stroke-width="3"/><path d="M8 32h48" stroke="#FF589B" stroke-width="2.5"/><rect x="36" y="37" width="14" height="10" rx="4" fill="#FFDE42" stroke="#000" stroke-width="1.5"/><circle cx="43" cy="42" r="2" fill="#000"/><path d="M14 12h32a6 6 0 0 1 6 6" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M14 22l-8 10 8 10" stroke="#FFDE42" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 42H14M22 34l-8 8 8 8" stroke="#FF589B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 22H14" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M14 8h36v52l-6-4-6 4-6-4-6 4-6-4-6 4V8z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M22 22h20M22 30h20M22 38h12" stroke="#FF589B" stroke-width="2" stroke-linecap="round"/><circle cx="42" cy="40" r="8" fill="#FFDE42" stroke="#000" stroke-width="2"/><path d="M42 36v5M42 43v2" stroke="#000" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="10" y="10" width="44" height="44" rx="6" stroke="#FF589B" stroke-width="3"/><circle cx="32" cy="32" r="12" stroke="#FFDE42" stroke-width="2.5"/><circle cx="32" cy="32" r="4" fill="#FFDE42"/><path d="M32 16v6M32 42v6M16 32h6M42 32h6" stroke="#FF589B" stroke-width="2" stroke-linecap="round" opacity="0.5"/></svg>',
  ]},
  { topic: 'Marketing', icons: [
    '<svg viewBox="0 0 64 64" fill="none"><path d="M12 38V26l28-12v36L12 38z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M40 20v24" stroke="#FF589B" stroke-width="2.5"/><path d="M12 38l4 14" stroke="#FFDE42" stroke-width="3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="20" stroke="#FF589B" stroke-width="3"/><circle cx="32" cy="32" r="12" stroke="#FF589B" stroke-width="2" stroke-dasharray="3 3"/><circle cx="32" cy="32" r="5" fill="#FFDE42"/><path d="M32 12v4M32 48v4M12 32h4M48 32h4" stroke="#FF589B" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M8 20h48v24H8z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M8 20l24 16 24-16" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="48" cy="44" r="8" fill="#FFDE42" stroke="#000" stroke-width="2"/><path d="M45 44l3-3 3 3" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M14 46c0-10 8-18 18-18" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/><path d="M14 46c0-18 18-32 32-32" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 3"/><circle cx="46" cy="14" r="6" stroke="#FF589B" stroke-width="2.5"/><circle cx="46" cy="14" r="2" fill="#FFDE42"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="8" width="22" height="22" rx="4" stroke="#FF589B" stroke-width="3"/><rect x="34" y="8" width="22" height="22" rx="4" stroke="#FFDE42" stroke-width="3"/><rect x="8" y="34" width="22" height="22" rx="4" stroke="#FFDE42" stroke-width="3"/><rect x="34" y="34" width="22" height="22" rx="4" stroke="#FF589B" stroke-width="3"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M20 14l-6 36M36 14l-6 36" stroke="#FFDE42" stroke-width="4" stroke-linecap="round"/><path d="M12 28h40M10 40h40" stroke="#FF589B" stroke-width="4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M24 46H16V30h8l8-16a6 6 0 0 1 6 6v8h12a4 4 0 0 1 4 5l-5 15H24z" stroke="#FF589B" stroke-width="3" stroke-linejoin="round"/><path d="M24 30v16" stroke="#FFDE42" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="48" cy="14" r="7" stroke="#FFDE42" stroke-width="2.5"/><circle cx="48" cy="50" r="7" stroke="#FFDE42" stroke-width="2.5"/><circle cx="16" cy="32" r="7" stroke="#FF589B" stroke-width="2.5"/><path d="M22 28l20-10M22 36l20 10" stroke="#FF589B" stroke-width="2.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><path d="M8 50L22 32l8 10 14-18 12 10" stroke="#FF589B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 24l10 2-2 10" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 54h48" stroke="#FF589B" stroke-width="2" opacity="0.5"/></svg>',
    '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="14" r="8" stroke="#FFDE42" stroke-width="3"/><path d="M20 22l-10 32M44 22l10 32" stroke="#FFDE42" stroke-width="2.5" stroke-linecap="round"/><path d="M18 28h28" stroke="#FFDE42" stroke-width="2" stroke-linecap="round" opacity="0.6"/><path d="M10 54h44" stroke="#FF589B" stroke-width="3" stroke-linecap="round"/></svg>',
  ]},
];

// ============ GEMINI API ============
var SYSTEM_INSTRUCTION = [
  'You are the content strategist for LayerProof. You write platform-native social posts.',
  '',
  'LAYERPROOF POSITIONING:',
  '- LP enables verification and citation traceability',
  '- LP makes AI outputs traceable enough that a human can catch errors',
  '- NEVER claim LP prevents hallucinations or eliminates errors',
  '- Core line: "The citation isn\'t the answer. It\'s the starting point."',
  '- Efficiency framing, not blame framing.',
  '',
  'THE CARDINAL RULE — SHOW, DON\'T EXPLAIN:',
  '- WRONG: "AI stats are often wrong because they repeat unsourced claims."',
  '- RIGHT: "The \'90% of restaurants fail\' stat came from a 2003 Amex TV commercial. Not a study. AI has repeated it thousands of times since."',
  '- Lead with the SPECIFIC EXAMPLE. Let the lesson follow. Never explain first.',
  '- One concrete "wait, really?" moment per unit (tweet/post/slide).',
  '- If you have a striking named example, use it. Don\'t describe it in the abstract.',
  '',
  'THREAD/POST STRUCTURE — ONE REVELATION PER UNIT:',
  '- Each tweet/post = one standalone revelation. Screenshottable on its own.',
  '- Pattern: [Specific surprising fact or example] → [1 line of context or implication].',
  '- Do NOT explain what you are about to say. Just say it.',
  '- Do NOT summarize what you just said. Trust the reader.',
  '- Fragments are power. "Not a study. An ad." beats "It was not from a study but rather an advertisement."',
  '',
  'HOOK RULES (NON-NEGOTIABLE):',
  '- Lead with the most striking number or insight. Never bury the lead.',
  '- Hook must stand completely alone. If they stop at line 1, they still got value.',
  '- Simple language only. One read = understood.',
  '- No jargon. No corporate hedging. Contrarian positioning works.',
  '- NEVER end a hook with a period.',
  '',
  'FORMATTING RULES (STRICT):',
  '- NEVER use em dashes (--). Use short separate sentences instead.',
  '- No hedging phrases: "The truth is", "Here\'s the thing", "At the end of the day".',
  '',
  'VOICE BY PLATFORM:',
  '- X Thread: Sharp, declarative. Short sentence, then space, then expansion. Use line breaks.',
  '- X Single: One revelation + one line of context + CTA. Max 280 chars. Make every word earn its place.',
  '- Threads (Meta): Casual, personal. Like noticing something and texting a smart friend. Fragments OK.',
  '- Instagram: Visual-first. Punchy hook + 1-2 expanding sentences + CTA + hashtags.',
  '',
  'REFERENCE POSTS — match this quality:',
  '"AI gets facts wrong in your report in 4 predictable ways.\nNot random. Not rare. The same errors. Every time.\nWhen an LLM shortens a document, it doesn\'t just cut words. It reinterprets. Restructures. Fills gaps."',
  '"AI citation isn\'t the answer. It\'s the starting point.\nAI with no source: you can\'t verify anything.\nAI with a source: at least you know where to look."',
  '"The \'7% words, 38% tone, 55% body language\' rule?\nCame from a study judging a single word. The researcher himself says it was misapplied.\nYet it\'s in every presentation skills deck ever made."'
].join('\n');

async function callGemini(userPrompt, model) {
  var apiKey = document.getElementById('api-key').value.trim();
  if (!apiKey) { showToast('Enter your Gemini API key first!'); return null; }
  localStorage.setItem('lp_gemini_key', apiKey);

  var modelName = model || 'gemini-3.1-flash-lite-preview';
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelName + ':generateContent?key=' + apiKey;
  var body = {
    system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: [{ parts: [{ text: userPrompt }] }],
    generationConfig: { temperature: 0.9, maxOutputTokens: 4096, responseMimeType: 'application/json' }
  };

  try {
    var resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!resp.ok) {
      var errData = await resp.json().catch(function() { return {}; });
      if (resp.status === 429) {
        var retryDelay = '';
        try {
          var retryInfo = errData.error.details.find(function(d) { return d['@type'] && d['@type'].includes('RetryInfo'); });
          if (retryInfo && retryInfo.retryDelay) retryDelay = ' Retry in ' + parseInt(retryInfo.retryDelay) + 's.';
        } catch(_) {}
        showToast('Rate limit hit.' + retryDelay + ' Wait and try again.');
      } else if (resp.status === 401 || resp.status === 403) {
        showToast('Invalid API key — check your Gemini key.');
      } else {
        showToast('API Error ' + resp.status + ': ' + (errData.error && errData.error.message || resp.statusText));
      }
      return null;
    }
    var data = await resp.json();
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    showToast('Network error: ' + e.message);
    return null;
  }
}

function parseJSON(raw) {
  var cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

// ============ NAVIGATION ============
function goStep(n) {
  document.querySelectorAll('.step').forEach(function(s, i) { s.classList.toggle('active', i === n); });
  document.querySelectorAll('.nav-step').forEach(function(s, i) {
    s.classList.toggle('active', i === n);
    if (i < n) s.classList.add('completed');
  });
  window.scrollTo(0, 0);
}

// ============ STEP 0: GENERATE HOOKS ============
async function generateHooks() {
  var blog = document.getElementById('blog-input').value.trim();
  if (!blog) return showToast('Paste a blog first!');
  state.blog = blog;

  var btn = document.getElementById('gen-hooks-btn');
  var loading = document.getElementById('loading-indicator');
  btn.disabled = true; loading.classList.remove('hidden');

  var prompt = 'Given this blog post, generate exactly 5 hooks for social media.\n\nBLOG:\n"""\n' + blog + '\n"""\n\n' +
    'Generate one hook per pattern. Each hook: up to 10 words MAX. Think headline — punchy, triggering, incomplete is fine.\n\n' +
    '1. STAT + SURPRISE: A number that stops the scroll. e.g. "4 ways AI breaks your report"\n' +
    '2. CONTRAST: Sharp before/after. e.g. "AI citations look right — they\'re not"\n' +
    '3. ASSUMPTION FLIP: Destroy a belief they hold. e.g. "Citations don\'t mean accuracy"\n' +
    '4. DIRECT QUESTION: The question they\'re already thinking. e.g. "Does your AI actually cite correctly?"\n' +
    '5. NUMBERED STRUCTURE: A count that teases a list. e.g. "4 predictable AI fact errors"\n\n' +
    'Rules: Up to 10 words MAX. No full sentences. NEVER end with a period. Question mark is fine for question hooks. No jargon.\n\n' +
    'Return JSON:\n{"hooks":[{"type":"Stat + Surprise","text":"...","label":"why this works in 5 words"},{"type":"Contrast","text":"...","label":"..."},{"type":"Assumption Flip","text":"...","label":"..."},{"type":"Direct Question","text":"...","label":"..."},{"type":"Numbered Structure","text":"...","label":"..."}],"recommended":0}';

  try {
    var result = await callGemini(prompt, 'gemini-3.1-flash-lite-preview');
    if (!result) { btn.disabled = false; loading.classList.add('hidden'); return; }
    var parsed = parseJSON(result);
    state.hooks = parsed.hooks.map(function(h, i) {
      return { type: h.type, text: h.text, label: h.label, recommended: i === (parsed.recommended || 0) };
    });
    state.selectedHook = -1;
    document.getElementById('confirm-hook-btn').disabled = true;
    renderHooks(); goStep(1);
  } catch (e) { showToast('Failed to parse AI response.'); }
  btn.disabled = false; loading.classList.add('hidden');
}

// ============ STEP 1: HOOKS ============
function renderHooks() {
  var container = document.getElementById('hooks-container');
  container.innerHTML = state.hooks.map(function(h, i) {
    return '<div class="hook-card ' + (state.selectedHook === i ? 'selected' : '') + '" onclick="selectHook(' + i + ')">' +
      '<div class="hook-type">' + h.type + '</div>' +
      '<div class="hook-text">' + escHtml(h.text) + '</div>' +
      '<span class="hook-label">' + h.label + '</span>' +
      (h.recommended ? '<span class="recommended">★ My lean</span>' : '') + '</div>';
  }).join('');
}

function selectHook(i) {
  state.selectedHook = i;
  renderHooks();
  document.getElementById('confirm-hook-btn').disabled = false;
}

async function regenerateHooks() {
  var comment = document.getElementById('hook-comment').value.trim();
  var loading = document.getElementById('loading-posts');
  loading.textContent = '⏳ Regenerating hooks...'; loading.classList.remove('hidden');

  var feedbackLine = comment ? 'USER FEEDBACK: "' + comment + '"' : 'Generate fresh alternatives with different angles and wording from the previous hooks.';
  var prompt = 'Regenerate 5 hooks for this blog based on feedback.\n\nBLOG:\n"""\n' + state.blog + '\n"""\n\n' +
    'PREVIOUS HOOKS:\n' + state.hooks.map(function(h, i) { return (i+1) + '. [' + h.type + '] ' + h.text; }).join('\n') + '\n\n' +
    feedbackLine + '\n\n' +
    'Return 5 hooks (Stat + Surprise, Contrast, Assumption Flip, Direct Question, Numbered Structure). Up to 10 words MAX each. NEVER end with a period.\n' +
    'JSON: {"hooks":[{"type":"...","text":"...","label":"..."}...],"recommended":0}';

  try {
    var result = await callGemini(prompt, 'gemini-3.1-flash-lite-preview');
    if (!result) { loading.classList.add('hidden'); return; }
    var parsed = parseJSON(result);
    state.hooks = parsed.hooks.map(function(h, i) {
      return { type: h.type, text: h.text, label: h.label, recommended: i === (parsed.recommended || 0) };
    });
    state.selectedHook = -1;
    document.getElementById('confirm-hook-btn').disabled = true;
    renderHooks(); showToast('Hooks regenerated!');
  } catch (e) { showToast('Failed to parse response.'); }
  loading.classList.add('hidden');
  document.getElementById('hook-comment').value = '';
}

// ============ STEP 2: GENERATE ALL POSTS ============
async function confirmHook() {
  if (state.selectedHook < 0) return;
  var hook = state.hooks[state.selectedHook].text;
  var btn = document.getElementById('confirm-hook-btn');
  var loading = document.getElementById('loading-posts');
  btn.disabled = true; loading.classList.remove('hidden');

  var threadFlow = 'THREAD NARRATIVE FLOW (both X Thread and Threads):\n' +
    'Think of the full thread as ONE piece of writing split across posts. The reader goes on a journey.\n' +
    'Follow this arc — you can combine parts, make one longer, or skip 1-2 depending on the topic:\n' +
    '  1. OPEN: a stat, a term, or a bold opinion. Drop the reader into the world immediately.\n' +
    '  2. EXPLAIN: what do you mean by that? Define the thing. Make it concrete.\n' +
    '  3. PROOF: specific named examples, real data, named sources. Show, don\'t describe.\n' +
    '  4. INSIGHT: what does this tell us? The lesson. Keep it tight.\n' +
    '  5. ACTION: 1-3 things the reader can actually do. Use bullet points (- or →) here if listing.\n' +
    '  6. CTA: close with LayerProof mention.\n' +
    'Use \\n line breaks inside posts for rhythm. Short punchy sentence, then expansion.\n' +
    'No filler phrases ("The truth is", "At the end of the day"). No em dashes.\n\n';

  var carouselLayouts =
    '- "cover": Slide 1. title (3-5 words ALL CAPS) + subtitle (3-5 words ALL CAPS)\n' +
    '- "text-slide": title (2-4 words ALL CAPS) + body (2-3 short punchy sentences)\n' +
    '- "bullets-slide": title (2-3 words ALL CAPS) + bullets array (3-4 items, max 12 words each)\n' +
    '- "stats-slide": title (2-3 words ALL CAPS) + stat (1 striking sentence) + bullets array (2 short supporting points)\n' +
    '- "cta": ALWAYS last. title="INTERESTED?" body="This post is also made with LayerProof" url="layerproof.app"\n';

  var prompt = 'SELECTED HOOK: "' + hook + '"\n\nFULL BLOG:\n"""\n' + state.blog + '\n"""\n\n' +
    'Generate ALL 5 outputs in one response.\n\n' +
    threadFlow +
    'OUTPUT 1 - X THREAD:\n' +
    '- 5-8 tweets. Target 180-240 chars each. Hard max: 280 chars/tweet.\n' +
    '- Tweet 1: Hook (reuse the selected hook exactly) + 🧵.\n' +
    '- Follow the narrative arc above. One flow, not isolated revelations.\n' +
    '- Bullet points (- or →) allowed in 1-2 tweets for actions or lists.\n' +
    '- Last tweet: CTA + "This post was made with LayerProof."\n\n' +
    'OUTPUT 2 - SINGLE X POST:\n' +
    '- 200-260 chars (hard max 280). Lead with the single most surprising fact.\n' +
    '- One line of context, line break, CTA. End with "Link in bio."\n' +
    '- Different angle from the thread.\n\n' +
    'OUTPUT 3 - THREADS (Meta):\n' +
    '- 4-6 posts. Each up to 500 chars. Same arc as X Thread but more room per post.\n' +
    '- Casual, personal tone. Fragments OK. Bullet points (- or →) in 1-2 posts for actions.\n' +
    '- No hashtags.\n\n' +
    'OUTPUT 4 - INSTAGRAM:\n' +
    '- ~50 words. Lead with most surprising fact. 1-2 expanding sentences. CTA. 8-12 hashtags on new line.\n\n' +
    'OUTPUT 5 - CAROUSEL (5-7 slides):\n' +
    'Follow this arc: Cover (hook) → explain concept → specific proof/example → insight → actions → CTA.\n' +
    'Layouts available:\n' + carouselLayouts +
    'Titles ALL CAPS, short. Body direct, declarative. No filler. No em dashes.\n\n' +
    'Return one JSON object:\n' +
    '{\n' +
    '  "thread": ["tweet1", "tweet2", ...],\n' +
    '  "single": "...",\n' +
    '  "threads": ["post1", "post2", ...],\n' +
    '  "instagram": "...",\n' +
    '  "carousel": { "slides": [{"layout":"cover","title":"...","subtitle":"..."},{"layout":"text-slide","title":"...","body":"..."},{"layout":"bullets-slide","title":"...","bullets":["...","..."]},{"layout":"cta","title":"INTERESTED?","body":"This post is also made with LayerProof","url":"layerproof.app"}], "swipeLabel": "Swipe for more" }\n' +
    '}';

  try {
    var result = await callGemini(prompt);
    if (!result) { btn.disabled = false; loading.classList.add('hidden'); return; }
    var parsed = parseJSON(result);
    state.posts.thread = parsed.thread;
    state.posts.single = parsed.single;
    state.posts.threads = parsed.threads;
    state.posts.instagram = parsed.instagram;
    if (parsed.carousel && parsed.carousel.slides) {
      state.carouselPlan = parsed.carousel.slides;
      state.swipeLabel = parsed.carousel.swipeLabel || 'Swipe for more';
    }
    renderPosts();
    renderCarouselPlan();
    goStep(2);
    showToast('All posts + carousel ready!');
  } catch (e) { showToast('Failed to parse AI response.'); }
  btn.disabled = false; loading.classList.add('hidden');
}

function renderPosts() {
  // Thread
  var threadEl = document.getElementById('thread-container');
  threadEl.innerHTML = state.posts.thread.map(function(t, i) {
    var label = i === 0 ? '🧵 Tweet 1 (Hook)' : (i === state.posts.thread.length - 1 ? '📌 Tweet ' + (i+1) + ' (CTA)' : 'Tweet ' + (i+1));
    var over = t.length > 280;
    return '<div class="thread-tweet">' +
      '<div class="tweet-num">' + label + '</div>' +
      '<textarea rows="3" oninput="state.posts.thread[' + i + ']=this.value; updateTweetCount(this, ' + i + ')">' + escHtml(t) + '</textarea>' +
      '<div class="char-count' + (over ? ' over' : '') + '" id="tweet-count-' + i + '">' + t.length + ' / 280</div>' +
      '<button class="copy-btn" onclick="copyText(state.posts.thread[' + i + '])">Copy</button></div>';
  }).join('');

  // Single X
  var singleEl = document.getElementById('single-preview');
  singleEl.textContent = state.posts.single;
  singleEl.setAttribute('contenteditable', 'true');
  singleEl.oninput = function() { state.posts.single = singleEl.textContent; updateCharCount('single-count', state.posts.single, 280); };
  addCopyBtn(singleEl); updateCharCount('single-count', state.posts.single, 280);

  // Threads (Meta) — multi-post like X Thread, 500 chars each
  var threadsContEl = document.getElementById('threads-container');
  threadsContEl.innerHTML = (state.posts.threads || []).map(function(t, i) {
    var label = i === 0 ? '📱 Post 1 (Hook)' : (i === state.posts.threads.length - 1 ? '📌 Post ' + (i+1) + ' (CTA)' : 'Post ' + (i+1));
    var over = t.length > 500;
    return '<div class="thread-tweet" style="border-left-color:#FF589B;">' +
      '<div class="tweet-num">' + label + '</div>' +
      '<textarea rows="4" oninput="state.posts.threads[' + i + ']=this.value; updateThreadsCount(this,' + i + ')">' + escHtml(t) + '</textarea>' +
      '<div class="char-count' + (over ? ' over' : '') + '" id="threads-count-' + i + '">' + t.length + ' / 500</div>' +
      '<button class="copy-btn" onclick="copyText(state.posts.threads[' + i + '])">Copy</button></div>';
  }).join('');

  // Instagram
  var igEl = document.getElementById('instagram-preview');
  igEl.textContent = state.posts.instagram;
  igEl.setAttribute('contenteditable', 'true');
  igEl.oninput = function() { state.posts.instagram = igEl.textContent; };
  addCopyBtn(igEl);

  // Auto-fill image builder title from hook
  var hookText = state.hooks[state.selectedHook].text;
  var words = hookText.split(' ');
  var mid = Math.ceil(words.length / 2);
  var slide0 = state.slides[0];
  slide0.line1 = words.slice(0, mid).join(' ').toUpperCase().substring(0, 40);
  slide0.line2 = words.slice(mid).join(' ').toUpperCase().substring(0, 40);
  document.getElementById('title-line1').value = slide0.line1;
  document.getElementById('title-line2').value = slide0.line2;
  updatePreview();
}

function updateCharCount(elId, text, limit) {
  var count = (text || '').length;
  var el = document.getElementById(elId);
  if (!el) return;
  el.textContent = count + ' / ' + limit;
  el.className = 'char-count' + (count > limit ? ' over' : '');
}

function updateTweetCount(textarea, idx) {
  state.posts.thread[idx] = textarea.value;
  var el = document.getElementById('tweet-count-' + idx);
  if (el) { el.textContent = textarea.value.length + ' / 280'; el.className = 'char-count' + (textarea.value.length > 280 ? ' over' : ''); }
}

function updateThreadsCount(textarea, idx) {
  state.posts.threads[idx] = textarea.value;
  var el = document.getElementById('threads-count-' + idx);
  if (el) { el.textContent = textarea.value.length + ' / 500'; el.className = 'char-count' + (textarea.value.length > 500 ? ' over' : ''); }
}

async function regenFormat(format) {
  var commentEl = document.getElementById(format + '-comment');
  var comment = commentEl ? commentEl.value.trim() : '';
  var commentPrompt = comment ? '"' + comment + '"' : 'give me a fresh variation with a different angle and wording — same hook but new examples and structure';

  var regenBtn = commentEl ? commentEl.parentElement.querySelector('.btn') : null;
  if (!regenBtn) return;
  var origHtml = regenBtn.innerHTML;
  regenBtn.innerHTML = '<span style="display:inline-block;animation:spin 0.8s linear infinite;">↻</span> Generating...'; regenBtn.disabled = true;

  var formatNames = { thread: 'X Thread', single: 'Single X Post', threads: 'Threads (Meta)', instagram: 'Instagram Caption' };
  var threadFlowRules = 'Follow this narrative arc (combine or skip parts as needed): 1-OPEN with a stat/term/opinion, 2-EXPLAIN what you mean, 3-PROOF with specific named examples, 4-INSIGHT/lesson, 5-ACTIONS with bullet points (- or →), 6-CTA. The full thread = one journey, not isolated posts. Use \\n line breaks for rhythm. No filler phrases. No em dashes.';
  var formatRules = {
    thread: '5-8 tweets. 180-240 chars each (hard max 280). Tweet 1 = hook + 🧵. ' + threadFlowRules + ' Last tweet = CTA + LayerProof mention.',
    single: 'Target 200-260 chars (hard max 280). Lead with the single most surprising specific fact. One line of context. Line break. CTA ending with "Link in bio."',
    threads: '4-6 posts. Each up to 500 chars. Casual personal tone. Fragments OK. ' + threadFlowRules + ' No hashtags. Last post = soft CTA.',
    instagram: '~50 words. Lead with the most surprising specific fact. 1-2 expanding sentences. CTA ("Save this" or "Link in bio"). 8-12 hashtags on new line.',
  };
  var currentContent = (format === 'thread' || format === 'threads') ? state.posts[format].join('\n---\n') : state.posts[format];
  var returnFormat = format === 'thread' ? '{"thread":["tweet 1","tweet 2",...]}' :
    format === 'threads' ? '{"threads":["post 1","post 2","post 3"]}' :
    '{"' + format + '":"the full post text"}';
  var prompt = 'Rewrite this ' + formatNames[format] + ' based on feedback.\n\nCURRENT:\n"""\n' + currentContent + '\n"""\n\nBLOG:\n"""\n' + state.blog + '\n"""\n\nFEEDBACK: ' + commentPrompt + '\n\nRULES: ' + formatRules[format] + '\n\nReturn JSON:\n' + returnFormat;

  try {
    var result = await callGemini(prompt);
    if (!result) { regenBtn.innerHTML = origHtml; regenBtn.disabled = false; return; }
    var parsed = parseJSON(result);
    if (format === 'thread') state.posts.thread = parsed.thread;
    else if (format === 'single') state.posts.single = parsed.single;
    else if (format === 'threads') state.posts.threads = parsed.threads;
    else if (format === 'instagram') state.posts.instagram = parsed.instagram;
    renderPosts(); showToast(formatNames[format] + ' regenerated!');
  } catch (e) { showToast('Failed to parse response.'); }
  regenBtn.innerHTML = origHtml; regenBtn.disabled = false;
  if (commentEl) commentEl.value = '';
}

// ============ CAROUSEL PLAN (Posts Tab) ============
async function generateCarousel(silent) {
  if (!state.blog) { if (!silent) showToast('Paste a blog and generate hooks first!'); return; }
  if (state.selectedHook < 0) { if (!silent) showToast('Pick a hook first (Step 1)!'); return; }

  var hook = state.hooks[state.selectedHook].text;
  var commentEl = document.getElementById('carousel-comment');
  var comment = commentEl ? commentEl.value.trim() : '';
  var loadingEl = document.getElementById('loading-carousel');
  var btn = document.getElementById('carousel-gen-btn');

  if (!silent) { btn.disabled = true; loadingEl.classList.remove('hidden'); }
  else { loadingEl.classList.remove('hidden'); }

  var prompt = 'HOOK: "' + hook + '"\n\nBLOG:\n"""\n' + state.blog + '\n"""\n\n' +
    (comment ? 'DIRECTION: "' + comment + '"\n\n' : '') +
    'Generate a 5-7 slide Instagram carousel plan.\n\nLAYOUTS:\n' +
    '- "cover": Slide 1. title (3-5 words, ALL CAPS) + subtitle (3-5 words, ALL CAPS)\n' +
    '- "text-slide": Narrative. title (2-4 words ALL CAPS) + body (2-3 short punchy sentences, no filler, no em dashes)\n' +
    '- "bullets-slide": Learnings/tips. title (2-3 words ALL CAPS) + bullets (3-4 items, max 12 words each)\n' +
    '- "stats-slide": Data findings. title (2-3 words ALL CAPS) + stat (1 striking sentence) + bullets (2 short supporting points)\n' +
    '- "cta": ALWAYS last. title="INTERESTED?" body="This post is also made with LayerProof" url="layerproof.app"\n\n' +
    'CAROUSEL FLOW — follow this arc:\n' +
    '  Slide 1 (cover): bold hook from the selected hook\n' +
    '  Slide 2: explain the core concept — what is this about?\n' +
    '  Slide 3-5: specific proof, named example, or data — one per slide\n' +
    '  Slide 6: insight or lesson — what does this mean?\n' +
    '  Slide 7 (if needed): actions — what can they do?\n' +
    '  Last slide: CTA\n' +
    'Titles: ALL CAPS, short, punchy. Body: direct, declarative. No filler. No em dashes.\n\n' +
    'Return JSON:\n{"slides":[{"layout":"cover","title":"...","subtitle":"..."},{"layout":"text-slide","title":"...","body":"..."},{"layout":"bullets-slide","title":"...","bullets":["..."]},{"layout":"cta","title":"INTERESTED?","body":"This post is also made with LayerProof","url":"layerproof.app"}],"swipeLabel":"Swipe for more"}';

  try {
    var result = await callGemini(prompt);
    if (!result) { btn.disabled = false; loadingEl.classList.add('hidden'); return; }
    var parsed = parseJSON(result);
    state.carouselPlan = parsed.slides;
    state.swipeLabel = parsed.swipeLabel || 'Swipe for more';
    renderCarouselPlan();
    showToast('Carousel ready — ' + parsed.slides.length + ' slides.');
  } catch (e) { console.error(e); if (!silent) showToast('Failed to parse response.'); }
  btn.disabled = false; loadingEl.classList.add('hidden');
  if (commentEl) commentEl.value = '';
}

function renderCarouselPlan() {
  var container = document.getElementById('carousel-plan-container');
  if (!state.carouselPlan.length) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:13px;">Generate a carousel plan above.</p>';
    return;
  }
  container.innerHTML = state.carouselPlan.map(function(slide, i) {
    var layoutLabels = { cover: 'Cover', 'text-slide': 'Text', 'bullets-slide': 'Bullets', 'stats-slide': 'Stats', cta: 'CTA' };
    var layoutColors = { cover: 'var(--cyan)', 'text-slide': 'var(--text-muted)', 'bullets-slide': 'var(--yellow)', 'stats-slide': '#7c6cff', cta: 'var(--yellow)' };
    var color = layoutColors[slide.layout] || 'var(--text-muted)';
    var content = '';
    switch(slide.layout) {
      case 'cover':
        content = '<div class="cplan-title">' + escHtml(slide.title || '') + '</div><div class="cplan-subtitle">' + escHtml(slide.subtitle || '') + '</div>';
        break;
      case 'text-slide':
        content = '<div class="cplan-title">' + escHtml(slide.title || '') + '</div><div class="cplan-body">' + escHtml(slide.body || '') + '</div>';
        break;
      case 'bullets-slide':
        content = '<div class="cplan-title">' + escHtml(slide.title || '') + '</div>' +
          (slide.bullets || []).map(function(b) { return '<div class="cplan-bullet">▶ ' + escHtml(b) + '</div>'; }).join('');
        break;
      case 'stats-slide':
        content = '<div class="cplan-title">' + escHtml(slide.title || '') + '</div>' +
          '<div class="cplan-stat">' + escHtml(slide.stat || '') + '</div>' +
          (slide.bullets || []).map(function(b) { return '<div class="cplan-bullet">▶ ' + escHtml(b) + '</div>'; }).join('');
        break;
      case 'cta':
        content = '<div class="cplan-title" style="color:var(--yellow);">' + escHtml(slide.title || '') + '</div>' +
          '<div class="cplan-body">' + escHtml(slide.body || '') + '</div>' +
          '<div class="cplan-url">🔗 ' + escHtml(slide.url || '') + '</div>';
        break;
    }
    return '<div class="carousel-plan-card">' +
      '<div class="cplan-header">' +
        '<span class="cplan-num">Slide ' + (i+1) + '</span>' +
        '<span class="cplan-layout-badge" style="background:' + color + '20; color:' + color + ';">' + (layoutLabels[slide.layout] || slide.layout) + '</span>' +
      '</div>' + content + '</div>';
  }).join('');
}

function buildCarouselInImageBuilder() {
  state.slides = state.carouselPlan.map(function(s) {
    return {
      layout: s.layout || 'cover',
      line1: (s.title || '').toUpperCase(),
      line2: (s.subtitle || '').toUpperCase(),
      size1: s.layout === 'cta' ? 56 : 36,
      size2: 26,
      body: s.body || '',
      bodyColor: '#ffffff', bodySize: 16,
      bullets: s.bullets || [],
      bulletColor: '#FF589B', bulletSize: 15,
      stat: s.stat || '',
      url: s.url || 'layerproof.app',
      swipeLabel: (s.layout !== 'cta' && s.layout !== 'cover') ? (state.swipeLabel || '') : '',
      iconIdx: 0, iconScale: 100,
      image: null, imgScale: 80, imgY: 55, imgRadius: 8,
    };
  });
  state.currentSlide = 0;
  state.mode = 'carousel';

  goStep(3);

  // Activate carousel mode UI
  var modeToggle = document.getElementById('mode-toggle');
  modeToggle.querySelectorAll('button').forEach(function(b) { b.classList.remove('active'); });
  modeToggle.querySelectorAll('button')[1].classList.add('active');
  document.getElementById('carousel-panel').classList.remove('hidden');
  document.getElementById('download-all-btn').classList.remove('hidden');

  renderCarouselThumbs();
  loadSlide(0);
  showToast(state.slides.length + ' slides loaded in Image Builder!');
}

function goToImageBuilder() {
  if (state.carouselPlan && state.carouselPlan.length > 0) {
    buildCarouselInImageBuilder();
  } else {
    goStep(3);
  }
}

// ============ TABS ============
function switchTab(tabEl, contentId) {
  tabEl.closest('.tabs').querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
  tabEl.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(function(tc) { tc.classList.remove('active'); });
  document.getElementById(contentId).classList.add('active');
}

// ============ IMAGE BUILDER – ICONS ============
function initIcons() {
  renderIconTopics();
  renderIconGrid(0);
}

function renderIconTopics() {
  var container = document.getElementById('icon-topics');
  container.innerHTML = iconSets.map(function(set, i) {
    return '<button class="icon-topic-btn' + (state.iconSet === i ? ' active' : '') + '" onclick="renderIconGrid(' + i + ')">' + set.topic + '</button>';
  }).join('');
}

function renderIconGrid(setIdx) {
  state.iconSet = setIdx;
  renderIconTopics();
  var grid = document.getElementById('icon-grid');
  var icons = iconSets[setIdx].icons;
  var currentSlide = state.slides[state.currentSlide];
  grid.innerHTML = icons.map(function(svg, i) {
    return '<div class="icon-option ' + (currentSlide.iconIdx === i ? 'selected' : '') + '" onclick="pickIcon(' + i + ')">' + svg + '</div>';
  }).join('');
  updatePreview();
}

function pickIcon(i) {
  state.slides[state.currentSlide].iconIdx = i;
  renderIconGrid(state.iconSet);
}

function updateIconScale() {
  var scale = parseInt(document.getElementById('icon-scale').value);
  state.slides[state.currentSlide].iconScale = scale;
  updatePreview();
}

// ============ IMAGE BUILDER – LAYOUT ============
var LAYOUTS = [
  { key: 'cover',        label: 'Cover',   desc: 'Title + icon + image' },
  { key: 'text-slide',   label: 'Text',    desc: 'Heading + body text' },
  { key: 'bullets-slide',label: 'Bullets', desc: 'Heading + arrow list' },
  { key: 'stats-slide',  label: 'Stats',   desc: 'Heading + stat + list' },
  { key: 'cta',          label: 'CTA',     desc: '"Interested?" end slide' },
];

function renderLayoutSelector() {
  var current = (state.slides[state.currentSlide] && state.slides[state.currentSlide].layout) || 'cover';
  var container = document.getElementById('layout-selector');
  container.innerHTML = LAYOUTS.map(function(l) {
    return '<button class="layout-btn' + (current === l.key ? ' active' : '') + '" onclick="setLayout(\'' + l.key + '\')" title="' + l.desc + '">' + l.label + '</button>';
  }).join('');
}

function setLayout(layout) {
  state.slides[state.currentSlide].layout = layout;
  renderLayoutSelector();
  updateLayoutControls();
  updatePreview();
}

function updateLayoutControls() {
  var layout = (state.slides[state.currentSlide] && state.slides[state.currentSlide].layout) || 'cover';
  var show = function(id, visible) { var el = document.getElementById(id); if (el) el.style.display = visible ? '' : 'none'; };

  show('ctrl-line2',   layout === 'cover');
  show('ctrl-size2',   layout === 'cover');
  show('ctrl-icon',    layout === 'cover');
  show('ctrl-image',   true);
  show('ctrl-body',    ['text-slide','cta'].indexOf(layout) >= 0);
  show('ctrl-bullets', ['bullets-slide','stats-slide'].indexOf(layout) >= 0);
  show('ctrl-stat',    layout === 'stats-slide');
  show('ctrl-url',     layout === 'cta');
  show('ctrl-swipe',   ['text-slide','bullets-slide','stats-slide'].indexOf(layout) >= 0);
}

// ============ IMAGE BUILDER – CANVAS RENDERER ============
function renderSlideCanvas(slide) {
  var canvas = document.getElementById('slide-canvas');
  var layout = slide.layout || 'cover';
  var s1 = slide.size1 || 32;
  var s2 = slide.size2 || 26;
  var bodyColor = slide.bodyColor || '#ffffff';
  var bodySize = slide.bodySize || 16;
  var bulletColor = slide.bulletColor || '#FF589B';
  var bulletSize = slide.bulletSize || 15;
  var iconScale = slide.iconScale || 100;
  var iconSize = Math.round(55 * iconScale / 100);
  var icons = iconSets[state.iconSet] && iconSets[state.iconSet].icons;
  var iconSvg = icons ? (icons[slide.iconIdx] || icons[0]) : '';
  var imgScale = slide.imgScale || 80;
  var imgRadius = slide.imgRadius || 8;
  var imgY = slide.imgY || 55;

  var imgHtml = slide.image
    ? '<img src="' + slide.image + '" style="width:' + imgScale + '%; border-radius:' + imgRadius + 'px; box-shadow:0 8px 32px rgba(0,0,0,0.5); max-width:100%; max-height:100%; object-fit:contain;">'
    : '<div style="width:70%;height:80%;border:2px dashed #333;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#444;font-size:12px;font-family:Roboto,sans-serif;">Drop or paste image</div>';

  var logo = '<div style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);z-index:10;">' +
    '<img src="' + LOGO_DATA_URL + '" height="14" style="display:block;"></div>';

  switch(layout) {
    case 'cover':
      canvas.innerHTML =
        '<div style="position:absolute;top:28px;left:28px;right:' + (iconSize + 44) + 'px;z-index:10;">' +
          '<div style="font-family:Anton,sans-serif;font-size:' + s1 + 'px;color:#FFDE42;text-transform:uppercase;line-height:1.05;">' + escHtml(slide.line1 || '') + '</div>' +
          '<div style="font-family:Anton,sans-serif;font-size:' + s2 + 'px;color:#FF589B;text-transform:uppercase;line-height:1.05;margin-top:4px;">' + escHtml(slide.line2 || '') + '</div>' +
        '</div>' +
        '<div style="position:absolute;top:28px;right:28px;width:' + iconSize + 'px;height:' + iconSize + 'px;z-index:10;display:flex;align-items:center;justify-content:center;">' + iconSvg + '</div>' +
        '<div style="position:absolute;top:' + imgY + '%;left:50%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;z-index:5;width:84%;height:52%;overflow:hidden;">' + imgHtml + '</div>' +
        logo;
      break;

    case 'text-slide':
      var tsBottomBar = '<div style="position:absolute;bottom:14px;left:28px;right:28px;display:flex;align-items:center;justify-content:space-between;z-index:10;">' +
        '<img src="' + LOGO_DATA_URL + '" height="11" style="display:block;">' +
        (slide.swipeLabel ? '<span style="font-family:Roboto,sans-serif;font-weight:700;font-size:13px;color:#FFDE42;">' + escHtml(slide.swipeLabel) + ' →</span>' : '') +
        '</div>';
      var tsBodyHtml = slide.bodyHtml || (escHtml(slide.body || '').replace(/\n/g, '<br>'));
      canvas.innerHTML =
        '<div style="position:absolute;top:28px;left:28px;right:28px;z-index:10;">' +
          '<div style="font-family:Anton,sans-serif;font-size:' + s1 + 'px;color:#FF589B;text-transform:uppercase;line-height:1.0;">' + escHtml(slide.line1 || '') + '</div>' +
        '</div>' +
        '<div style="position:absolute;top:' + (s1 + 50) + 'px;left:28px;right:28px;z-index:10;">' +
          '<div id="canvas-body-text" contenteditable="true" spellcheck="false" style="font-family:Roboto,sans-serif;font-size:' + bodySize + 'px;color:' + bodyColor + ';line-height:1.65;outline:none;cursor:text;">' + tsBodyHtml + '</div>' +
        '</div>' +
        (slide.image ? '<div style="position:absolute;bottom:52px;left:50%;transform:translateX(-50%);display:flex;align-items:center;justify-content:center;width:80%;z-index:5;">' + imgHtml + '</div>' : '') +
        tsBottomBar;
      var tsBodyEl = document.getElementById('canvas-body-text');
      if (tsBodyEl) {
        tsBodyEl.addEventListener('input', function() { state.slides[state.currentSlide].bodyHtml = this.innerHTML; });
        tsBodyEl.addEventListener('blur', function() { state.slides[state.currentSlide].bodyHtml = this.innerHTML; });
      }
      break;

    case 'bullets-slide':
      var bHtml = (slide.bullets || []).map(function(b) {
        return '<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:' + Math.round(bulletSize * 1.1) + 'px;">' +
          '<span style="color:' + bulletColor + ';font-size:' + Math.round(bulletSize + 2) + 'px;line-height:1.4;flex-shrink:0;margin-top:1px;">▶</span>' +
          '<span style="font-family:Roboto,sans-serif;font-size:' + bulletSize + 'px;color:#fff;line-height:1.55;">' + escHtml(b) + '</span>' +
        '</div>';
      }).join('');
      var bsBottomBar = '<div style="position:absolute;bottom:14px;left:28px;right:28px;display:flex;align-items:center;justify-content:space-between;z-index:10;">' +
        '<img src="' + LOGO_DATA_URL + '" height="11" style="display:block;">' +
        (slide.swipeLabel ? '<span style="font-family:Roboto,sans-serif;font-weight:700;font-size:13px;color:#FFDE42;">' + escHtml(slide.swipeLabel) + ' →</span>' : '') +
        '</div>';
      var bsContent = slide.image
        ? '<div style="display:flex;gap:14px;">' +
            '<div style="flex:1;">' + bHtml + '</div>' +
            '<div style="flex:1;display:flex;align-items:flex-start;justify-content:center;">' + imgHtml + '</div>' +
          '</div>'
        : bHtml;
      canvas.innerHTML =
        '<div style="position:absolute;top:28px;left:28px;right:28px;z-index:10;">' +
          '<div style="font-family:Anton,sans-serif;font-size:' + s1 + 'px;color:#FFDE42;text-transform:uppercase;line-height:1.0;">' + escHtml(slide.line1 || '') + '</div>' +
        '</div>' +
        '<div style="position:absolute;top:' + (s1 + 50) + 'px;left:28px;right:28px;z-index:10;">' + bsContent + '</div>' +
        bsBottomBar;
      break;

    case 'stats-slide':
      var sbHtml = (slide.bullets || []).map(function(b) {
        return '<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:12px;">' +
          '<span style="color:' + bulletColor + ';font-size:' + bulletSize + 'px;line-height:1.4;flex-shrink:0;">▶</span>' +
          '<span style="font-family:Roboto,sans-serif;font-size:' + Math.max(bulletSize - 2, 11) + 'px;color:#fff;line-height:1.5;">' + escHtml(b) + '</span>' +
        '</div>';
      }).join('');
      var ssBottomBar = '<div style="position:absolute;bottom:14px;left:28px;right:28px;display:flex;align-items:center;justify-content:space-between;z-index:10;">' +
        '<img src="' + LOGO_DATA_URL + '" height="11" style="display:block;">' +
        (slide.swipeLabel ? '<span style="font-family:Roboto,sans-serif;font-weight:700;font-size:13px;color:#FFDE42;">' + escHtml(slide.swipeLabel) + ' →</span>' : '') +
        '</div>';
      canvas.innerHTML =
        '<div style="position:absolute;top:28px;left:28px;right:28px;z-index:10;">' +
          '<div style="font-family:Anton,sans-serif;font-size:' + s1 + 'px;color:#FF589B;text-transform:uppercase;line-height:1.0;">' + escHtml(slide.line1 || '') + '</div>' +
        '</div>' +
        '<div style="position:absolute;top:' + (s1 + 44) + 'px;left:28px;right:28px;z-index:10;">' +
          '<div style="font-family:Roboto,sans-serif;font-size:' + bodySize + 'px;color:' + bodyColor + ';line-height:1.5;margin-bottom:20px;">' + escHtml(slide.stat || '') + '</div>' +
          '<div style="display:flex;gap:16px;">' +
            '<div style="flex:1;">' + sbHtml + '</div>' +
            (slide.image ? '<div style="flex:1;display:flex;align-items:flex-start;justify-content:center;">' + imgHtml + '</div>' : '') +
          '</div>' +
        '</div>' +
        ssBottomBar;
      break;

    case 'cta':
      canvas.innerHTML =
        '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:32px;z-index:10;">' +
          '<div style="font-family:Anton,sans-serif;font-size:' + s1 + 'px;color:#FFDE42;text-align:center;text-transform:uppercase;line-height:1;">' + escHtml(slide.line1 || 'INTERESTED?') + '</div>' +
          (slide.image ? '<div style="width:65%;display:flex;justify-content:center;">' + imgHtml + '</div>' : '') +
          '<div style="display:flex;align-items:center;gap:8px;font-family:Roboto,sans-serif;font-size:14px;color:#fff;text-align:center;">' +
            '<span>' + escHtml(slide.body || 'This post is also made with') + '</span>' +
            '<img src="' + LOGO_DATA_URL + '" height="12" style="display:inline-block;vertical-align:middle;">' +
          '</div>' +
          '<div style="background:#1e1e1e;border:1px solid #333;border-radius:10px;padding:12px 28px;font-family:Roboto,sans-serif;font-size:14px;color:#fff;">' + escHtml(slide.url || 'layerproof.app') + '</div>' +
        '</div>';
      break;
  }
}

// ============ IMAGE BUILDER – CONTROLS ============
function setMode(mode, btn) {
  state.mode = mode;
  btn.parentElement.querySelectorAll('button').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  var carouselPanel = document.getElementById('carousel-panel');
  var downloadAllBtn = document.getElementById('download-all-btn');
  if (mode === 'carousel') {
    carouselPanel.classList.remove('hidden');
    downloadAllBtn.classList.remove('hidden');
    if (state.slides.length < 2) {
      for (var i = state.slides.length; i < 3; i++) {
        var ns = DEFAULT_SLIDE('text-slide');
        ns.line1 = 'SLIDE ' + (i+1); ns.line2 = ''; ns.size1 = 36; ns.swipeLabel = 'Swipe for more';
        state.slides.push(ns);
      }
    }
    renderCarouselThumbs();
  } else {
    carouselPanel.classList.add('hidden');
    downloadAllBtn.classList.add('hidden');
  }
}

function setRatio(ratio, btn) {
  state.ratio = ratio;
  btn.parentElement.querySelectorAll('button').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('slide-canvas').classList.toggle('portrait', ratio === 'portrait');
}

function renderCarouselThumbs() {
  var container = document.getElementById('carousel-thumbs');
  var layoutLabels = { cover: 'Cover', 'text-slide': 'Text', 'bullets-slide': 'Bullets', 'stats-slide': 'Stats', cta: 'CTA' };
  container.innerHTML = state.slides.map(function(s, i) {
    var lbl = layoutLabels[s.layout] || (i === 0 ? 'Cover' : 'Slide '+(i+1));
    return '<div class="carousel-thumb ' + (state.currentSlide === i ? 'active' : '') + '" onclick="switchSlide(' + i + ')">' +
      '<div style="font-size:9px;opacity:0.6;margin-bottom:2px;">' + (i+1) + '</div>' +
      '<div style="font-size:10px;font-weight:700;">' + lbl + '</div></div>';
  }).join('') + '<div class="add-slide-btn" onclick="addSlide()">+</div>';
}

function switchSlide(i) {
  saveCurrentSlide();
  state.currentSlide = i;
  loadSlide(i);
  renderCarouselThumbs();
}

function addSlide() {
  var s = DEFAULT_SLIDE('text-slide');
  s.line1 = 'NEW SLIDE'; s.line2 = ''; s.size1 = 36;
  state.slides.push(s);
  switchSlide(state.slides.length - 1);
}

function setBodyColor(c) { state.slides[state.currentSlide].bodyColor = c; updatePreview(); }
function setBulletColor(c) { state.slides[state.currentSlide].bulletColor = c; updatePreview(); }

// ============ CANVAS WORD COLOR ============
function applyCanvasColor(color) {
  document.execCommand('foreColor', false, color);
  var el = document.getElementById('canvas-body-text');
  if (el) state.slides[state.currentSlide].bodyHtml = el.innerHTML;
}
function applyCanvasBold() {
  document.execCommand('bold', false);
  var el = document.getElementById('canvas-body-text');
  if (el) state.slides[state.currentSlide].bodyHtml = el.innerHTML;
}
function handleCanvasSelection() {
  var sel = window.getSelection();
  var toolbar = document.getElementById('canvas-color-toolbar');
  if (!toolbar) return;
  var bodyEl = document.getElementById('canvas-body-text');
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed || !bodyEl) {
    toolbar.style.display = 'none';
    return;
  }
  var range = sel.getRangeAt(0);
  if (!bodyEl.contains(range.commonAncestorContainer)) {
    toolbar.style.display = 'none';
    return;
  }
  var rect = range.getBoundingClientRect();
  toolbar.style.display = 'flex';
  toolbar.style.left = Math.max(8, rect.left) + 'px';
  toolbar.style.top = Math.max(8, rect.top - 46) + 'px';
}
document.addEventListener('selectionchange', handleCanvasSelection);

function saveCurrentSlide() {
  var s = state.slides[state.currentSlide];
  s.line1 = document.getElementById('title-line1').value;
  s.line2 = document.getElementById('title-line2').value;
  s.size1 = parseInt(document.getElementById('title-size1').value);
  s.size2 = parseInt(document.getElementById('title-size2').value);
  s.imgScale = parseInt(document.getElementById('img-scale').value);
  s.imgY = parseInt(document.getElementById('img-y').value);
  s.imgRadius = parseInt(document.getElementById('img-radius').value);
  s.iconScale = parseInt(document.getElementById('icon-scale').value);
  var bodyEl = document.getElementById('slide-body-text'); if (bodyEl) s.body = bodyEl.value;
  var bodySzEl = document.getElementById('body-size'); if (bodySzEl) s.bodySize = parseInt(bodySzEl.value) || 16;
  var bulletsEl = document.getElementById('slide-bullets-text'); if (bulletsEl) s.bullets = bulletsEl.value.split('\n').filter(function(b) { return b.trim(); });
  var bulletSzEl = document.getElementById('bullet-size'); if (bulletSzEl) s.bulletSize = parseInt(bulletSzEl.value) || 15;
  var statEl = document.getElementById('slide-stat-text'); if (statEl) s.stat = statEl.value;
  var urlEl = document.getElementById('slide-url-text'); if (urlEl) s.url = urlEl.value;
  var swipeEl = document.getElementById('slide-swipe-label'); if (swipeEl) s.swipeLabel = swipeEl.value;
}

function loadSlide(i) {
  var s = state.slides[i];
  document.getElementById('title-line1').value = s.line1 || '';
  document.getElementById('title-line2').value = s.line2 || '';
  document.getElementById('title-size1').value = s.size1 || 32;
  document.getElementById('title-size2').value = s.size2 || 26;
  document.getElementById('img-scale').value = s.imgScale || 80;
  document.getElementById('img-y').value = s.imgY || 55;
  document.getElementById('img-radius').value = s.imgRadius || 8;
  document.getElementById('icon-scale').value = s.iconScale || 100;
  var bodyEl = document.getElementById('slide-body-text'); if (bodyEl) bodyEl.value = s.body || '';
  var bodySzEl = document.getElementById('body-size'); if (bodySzEl) bodySzEl.value = s.bodySize || 16;
  var bulletsEl = document.getElementById('slide-bullets-text'); if (bulletsEl) bulletsEl.value = (s.bullets || []).join('\n');
  var bulletSzEl = document.getElementById('bullet-size'); if (bulletSzEl) bulletSzEl.value = s.bulletSize || 15;
  var statEl = document.getElementById('slide-stat-text'); if (statEl) statEl.value = s.stat || '';
  var urlEl = document.getElementById('slide-url-text'); if (urlEl) urlEl.value = s.url || 'layerproof.app';
  var swipeEl = document.getElementById('slide-swipe-label'); if (swipeEl) swipeEl.value = s.swipeLabel || '';
  var preview = document.getElementById('drop-preview');
  if (s.image) { preview.src = s.image; preview.classList.remove('hidden'); } else { preview.classList.add('hidden'); }
  renderIconGrid(state.iconSet);
  renderLayoutSelector();
  updateLayoutControls();
  updatePreview();
}

// ============ IMAGE UPLOAD ============
var dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', function(e) { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', function() { dropZone.classList.remove('dragover'); });
dropZone.addEventListener('drop', function(e) {
  e.preventDefault(); dropZone.classList.remove('dragover');
  var file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) loadImage(file);
});
document.addEventListener('paste', function(e) {
  var items = e.clipboardData.items;
  for (var i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) { loadImage(items[i].getAsFile()); break; }
  }
});
function handleFileSelect(e) { var file = e.target.files[0]; if (file) loadImage(file); }
function loadImage(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    state.slides[state.currentSlide].image = e.target.result;
    var preview = document.getElementById('drop-preview');
    preview.src = e.target.result; preview.classList.remove('hidden');
    updatePreview();
  };
  reader.readAsDataURL(file);
}

// ============ PREVIEW UPDATE ============
function updatePreview() {
  // Don't re-render while user is editing text directly in the canvas
  if (document.activeElement && document.activeElement.id === 'canvas-body-text') return;
  var slide = state.slides[state.currentSlide];
  slide.line1 = document.getElementById('title-line1').value;
  slide.line2 = document.getElementById('title-line2').value;
  slide.size1 = parseInt(document.getElementById('title-size1').value) || 32;
  slide.size2 = parseInt(document.getElementById('title-size2').value) || 26;
  slide.imgScale = parseInt(document.getElementById('img-scale').value) || 80;
  slide.imgY = parseInt(document.getElementById('img-y').value) || 55;
  slide.imgRadius = parseInt(document.getElementById('img-radius').value) || 8;
  slide.iconScale = parseInt(document.getElementById('icon-scale').value) || 100;
  var bodyEl = document.getElementById('slide-body-text'); if (bodyEl) slide.body = bodyEl.value;
  var bodySzEl = document.getElementById('body-size'); if (bodySzEl) slide.bodySize = parseInt(bodySzEl.value) || 16;
  var bulletsEl = document.getElementById('slide-bullets-text'); if (bulletsEl) slide.bullets = bulletsEl.value.split('\n').filter(function(b) { return b.trim(); });
  var bulletSzEl = document.getElementById('bullet-size'); if (bulletSzEl) slide.bulletSize = parseInt(bulletSzEl.value) || 15;
  var statEl = document.getElementById('slide-stat-text'); if (statEl) slide.stat = statEl.value;
  var urlEl = document.getElementById('slide-url-text'); if (urlEl) slide.url = urlEl.value;
  var swipeEl = document.getElementById('slide-swipe-label'); if (swipeEl) slide.swipeLabel = swipeEl.value;
  renderSlideCanvas(slide);
}

// ============ DOWNLOAD ============
async function downloadSlide() {
  var canvas = document.getElementById('slide-canvas');
  var realW = 1080;
  var realH = state.ratio === 'square' ? 1080 : 1350;
  try {
    await document.fonts.ready;
    var c = await html2canvas(canvas, {
      width: canvas.offsetWidth, height: canvas.offsetHeight,
      scale: realW / canvas.offsetWidth,
      backgroundColor: '#000000', useCORS: true,
    });
    var link = document.createElement('a');
    var slideLabel = state.mode === 'carousel' ? '-slide' + (state.currentSlide + 1) : '';
    link.download = 'layerproof-post' + slideLabel + '.png';
    link.href = c.toDataURL('image/png');
    link.click(); showToast('Downloaded!');
  } catch (err) { showToast('Download failed: ' + err.message); }
}

async function downloadAllSlides() {
  saveCurrentSlide();
  for (var i = 0; i < state.slides.length; i++) {
    state.currentSlide = i; loadSlide(i);
    await new Promise(function(r) { setTimeout(r, 250); });
    await downloadSlide();
  }
  showToast('Downloaded ' + state.slides.length + ' slides!');
}

// ============ UTILITIES ============
function escHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function copyText(text) { navigator.clipboard.writeText(text).then(function() { showToast('Copied!'); }); }
function addCopyBtn(parentEl) {
  parentEl.querySelectorAll('.copy-btn').forEach(function(b) { b.remove(); });
  var btn = document.createElement('button');
  btn.className = 'copy-btn'; btn.textContent = 'Copy';
  btn.onclick = function() { copyText(parentEl.textContent.replace('Copy', '').trim()); };
  parentEl.style.position = 'relative'; parentEl.appendChild(btn);
}
function showToast(msg) {
  var t = document.getElementById('toast'); t.textContent = msg;
  t.classList.add('show'); setTimeout(function() { t.classList.remove('show'); }, 2000);
}

// ============ INIT ============
initIcons();
renderLayoutSelector();
updateLayoutControls();
updatePreview();
var savedKey = localStorage.getItem('lp_gemini_key');
if (savedKey) document.getElementById('api-key').value = savedKey;
