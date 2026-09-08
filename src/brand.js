/*
 * ============================================================================
 *  الهوية البصرية  |  BRAND ASSETS
 * ============================================================================
 *  الشعار الرسمي كما ورد في ملف الأصول — لا يُعاد رسمه ولا يُعاد تلوينه.
 *  The official artwork straight from the assets folder. Do not re-draw or
 *  re-colour it; swap the PNGs here if brand ever ships a new lockup.
 *
 *  LOCKUP  = القفل الكامل: PIF Hackathon 2026 › INNOVATE › السطر العربي
 *            the full lockup: kicker › INNOVATE wordmark › Arabic event line
 *  pif()   = شعار صندوق الاستثمارات العامة بلغة الواجهة الحالية (نسخة فاتحة)
 *            the Public Investment Fund logo in the current UI language
 *
 *  كلاهما شفاف الخلفية ومصمّم للأرضيات الداكنة فقط.
 *  Both are transparent PNGs, drawn for dark grounds only.
 * ============================================================================
 */

import { getLang } from './i18n.js'
import lockupUrl from './assets/innovate-lockup.png'
import pifEnUrl from './assets/pif-logo.png'
import pifArUrl from './assets/pif-logo-ar.svg'
import tuwaiqUrl from './assets/tuwaiq-academy.png'
import saudiUrl from './assets/digital-saudi.png'
import humainUrl from './assets/humain.png'
import siteUrl from './assets/site.png'

/* الأخضر النعناعي المأخوذ من الشعار | the mint sampled from the wordmark */
export const MINT = '#1CB68D'

export const LOCKUP_SRC = lockupUrl
export const PIF_EN_SRC = pifEnUrl
export const PIF_AR_SRC = pifArUrl
export const TUWAIQ_SRC = tuwaiqUrl
export const DIGITAL_SAUDI_SRC = saudiUrl
export const HUMAIN_SRC = humainUrl
export const SITE_SRC = siteUrl

/* نسب الصور — تمنع القفزة أثناء التحميل | intrinsic ratios, to avoid reflow */
export const LOCKUP_RATIO = '860 / 284'

/* ----------------------------------------------------------------------------
 *  القفل الكامل  |  Full lockup
 *  النص البديل يُمرَّر بلغة الواجهة الحالية | alt text is passed in, localised
 * ------------------------------------------------------------------------- */
export const lockup = (alt) =>
  `<img class="wm" src="${LOCKUP_SRC}" alt="${alt}" width="860" height="284" decoding="async" />`

/* ----------------------------------------------------------------------------
 *  شعار صندوق الاستثمارات العامة  |  The PIF logo
 *  النسخة الفاتحة (أبيض + ذهبي) من ملف الهوية الرسمي — للأرضيات الداكنة فقط.
 *  The light lockup (white + gold) from the official identity file; for dark
 *  grounds only. Rendered from `PIF Logo ENG _ CMYK Light.ai` at full vector
 *  resolution, so it stays crisp — do not re-draw or re-colour it.
 * ------------------------------------------------------------------------- */
/* لكل لغة قفلها الرسمي: النسخة العربية شعارها على اليمين ونصّها على اليسار،
   فتقرأ صحيحة في اتجاه الصفحة العربية، والعكس في الإنجليزية. تُقرأ اللغة عند
   الاستدعاء، وكل الشاشات تُعاد رسمها عند التبديل فيتبدّل الشعار معها.
   Each language has its own official lockup — the Arabic one puts the emblem on
   the right and its text on the left, so it reads correctly in an RTL page, and
   the English one is the mirror of that. The language is read at call time, and
   every screen re-renders on a switch, so the logo follows along. */
export const pif = () => {
  const ar = getLang() === 'ar'
  const src = ar ? PIF_AR_SRC : PIF_EN_SRC
  const alt = ar ? 'صندوق الاستثمارات العامة' : 'Public Investment Fund'
  // النسبتان مختلفتان قليلًا، والارتفاع هو ما يُضبط في CSS فيبقى العرض متناسبًا
  // The two lockups differ slightly in ratio; CSS pins the height, so the width
  // follows each one's own proportions.
  return `<img class="pif" src="${src}" alt="${alt}" decoding="async" />`
}

/* ----------------------------------------------------------------------------
 *  شعارات الشركاء — أبيض على خلفية شفافة، للأرضيات الداكنة وحدها
 *  The partner logos: white artwork on transparency, for dark grounds only.
 *  The first three were lifted out of the official header strip at 3x, so they
 *  stay crisp on retina; the fourth came in as its own file.
 * ------------------------------------------------------------------------- */
export const TUWAIQ = `<img class="pl pl-tuwaiq" src="${TUWAIQ_SRC}" alt="Tuwaiq Academy" width="456" height="90" decoding="async" />`
export const DIGITAL_SAUDI = `<img class="pl pl-saudi" src="${DIGITAL_SAUDI_SRC}" alt="Digital Saudi" width="582" height="156" decoding="async" />`
/* قُصّت الحواف الشفافة من هذا الملف حتى يقيسه الارتفاع كما يقيس أخويه
   The transparent margin was cropped off this one, so sizing it by height
   lands it optically level with the other two. */
export const HUMAIN = `<img class="pl pl-humain" src="${HUMAIN_SRC}" alt="HUMAIN" width="432" height="68" decoding="async" />`
/* شعار «سايت» يصل بالحبر الأخضر الداكن للأرضيات الفاتحة، فأُعيد تلوينه أبيض مع
   الإبقاء على قناة الشفافية كما هي، وقُصّ هامشه — ليقف مع إخوته على الشريط
   الداكن نفسه. الأصل الملوّن محفوظ في مجلد الأصول.
   The Site mark ships as dark green ink, drawn for light grounds. It is
   repainted white here — alpha channel untouched, so the antialiased edges
   survive — and its margin cropped, so it stands on the same dark strip as the
   other three. The original coloured artwork is kept in the assets folder. */
export const SITE = `<img class="pl pl-site" src="${SITE_SRC}" alt="Site" width="1702" height="467" decoding="async" />`

/* ----------------------------------------------------------------------------
 *  شريط الهوية  |  The brand strip
 * ----------------------------------------------------------------------------
 *  نفس ترتيب شريط العرض الرسمي: صندوق الاستثمارات العامة في البداية، وفي
 *  النهاية عنوان "الشركاء الاستراتيجيون" وتحته شعارات طويق والسعودية الرقمية
 *  و«هيومين» و«سايت»، تفصل بينها خطوط رأسية. يُستخدم على كل الشاشات بلا استثناء.
 *
 *  The same arrangement as the official header strip: the fund leads, and the
 *  "Strategic Partners" line closes with Tuwaiq Academy, Digital Saudi, HUMAIN
 *  and Site beneath it, split by rules. Used on every screen, unchanged.
 *
 *  `label` يُمرَّر من طبقة اللغة | the label is passed in from the i18n layer.
 * ------------------------------------------------------------------------- */
export const brandStrip = (label) => `
  <div class="brandbar">
    <span class="pif-slot">${pif()}</span>
    <div class="partners">
      <div class="partners-label">${label}</div>
      <div class="partners-logos">
        ${TUWAIQ}
        <span class="pl-div" aria-hidden="true"></span>
        ${DIGITAL_SAUDI}
        <span class="pl-div" aria-hidden="true"></span>
        ${HUMAIN}
        <span class="pl-div" aria-hidden="true"></span>
        ${SITE}
      </div>
    </div>
  </div>`
