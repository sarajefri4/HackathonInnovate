import './style.css'
import { EVENT, FLOORS, ROOMS, CATEGORIES } from './data.js'
import { icon } from './icons.js'
import { renderAgenda } from './agenda.js'
import { lockup, brandStrip } from './brand.js'
import { L, t, getLang, otherLang, toggleLang, onLangChange, applyDocumentLang, LANGS } from './i18n.js'

const app = document.querySelector('#app')

applyDocumentLang()

/* الهيكل ثابت — يُبنى مرة واحدة فقط. إعادة بنائه ستُتلف لوحة three.js.
   The shell is built once; rebuilding it would destroy the three.js canvas. */
app.innerHTML = `
  <div class="aurora"></div>

  <section class="view home active" id="v-home"></section>
  <section class="view" id="v-agenda"></section>
  <section class="view floor" id="v-floor">
    <canvas id="three-canvas"></canvas>
    <div class="floor-loading" id="floor-loading"><div class="spinner"></div></div>
    <div class="floor-ui" id="floor-ui"></div>
    <div class="sheet-scrim" id="scrim"></div>
    <div class="sheet" id="sheet"></div>
  </section>
  <section class="view" id="v-qr"></section>

  <nav class="nav" id="nav"></nav>
`

/* ----------------------------- routing ----------------------------- */
const views = {
  home: app.querySelector('#v-home'),
  agenda: app.querySelector('#v-agenda'),
  floor: app.querySelector('#v-floor'),
  qr: app.querySelector('#v-qr'),
}
const navEl = app.querySelector('#nav')
let current = 'home'
let floor3d = null
let floorReady = null
let activeFloor = FLOORS[0].id

function show(name) {
  Object.entries(views).forEach(([k, el]) => el.classList.toggle('active', k === name))
  navEl.querySelectorAll('button[data-view]').forEach((b) => b.classList.toggle('on', b.dataset.view === name))
  current = name
  if (name === 'floor') ensureFloor()
  // الشاشة صارت مرئية الآن، فيمكن للمراقب قياسها | now visible, so it can be measured
  if (name === 'agenda' && agendaApi) requestAnimationFrame(() => agendaApi.observeReveals())
}

/* ----------------------------- BOTTOM NAV ----------------------------- */
function renderNav() {
  const next = otherLang()
  navEl.innerHTML = `
    <button data-view="home" class="${current === 'home' ? 'on' : ''}">${icon('sparkle', 22)}<span>${t('navHome')}</span></button>
    <button data-view="agenda" class="${current === 'agenda' ? 'on' : ''}">${icon('calendar', 22)}<span>${t('navAgenda')}</span></button>
    <button data-view="floor" class="${current === 'floor' ? 'on' : ''}">${icon('layers', 22)}<span>${t('navFloor')}</span></button>
    <button class="lang-btn" id="lang-btn" lang="${next}" title="${t('switchLang')}" aria-label="${t('switchLang')}">
      ${icon('globe', 22)}<span>${LANGS[next].label}</span>
    </button>
  `
}

// تفويض الأحداث حتى تنجو من إعادة الرسم | delegated so it survives re-renders
navEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button')
  if (!btn) return
  if (btn.id === 'lang-btn') toggleLang()
  else if (btn.dataset.view) show(btn.dataset.view)
})

/* ----------------------------- HOME ----------------------------- */
function renderHome() {
  const title = L(EVENT.title)
  views.home.innerHTML = `
    <div class="scroll">
      <div class="hero">
        <!-- شريط الهوية الرسمي، ثم شعار الحدث تحته — كما في الصفحة الأولى للعرض
             The official brand strip, with the event lockup beneath it. -->
        ${brandStrip(t('partnersLabel'))}
        <!-- الشعار الرسمي كما هو في ملف الأصول — لا يُعاد بناؤه من نص
             The official lockup artwork, used as-is; never re-typeset. -->
        <h1 class="lockup">${lockup(`${EVENT.subtitle} — ${title}`)}</h1>
        <div class="meta">
          <span class="chip">${icon('calendar', 15)} ${L(EVENT.dateLabel)}</span>
          <span class="chip">${icon('pin', 15)} ${L(EVENT.venue)}</span>
        </div>
      </div>

      <div class="home-cards">
        <button class="big-card" data-view="agenda">
          <div class="glow" style="background:#ABE8D6"></div>
          <div class="cico" style="background:#ABE8D61f;color:#ABE8D6">${icon('calendar', 28)}</div>
          <div class="body"><h3>${t('cardAgenda')}</h3><p>${t('cardAgendaSub')}</p></div>
          <span class="go">${icon('chevron', 22)}</span>
        </button>
        <button class="big-card" data-view="floor">
          <div class="glow" style="background:#1CB68D"></div>
          <div class="cico" style="background:#1CB68D1f;color:#1CB68D">${icon('layers', 28)}</div>
          <div class="body"><h3>${t('cardFloor')}</h3><p>${t('cardFloorSub')}</p></div>
          <span class="go">${icon('chevron', 22)}</span>
        </button>
      </div>

      <div class="home-foot">
        ${L(EVENT.host)}
        <div class="foot-cta"><button class="chip" id="open-qr">${icon('sparkle', 15)} ${t('showQR')}</button></div>
      </div>
    </div>
  `
  views.home.querySelectorAll('.big-card').forEach((c) => c.addEventListener('click', () => show(c.dataset.view)))
  views.home.querySelector('#open-qr').addEventListener('click', async () => {
    show('qr')
    const { renderQR } = await import('./qr.js')
    renderQR(views.qr, () => show('home'))
  })
}

/* ----------------------------- AGENDA ----------------------------- */
let agendaApi = null
function renderAgendaView() {
  agendaApi = renderAgenda(views.agenda, {
    onGotoRoom: async (roomId, floorId) => {
      show('floor')
      await ensureFloor() // resolves once three.js + scene are ready
      /* selectRoom() يبدّل الطابق داخل المشهد وحده، فيبقى activeFloor هنا قديمًا
         وتظل أزرار الطابق واسم الطابق وقائمة المساحات تشير إلى الطابق الخطأ.
         selectRoom() switches the floor inside the scene only; without this the
         module's own activeFloor goes stale and the floor toggle, the floor
         name and the Spaces list all keep describing the floor you left. */
      const room = ROOMS.find((r) => r.id === roomId)
      const target = floorId || (room && room.floor)
      if (target && target !== activeFloor) {
        activeFloor = target
        renderFloorChrome()
      }
      setTimeout(() => floor3d && floor3d.selectRoom(roomId), 120)
    },
  })
  if (current === 'agenda') requestAnimationFrame(() => agendaApi.observeReveals())
}

/* ----------------------------- FLOOR ----------------------------- */
const floorUI = app.querySelector('#floor-ui')
const loadingEl = app.querySelector('#floor-loading')
const scrim = app.querySelector('#scrim')
const sheet = app.querySelector('#sheet')
let hintHidden = false
// قائمة المساحات مطويّة افتراضيًا فيبقى المجسّم كاملًا أمام المستخدم؛ الحالة تعيش
// خارج الرسم فتنجو من إعادة البناء وتظل على اختيار المستخدم بين الطوابق واللغات.
// The spaces list starts collapsed so the model gets the full canvas; the flag
// lives outside the render, so the user's choice survives a rebuild — switching
// floor or language will not silently reopen it.
let listOpen = false

/* قائمة مساحات الطابق — طريقة ثانية لتصفّح الغرف إلى جانب النموذج نفسه.
   The floor's spaces list — a second way through the rooms, alongside the model
   itself, for anyone who would rather read a name than hunt for a block. */
function floorRooms() {
  return ROOMS.filter((r) => r.floor === activeFloor)
}

function roomListItems() {
  return floorRooms()
    .map((r) => {
      const c = CATEGORIES[r.category] || {}
      return `<button class="rl-item${openRoomId === r.id ? ' on' : ''}" data-room="${r.id}">
        <span class="sw" style="background:${c.color}"></span>
        <span class="nm">${L(r.name)}</span>
      </button>`
    })
    .join('')
}

/* يُعاد رسم العناصر وحدها عند تبديل الطابق — الحاوية تبقى فيبقى مستمع النقر.
   Only the items are repainted on a floor switch; the container stays put, so
   the delegated click listener on it survives. */
function paintRoomList() {
  const box = floorUI.querySelector('#rl-items')
  if (box) box.innerHTML = roomListItems()
  const cnt = floorUI.querySelector('#rl-count')
  if (cnt) cnt.textContent = floorRooms().length
  markListOverflow()
}

/* التلاشي السفلي يظهر فقط إن كانت القائمة أطول من إطارها — الطابق الأول فيه
   مساحتان فقط ولا ينبغي أن يوحي بوجود مزيد.
   The bottom fade is applied only when the list actually overflows; the first
   floor holds two spaces and must not hint at more. */
function markListOverflow() {
  const box = floorUI.querySelector('#rl-items')
  if (box) box.classList.toggle('scrollable', box.scrollHeight > box.clientHeight + 2)
}

/* إبراز المساحة المفتوحة في القائمة — يعمل سواء جاء الاختيار من القائمة أو من
   النقر على المجسّم. | Mirrors the open room, whether it was picked from the
   list or by tapping the block in the model. */
function syncRoomList() {
  let active = null
  floorUI.querySelectorAll('.rl-item').forEach((b) => {
    const on = b.dataset.room === openRoomId
    b.classList.toggle('on', on)
    if (on) active = b
  })
  // اختيار جاء من النقر على المجسّم قد يكون خارج إطار القائمة | a pick made on the
  // model can sit outside the list's viewport, so bring it into view
  if (active) active.scrollIntoView({ block: 'nearest' })
}

/* تُعاد كتابة الطبقة النصية فقط — اللوحة (canvas) خارجها فلا تتأثر.
   Only the text overlay is rewritten; the canvas sits outside it. */
function renderFloorChrome() {
  const f = FLOORS.find((x) => x.id === activeFloor) || FLOORS[0]
  floorUI.innerHTML = `
    <div class="floor-top">
      ${brandStrip(t('partnersLabel'))}
      <div class="floor-head">
        <div class="floor-title">
          <h2>${icon('layers', 20)} ${t('floorTitle')}</h2>
          <p id="floor-name">${icon('pin', 14)} ${L(f.name)}</p>
        </div>
        <div class="floor-toggle" id="floor-toggle">
          ${FLOORS.map((x) => `<button data-floor="${x.id}" class="${x.id === activeFloor ? 'on' : ''}">${L(x.short)}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="hint" id="floor-hint"${hintHidden ? ' style="opacity:0"' : ''}>${icon('hand', 16)} ${t('floorHint')}</div>
    <aside class="room-list${listOpen ? '' : ' closed'}" id="room-list">
      <button class="rl-head" id="rl-head" aria-expanded="${listOpen}" title="${t('spacesToggle')}">
        ${icon('map', 15)}
        <span class="ttl">${t('spacesTitle')}</span>
        <span class="cnt" id="rl-count">${floorRooms().length}</span>
        <span class="chev">${icon('chevron', 15)}</span>
      </button>
      <div class="rl-items" id="rl-items">${roomListItems()}</div>
    </aside>
    <div class="floor-tools">
      <div class="legend">
        ${Object.values(CATEGORIES).map((c) => `<div class="li"><span class="sw" style="background:${c.color}"></span>${L(c.label)}</div>`).join('')}
      </div>
      <div class="tool-btns">
        <button class="tool-btn" id="btn-reset" title="${t('resetView')}" aria-label="${t('resetView')}">${icon('rotate', 22)}</button>
      </div>
    </div>
  `

  floorUI.querySelectorAll('#floor-toggle button').forEach((b) => {
    b.addEventListener('click', () => {
      activeFloor = b.dataset.floor
      floorUI.querySelectorAll('#floor-toggle button').forEach((x) => x.classList.toggle('on', x === b))
      const nf = FLOORS.find((x) => x.id === activeFloor)
      floorUI.querySelector('#floor-name').innerHTML = `${icon('pin', 14)} ${L(nf.name)}`
      floor3d && floor3d.setFloor(activeFloor)
      closeSheet()
      paintRoomList()
    })
  })

  const listEl = floorUI.querySelector('#room-list')
  const headEl = floorUI.querySelector('#rl-head')
  headEl.addEventListener('click', () => {
    listOpen = !listOpen
    listEl.classList.toggle('closed', !listOpen)
    headEl.setAttribute('aria-expanded', String(listOpen))
    if (listOpen) markListOverflow()
  })
  markListOverflow()
  // مفوَّض على الحاوية حتى ينجو من إعادة رسم العناصر | delegated, so repaints keep it
  listEl.addEventListener('click', (e) => {
    const item = e.target.closest('.rl-item')
    if (!item) return
    // نفس مسار النقر على المجسّم: إبراز + تقريب الكاميرا + فتح البطاقة
    // The same path as tapping the block: highlight, focus the camera, open the sheet.
    floor3d && floor3d.selectRoom(item.dataset.room)
  })

  floorUI.querySelector('#btn-reset').addEventListener('click', () => {
    floor3d && floor3d.resetView()
    closeSheet()
  })
}

function ensureFloor() {
  if (floorReady) return floorReady
  floorReady = (async () => {
    const canvas = app.querySelector('#three-canvas')
    const { createFloor3D } = await import('./floor3d.js')
    floor3d = createFloor3D(canvas, { onSelect: showSheet })
    await floor3d.init(activeFloor)
    loadingEl.classList.add('hide')
  })()
  return floorReady
}

/* ----------------------------- ROOM SHEET ----------------------------- */
let openRoomId = null

function showSheet(room) {
  if (!room) return closeSheet()
  openRoomId = room.id
  const hintEl = floorUI.querySelector('#floor-hint')
  if (!hintHidden && hintEl) {
    hintEl.style.opacity = '0'
    hintHidden = true
  }
  const cat = CATEGORIES[room.category]
  const floorName = L((FLOORS.find((f) => f.id === room.floor) || {}).name || '')
  const offerings = L(room.offerings) || []
  sheet.innerHTML = `
    <div class="grab"></div>
    <button class="close" id="sheet-close" title="${t('close')}" aria-label="${t('close')}">${icon('close', 20)}</button>
    <div class="sh-top">
      <div class="sh-ic" style="background:${cat.color}1f;color:${cat.color}">${icon(room.icon, 28)}</div>
      <div>
        <div class="sh-cat" style="color:${cat.color}">${L(cat.label)}</div>
        <h3>${L(room.name)}</h3>
        <!-- الاسم باللغة الأخرى كسطر ثانوي | the name in the other language -->
        <div class="alt" lang="${otherLang()}" dir="${LANGS[otherLang()].dir}">${L(room.name, otherLang())}</div>
      </div>
    </div>
    <span class="sh-floor">${icon('layers', 13)} ${floorName}</span>
    <div class="tagline">${L(room.tagline)}</div>
    <p class="desc">${L(room.desc)}</p>
    <div class="off-title">${icon('sparkle', 18)} ${t('offerings')}</div>
    <div class="off">
      ${offerings.map((o) => `<div class="row"><span class="b" style="background:${cat.color};box-shadow:0 0 8px ${cat.color}"></span>${o}</div>`).join('')}
    </div>
  `
  sheet.querySelector('#sheet-close').addEventListener('click', () => {
    closeSheet()
    floor3d && floor3d.clearSelection()
  })
  scrim.classList.add('open')
  sheet.classList.add('open')
  sheet.scrollTop = 0
  syncRoomList()
}

function closeSheet() {
  openRoomId = null
  scrim.classList.remove('open')
  sheet.classList.remove('open')
  syncRoomList()
}

scrim.addEventListener('click', () => {
  closeSheet()
  floor3d && floor3d.clearSelection()
})

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

/* ----------------------------- language switch ----------------------------- */
onLangChange(() => {
  const reopen = openRoomId
  renderNav()
  renderHome()
  renderAgendaView()
  renderFloorChrome()
  // لافتات المخطط مرسومة على canvas — تحتاج إعادة توليد | 3D labels are canvas textures
  floor3d && floor3d.refreshLabels()
  if (reopen) {
    const room = ROOMS.find((r) => r.id === reopen)
    if (room) showSheet(room)
  }
  // شاشة QR تُبنى عند الطلب — أعِد رسمها فقط إن كانت معروضة | QR is lazy; redraw only if open
  if (current === 'qr') {
    import('./qr.js').then(({ renderQR }) => renderQR(views.qr, () => show('home')))
  }
  document.title = `${L(EVENT.title)} · INNOVATE`
})

/* ----------------------------- boot ----------------------------- */
renderNav()
renderHome()
renderAgendaView()
renderFloorChrome()
document.title = `${L(EVENT.title)} · INNOVATE`
