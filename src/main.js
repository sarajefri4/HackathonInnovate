import './style.css'
import { EVENT, FLOORS, ROOMS, CATEGORIES } from './data.js'
import { icon } from './icons.js'
import { renderAgenda } from './agenda.js'

const app = document.querySelector('#app')

const LOGO = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#8DE0B0"/><stop offset="1" stop-color="#006044"/></linearGradient></defs>
  <path fill="url(#lg)" d="M24 3 25.8 18.2 41 20 25.8 21.8 24 37 22.2 21.8 7 20 22.2 18.2 24 3Z"/>
  <path fill="url(#lg)" d="M38 30 39 38 47 39 39 40 38 48 37 40 29 39 37 38 38 30Z" opacity=".8"/>
</svg>`

app.innerHTML = `
  <div class="aurora"></div>

  <section class="view home active" id="v-home"></section>
  <section class="view" id="v-agenda"></section>
  <section class="view floor" id="v-floor"></section>
  <section class="view" id="v-qr"></section>

  <nav class="nav" id="nav">
    <button data-view="home" class="on">${icon('sparkle', 22)}<span>الرئيسية</span></button>
    <button data-view="agenda">${icon('calendar', 22)}<span>الأجندة</span></button>
    <button data-view="floor">${icon('layers', 22)}<span>المخطط</span></button>
  </nav>
`

/* ----------------------------- routing ----------------------------- */
const views = {
  home: app.querySelector('#v-home'),
  agenda: app.querySelector('#v-agenda'),
  floor: app.querySelector('#v-floor'),
  qr: app.querySelector('#v-qr'),
}
let current = 'home'
let floor3d = null
let floorReady = null

function show(name) {
  Object.entries(views).forEach(([k, el]) => el.classList.toggle('active', k === name))
  app.querySelectorAll('#nav button').forEach((b) => b.classList.toggle('on', b.dataset.view === name))
  current = name
  if (name === 'floor') ensureFloor()
}

app.querySelectorAll('#nav button').forEach((b) => b.addEventListener('click', () => show(b.dataset.view)))

/* ----------------------------- HOME ----------------------------- */
views.home.innerHTML = `
  <div class="scroll">
    <div class="hero">
      <div class="mark">${LOGO}</div>
      <div class="kicker">${EVENT.subtitle}</div>
      <h1>${EVENT.title}</h1>
      <p class="tagline">${EVENT.tagline}</p>
      <div class="meta">
        <span class="chip">${icon('calendar', 15)} ${EVENT.dateLabel}</span>
        <span class="chip">${icon('pin', 15)} ${EVENT.venue}</span>
      </div>
    </div>

    <div class="home-cards">
      <button class="big-card" data-view="agenda">
        <div class="glow" style="background:#F4FCA8"></div>
        <div class="cico" style="background:#F4FCA81f;color:#F4FCA8">${icon('calendar', 28)}</div>
        <div class="body"><h3>الأجندة التفصيلية</h3><p>جدول الفعاليات على مدار اليومين</p></div>
        <span class="go">${icon('chevron', 22)}</span>
      </button>
      <button class="big-card" data-view="floor">
        <div class="glow" style="background:#60BC94"></div>
        <div class="cico" style="background:#60BC941f;color:#60BC94">${icon('layers', 28)}</div>
        <div class="body"><h3>المخطط ثلاثي الأبعاد</h3><p>استكشف القاعات وتفاصيل كل مساحة</p></div>
        <span class="go">${icon('chevron', 22)}</span>
      </button>
    </div>

    <div class="home-foot">
      ${EVENT.host}<br/>
      <a href="mailto:${EVENT.contact}">${EVENT.contact}</a>
      <div style="margin-top:14px"><button class="chip" id="open-qr">${icon('sparkle', 15)} عرض رمز QR للمشاركة</button></div>
    </div>
  </div>
`
views.home.querySelectorAll('.big-card').forEach((c) => c.addEventListener('click', () => show(c.dataset.view)))
views.home.querySelector('#open-qr').addEventListener('click', async () => {
  show('qr')
  const { renderQR } = await import('./qr.js')
  renderQR(views.qr, () => show('home'))
})

/* ----------------------------- AGENDA ----------------------------- */
renderAgenda(views.agenda, {
  onGotoRoom: async (roomId) => {
    show('floor')
    await ensureFloor() // resolves once three.js + scene are ready
    setTimeout(() => floor3d && floor3d.selectRoom(roomId), 120)
  },
})

/* ----------------------------- FLOOR ----------------------------- */
views.floor.innerHTML = `
  <canvas id="three-canvas"></canvas>
  <div class="floor-loading" id="floor-loading"><div class="spinner"></div></div>
  <div class="floor-ui">
    <div class="floor-top">
      <div class="floor-title">
        <h2>${icon('layers', 20)} المخطط التفاعلي</h2>
        <p id="floor-name">${icon('pin', 14)} ${FLOORS[0].name}</p>
      </div>
      <div class="floor-toggle" id="floor-toggle">
        ${FLOORS.map((f, i) => `<button data-floor="${f.id}" class="${i === 0 ? 'on' : ''}">${f.short}</button>`).join('')}
      </div>
    </div>
    <div class="hint" id="floor-hint">${icon('hand', 16)} اسحب للتدوير · انقر على أي قاعة لعرض التفاصيل</div>
    <div class="floor-tools">
      <div class="legend">
        ${Object.values(CATEGORIES).map((c) => `<div class="li"><span class="sw" style="background:${c.color}"></span>${c.label}</div>`).join('')}
      </div>
      <div class="tool-btns">
        <button class="tool-btn" id="btn-reset" title="إعادة الضبط">${icon('rotate', 22)}</button>
      </div>
    </div>
  </div>

  <div class="sheet-scrim" id="scrim"></div>
  <div class="sheet" id="sheet"></div>
`

const loadingEl = views.floor.querySelector('#floor-loading')
const floorNameEl = views.floor.querySelector('#floor-name')
const hintEl = views.floor.querySelector('#floor-hint')
const scrim = views.floor.querySelector('#scrim')
const sheet = views.floor.querySelector('#sheet')

function ensureFloor() {
  if (floorReady) return floorReady
  floorReady = (async () => {
    const canvas = views.floor.querySelector('#three-canvas')
    const { createFloor3D } = await import('./floor3d.js')
    floor3d = createFloor3D(canvas, { onSelect: showSheet })
    await floor3d.init('GF')
    loadingEl.classList.add('hide')
  })()
  return floorReady
}

// floor toggle
views.floor.querySelectorAll('#floor-toggle button').forEach((b) => {
  b.addEventListener('click', () => {
    views.floor.querySelectorAll('#floor-toggle button').forEach((x) => x.classList.toggle('on', x === b))
    const f = FLOORS.find((x) => x.id === b.dataset.floor)
    floorNameEl.innerHTML = `${icon('pin', 14)} ${f.name}`
    floor3d && floor3d.setFloor(b.dataset.floor)
    closeSheet()
  })
})

views.floor.querySelector('#btn-reset').addEventListener('click', () => { floor3d && floor3d.resetView(); closeSheet() })

/* ----------------------------- ROOM SHEET ----------------------------- */
let hintHidden = false
function showSheet(room) {
  if (!room) return closeSheet()
  if (!hintHidden) { hintEl.style.opacity = '0'; hintHidden = true }
  const cat = CATEGORIES[room.category]
  const floorName = (FLOORS.find((f) => f.id === room.floor) || {}).name || ''
  sheet.innerHTML = `
    <div class="grab"></div>
    <button class="close" id="sheet-close">${icon('close', 20)}</button>
    <div class="sh-top">
      <div class="sh-ic" style="background:${cat.color}1f;color:${cat.color}">${icon(room.icon, 28)}</div>
      <div>
        <div class="sh-cat" style="color:${cat.color}">${cat.label}</div>
        <h3>${room.name}</h3>
        <div class="en">${room.en}</div>
      </div>
    </div>
    <span class="sh-floor">${icon('layers', 13)} ${floorName}</span>
    <div class="tagline">${room.tagline}</div>
    <p class="desc">${room.desc}</p>
    <div class="off-title">${icon('sparkle', 18)} ماذا تقدّم هذه المساحة</div>
    <div class="off">
      ${room.offerings.map((o) => `<div class="row"><span class="b" style="background:${cat.color};box-shadow:0 0 8px ${cat.color}"></span>${o}</div>`).join('')}
    </div>
  `
  sheet.querySelector('#sheet-close').addEventListener('click', () => { closeSheet(); floor3d && floor3d.clearSelection() })
  scrim.classList.add('open')
  sheet.classList.add('open')
  sheet.scrollTop = 0
}
function closeSheet() {
  scrim.classList.remove('open')
  sheet.classList.remove('open')
}
scrim.addEventListener('click', () => { closeSheet(); floor3d && floor3d.clearSelection() })

// swipe-down to dismiss the sheet
let sy = 0
sheet.addEventListener('touchstart', (e) => (sy = e.touches[0].clientY), { passive: true })
sheet.addEventListener('touchmove', (e) => {
  const dy = e.touches[0].clientY - sy
  if (dy > 0 && sheet.scrollTop <= 0) sheet.style.transform = `translateY(${dy}px)`
}, { passive: true })
sheet.addEventListener('touchend', (e) => {
  const dy = e.changedTouches[0].clientY - sy
  sheet.style.transform = ''
  if (dy > 90) { closeSheet(); floor3d && floor3d.clearSelection() }
}, { passive: true })
