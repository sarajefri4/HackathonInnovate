import { AGENDA, DAYS, KINDS, ROOMS, EVENT, SECTIONS } from './data.js'
import { icon } from './icons.js'
import { brandStrip } from './brand.js'
import { L, t } from './i18n.js'

const roomById = (id) => ROOMS.find((r) => r.id === id)

/* الوقت يُخزَّن بنظام ٢٤ ساعة ويُعرض ١٢ ساعة بعُرف الأجندة الرسمية نفسه:
   تُكتب AM/PM مرة واحدة في نهاية النطاق، وتتكرر فقط إذا عبر النطاق الظهر
   ("10:40 AM – 12:00 PM"). النشاط بلا وقت نهاية يُعرض بوقت واحد.
   Times are stored 24h and displayed 12h exactly as the official agenda does:
   the meridiem is written once at the end of the range, and twice only when the
   range straddles noon. An activity with no end time shows a single time. */
const mins = (v) => { const [h, m] = v.split(':').map(Number); return h * 60 + m }
const mer = (v) => (mins(v) < 720 ? 'AM' : 'PM')
const h12 = (v) => { const [h, m] = v.split(':'); return `${+h % 12 || 12}:${m}` }
const timeRange = (start, end) => {
  if (!end) return `${h12(start)} ${mer(start)}`
  return mer(start) === mer(end)
    ? `${h12(start)} – ${h12(end)} ${mer(end)}`
    : `${h12(start)} ${mer(start)} – ${h12(end)} ${mer(end)}`
}

/* شريط القسم — نسخة الشاشة من الشريط الملوّن في الأجندة الرسمية
   The section band — the on-screen version of the official agenda's coloured
   header row. Its solid ground also masks the timeline rail running behind it. */
const sectionBand = (sec) => `
  <div class="sec-band reveal" style="--sc:${sec.color}; background:${sec.color}26">
    ${L(sec.title)}
  </div>`

export function renderAgenda(root, { onGotoRoom, day }) {
  root.innerHTML = `
    <div class="topbar">
      ${brandStrip(t('partnersLabel'))}
      <div class="agenda-head" style="padding:0">
        <h2>${t('agendaTitle')}</h2>
        <p>${L(EVENT.titleShort)} · ${L(EVENT.dateLabel)}</p>
      </div>
    </div>
    <div class="day-switch" id="day-switch"></div>
    <div class="scroll"><div class="timeline" id="timeline"></div></div>
  `

  const switchEl = root.querySelector('#day-switch')
  const timelineEl = root.querySelector('#timeline')
  /* اليوم المعروض يُمرَّر من الخارج كي ينجو من تبديل اللغة — كانت الأجندة ترتدّ
     إلى اليوم الأول عند كل تبديل. | The visible day is passed in so it survives
     a language switch; the view used to snap back to Day 1 on every toggle. */
  let active = DAYS.some((d) => d.id === day) ? day : DAYS[0].id
  let io = null

  /* المراقب لا يعمل والشاشة مخفية (display:none) — لذا نعيد ربطه عند كل عرض.
     An IntersectionObserver whose root is display:none never reports an
     intersection, and Chrome does not re-evaluate when the ancestor becomes
     visible. So the observer is rebuilt every time the view is shown. */
  function observeReveals() {
    if (io) io.disconnect()
    io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { root: root.querySelector('.scroll'), threshold: 0.12 }
    )
    timelineEl.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
  }

  switchEl.innerHTML = DAYS.map(
    (d) => `<button class="day-btn ${d.id === active ? 'on' : ''}" data-day="${d.id}">
      <span>${L(d.name)}</span><span class="d">${L(d.date)}</span></button>`
  ).join('')

  function paint() {
    const items = AGENDA.filter((s) => s.day === active)
    /* حدود الأقسام تُحسب قبل الرسم: أول بطاقة في القسم وآخر بطاقة فيه. الخط
       الزمني يُرسم قطعةً داخل كل بطاقة، فيبدأ من أول نقطة وينتهي عند آخر نقطة
       ولا يمرّ خلف شريط القسم أصلًا.
       The section runs are resolved before painting — the first and last slot of
       each run. The rail is drawn as a segment inside every slot, so it starts
       on a section's first dot and ends on its last, and never runs behind the
       band at all. */
    const startsRun = items.map((s, i) => i === 0 || s.section !== items[i - 1].section)
    const endsRun = items.map((s, i) => i === items.length - 1 || s.section !== items[i + 1].section)
    let openSection = null
    timelineEl.innerHTML = items
      .map((s, i) => {
        const kind = KINDS[s.kind] || KINDS.stage
        const room = roomById(s.room)
        // الأجندة الرسمية سطر واحد لكل نشاط — الوصف اختياري ولا تُترك فقرة فارغة
        // The official agenda is one line per activity; desc is optional.
        const desc = s.desc ? L(s.desc) : ''
        /* شريط القسم يُطبع عند أول نشاط فيه فقط — كما في الأجندة الرسمية، حيث
           يفصل شريط "حفل الختام" الذهبي بين فقرتَي اليوم الثاني.
           The band is printed on a section's first activity only, exactly as on
           the official agenda, where the gold "Closing Ceremony" band splits
           Day 2 in two. */
        const sec = s.section !== openSection ? SECTIONS[s.section] : null
        if (sec) openSection = s.section
        return `
        ${sec ? sectionBand(sec) : ''}
        <div class="slot reveal${startsRun[i] ? ' run-start' : ''}${endsRun[i] ? ' run-end' : ''}">
          <div class="dot" style="color:${kind.color}"></div>
          <div class="card" style="--kc:${kind.color}">
            <!-- الوقت داخل البطاقة: عمود جانبي ضيّق كان يقصّ "10:00" على الجوال
                 The time lives inside the card; the old 52px rail clipped it. -->
            <div class="when">
              <!-- البادئة خارج عزل الاتجاه: تُقرأ بلغة الواجهة بينما يبقى النطاق لاتينيًا
                   The prefix sits outside the LTR isolate, so it reads in the UI
                   language while the range itself stays Latin. -->
              ${s.timePrefix ? `<span class="pre">${L(s.timePrefix)}</span>` : ''}
              <span class="range">${timeRange(s.start, s.end)}</span>
              <span class="tag" style="background:${kind.color}22;color:${kind.color}">${L(kind.label)}</span>
            </div>
            <div class="khead">
              <div class="kico" style="background:${kind.color}1f;color:${kind.color}">${icon(s.icon, 19)}</div>
              <h4>${L(s.title)}</h4>
            </div>
            ${desc ? `<p>${desc}</p>` : ''}
            ${room ? `<button class="loc" data-room="${room.id}" data-floor="${room.floor}">${icon('pin', 15)} ${L(room.name)}</button>` : ''}
          </div>
        </div>`
      })
      .join('')

    // reveal on scroll
    timelineEl.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 45, 260)}ms`
    })
    observeReveals()

    // location chips → floor plan
    timelineEl.querySelectorAll('.loc').forEach((btn) => {
      btn.addEventListener('click', () => onGotoRoom(btn.dataset.room, btn.dataset.floor))
    })
  }

  switchEl.querySelectorAll('.day-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      active = btn.dataset.day
      switchEl.querySelectorAll('.day-btn').forEach((b) => b.classList.toggle('on', b === btn))
      root.querySelector('.scroll').scrollTop = 0
      paint()
    })
  })

  paint()

  /* observeReveals يستدعيه المُوجِّه بعد إظهار الشاشة، و destroy قبل إعادة البناء
     كي لا يبقى مراقب معلَّق على عقد مُزالة.
     observeReveals is called by the router once the view is visible; destroy is
     called before a rebuild so no observer is left holding detached nodes. */
  return {
    observeReveals,
    getDay: () => active,
    destroy() {
      if (io) io.disconnect()
      io = null
    },
  }
}
