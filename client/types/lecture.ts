// types/lecture.ts
export interface LectureResource {
  type: 'file' | 'link'
  name: string
  url: string
  file?: File | null
  mimeType?: string
  _id?: string // Optional for existing resources from DB
}
