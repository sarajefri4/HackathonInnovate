import { AGENDA, DAYS, KINDS, ROOMS, EVENT } from './data.js'
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

export function renderAgenda(root, { onGotoRoom }) {
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
  let active = DAYS[0].id
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
    timelineEl.innerHTML = items
      .map((s) => {
        const kind = KINDS[s.kind] || KINDS.stage
        const room = roomById(s.room)
        // الأجندة الرسمية سطر واحد لكل نشاط — الوصف اختياري ولا تُترك فقرة فارغة
        // The official agenda is one line per activity; desc is optional.
        const desc = s.desc ? L(s.desc) : ''
        return `
        <div class="slot reveal">
          <div class="dot" style="color:${kind.color}"></div>
          <div class="card" style="--kc:${kind.color}">
            <!-- الوقت داخل البطاقة: عمود جانبي ضيّق كان يقصّ "10:00" على الجوال
                 The time lives inside the card; the old 52px rail clipped it. -->
            <div class="when">
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

  // يستدعيه المُوجِّه بعد إظهار الشاشة | called by the router once the view is visible
  return { observeReveals }
}
