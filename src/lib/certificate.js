// Generates a "Certificate of Participation" PDF for a program participant.
//
// pdf-lib is loaded from a CDN at runtime instead of being added as an npm
// dependency — that keeps package.json/package-lock.json untouched, so this
// feature can't break the existing Vercel build.

const PDF_LIB_CDN = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js'

let pdfLibPromise = null

function loadPdfLib() {
  if (window.PDFLib) return Promise.resolve(window.PDFLib)
  if (pdfLibPromise) return pdfLibPromise

  pdfLibPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = PDF_LIB_CDN
    script.onload = () => resolve(window.PDFLib)
    script.onerror = () => reject(new Error('Could not load PDF library. Check your internet connection.'))
    document.head.appendChild(script)
  })

  return pdfLibPromise
}

function generateCertificateId(programDate) {
  const year = (programDate || '').slice(0, 4) || new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `KS-${year}-${random}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

/**
 * @param {object} params
 * @param {string} params.participantName
 * @param {string} params.programTitle
 * @param {string} params.programDate  (YYYY-MM-DD)
 * @param {string} [params.location]
 * @param {string} [params.certificateId]  auto-generated if omitted
 * @param {string} [params.logoUrl]  URL of the Sangh logo image to embed (PNG or JPG)
 * @returns {Promise<{ blob: Blob, certificateId: string }>}
 */
export async function generateCertificatePdf({ participantName, programTitle, programDate, location, certificateId, logoUrl }) {
  const PDFLib = await loadPdfLib()
  const { PDFDocument, StandardFonts, rgb } = PDFLib

  const id = certificateId || generateCertificateId(programDate)

  const doc = await PDFDocument.create()
  const page = doc.addPage([842, 595]) // A4 landscape (points)
  const { width, height } = page.getSize()

  const serif = await doc.embedFont(StandardFonts.TimesRomanBold)
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic)
  const body = await doc.embedFont(StandardFonts.TimesRoman)

  const maroon = rgb(0.42, 0.09, 0.11)
  const gold = rgb(0.72, 0.55, 0.15)
  const ink = rgb(0.15, 0.13, 0.11)
  const grey = rgb(0.4, 0.4, 0.4)

  let logoImage = null
  if (logoUrl) {
    try {
      const res = await fetch(logoUrl)
      const bytes = await res.arrayBuffer()
      const isPng = logoUrl.toLowerCase().includes('.png') || res.headers.get('content-type')?.includes('png')
      logoImage = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes)
    } catch {
      logoImage = null
    }
  }

  // Watermark — large, faint, centered behind all other content.
  if (logoImage) {
    const wmSize = 380
    const wmDims = logoImage.scale(wmSize / Math.max(logoImage.width, logoImage.height))
    page.drawImage(logoImage, {
      x: (width - wmDims.width) / 2,
      y: (height - wmDims.height) / 2,
      width: wmDims.width,
      height: wmDims.height,
      opacity: 0.07,
    })
  }

  const margin = 24
  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - margin * 2,
    height: height - margin * 2,
    borderColor: gold,
    borderWidth: 3,
  })
  page.drawRectangle({
    x: margin + 8,
    y: margin + 8,
    width: width - (margin + 8) * 2,
    height: height - (margin + 8) * 2,
    borderColor: maroon,
    borderWidth: 1,
  })

  function centerText(text, y, font, size, color = ink) {
    const textWidth = font.widthOfTextAtSize(text, size)
    page.drawText(text, { x: (width - textWidth) / 2, y, size, font, color })
  }

  if (logoImage) {
    const logoSize = 120
    const logoDims = logoImage.scale(logoSize / Math.max(logoImage.width, logoImage.height))
    const logoX = margin + 30
    const logoY = height - 50 - logoDims.height

    const pad = 4
    page.drawRectangle({
      x: logoX - pad,
      y: logoY - pad,
      width: logoDims.width + pad * 2,
      height: logoDims.height + pad * 2,
      color: rgb(1, 1, 1),
    })
    page.drawImage(logoImage, { x: logoX, y: logoY, width: logoDims.width, height: logoDims.height })
  }

  const logoBottomY = height - 90
  centerText('KUSHWAHA SANGH', logoBottomY, serif, 22, maroon)
  centerText('Community Welfare Association', logoBottomY - 22, body, 11, ink)

  const ruleWidth = 200
  page.drawLine({
    start: { x: (width - ruleWidth) / 2, y: logoBottomY - 34 },
    end: { x: (width + ruleWidth) / 2, y: logoBottomY - 34 },
    thickness: 1,
    color: gold,
  })

  const titleY = logoBottomY - 65
  centerText('Certificate of Participation', titleY, serif, 30, maroon)

  centerText('This is to certify that', titleY - 55, serifItalic, 14, ink)
  centerText(participantName, titleY - 92, serif, 26, maroon)

  const line1 = `has actively participated in`
  centerText(line1, titleY - 128, body, 13, ink)
  centerText(programTitle, titleY - 152, serif, 17, ink)

  const line2 = location
    ? `held on ${formatDate(programDate)} at ${location}, organized by Kushwaha Sangh.`
    : `held on ${formatDate(programDate)}, organized by Kushwaha Sangh.`
  centerText(line2, titleY - 178, body, 12, ink)

  centerText(
    'We appreciate this valuable contribution towards our community welfare initiatives',
    titleY - 202,
    serifItalic,
    11,
    grey
  )
  centerText('and thank you for standing with the Sangh in service of society.', titleY - 218, serifItalic, 11, grey)

  const sealCx = width / 2
  const sealCy = 128
  const sealR = 30
  page.drawCircle({ x: sealCx, y: sealCy, size: sealR, borderColor: gold, borderWidth: 2, color: rgb(1, 1, 1) })
  page.drawCircle({ x: sealCx, y: sealCy, size: sealR - 6, borderColor: maroon, borderWidth: 1 })
  const sealLine1 = 'OFFICIAL'
  const sealLine1Width = body.widthOfTextAtSize(sealLine1, 8)
  page.drawText(sealLine1, { x: sealCx - sealLine1Width / 2, y: sealCy + 8, size: 8, font: body, color: maroon })
  const sealLine2 = 'SEAL'
  const sealLine2Width = body.widthOfTextAtSize(sealLine2, 8)
  page.drawText(sealLine2, { x: sealCx - sealLine2Width / 2, y: sealCy - 4, size: 8, font: body, color: maroon })
  const sealLine3 = 'K.S.'
  const sealLine3Width = serif.widthOfTextAtSize(sealLine3, 9)
  page.drawText(sealLine3, { x: sealCx - sealLine3Width / 2, y: sealCy - 16, size: 9, font: serif, color: maroon })

  const footerY = 90
  page.drawText(`Certificate ID: ${id}`, { x: margin + 40, y: footerY, size: 9, font: body, color: grey })
  page.drawText(`Issued: ${formatDate(new Date().toISOString().slice(0, 10))}`, {
    x: margin + 40,
    y: footerY - 16,
    size: 9,
    font: body,
    color: grey,
  })

  function signatureBlock(centerX, label) {
    const lineWidth = 160
    const lineY = footerY + 10
    page.drawLine({
      start: { x: centerX - lineWidth / 2, y: lineY },
      end: { x: centerX + lineWidth / 2, y: lineY },
      thickness: 1,
      color: ink,
    })
    const labelWidth = body.widthOfTextAtSize(label, 10)
    page.drawText(label, { x: centerX - labelWidth / 2, y: lineY - 16, size: 10, font: body, color: ink })
  }

  signatureBlock(width / 2 - 220, 'Secretary')
  signatureBlock(width / 2 + 220, 'President')

  const bytes = await doc.save()
  const blob = new Blob([bytes], { type: 'application/pdf' })
  return { blob, certificateId: id }
}
