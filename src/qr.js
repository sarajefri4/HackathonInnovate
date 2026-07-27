import QRCode from 'qrcode'
import { EVENT } from './data.js'
import { icon } from './icons.js'

export function renderQR(root, onBack) {
  const url = location.origin + location.pathname
  root.innerHTML = `
    <div class="qr-wrap">
      <div class="qr-card"><canvas id="qr-canvas"></canvas></div>
      <h2>امسح للوصول إلى الدليل</h2>
      <p>${url}</p>
      <button class="qr-back" id="qr-back">${icon('chevron', 18)} رجوع</button>
    </div>
  `
  const canvas = root.querySelector('#qr-canvas')
  QRCode.toCanvas(canvas, url, {
    width: 232,
    margin: 1,
    color: { dark: '#001008', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  }).catch(() => {})
  root.querySelector('#qr-back').addEventListener('click', onBack)
}
