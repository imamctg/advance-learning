import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { cloudinary } from '../middlewares/cloudinary'

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
  filename: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<string> => {
  const result = await new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: filename,
          resource_type: resourceType,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error || !result) {
            return reject(error)
          }
          resolve(result.secure_url)
        }
      )
      .end(fileBuffer)
  })

  return result
}
