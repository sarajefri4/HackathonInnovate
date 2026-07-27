import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ROOMS, CONTEXT, FOOTPRINT, CATEGORIES } from './data.js'

/*
 * مخطط ثلاثي الأبعاد تفاعلي — Interactive 3D floor plan
 * التحكم باللمس: سحب = تدوير · إصبعان = تكبير/تحريك · نقر = اختيار غرفة
 */
export function createFloor3D(canvas, { onSelect } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x001008, 120, 260)

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
  const rim = new THREE.DirectionalLight(0x8de0b0, 0.6)
  rim.position.set(-40, 30, -30)
  scene.add(rim)

  const floorGroups = {} // id -> THREE.Group
  const selectable = []  // room meshes of active floor
  const roomMeshes = {}  // roomId -> { mesh, edges, baseY, targetY, mat, base, hi }
  let activeFloor = null
  let selectedId = null
  let interacted = false

  const catColor = (c) => new THREE.Color(CATEGORIES[c] ? CATEGORIES[c].color : '#60BC94')

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
    ctx.font = `700 ${fs}px Tajawal, sans-serif`
    ctx.direction = 'rtl'
    const w = Math.ceil(ctx.measureText(text).width) + pad * 2
    const h = fs + pad * 1.4
    c.width = w
    c.height = h
    ctx.font = `700 ${fs}px Tajawal, sans-serif`
    ctx.direction = 'rtl'
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

      const label = makeLabel(room.name, '#eafff4', ['hackathon', 'coding'].includes(room.id))
      label.position.set(x, h + 3.4, z)
      group.add(label)

      group.add(mesh)
      roomMeshes[room.id] = { mesh, edges, mat, base: base.clone(), hi: col.clone(), baseY: h / 2, targetY: h / 2, floor: floorId, label, labelBaseY: h + 3.4 }
    })

    group.visible = false
    scene.add(group)
    floorGroups[floorId] = group
    return group
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
    const o = roomMeshes[id]
    if (!o) return
    if (o.floor !== activeFloor) setFloor(o.floor)
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

  return { init, setFloor, selectRoom, clearSelection, resetView, dispose, get floor() { return activeFloor } }
}
