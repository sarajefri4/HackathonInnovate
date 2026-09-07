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
 *  📋  الأجندة أدناه منقولة عن شريحتَي الأجندة الرسميتين (اليوم الأول والثاني).
 *      عدّلها هنا وحدها إن تغيّر الجدول. أوصاف الغرف مأخوذة من دليل هوية
 *      مركز الابتكار ومن مخطط المكان.
 *      The agenda below is transcribed from the two official agenda slides.
 *      If the schedule changes, this is the only place to edit it. Room
 *      descriptions come from the Innovation Hub brand guide + the floor plan.
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
      'Breakfast',
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
      'Quick challenges',
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
    ar: ['مخصّص لضيوف الحدث'],
    en: ['Reserved for invited guests'],
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
      ar: 'المجلس الثاني لضيوف الحدث.',
      en: 'The second guest lounge.',
    },
    offerings: {
      ar: ['مخصّص لضيوف الحدث'],
      en: ['For invited guests'],
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
    tagline: { ar: 'مدخل الهاكاثون', en: 'Hackathon entrance' },
    desc: {
      ar: 'نقطة الدخول إلى مركز الابتكار، ومنها تبدأ بالتسجيل.',
      en: 'The main entrance to the Hackathon.',
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
  tagline: { ar: 'استراحة الغداء', en: 'The lunch break' },
  desc: {
    ar: 'المنطقة المخصّصة لتناول الغداء.',
    en: 'The area set aside for lunch.',
  },
  offerings: {
    ar: ['وجبة غداء'],
    en: ['Lunch'],
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
 *  الأيام  |  DAYS
 * ------------------------------------------------------------------------- */
export const DAYS = [
  { id: 'd1', name: { ar: 'اليوم الأول', en: 'Day One' }, date: { ar: '٩ سبتمبر', en: '9 September' } },
  { id: 'd2', name: { ar: 'اليوم الثاني', en: 'Day Two' }, date: { ar: '١٠ سبتمبر', en: '10 September' } },
]

/* ----------------------------------------------------------------------------
 *  أقسام الأجندة  |  AGENDA SECTIONS
 * ----------------------------------------------------------------------------
 *  الشرائط الملوّنة نفسها الموجودة في الأجندة الرسمية. اليوم الأول قسم واحد،
 *  واليوم الثاني قسمان: العروض والتقييم ثم حفل الختام بشريطه الذهبي.
 *  الترتيب يتبع ترتيب الأنشطة في AGENDA؛ يُطبع العنوان عند كل تغيّر قسم.
 *
 *  The same coloured bands the official agenda uses. Day 1 is one section, Day 2
 *  is two: the demo block, then the closing ceremony on its gold band. Order
 *  follows AGENDA itself — a heading is printed wherever the section changes.
 * ------------------------------------------------------------------------- */
export const SECTIONS = {
  s1: { title: { ar: 'اليوم الأول — الافتتاح وعمل الفرق', en: 'Day 1 — Opening & Team Hacking' }, color: '#1CB68D' },
  s2: { title: { ar: 'اليوم الثاني — العروض والتقييم', en: 'Day 2 — Demo & Evaluation' }, color: '#1CB68D' },
  /* الذهبي مأخوذ عيّنةً من شريط الهوية الرسمي | gold sampled off the brand strip */
  s3: { title: { ar: 'حفل الختام', en: 'Closing Ceremony' }, color: '#C79E63' },
}

/* ----------------------------------------------------------------------------
 *  الأجندة  |  AGENDA
 * ----------------------------------------------------------------------------
 *  منقولة حرفيًا عن شريحتَي الأجندة الرسميتين (اليوم الأول والثاني).
 *  Transcribed from the two official agenda slides, row for row.
 *
 *  room       = معرّف الغرفة المرتبطة (زر الانتقال إلى المخطط)
 *  section    = القسم الذي ينتمي إليه النشاط | which SECTIONS band it sits under
 *  timePrefix = بادئة اختيارية قبل الوقت ("قبل ١٠:٠٠") | optional time prefix
 *  end        = يُحذف للأنشطة ذات الوقت الواحد | omitted for single-time rows
 * ------------------------------------------------------------------------- */
export const AGENDA = [
  // ===== اليوم الأول — الافتتاح وعمل الفرق | DAY 1 — OPENING & TEAM HACKING =====
  {
    day: 'd1', section: 's1', start: '09:00', end: '10:00', room: 'registration', icon: 'gate', kind: 'break',
    title: { ar: 'التسجيل والترحيب', en: 'Registration & Welcome' },
  },
  {
    day: 'd1', section: 's1', start: '09:00', end: '10:00', room: 'welcome', icon: 'map', kind: 'break',
    title: { ar: 'جولات مركز الابتكار', en: 'Innovation Center Tours' },
    desc: { ar: 'اختياري', en: 'Optional' },
  },
  {
    day: 'd1', section: 's1', start: '10:00', end: '10:15', room: 'hackathon', icon: 'mic', kind: 'stage',
    title: { ar: 'الافتتاح', en: 'Hackathon Kick-off' },
    desc: { ar: 'نظرة عامة على تجربة الهاكاثون', en: 'Introduction and an overview of the hackathon' },
  },
  {
    day: 'd1', section: 's1', start: '10:15', end: '10:20', room: 'hackathon', icon: 'mic', kind: 'stage',
    title: {
      ar: 'كلمة رئيس قسم الذكاء الاصطناعي وتحليل البيانات',
      en: 'Remarks by PIF\u2019s Head of Data & AI',
    },
    desc: { ar: 'خالد العصيمي — صندوق الاستثمارات العامة', en: 'Khaled AlQusaimi' },
  },
  {
    day: 'd1', section: 's1', start: '10:20', end: '10:30', room: 'hackathon', icon: 'target', kind: 'stage',
    title: { ar: 'نظرة عامة على تحدي مساهمة', en: 'Challenge Deep Dive' },
    desc: { ar: 'نايف النجيدي', en: 'Naif Alnujaydi' },
  },
 {
  day: 'd1', section: 's1', start: '10:30', end: '10:40', room: 'hackathon', icon: 'sparkle', kind: 'stage',
  title: { ar: 'عرض تعريفي بـ HUMAIN Code', en: 'HUMAIN Code Demo' },
  desc: {
    ar: 'جولة سريعة على أداة HUMAIN Code وكيفية استخدامها خلال الهاكاثون.',
    en: 'A quick walkthrough of HUMAIN Code and how to use it during the hackathon.',
  },
},
  {
    day: 'd1', section: 's1', start: '10:40', end: '12:00', room: 'hackathon', icon: 'code', kind: 'build',
    title: { ar: 'عمل الفرق وتطوير الأفكار', en: 'Team Hacking & Idea Development' },
  },
  {
    day: 'd1', section: 's1', start: '12:00', end: '13:00', room: 'hackathon', icon: 'users', kind: 'build',
    title: { ar: 'جولة الإرشاد الأولى', en: 'Mentoring Round 1' },
    desc: { ar: 'تنقّل المرشدين بين الفرق', en: 'Mentors rotate across teams' },
  },
  {
    day: 'd1', section: 's1', start: '13:00', end: '13:30', room: 'lunch', icon: 'utensils', kind: 'break',
    title: { ar: 'الغداء وصلاة الظهر', en: 'Lunch & Dhuhr Prayer' },
  },
  {
    day: 'd1', section: 's1', start: '13:30', end: '15:00', room: 'hackathon', icon: 'code', kind: 'build',
    title: { ar: 'تطوير الحلول وعمل الفرق', en: 'Team Hacking: Continued Development' },
  },
  {
    day: 'd1', section: 's1', start: '15:00', end: '16:00', room: 'hackathon', icon: 'users', kind: 'build',
    title: { ar: 'جولة الإرشاد الثانية', en: 'Mentoring Round 2' },
    desc: { ar: 'مراجعة الحلول وتطويرها', en: 'Solution review and refinement' },
  },
  {
    day: 'd1', section: 's1', start: '16:00', end: '17:00', room: 'hackathon', icon: 'code', kind: 'build',
    title: { ar: 'استكمال تطوير النماذج الأولية', en: 'Team Hacking: Continued Development' },
  },
  {
    /* بلا وقت نهاية في الأجندة الرسمية | no end time on the official agenda */
    day: 'd1', section: 's1', start: '16:55', room: 'hackathon', icon: 'flag', kind: 'stage',
    title: { ar: 'ختام اليوم الأول وتوقعات اليوم الثاني', en: 'Day 1 Wrap-Up & Day 2 Expectations' },
  },
  {
    day: 'd1', section: 's1', start: '17:00', end: '19:00', room: 'coding', icon: 'clock', kind: 'build',
    title: { ar: 'استمرار إتاحة مركز الابتكار', en: 'Innovation Hub Remains Open' },
    desc: { ar: 'للفرق الراغبة في مواصلة العمل', en: 'For teams who wish to continue' },
  },

  // ===== اليوم الثاني — العروض والتقييم | DAY 2 — DEMO & EVALUATION =====
  {
    day: 'd2', section: 's2', start: '10:00', end: '11:30', room: 'coding', icon: 'clock', kind: 'build',
    timePrefix: { ar: 'قبل', en: 'Before' },
    title: { ar: 'مركز الابتكار متاح', en: 'Innovation Hub Open' },
    desc: { ar: 'عمل نهائي اختياري، وتدريب، واستعداد', en: 'Optional final work, rehearsal & preparation' },
  },
  {
    day: 'd2', section: 's2', start: '11:30', end: '12:00', room: 'hackathon', icon: 'target', kind: 'build',
    title: {
      ar: 'استكمال الحل والتأكد من الجاهزية التقنية وصلاة الظهر',
      en: 'Solution Finalization, Technical Readiness & Dhuhr Prayer',
    },
  },
  {
    day: 'd2', section: 's2', start: '12:00', end: '12:15', room: 'hackathon', icon: 'mic', kind: 'stage',
    title: { ar: 'انطلاق فقرة العروض', en: 'Demo Kickoff' },
    desc: {
      ar: 'التعريف بلجنة التحكيم وإرشادات تقديم العروض',
      en: 'Judges introduction & presentation guidelines',
    },
  },
  {
    day: 'd2', section: 's2', start: '12:15', end: '14:15', room: 'hackathon', icon: 'mic', kind: 'stage',
    title: { ar: 'عروض حلول الفرق', en: 'Team Solution Presentations' },
  },
  {
    day: 'd2', section: 's2', start: '14:15', end: '14:45', room: 'hackathon', icon: 'users', kind: 'break',
    title: {
      ar: 'نقاش لجنة التحكيم واختيار أفضل ٥ فرق',
      en: 'Judges\u2019 Deliberation & Top 5 Finalists Selection',
    },
  },
  {
    day: 'd2', section: 's2', start: '14:45', end: '15:00', room: 'hackathon', icon: 'flag', kind: 'break',
    title: { ar: 'تجهيز حفل الختام', en: 'Closing Ceremony Setup' },
  },

  // ===== حفل الختام | CLOSING CEREMONY =====
  {
    day: 'd2', section: 's3', start: '15:00', end: '15:10', room: 'hackathon', icon: 'sparkle', kind: 'stage',
    title: { ar: 'افتتاح حفل الختام', en: 'Closing Ceremony Opening' },
  },
  {
    day: 'd2', section: 's3', start: '15:10', end: '15:15', room: 'hackathon', icon: 'play', kind: 'stage',
    title: { ar: 'عرض فيديو', en: 'Hackathon Video Recap' },
    desc: { ar: 'أبرز لحظات الهاكاثون', en: 'The highlights of the two days' },
  },
  {
    day: 'd2', section: 's3', start: '15:15', end: '15:50', room: 'hackathon', icon: 'mic', kind: 'stage',
    title: { ar: 'عرض الحلول الـ٦ المؤهلة', en: 'Top 6 Finalists Live Presentations & Demos' },
    desc: { ar: '٣ دقائق لكل فريق', en: '3 minutes each' },
  },
  {
    day: 'd2', section: 's3', start: '15:50', end: '15:55', room: 'hackathon', icon: 'mic', kind: 'stage',
    title: { ar: 'كلمة مدير قسم الرقمية والتقنية', en: 'PIF D&T Head Remarks' },
  },
  {
    day: 'd2', section: 's3', start: '15:55', end: '16:00', room: 'hackathon', icon: 'star', kind: 'stage',
    title: { ar: 'تكريم الشركاء الاستراتيجيين', en: 'Strategic Partners Recognition' },
  },
  {
    day: 'd2', section: 's3', start: '16:00', end: '16:20', room: 'hackathon', icon: 'trophy', kind: 'stage',
    title: { ar: 'إعلان الفائزين وتسليم الجوائز', en: 'Winners Announcement & Awards' },
  },
  {
    day: 'd2', section: 's3', start: '16:20', end: '16:25', room: 'hackathon', icon: 'camera', kind: 'stage',
    title: { ar: 'الصورة الجماعية والختام', en: 'Group Photo & Closing' },
  },
  {
    day: 'd2', section: 's3', start: '16:30', end: '17:00', room: 'hackathon', icon: 'sofa', kind: 'break',
    title: {
      ar: 'التواصل والمقابلات الإعلامية والمغادرة',
      en: 'Networking / Media Interviews / Departure',
    },
  },
]

/* أنواع الجلسات — للألوان في الأجندة | session kinds, drive the agenda colours */
export const KINDS = {
  stage: { label: { ar: 'على المنصّة', en: 'On Stage' },  color: '#FFFFFF' },
  build: { label: { ar: 'عمل الفرق',   en: 'Team Work' }, color: '#1CB68D' },
  break: { label: { ar: 'استراحة',     en: 'Break' },     color: '#79D6BB' },
}
