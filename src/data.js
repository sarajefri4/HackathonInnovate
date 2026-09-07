/*
 * ============================================================================
 *  ملف المحتوى — نقطة التعديل الوحيدة  |  CONTENT FILE — the only file to edit
 * ============================================================================
 *
 *  عدّل هنا فقط لتغيير الأجندة أو تفاصيل الغرف. لا حاجة لِلَمس بقية الملفات.
 *  Edit this file only to change the agenda or room details.
 *
 *  🌐  كل نص يظهر للمستخدم مكتوب على هيئة { ar: '…', en: '…' }.
 *      أضِف اللغتين معًا عند إضافة أي محتوى جديد — الواجهة تختار تلقائيًا.
 *      Every user-facing string is a { ar, en } pair. Fill in both when adding
 *      content; the UI picks the right one via L() in i18n.js.
 *
 *  ⚠️  الأوقات والعناوين في الأجندة مبدئية للعرض — استبدلها بالجدول الرسمي.
 *      Agenda times/titles below are realistic placeholders — swap in the
 *      official schedule when ready. Room descriptions are drawn from the
 *      DGA Innovation Hub brand guide + the venue floor plan.
 *
 *  إحداثيات الغرف (plan) بوحدات المخطط: x/z = المركز، w/d = العرض/العمق،
 *  h = الارتفاع. المنشأة تمتد تقريبًا من x:-48..48 و z:-24..27.
 * ============================================================================
 */

export const EVENT = {
  title: {
    ar: 'هاكاثون ابتكار صندوق الاستثمارات العامة',
    en: 'PIF Innovate Hackathon',
  },
  titleShort: { ar: 'هاكاثون ابتكار', en: 'Innovate Hackathon' },
  subtitle: 'PIF Hackathon 2026', // لاتيني في الحالتين | Latin in both languages
  host: { ar: 'صندوق الاستثمارات العامة', en: 'Public Investment Fund' },
  dateLabel: { ar: '٩ - ١٠ سبتمبر ٢٠٢٦', en: '9 - 10 September 2026' },
  venue: { ar: 'مركز الابتكار — الرياض', en: 'Innovation Hub - Riyadh' },
}

/* ----------------------------------------------------------------------------
 *  الطوابق  |  FLOORS
 * ------------------------------------------------------------------------- */
export const FLOORS = [
  {
    id: 'GF',
    name: { ar: 'الطابق الأرضي', en: 'Ground Floor' },
    short: { ar: 'أرضي', en: 'Ground' },
  },
  {
    id: 'FF',
    name: { ar: 'الطابق الأول', en: 'First Floor' },
    short: { ar: 'أول', en: 'First' },
  },
]

/* ----------------------------------------------------------------------------
 *  فئات الغرف (تُستخدم للألوان والوسيلة الإيضاحية)  |  ROOM CATEGORIES
 * ------------------------------------------------------------------------- */
/* ملاحظة: التدرّج مشتق من هوية الشعار (أبيض + أخضر نعناعي) — بلا ألوان دخيلة.
   Note: scale derived from the wordmark identity (white + PIF mint) only. */
export const CATEGORIES = {
  core:        { label: { ar: 'مساحات أساسية', en: 'Core Spaces' },        color: '#1CB68D' },
  hospitality: { label: { ar: 'ضيافة',          en: 'Hospitality' },        color: '#79D6BB' },
  vip:         { label: { ar: 'كبار الشخصيات',  en: 'VIP' },                color: '#FFFFFF' },
  activity:    { label: { ar: 'أنشطة',          en: 'Activities' },         color: '#3FA98A' },
  support:     { label: { ar: 'دعم وإرشاد',     en: 'Support & Mentoring' }, color: '#6FC7C0' },
  entry:       { label: { ar: 'مداخل',          en: 'Entrances' },          color: '#ABE8D6' },
}

/* ----------------------------------------------------------------------------
 *  الغرف  |  ROOMS
 *  plan = { x, z, w, d, h }  (وحدات المخطط)
 * ------------------------------------------------------------------------- */
export const ROOMS = [
  // ===== الطابق الأرضي — GROUND FLOOR =====
  {
    id: 'hackathon',
    floor: 'GF',
    name: { ar: 'منطقة الهاكاثون', en: 'Hackathon Area' },
    category: 'core',
    icon: 'code',
    tagline: { ar: 'المساحة الرئيسية للعمل', en: 'Main Working Space' },
    desc: {
      ar: 'في هذه المساحة يجتمع الهاكاثون؛ لكل فريق طاولته الخاصة للعمل طوال اليوم، وفيها تُقام جلسة الافتتاح وعروض الفرق في اليوم الثاني.',
      en: 'This is where the hackathon comes together - every team has its own table to build at through the day, and the same space hosts the opening session and the Day 2 demos.',
    },
    offerings: {
      ar: [
        'طاولة مخصّصة لكل فريق',
        'جلسة انطلاق الهاكاثون',
        'عروض الفرق في اليوم الثاني',
      ],
      en: [
        'A dedicated table for every team',
        'The hackathon kick-off session',
        'The Day 2 team demos',
      ],
    },
    plan: { x: -26, z: 9.5, w: 44, d: 24, h: 6 },
  },
  {
    id: 'coffee',
  floor: 'GF',
  name: { ar: 'منطقة القهوة', en: 'Coffee Area' },
  category: 'hospitality',
  icon: 'coffee',
  tagline: { ar: 'قهوة ومأكولات خفيفة', en: 'Coffee and refreshments' },
  desc: {
    ar: 'ابدأ يومك الأول بالإفطار هنا، ثم عُد وقتما شئت — محطة القهوة والمأكولات الخفيفة متاحة طوال اليوم.',
    en: 'Start Day 1 with breakfast here, then come back whenever you need to, the coffee station and refreshments run all day.',
  },
  offerings: {
    ar: [
      'إفطار اليوم الأول',
      'مأكولات خفيفة طوال اليوم',
      'محطة قهوة',
    ],
    en: [
      'Day 1 breakfast',
      'Refreshments all day',
      'Coffee station',
    ],
  },

    plan: { x: -17, z: -14.2, w: 17.5, d: 10, h: 3.4 },
  },
  {
  id: 'brain',
  floor: 'GF',
  name: { ar: 'ركن الألغاز الذهنية', en: 'Brain Teaser Hub' },
  category: 'activity',
  icon: 'brain',
  tagline: { ar: 'استراحة ذهنية', en: 'A mental break' },
  desc: {
    ar: 'خُذ استراحة قصيرة من جهازك وأعِد شحن ذهنك بلغز سريع — الألغاز تتجدّد على مدار اليوم، فهناك دائمًا شيء جديد في انتظارك.',
    en: 'Take a short break from your laptop and reset with a quick puzzle — the teasers refresh through the day, so there is always something new waiting.',
  },
  offerings: {
    ar: [
      'سودوكو وألغاز منطقية',
      'تحديات سريعة',
      'متاح طوال اليوم',
    ],
    en: [
      'Sudoku and logic puzzles',
      'Quick-fire challenges',
      'Open all day',
    ],
  },
  plan: { x: -31, z: -9.5, w: 10, d: 6, h: 3 },
},
  {
    id: 'vip1',
  floor: 'GF',
  name: { ar: 'مجلس كبار الضيوف ١', en: 'VIP Lounge 1' },
  category: 'vip',
  icon: 'star',
  tagline: { ar: 'لضيوف الحدث', en: 'For invited guests' },
  desc: {
    ar: 'مجلس خاص مخصّص لضيوف الحدث، يُستخدم قبل حفل الختام.',
    en: "A private lounge reserved for the event's invited guests, in use ahead of the closing ceremony.",
  },
  offerings: {
    ar: [
      'مخصّص لضيوف الحدث',
      
    ],
    en: [
      'Reserved for invited guests',
    
    ],
  },
    plan: { x: 11, z: -10.5, w: 9, d: 8, h: 3.2 },
  },
  {
    id: 'vip2',
    floor: 'GF',
    name: { ar: 'استراحة كبار الشخصيات ٢', en: 'VIP Rest & Lounge 2' },
    category: 'vip',
    icon: 'star',
    tagline: { ar: 'لضيوف الحدث', en: 'For invited guests' },
    desc: {
      ar: 'المجلس الثاني لضيوف الحدث، بجوار الأول.',
      en: 'The second guest lounge, next to the first.',
    },
    offerings: {
      ar: [
        'مخصّص لضيوف الحدث',
        
      ],
      en: [
        'For invited guests',

      ],
    },
    plan: { x: 22, z: -9.9, w: 8, d: 7, h: 3.2 },
  },
  {
  id: 'mentor',
  floor: 'GF',
  name: { ar: 'منطقة المرشدين وفريق العمل', en: 'Mentor & Crew Area' },
  category: 'support',
  icon: 'users',
  tagline: { ar: 'المرشدون وفريق التنظيم', en: 'Mentors and organisers' },
  desc: {
    ar: 'هنا يتمركز المرشدون وفريق التنظيم طوال الحدث. يمكنك التوجّه إلى هذه المنطقة لطلب الإرشاد أو للاستفسار عن أي أمر تنظيمي.',
    en: 'The mentors and the organising team are based here throughout the event. Visit this area for technical guidance or for any questions about the programme.',
  },
  offerings: {
    ar: [
      'إرشاد خارج الجولات المجدولة',
      'استفسارات التنظيم واللوجستيات',
    ],
    en: [
      'Guidance outside the scheduled rounds',
      'Event and logistics questions',
    ],
  },
  plan: { x: 38, z: 10.1, w: 21, d: 16, h: 4 },
},
  {
    id: 'registration',
    floor: 'GF',
    name: { ar: 'منطقة التسجيل', en: 'Registration Area' },
    category: 'entry',
    icon: 'users',
    tagline: { ar: 'ابدأ من هنا', en: 'Start here' },
    desc: {
      ar: 'سجّل حضورك واستلم شارتك وحقيبة الترحيب ورقم فريقك، ثم توجّه إلى طاولة فريقك في منطقة الهاكاثون.',
      en: 'Check in and pick up your badge, welcome kit and team number, then head to your team table in the Hackathon Area.',
    },
    offerings: {
      ar: [
        'تسجيل الحضور',
        'الشارة وحقيبة الترحيب',
        'رقم فريقك',
        'إرشاد إلى طاولتك',
      ],
      en: [
        'Check in',
        'Badge and welcome kit',
        'Your team number',
        'Directions to your table',
      ],
    },
    plan: { x: 13, z: 2.5, w: 12, d: 8, h: 3.2 },
  },
  {
    id: 'welcome',
    floor: 'GF',
    name: { ar: 'بوابة الترحيب', en: 'Welcome Gate' },
    category: 'entry',
    icon: 'gate',
    tagline: { ar: 'مدخل الحدث', en: 'The event entrance' },
    desc: {
      ar: 'مدخل الفعالية. من هنا تدخل مركز الابتكار وتتّجه إلى التسجيل.',
      en: 'The main entrance to the Hackathon.',
    },
    offerings: {
      ar: [
        'مدخل الحدث',
        'يؤدي إلى منطقة التسجيل',
      ],
      en: [
        'The way in',
        'Leads to the Registration Area',
      ],
    },
    plan: { x: 13, z: 24.5, w: 14, d: 6, h: 3 },
  },

  // ===== الطابق الأول — FIRST FLOOR =====
  {
id: 'coding',
floor: 'FF',
name: { ar: 'كهف البرمجة', en: 'Coding Cave' },
category: 'core',
icon: 'code',
tagline: { ar: 'مساحة هادئة للتركيز في الطابق الأول', en: 'A quiet focus space on the first floor' },
desc: {
  ar: 'إن احتجت إلى تركيز أعمق بعيدًا عن حركة القاعة الرئيسية، فهذه المساحة تمنحك جوًّا أهدأ للعمل بمقاعد مريحة، وتبقى مفتوحة طوال أيام الهاكاثون.',
  en: 'When you need deeper focus away from the buzz of the main hall, this space gives you a quieter place to work with comfortable seating, open throughout the hackathon.',
},
  offerings: {
    ar: [
      'مقاعد مريحة للعمل',
      'الطابق الأول، بعيدًا عن القاعة الرئيسية',
      'مفتوحة طوال أيام الهاكاثون',
    ],
    en: [
      'Comfortable seating for working',
      'Open throughout the hackathon',
    ],
  },
    plan: { x: 41.5, z: 16.5, w: 15, d: 16, h: 5 },
  },
  {
  id: 'lunch',
  floor: 'FF',
  name: { ar: 'منطقة الغداء', en: 'Lunch Area' },
  category: 'hospitality',
  icon: 'utensils',
  tagline: { ar: 'استراحة تُعيد الطاقة', en: 'A break to recharge' },
  desc: {
    ar: 'المنطقة المخصّصة لاستراحة الغداء، بمقاعد تتّسع للجميع وفرصة لالتقاط الأنفاس بين جلسات العمل.',
    en: 'The area set aside for the lunch break, with seating for everyone and a chance to catch your breath between work sessions.',
  },
  offerings: {
    ar: [
      'وجبة غداء يوميًا',
      'مساحة للجلوس والاستراحة',
    ],
    en: [
      'A daily lunch',
      'Space to sit and take a break',
    ],
  },
  plan: { x: -11, z: 15.5, w: 18, d: 18, h: 3.6 },
},
]

/* ----------------------------------------------------------------------------
 *  كتل سياقية غير تفاعلية (درج/دورات مياه) لإضفاء واقعية على المخطط
 *  Non-interactive context blocks (stairs / restrooms) for spatial realism
 * ------------------------------------------------------------------------- */
export const CONTEXT = {
  GF: [
    { x: -42, z: -18, w: 11, d: 8, h: 3, label: { ar: 'دورات المياه', en: 'Restrooms' } },
    { x: 2, z: 1, w: 6, d: 11, h: 1.4, label: { ar: 'الدرج', en: 'Stairs' } },
  ],
  FF: [
    { x: -40, z: -15, w: 12, d: 9, h: 3, label: { ar: 'دورات المياه', en: 'Restrooms' } },
    { x: 0, z: -1, w: 7, d: 12, h: 1.4, label: { ar: 'الدرج', en: 'Stairs' } },
  ],
}

/* ----------------------------------------------------------------------------
 *  المنشأة (شكل الأرضية شبه المنحرف)  |  BUILDING FOOTPRINT (trapezoid)
 *  نقاط بترتيب [x, z]
 * ------------------------------------------------------------------------- */
export const FOOTPRINT = [
  [-48, -23.5],
  [48, -7.5],
  [48, 22.5],
  [-48, 26.5],
]

/* ----------------------------------------------------------------------------
 *  الأجندة  |  AGENDA
 *  room = معرّف الغرفة المرتبطة (للانتقال إلى المخطط)
 * ------------------------------------------------------------------------- */
export const DAYS = [
  { id: 'd1', name: { ar: 'اليوم الأول', en: 'Day One' }, date: { ar: '٩ سبتمبر', en: '9 September' } },
  { id: 'd2', name: { ar: 'اليوم الثاني', en: 'Day Two' }, date: { ar: '١٠ سبتمبر', en: '10 September' } },
]

export const AGENDA = [
  // ===== اليوم الأول — الافتتاح وعمل الفرق | DAY 1 — OPENING & TEAM HACKING =====
  {
    day: 'd1', start: '09:00', end: '10:00', room: 'registration', icon: 'gate', kind: 'break',
    title: { ar: 'التسجيل والترحيب', en: 'Registration & Welcome' },
    desc: { ar: 'استلم شارتك وتعرّف على مكان فريقك', en: 'Collect your badge and find your team table' },
  },
  {
    day: 'd1', start: '09:00', end: '10:00', room: 'welcome', icon: 'map', kind: 'break',
    title: { ar: 'جولات مركز الابتكار', en: 'Innovation Center Tours' },
    desc: { ar: 'اختياري', en: 'Optional' },
  },
  {
    day: 'd1', start: '10:00', end: '10:15', room: 'hackathon', icon: 'mic', kind: 'stage',
    title: { ar: 'انطلاق الهاكاثون', en: 'Hackathon Kick-off' },
    desc: { ar: 'نظرة عامة على تجربة اليومين', en: 'What to expect over the two days' },
  },
  {
    day: 'd1', start: '10:15', end: '10:30', room: 'hackathon', icon: 'target', kind: 'stage',
    title: { ar: 'التعمّق في التحدي', en: 'Challenge Deep Dive' },
    desc: { ar: 'تفاصيل تحدي مساهمة', en: 'The Musahama challenge in detail' },
  },
  {
    day: 'd1', start: '10:30', end: '10:40', room: 'hackathon', icon: 'sparkle', kind: 'stage',
    title: { ar: 'أدوات الابتكار', en: 'Innovation Tools' },
    desc: { ar: 'أدوات ومنهجيات تساعدك على بناء حلّك', en: 'Tools and methodologies to help you build' },
  },
  {
    day: 'd1', start: '10:40', end: '12:00', room: 'hackathon', icon: 'code', kind: 'build',
    title: { ar: 'عمل الفرق وتطوير الأفكار', en: 'Team Work: Idea Development' },
  },
  {
    day: 'd1', start: '12:00', end: '13:00', room: 'hackathon', icon: 'users', kind: 'build',
    title: { ar: 'جولة الإرشاد الأولى', en: 'Mentoring Round 1' },
    desc: { ar: 'يمرّ المرشدون على الطاولات للاطّلاع على ما وصل إليه كل فريق وتقديم الدعم اللازم.', en: 'Mentors circulate between the tables to see where each team has reached and offer support.' },
  },
  {
    day: 'd1', start: '13:00', end: '13:30', room: 'lunch', icon: 'utensils', kind: 'break',
    title: { ar: 'الغداء وصلاة الظهر', en: 'Lunch & Dhuhr Prayer' },
  },
  {
    day: 'd1', start: '13:30', end: '15:00', room: 'hackathon', icon: 'code', kind: 'build',
    title: { ar: 'مواصلة تطوير الحلول', en: 'Team Work: Building the Solution' },
  },
  {
    day: 'd1', start: '15:00', end: '16:00', room: 'hackathon', icon: 'users', kind: 'build',
    title: { ar: 'جولة الإرشاد الثانية', en: 'Mentoring Round 2' },
    desc: { ar: 'الجولة الثانية والأخيرة للمرشدين، لمراجعة الحلول وتقديم الملاحظات النهائية.', en: 'The mentors\' second and final round, reviewing solutions and sharing their closing feedback.' },
  },
  {
    day: 'd1', start: '16:00', end: '17:00', room: 'hackathon', icon: 'code', kind: 'build',
    title: { ar: 'استكمال النماذج الأولية', en: 'Team Work: Prototype Push' },
  },
  {
    day: 'd1', start: '16:55', end: '17:00', room: 'hackathon', icon: 'flag', kind: 'stage',
    title: { ar: 'ختام اليوم الأول', en: 'Day 1 Wrap-Up' },
    desc: { ar: 'ما ينتظركم في اليوم الثاني', en: 'What to expect on Day 2' },
  },
  {
    day: 'd1', start: '17:00', end: '19:00', room: 'coding', icon: 'clock', kind: 'build',
    title: { ar: 'مركز الابتكار يبقى مفتوحًا', en: 'Innovation Hub Stays Open' },
    desc: { ar: 'للفرق الراغبة في مواصلة العمل (اختياري)', en: 'Optional, for teams who want to keep going' },
  },
 
  // ===== اليوم الثاني — العروض والختام | DAY 2 — DEMOS & CLOSING =====
  {
    day: 'd2', start: '10:00', end: '11:30', room: 'coding', icon: 'clock', kind: 'build',
    title: { ar: 'مركز الابتكار متاح للفرق', en: 'Innovation Hub Open for Teams' },
    desc: { ar: 'عمل نهائي وتدريب على العرض', en: 'Final work and pitch rehearsal' },
  },
  {
    day: 'd2', start: '11:30', end: '12:00', room: 'hackathon', icon: 'target', kind: 'build',
    title: { ar: 'اللمسات الأخيرة والجاهزية التقنية', en: 'Final Touches & Technical Check' },
    
  },
  {
    day: 'd2', start: '12:00', end: '12:15', room: 'hackathon', icon: 'mic', kind: 'stage',
    title: { ar: 'انطلاق فقرة العروض', en: 'Demo Kick-off' },
    desc: { ar: 'التعريف بلجنة التحكيم وإرشادات العرض', en: 'Meet the judges and hear the presentation guidelines' },
  },
  {
    day: 'd2', start: '12:15', end: '14:15', room: 'hackathon', icon: 'mic', kind: 'stage',
    title: { ar: 'عروض حلول الفرق', en: 'Team Solution Presentations' },
    desc: { ar: '', en: 'Teams present their solutions to the judging panel on stage.' },
  },
  {
    day: 'd2', start: '14:15', end: '14:45', room: 'coffee', icon: 'clock', kind: 'break',
    title: { ar: 'تعرض الفرق حلولها أمام لجنة التحكيم على المسرح.', en: 'Break While the Judges Deliberate' },
  },
  {
    day: 'd2', start: '14:45', end: '15:00', room: 'hackathon', icon: 'flag', kind: 'break',
    title: { ar: 'الاستعداد لحفل الختام', en: 'Take Your Seats for the Closing Ceremony' },
  },
  {
    day: 'd2', start: '15:00', end: '15:20', room: 'hackathon', icon: 'sparkle', kind: 'stage',
    title: { ar: 'افتتاح حفل الختام', en: 'Closing Ceremony Opening' },
  },
  
  ,
  {
    day: 'd2', start: '15:20', end: '15:25', room: 'hackathon', icon: 'mic', kind: 'stage',
    title: {
      ar: 'كلمة مدير قسم الرقمية والتقنية لصندوق الاستثمارات العامة',
      en: 'Remarks by PIFs Head of Digital & Technology',
    },
  },

  {
    day: 'd2', start: '15:30', end: '15:55', room: 'hackathon', icon: 'trophy', kind: 'stage',
    title: { ar: 'إعلان الفائزين وتسليم الجوائز', en: 'Winners Announcement & Awards' },
  },
  {
    day: 'd2', start: '15:55', end: '16:00', room: 'hackathon', icon: 'star', kind: 'stage',
    title: { ar: 'الصورة الجماعية والختام', en: 'Group Photo & Closing' },
  },
  {
    day: 'd2', start: '16:00', end: '17:00', room: 'hackathon', icon: 'sofa', kind: 'break',
    title: { ar: 'التواصل والمغادرة', en: 'Networking & Departure' },
     },

]

/* أنواع الجلسات — للألوان في الأجندة | session kinds, drive the agenda colours */
export const KINDS = {
  stage: { label: { ar: 'على المنصّة', en: 'On Stage' },  color: '#FFFFFF' },
  build: { label: { ar: 'عمل الفرق',   en: 'Team Work' }, color: '#1CB68D' },
  break: { label: { ar: 'استراحة',     en: 'Break' },     color: '#79D6BB' },
}
