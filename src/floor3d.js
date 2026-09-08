import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ROOMS, CONTEXT, FOOTPRINT, CATEGORIES, POI } from './data.js'
import { iconSvg } from './icons.js'
import { L, isRTL } from './i18n.js'

/*
 * مخطط ثلاثي الأبعاد تفاعلي — Interactive 3D floor plan
 * التحكم باللمس: سحب = تدوير · إصبعان = تكبير/تحريك · نقر = اختيار غرفة
 */
export function createFloor3D(canvas, { onSelect } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x031813, 120, 260)

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 1000)
  // Building is wide (x) and shallow (z). On a portrait phone we frame the
  // camera down the long axis so the wide dimension maps to screen-height.
  const HOME_POS = new THREE.Vector3(120, 100, 12)
  const HOME_TGT = new THREE.Vector3(0, -3, 0)
  camera.position.copy(HOME_POS)

  const controls = new OrbitControls(camera, canvas)
  controls.target.copy(HOME_TGT)
  controls.enableDamping = true
  controls.dampingFactor = 0.09
  controls.minDistance = 42
  controls.maxDistance = 210
  controls.maxPolarAngle = Math.PI * 0.46
  controls.minPolarAngle = Math.PI * 0.12
  controls.rotateSpeed = 0.75
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.55
  controls.enablePan = true
  controls.screenSpacePanning = false

  // ---- lighting ----
  scene.add(new THREE.HemisphereLight(0xbfe6d0, 0x00160c, 1.05))
  const key = new THREE.DirectionalLight(0xffffff, 1.15)
  key.position.set(30, 80, 40)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x1CB68D, 0.6)
  rim.position.set(-40, 30, -30)
  scene.add(rim)

  const floorGroups = {} // id -> THREE.Group
  const selectable = []  // room meshes of active floor
  const roomMeshes = {}  // roomId -> { mesh, edges, baseY, targetY, mat, base, hi }
  const poiMarkers = []  // { poi, sprite, group } for every floor built so far
  let activeFloor = null
  let selectedId = null
  let interacted = false

  const catColor = (c) => new THREE.Color(CATEGORIES[c] ? CATEGORIES[c].color : '#1CB68D')

  // ---------- build footprint slab ----------
  function buildSlab() {
    const shape = new THREE.Shape()
    FOOTPRINT.forEach(([x, z], i) => (i ? shape.lineTo(x, -z) : shape.moveTo(x, -z)))
    shape.closePath()
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 1 })
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, -2, 0)
    const mat = new THREE.MeshStandardMaterial({ color: 0x04241a, roughness: 0.9, metalness: 0.1 })
    const slab = new THREE.Mesh(geo, mat)

    // subtle grid on top
    const grid = new THREE.GridHelper(120, 40, 0x1c6b4e, 0x0c3d2b)
    grid.position.y = 0.02
    grid.material.transparent = true
    grid.material.opacity = 0.32

    const g = new THREE.Group()
    g.add(slab, grid)
    return g
  }

  // ---------- text label sprite ----------
  function makeLabel(text, color = '#eafff4', big = false) {
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    const fs = big ? 52 : 44
    const pad = 26
    const font = `700 ${fs}px Arial, Helvetica, sans-serif`
    const dir = isRTL() ? 'rtl' : 'ltr'
    ctx.font = font
    ctx.direction = dir
    const w = Math.ceil(ctx.measureText(text).width) + pad * 2
    const h = fs + pad * 1.4
    c.width = w
    c.height = h
    ctx.font = font
    ctx.direction = dir
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // pill background
    const r = h / 2
    ctx.fillStyle = 'rgba(0,10,6,0.72)'
    roundRect(ctx, 1, 1, w - 2, h - 2, r)
    ctx.fill()
    ctx.lineWidth = 2.5
    ctx.strokeStyle = color + '55'
    roundRect(ctx, 1, 1, w - 2, h - 2, r)
    ctx.stroke()
    ctx.fillStyle = color
    ctx.fillText(text, w / 2, h / 2 + 2)

    const tex = new THREE.CanvasTexture(c)
    tex.anisotropy = 4
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false }))
    // scale to a fixed world-height so labels stay readable & consistent;
    // sizeAttenuation (default) shrinks them as the camera pulls back.
    const targetH = big ? 3.1 : 2.5
    const s = targetH / h
    spr.scale.set(w * s, h * s, 1)
    spr.renderOrder = 10
    return spr
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  /* ---------- علامة مرفق (أيقونة + اسم) ----------
     A facility marker: the icon and the name in one pill, floating over a ring
     drawn on the floor. Built the same way as the room labels — a canvas turned
     into a sprite — with one difference: the icon is an SVG, and an SVG has to
     be decoded before it can be drawn. The pill is painted immediately and the
     glyph is stamped in whenever the decode lands, so a slow decode delays the
     icon, never the marker. */
  function makeMarkerSprite(poi, color = '#eafff4') {
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    const fs = 40
    const ico = 46
    const gap = 13
    const padX = 26
    const font = `700 ${fs}px Arial, Helvetica, sans-serif`
    const rtl = isRTL()
    const text = L(poi.name)

    ctx.font = font
    ctx.direction = rtl ? 'rtl' : 'ltr'
    const tw = Math.ceil(ctx.measureText(text).width)
    const w = padX * 2 + ico + gap + tw
    const h = 74
    c.width = w
    c.height = h

    ctx.font = font
    ctx.direction = rtl ? 'rtl' : 'ltr'
    ctx.textBaseline = 'middle'

    const r = h / 2
    ctx.fillStyle = 'rgba(0,10,6,0.78)'
    roundRect(ctx, 1, 1, w - 2, h - 2, r)
    ctx.fill()
    ctx.lineWidth = 2.5
    ctx.strokeStyle = color + '66'
    roundRect(ctx, 1, 1, w - 2, h - 2, r)
    ctx.stroke()

    /* الأيقونة في جهة البداية والنص بعدها، فينقلب الترتيب مع اتجاه اللغة
       Icon on the leading side, text after it, so the pair flips with the
       page direction rather than reading backwards in Arabic. */
    const icoX = rtl ? w - padX - ico : padX
    const textX = rtl ? w - padX - ico - gap : padX + ico + gap
    ctx.textAlign = rtl ? 'right' : 'left'
    ctx.fillStyle = color
    ctx.fillText(text, textX, h / 2 + 2)

    const tex = new THREE.CanvasTexture(c)
    tex.anisotropy = 4
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false }))
    const targetH = 2.6
    const sc = targetH / h
    spr.scale.set(w * sc, h * sc, 1)
    spr.renderOrder = 11

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, icoX, (h - ico) / 2, ico, ico)
      tex.needsUpdate = true
    }
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSvg(poi.icon, ico, color))

    return spr
  }

  /* ---------- المرافق: حلقة على الأرض وعلامة فوقها ----------
     Facilities are markers, not blocks: a ring on the slab saying "here", a
     hairline rising from it, and the icon pill at the top. Nothing is added to
     `selectable`, so they stay out of the picker and out of the Spaces list —
     they are signposts, not rooms.

     العلامة أعلى من أطول كتلة في الطابق (٦ وحدات) فلا يبتلعها سقف قاعة،
     وحلقتها وساقها ترتسمان فوق كل شيء كدبّوس الخرائط: موضعها يجب أن يُرى من
     أي زاوية، لا أن يختفي خلف كتلة تصادف وقوفها في الطريق.
     The pill clears the tallest block on either floor (6 units), so no hall
     roof swallows it, and the ring and stem draw over everything the way a map
     pin does: where a facility is has to be visible from every angle, not hide
     behind whichever block happens to stand in the way. */
  const POI_Y = 8.2
  function buildPOI(floorId, group) {
    POI.filter((p) => p.floor === floorId).forEach((poi) => {
      const col = new THREE.Color(0x1cb68d)

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.8, 2.5, 36),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthTest: false, depthWrite: false })
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.set(poi.at.x, 0.06, poi.at.z)
      ring.renderOrder = 8

      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(1, 28),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthTest: false, depthWrite: false })
      )
      dot.rotation.x = -Math.PI / 2
      dot.position.set(poi.at.x, 0.05, poi.at.z)
      dot.renderOrder = 8

      const stem = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(poi.at.x, 0.1, poi.at.z),
          new THREE.Vector3(poi.at.x, POI_Y - 1.4, poi.at.z),
        ]),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.45, depthTest: false, depthWrite: false })
      )
      stem.renderOrder = 8

      const sprite = makeMarkerSprite(poi)
      sprite.position.set(poi.at.x, POI_Y, poi.at.z)

      group.add(ring, dot, stem, sprite)
      poiMarkers.push({ poi, sprite, group })
    })
  }

  // ---------- build one floor ----------
  function buildFloor(floorId) {
    const group = new THREE.Group()
    group.add(buildSlab())

    // context blocks (non-interactive)
    ;(CONTEXT[floorId] || []).forEach((b) => {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d)
      const mat = new THREE.MeshStandardMaterial({ color: 0x0a3527, roughness: 0.85, metalness: 0.05, transparent: true, opacity: 0.55 })
      const m = new THREE.Mesh(geo, mat)
      m.position.set(b.x, b.h / 2, b.z)
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x2f7a5c, transparent: true, opacity: 0.5 }))
      m.add(edges)
      group.add(m)
    })

    // rooms (interactive)
    ROOMS.filter((r) => r.floor === floorId).forEach((room) => {
      const { x, z, w, d, h } = room.plan
      const col = catColor(room.category)
      const geo = new THREE.BoxGeometry(w, h, d)
      const base = new THREE.Color(col).multiplyScalar(0.34)
      const mat = new THREE.MeshStandardMaterial({
        color: base, emissive: col, emissiveIntensity: 0.18,
        roughness: 0.42, metalness: 0.15, transparent: true, opacity: 0.94,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, h / 2, z)
      mesh.userData.roomId = room.id

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.85 })
      )
      mesh.add(edges)

      // glowing top cap
      const capGeo = new THREE.PlaneGeometry(w, d)
      capGeo.rotateX(-Math.PI / 2)
      const cap = new THREE.Mesh(capGeo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.12 }))
      cap.position.y = h / 2 + 0.05
      mesh.add(cap)

      const big = ['hackathon', 'coding'].includes(room.id)
      const label = makeLabel(L(room.name), '#eafff4', big)
      label.position.set(x, h + 3.4, z)
      group.add(label)

      group.add(mesh)
      roomMeshes[room.id] = { mesh, edges, mat, base: base.clone(), hi: col.clone(), baseY: h / 2, targetY: h / 2, floor: floorId, label, labelBaseY: h + 3.4, big, group }
    })

    buildPOI(floorId, group)

    group.visible = false
    scene.add(group)
    floorGroups[floorId] = group
    return group
  }

  /* ---------- إعادة توليد اللافتات بعد تغيير اللغة ----------
     Labels are canvas textures, so a language change means redrawing them.
     Width depends on the text, so the sprite is rebuilt and swapped in. */
  function refreshLabels() {
    Object.entries(roomMeshes).forEach(([id, o]) => {
      const room = ROOMS.find((r) => r.id === id)
      if (!room || !o.label) return
      const next = makeLabel(L(room.name), '#eafff4', o.big)
      next.position.copy(o.label.position)
      o.group.add(next)
      o.group.remove(o.label)
      o.label.material.map.dispose()
      o.label.material.dispose()
      o.label = next
    })
    /* والعلامات كذلك — اسمها ونصّها واتجاهه كلها مرسومة داخل الصورة نفسها
       The markers too: their name, and the direction it reads in, are baked
       into the picture, so a language switch means redrawing them. */
    poiMarkers.forEach((m) => {
      const next = makeMarkerSprite(m.poi)
      next.position.copy(m.sprite.position)
      m.group.add(next)
      m.group.remove(m.sprite)
      m.sprite.material.map.dispose()
      m.sprite.material.dispose()
      m.sprite = next
    })
  }

  // ---------- selection ----------
  function setSelected(id) {
    selectedId = id
    Object.entries(roomMeshes).forEach(([rid, o]) => {
      if (o.floor !== activeFloor) return
      const on = rid === id
      o.targetY = on ? o.baseY + 2.2 : o.baseY
      o.mat.emissiveIntensity = on ? 0.75 : 0.18
      o.mat.opacity = id && !on ? 0.62 : 0.94
      o.edges.material.opacity = on ? 1 : id ? 0.4 : 0.85
    })
    const room = ROOMS.find((r) => r.id === id) || null
    if (onSelect) onSelect(room)
  }

  function selectRoom(id) {
    /* تُبنى مجسّمات الطابق عند أول عرض له فقط، فـ roomMeshes لا يعرف غرف طابق
       لم يُعرض بعد. لذلك نحدّد الطابق من البيانات لا من المجسّمات، ونبدّله أولًا
       (وهو ما يبنيه) ثم نبحث عن المجسّم.
       A floor's meshes are built the first time it is shown, so roomMeshes knows
       nothing about a floor that has not been displayed yet. Resolve the floor
       from the data rather than the meshes, switch to it first — which builds
       it — and only then look the mesh up. Reading roomMeshes first made this
       a silent no-op for every first-floor room. */
    const room = ROOMS.find((r) => r.id === id)
    if (!room) return
    if (room.floor !== activeFloor) setFloor(room.floor)
    const o = roomMeshes[id]
    if (!o) return
    interacted = true
    controls.autoRotate = false
    setSelected(id)
    // gently focus the room — approach from the same direction as the home view
    const r = ROOMS.find((x) => x.id === id)
    const dir = HOME_POS.clone().normalize()
    tweenTo(
      new THREE.Vector3(r.plan.x, 0, r.plan.z).add(dir.multiplyScalar(90)),
      new THREE.Vector3(r.plan.x, 4, r.plan.z)
    )
  }

  function clearSelection() {
    if (selectedId) setSelected(null)
  }

  // ---------- floor switching ----------
  function setFloor(id) {
    if (activeFloor === id) return
    activeFloor = id
    if (!floorGroups[id]) buildFloor(id)
    Object.entries(floorGroups).forEach(([fid, g]) => (g.visible = fid === id))
    selectable.length = 0
    Object.values(roomMeshes).forEach((o) => o.floor === id && selectable.push(o.mesh))
    setSelected(null)
  }

  // ---------- camera tween ----------
  let tween = null
  function tweenTo(pos, tgt, dur = 620) {
    tween = { fromP: camera.position.clone(), toP: pos.clone(), fromT: controls.target.clone(), toT: tgt.clone(), t: 0, dur }
  }
  function resetView() {
    interacted = true
    controls.autoRotate = false
    clearSelection()
    tweenTo(HOME_POS, HOME_TGT)
  }

  // ---------- picking ----------
  const raycaster = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  let down = null

  function toNDC(e) {
    const rect = canvas.getBoundingClientRect()
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }
  function onDown(e) {
    interacted = true
    controls.autoRotate = false
    const p = e.touches ? e.touches[0] : e
    down = { x: p.clientX, y: p.clientY, t: performance.now() }
  }
  function onUp(e) {
    if (!down) return
    const p = e.changedTouches ? e.changedTouches[0] : e
    const moved = Math.hypot(p.clientX - down.x, p.clientY - down.y)
    const dt = performance.now() - down.t
    down = null
    if (moved > 10 || dt > 500) return // was a drag, not a tap
    toNDC(p)
    raycaster.setFromCamera(ndc, camera)
    const hit = raycaster.intersectObjects(selectable, false)[0]
    if (hit) {
      const id = hit.object.userData.roomId
      setSelected(id === selectedId ? null : id)
    } else {
      clearSelection()
    }
  }
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointerup', onUp)

  // ---------- resize ----------
  function resize() {
    const p = canvas.parentElement
    const w = p.clientWidth || window.innerWidth
    const h = p.clientHeight || window.innerHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas.parentElement)

  // ---------- render loop ----------
  const clock = new THREE.Clock()
  let raf
  function animate() {
    raf = requestAnimationFrame(animate)
    const dt = Math.min(clock.getDelta(), 0.05)

    // room lift lerp
    Object.values(roomMeshes).forEach((o) => {
      if (o.floor !== activeFloor) return
      const y = o.mesh.position.y + (o.targetY - o.mesh.position.y) * Math.min(dt * 10, 1)
      o.mesh.position.y = y
      o.label.position.y = o.labelBaseY + (y - o.baseY)
    })

    // camera tween
    if (tween) {
      tween.t += dt * 1000
      const k = Math.min(tween.t / tween.dur, 1)
      const e = 1 - Math.pow(1 - k, 3)
      camera.position.lerpVectors(tween.fromP, tween.toP, e)
      controls.target.lerpVectors(tween.fromT, tween.toT, e)
      if (k >= 1) tween = null
    }

    controls.update()
    renderer.render(scene, camera)
  }

  // ---------- init ----------
  async function init(startFloor = 'GF') {
    try { await document.fonts.ready } catch (_) {}
    resize()
    setFloor(startFloor)
    animate()
  }

  function dispose() {
    cancelAnimationFrame(raf)
    ro.disconnect()
    controls.dispose()
    renderer.dispose()
  }

  return { init, setFloor, selectRoom, clearSelection, resetView, refreshLabels, dispose, get floor() { return activeFloor } }
}
