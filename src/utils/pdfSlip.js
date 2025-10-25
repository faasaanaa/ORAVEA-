import jsPDF from 'jspdf'
import { formatCurrency } from './index'

function drawLine(pdf, y) {
  pdf.setDrawColor(200)
  pdf.setLineWidth(0.5)
  pdf.line(14, y, 196, y)
}

/**
 * Draws a rotated rectangular "stamp" with a slanted right edge.
 * rectColor is used for the rectangle border, textColor for the label.
 * skew pushes the right-side corners outward before rotation to create the slant.
 */
function drawRotatedRectStamp(pdf, cx, cy, w, h, angleDeg, label, skew = 8, rectColor = [0, 0, 0], textColor = [200, 0, 0]) {
  const rad = (angleDeg * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const hw = w / 2
  const hh = h / 2

  // Pre-skew rectangle corners: make the right edge slanted by adding 'skew' to x
  const cornersPre = [
    { x: -hw, y: -hh },
    { x: hw + skew, y: -hh },
    { x: hw + skew, y: hh },
    { x: -hw, y: hh },
  ]

  const corners = cornersPre.map(p => ({ x: cx + p.x * cos - p.y * sin, y: cy + p.x * sin + p.y * cos }))

  // Rectangle border color
  if (Array.isArray(rectColor) && rectColor.length === 3) {
    pdf.setDrawColor(rectColor[0], rectColor[1], rectColor[2])
  } else {
    pdf.setDrawColor(rectColor)
  }
  pdf.setLineWidth(1.2)
  for (let i = 0; i < 4; i++) {
    const a = corners[i]
    const b = corners[(i + 1) % 4]
    pdf.line(a.x, a.y, b.x, b.y)
  }

  // Label (rotated to match rectangle)
  if (Array.isArray(textColor) && textColor.length === 3) {
    pdf.setTextColor(textColor[0], textColor[1], textColor[2])
  } else {
    pdf.setTextColor(textColor)
  }
  pdf.setFontSize(30)
  // Use jsPDF angle option; if unsupported it will draw unrotated text
  try {
    pdf.text(label, cx + 5, cy + 12, { align: 'center', angle: -angleDeg })
  } catch (err) {
    pdf.text(label, cx + 5, cy + 12, { align: 'center' })
  }
}


export default function generateOrderPdf(order = {}, opts = { forCustomer: false, confirmed: false }) {
  try {
    const { forCustomer = false, confirmed = false } = opts || {}
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' })

    // Header
    pdf.setFillColor(18, 18, 18)
    pdf.rect(0, 0, 210, 30, 'F')
    pdf.setTextColor(255, 215, 0)
    pdf.setFontSize(20)
    pdf.text('Oravéa — Premium Order Slip', 14, 18)

    pdf.setTextColor(255)
    pdf.setFontSize(10)
    pdf.text(`Order ID: ${String(order.orderId || '')}`, 14, 36)
    pdf.text(
      `Status: ${String(order.status || (forCustomer && !confirmed ? 'unconfirmed' : 'unconfirmed'))}`,
      14,
      44
    )

    if (order.createdAt && order.createdAt.toDate) {
      const d = order.createdAt.toDate()
      pdf.text(`Date: ${d.toLocaleString()}`, 140, 36)
    }

    // Customer
    let y = 54
    pdf.setFontSize(12)
    pdf.setTextColor(0)
    pdf.text('Customer', 14, y)
    pdf.setFontSize(10)
    y += 6
    pdf.text(String(order.customer?.name || ''), 14, y)
    y += 6
    pdf.text(String(order.customer?.email || ''), 14, y)
    y += 6
    pdf.text(String(order.customer?.whatsapp || ''), 14, y)

    // Address
    y = 54
    pdf.setFontSize(12)
    pdf.setTextColor(0)
    pdf.text('Shipping Address', 110, y)
    pdf.setFontSize(10)
    y += 6
    const addr = order.customer?.shipping || {}
    const addrLines = [addr.line1, addr.city, addr.state, addr.postal, addr.country]
      .filter(Boolean)
      .join(', ')
    pdf.text(String(addr.line1 || ''), 110, y)
    y += 6
    pdf.text(String(addrLines), 110, y)

    // Items header
    let itemY = 100
    drawLine(pdf, itemY - 4)
    pdf.setFontSize(11)
    pdf.setTextColor(80)
    pdf.text('Item', 14, itemY)
    pdf.text('Qty', 120, itemY)
    pdf.text('Unit Price', 140, itemY)
    pdf.text('Subtotal', 180, itemY)
    drawLine(pdf, itemY + 2)
    itemY += 8

    const items = order.items || []
    items.forEach(it => {
      const name = String(it.name || '')
      const qty = String(it.qty || 0)
      const unit = String(formatCurrency(it.price || 0))
      const subtotal = String(formatCurrency(it.subtotal || (it.price * (it.qty || 0))))

      pdf.setFontSize(10)
      pdf.setTextColor(0)
      pdf.text(name, 14, itemY)
      pdf.text(qty, 120, itemY)
      pdf.text(unit, 140, itemY)

      const subtotalWidth = pdf.getTextWidth(subtotal)
      pdf.text(subtotal, 180 - subtotalWidth, itemY)

      itemY += 7
      if (itemY > 260) {
        pdf.addPage()
        itemY = 20
      }
    })

    // Totals
    const PAGE_BOTTOM = 280
    const neededSpace = 64
    if (itemY + neededSpace > PAGE_BOTTOM) {
      pdf.addPage()
      itemY = 20
    }

    drawLine(pdf, itemY + 2)
    pdf.setFontSize(12)
    pdf.setTextColor(0)
    const baseY = itemY + 10
    pdf.text('Subtotal', 140, baseY)
    const subtotalText = String(formatCurrency(order.totalAmount || 0))
    const subtotalWidth = pdf.getTextWidth(subtotalText)
    pdf.text(subtotalText, 180 - subtotalWidth, baseY)

    const shipment = Number(order.shipmentCost || 0)
    const shipY = baseY + 8
    if (forCustomer && !confirmed) {
      pdf.setFontSize(11)
      pdf.text('Shipping', 140, shipY)
      const shipText = 'Not confirmed'
      const shipW = pdf.getTextWidth(shipText)
      pdf.text(shipText, 180 - shipW, shipY)

      const labelY = shipY + 10
      pdf.setFontSize(13)
      pdf.text('Grand Total', 140, labelY)
      const amountY = labelY + 6
      pdf.setFontSize(12)
      const grandLabel = `${formatCurrency(order.totalAmount || 0)} + shipment`
      const grandLabelW = pdf.getTextWidth(grandLabel)
      pdf.text(grandLabel, 180 - grandLabelW, amountY)

  // 🔴 Red "UNCONFIRMED" stamp
  drawRotatedRectStamp(pdf, 60, amountY + 18, 70, 16, -15, 'UNCONFIRMED')
  // Admin note shown to customers on unconfirmed slip
  pdf.setFontSize(9)
  pdf.setTextColor(120)
  const adminNote = 'Note from admin: Please wait for confirmed slip on WhatsApp.'
  const noteLines = pdf.splitTextToSize ? pdf.splitTextToSize(adminNote, 120) : [adminNote]
  // place the note below the totals/stamp area
  const noteY = amountY + 36
  pdf.text(noteLines, 14, noteY)
    } else {
      if (shipment) {
        pdf.setFontSize(11)
        pdf.text('Shipping', 140, shipY)
        const shipText = String(formatCurrency(shipment))
        const shipW = pdf.getTextWidth(shipText)
        pdf.text(shipText, 180 - shipW, shipY)
      }

      const grand = Number(order.totalAmount || 0) + shipment
      const grandY = shipY + 10
      pdf.setFontSize(13)
      pdf.text('Grand Total', 140, grandY)
      const amountY = grandY + 6
      const grandText = String(formatCurrency(grand))
      const grandTextW = pdf.getTextWidth(grandText)
      pdf.text(grandText, 180 - grandTextW, amountY)

      // 🔴 Red "CONFIRMED" stamp
      drawRotatedRectStamp(pdf, 60, amountY + 18, 70, 16, -15, 'CONFIRMED')
    }

    if (order.notes) {
      pdf.setFontSize(10)
      pdf.setTextColor(80)
      pdf.text('Notes:', 14, itemY + 22)
      pdf.setFontSize(9)
      pdf.text(String(order.notes), 14, itemY + 28)
    }

    const blobUrl = pdf.output('bloburl')
    window.open(blobUrl, '_blank')
  } catch (err) {
    console.error('PDF generation failed', err)
    alert('Failed to generate order slip')
  }
}
