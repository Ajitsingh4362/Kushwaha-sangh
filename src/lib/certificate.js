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
 * @returns {Promise<{ blob: Blob, certificateId: string }>}
 */
export async function generateCertificatePdf({ participantName, programTitle, programDate, location, certificateId }) {
  const PDFLib = await loadPdfLib()
  const { PDFDocument, StandardFonts, rgb } = PDFLib

  const id = certificateId || generateCertificateId(programDate)

  const doc = await PDFDocument.create()
  const page = doc.addPage([842, 595]) // A4 landscape (points)
  const { width, height } = page.getSize()

  const serif = await doc.embedFont(StandardFonts.TimesRomanBold)
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic)
  const body = await doc.embedFont(StandardFonts.TimesRoman)

  const maroon = rgb(0.42, 0.09, 0.11) // approx maroon-deep
  const gold = rgb(0.72, 0.55, 0.15)
  const ink = rgb(0.15, 0.13, 0.11)

  // Outer decorative border
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

  centerText('KUSHWAHA SANGH', height - 100, serif, 22, maroon)
  centerText('Community Welfare Association', height - 122, body, 11, ink)

  centerText('Certificate of Participation', height - 175, serif, 30, maroon)

  centerText('This is to certify that', height - 235, serifItalic, 14, ink)
  centerText(participantName, height - 275, serif, 26, maroon)

  const line1 = `has actively participated in`
  centerText(line1, height - 315, body, 13, ink)
  centerText(programTitle, height - 340, serif, 17, ink)

  const line2 = location
    ? `held on ${formatDate(programDate)} at ${location}, organized by Kushwaha Sangh.`
    : `held on ${formatDate(programDate)}, organized by Kushwaha Sangh.`
  centerText(line2, height - 368, body, 12, ink)

  // Footer: certificate ID (left) + signature line (right)
  const footerY = 90
  page.drawText(`Certificate ID: ${id}`, { x: margin + 40, y: footerY, size: 9, font: body, color: rgb(0.4, 0.4, 0.4) })
  page.drawText(`Issued: ${formatDate(new Date().toISOString().slice(0, 10))}`, {
    x: margin + 40,
    y: footerY - 16,
    size: 9,
    font: body,
    color: rgb(0.4, 0.4, 0.4),
  })

  const sigLineWidth = 180
  const sigX = width - margin - 40 - sigLineWidth
  page.drawLine({
    start: { x: sigX, y: footerY + 10 },
    end: { x: sigX + sigLineWidth, y: footerY + 10 },
    thickness: 1,
    color: ink,
  })
  const sigLabel = 'Authorized Signatory'
  const sigLabelWidth = body.widthOfTextAtSize(sigLabel, 10)
  page.drawText(sigLabel, { x: sigX + (sigLineWidth - sigLabelWidth) / 2, y: footerY - 6, size: 10, font: body, color: ink })

  const bytes = await doc.save()
  const blob = new Blob([bytes], { type: 'application/pdf' })
  return { blob, certificateId: id }
}
