import { AGENDA, DAYS, KINDS, ROOMS, EVENT } from './data.js'
import { icon } from './icons.js'

const roomById = (id) => ROOMS.find((r) => r.id === id)

export function renderAgenda(root, { onGotoRoom }) {
  root.innerHTML = `
    <div class="topbar">
      <div class="agenda-head" style="padding:0">
        <h2>${icon('calendar', 22)} الأجندة التفصيلية</h2>
        <p>${EVENT.title} · ${EVENT.dateLabel}</p>
      </div>
    </div>
    <div class="day-switch" id="day-switch"></div>
    <div class="scroll"><div class="timeline" id="timeline"></div></div>
  `

  const switchEl = root.querySelector('#day-switch')
  const timelineEl = root.querySelector('#timeline')
  let active = DAYS[0].id

  switchEl.innerHTML = DAYS.map(
    (d) => `<button class="day-btn ${d.id === active ? 'on' : ''}" data-day="${d.id}">
      <span>${d.name}</span><span class="d">${d.date}</span></button>`
  ).join('')

  function paint() {
    const items = AGENDA.filter((s) => s.day === active)
    timelineEl.innerHTML = items
      .map((s) => {
        const kind = KINDS[s.kind] || KINDS.session
        const room = roomById(s.room)
        return `
        <div class="slot reveal">
          <div class="time"><div class="t">${s.start}</div><div class="e">${s.end}</div></div>
          <div class="dot" style="color:${kind.color}"></div>
          <div class="card" style="--kc:${kind.color}">
            <div class="khead">
              <div class="kico" style="background:${kind.color}1f;color:${kind.color}">${icon(s.icon, 19)}</div>
              <h4>${s.title}</h4>
              <span class="tag" style="background:${kind.color}22;color:${kind.color}">${kind.label}</span>
            </div>
            <p>${s.desc}</p>
            ${room ? `<button class="loc" data-room="${room.id}" data-floor="${room.floor}">${icon('pin', 15)} ${room.name}</button>` : ''}
          </div>
        </div>`
      })
      .join('')

    // reveal on scroll
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { root: root.querySelector('.scroll'), threshold: 0.12 }
    )
    timelineEl.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 45, 260)}ms`
      io.observe(el)
    })

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
}
