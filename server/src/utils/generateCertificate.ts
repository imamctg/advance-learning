import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

export const generateCertificate = async (
  userName: string,
  courseTitle: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })

    const fileName = `${userName}-${courseTitle}-certificate.pdf`.replace(
      /\s+/g,
      '_'
    )
    const certDir = path.join(__dirname, '../../certificates')

    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true })
    }

    const filePath = path.join(certDir, fileName)
    const stream = fs.createWriteStream(filePath)

    stream.on('finish', () => {
      console.log('PDF file written:', filePath)
      resolve(filePath)
    })

    stream.on('error', (err) => {
      console.error('Stream error:', err)
      reject(err)
    })

    doc.pipe(stream)

    // PDF Design Content
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f3f4f6') // Light gray background

    doc
      .fontSize(40)
      .fillColor('#1e293b')
      .font('Times-Bold')
      .text('Certificate of Completion', {
        align: 'center',
        underline: true,
      })

    doc
      .moveDown(1)
      .fontSize(18)
      .fillColor('#475569')
      .font('Times-Roman')
      .text('This certificate is proudly presented to', {
        align: 'center',
      })

    doc
      .moveDown(1)
      .fontSize(32)
      .fillColor('#111827')
      .font('Times-BoldItalic')
      .text(userName, { align: 'center' })

    doc
      .moveDown(1)
      .fontSize(20)
      .fillColor('#334155')
      .font('Times-Roman')
      .text(`For successfully completing the course`, {
        align: 'center',
      })

    doc
      .moveDown(0.5)
      .fontSize(26)
      .fillColor('#2563eb')
      .font('Times-Italic')
      .text(`"${courseTitle}"`, {
        align: 'center',
      })

    const issueDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    doc
      .moveDown(3)
      .fontSize(14)
      .fillColor('#6b7280')
      .text(`Issued on ${issueDate}`, {
        align: 'center',
      })

    doc
      .moveTo(80, doc.page.height - 120)
      .lineTo(250, doc.page.height - 120)
      .strokeColor('#94a3b8')
      .lineWidth(1)
      .stroke()

    doc
      .fontSize(12)
      .fillColor('#334155')
      .text('Authorized Signature', 80, doc.page.height - 115)

    doc
      .fontSize(10)
      .fillColor('#9ca3af')
      .text(
        '© 2025 Your Company Name. All rights reserved.',
        0,
        doc.page.height - 40,
        {
          align: 'center',
        }
      )

    doc.end() // ✅ Important: end after all content is written
  })
}
