// import fs from 'fs'
// import { generateCertificate } from '../../utils/generateCertificate'
// import User from '../user/user.model'
// import { Request, Response } from 'express'
// import mongoose from 'mongoose'
// import { cloudinary } from '../../utils/cloudinary'
// import Course from '../course/course.model'

// export const getCertificate = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { userId, courseId } = req.params
//   console.log(userId, courseId, 'getCertificate')

//   // 1. Get user
//   const user = await User.findById(userId)
//   if (!user) return res.status(404).json({ message: 'User not found' })

//   // 2. Check if certificate already exists
//   const existing = user.certificates.find(
//     (c) => c.courseId.toString() === courseId
//   )
//   if (existing) {
//     return res.json({ url: existing.certificateUrl })
//   }

//   // 3. Get course title
//   const course = await Course.findById(courseId)
//   if (!course) return res.status(404).json({ message: 'Course not found' })

//   // 4. Generate certificate PDF
//   const filePath = await generateCertificate(user.name, course.title)
//   const stats = fs.statSync(filePath)

//   // Wait for the file to be flushed properly
//   await new Promise((res) => setTimeout(res, 300))

//   try {
//     // 5. Upload to Cloudinary
//     const cloudRes = await cloudinary.uploader.upload(filePath, {
//       resource_type: 'raw',
//       folder: 'certificates',
//       use_filename: true,
//       unique_filename: false,
//     })

//     // Delete local file after upload
//     fs.unlinkSync(filePath)

//     // 6. Build download URL
//     const cloudinaryPublicId = cloudRes.public_id // e.g. certificates/xyz123
//     const sanitizedFileName = `certificate-${user.name.replace(/\s+/g, '-')}`
//     const encodedFileName = encodeURIComponent(sanitizedFileName)

//     const downloadUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/fl_attachment:${encodedFileName}/${cloudinaryPublicId}`

//     // 7. Save in DB
//     user.certificates.push({
//       courseId: new mongoose.Types.ObjectId(courseId),
//       certificateUrl: downloadUrl,
//       issuedAt: new Date(),
//     })

//     await user.save()

//     // 8. Send response
//     return res.json({ url: downloadUrl })
//   } catch (error) {
//     console.error('Cloudinary upload error:', error)

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath)
//     }

//     return res.status(500).json({ message: 'Certificate upload failed' })
//   }
// }

import { Request, Response } from 'express'
import { handleCertificateGeneration } from './certificate.service'

export const getCertificate = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, courseId } = req.params
    const url = await handleCertificateGeneration(userId, courseId)
    return res.json({ url })
  } catch (error: any) {
    console.error('Certificate error:', error)
    return res
      .status(error.status || 500)
      .json({ message: error.message || 'Internal server error' })
  }
}
