import QRCode from 'qrcode'
import { icon } from './icons.js'
import { t } from './i18n.js'
import { brandStrip } from './brand.js'

export function renderQR(root, onBack) {
  const url = location.origin + location.pathname
  root.innerHTML = `
    <div class="qr-wrap">
      ${brandStrip(t('partnersLabel'))}
      <div class="qr-card"><canvas id="qr-canvas"></canvas></div>
      <h2>${t('qrTitle')}</h2>
      <p>${url}</p>
      <button class="qr-back" id="qr-back">${icon('chevron', 18)} ${t('qrBack')}</button>
    </div>
  `
  const canvas = root.querySelector('#qr-canvas')
  QRCode.toCanvas(canvas, url, {
    width: 232,
    margin: 1,
    color: { dark: '#031813', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  }).catch(() => {})
  root.querySelector('#qr-back').addEventListener('click', onBack)
}
