/*
 * ============================================================================
 *  الترجمة وتبديل اللغة  |  i18n — language state + UI strings
 * ============================================================================
 *
 *  المحتوى (الغرف، الأجندة) يعيش في data.js على هيئة { ar, en }.
 *  هذا الملف يحمل نصوص الواجهة فقط، وحالة اللغة الحالية.
 *
 *  Content (rooms, agenda) lives in data.js as { ar, en } pairs.
 *  This file holds only chrome/UI strings plus the current language state.
 * ============================================================================
 */

const STORAGE_KEY = 'innovate.lang'

export const LANGS = {
  ar: { dir: 'rtl', label: 'العربية', short: 'ع' },
  en: { dir: 'ltr', label: 'English', short: 'EN' },
}

/* نصوص الواجهة  |  UI strings */
const UI = {
  // التنقّل السفلي | bottom nav
  navHome: { ar: 'الرئيسية', en: 'Home' },
  navAgenda: { ar: 'الأجندة', en: 'Agenda' },
  navFloor: { ar: 'المخطط', en: 'Floor' },

  // الرئيسية | home
  cardAgenda: { ar: 'الأجندة التفصيلية', en: 'Full Agenda' },
  cardAgendaSub: { ar: 'جدول الفعاليات على مدار اليومين', en: 'The full two-day schedule' },
  cardFloor: { ar: 'مخطط المكان', en: 'Floor Plan' },
  cardFloorSub: { ar: 'استكشف القاعات وتفاصيل كل مساحة', en: 'Explore every hall and what it offers' },
  showQR: { ar: 'عرض رمز QR للمشاركة', en: 'Show QR code to share' },

  // الأجندة | agenda
  agendaTitle: { ar: 'الأجندة التفصيلية', en: 'Full Agenda' },

  // المخطط | floor plan
  floorTitle: { ar: 'المخطط التفاعلي', en: 'Interactive Floor Plan' },
  // كما هو مكتوب في شريط العرض الرسمي | exactly as written on the official strip
  partnersLabel: {
    ar: 'الشركاء الاستراتيجيون | Strategic Partners',
    en: 'Strategic Partners | الشركاء الاستراتيجيون',
  },
  spacesTitle: { ar: 'المساحات', en: 'Spaces' },
  spacesToggle: { ar: 'إظهار/إخفاء قائمة المساحات', en: 'Show or hide the list of spaces' },
  floorHint: {
    ar: 'اسحب للتدوير · انقر على أي قاعة لعرض التفاصيل',
    en: 'Drag to rotate · tap any room for details',
  },
  resetView: { ar: 'إعادة الضبط', en: 'Reset view' },
  /* يظهر إن تعذّر تشغيل الرسم ثلاثي الأبعاد على الجهاز | shown when 3D cannot start */
  floorUnavailable: {
    ar: 'تعذّر عرض المخطط ثلاثي الأبعاد على هذا الجهاز. استخدم قائمة المساحات لتصفّح القاعات.',
    en: 'The 3D plan could not start on this device. Use the Spaces list to browse the halls.',
  },

  // بطاقة الغرفة | room sheet
  offerings: { ar: 'ماذا تقدّم هذه المساحة', en: 'What this space offers' },
  close: { ar: 'إغلاق', en: 'Close' },

  // رمز QR | QR screen
  qrTitle: { ar: 'امسح للوصول إلى الدليل', en: 'Scan to open the guide' },
  qrBack: { ar: 'رجوع', en: 'Back' },

  // مبدّل اللغة | language switch
  switchLang: { ar: 'Switch to English', en: 'التبديل إلى العربية' },
}

/* ---------------------------------------------------------------------------
 *  الحالة  |  state
 * ------------------------------------------------------------------------ */
function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && LANGS[saved]) return saved
  } catch (_) {
    /* التخزين المحلي محجوب (تصفّح خاص) — نتجاهله | storage blocked, ignore */
  }
  /* العربية هي اللغة الأساسية للحدث، بغضّ النظر عن لغة الجهاز.
     Arabic is the event's primary language regardless of device locale.
     لجعلها تتبع لغة الجهاز بدلًا من ذلك | to follow the device locale instead:
     return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'ar' */
  return 'ar'
}

let lang = initialLang()
const listeners = new Set()

export const getLang = () => lang
export const otherLang = () => (lang === 'ar' ? 'en' : 'ar')
export const isRTL = () => LANGS[lang].dir === 'rtl'

/** نص الواجهة حسب اللغة الحالية | a UI string in the current language */
export const t = (key) => (UI[key] ? UI[key][lang] : key)

/**
 * حقل محتوى مترجَم. يقبل { ar, en } أو نصًّا عاديًا (يُعاد كما هو).
 * A localized content field. Accepts { ar, en } or a plain value (passed through).
 */
export const L = (v, which = lang) =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v[which] ?? v.ar ?? '') : v

/** يطبّق lang/dir على عنصر <html> | reflect language on the document element */
export function applyDocumentLang() {
  const el = document.documentElement
  el.setAttribute('lang', lang)
  el.setAttribute('dir', LANGS[lang].dir)
}

export function setLang(next) {
  if (!LANGS[next] || next === lang) return
  lang = next
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch (_) {
    /* المتابعة دون حفظ | carry on without persisting */
  }
  applyDocumentLang()
  listeners.forEach((fn) => fn(lang))
}

export const toggleLang = () => setLang(otherLang())

/** يُسجّل دالة تُستدعى بعد كل تغيير لغة | run a callback after every change */
export function onLangChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
