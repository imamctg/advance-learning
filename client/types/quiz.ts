export interface Question {
  // question: string
  questionText: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Quiz {
  _id: string
  title: string
  course: string
  questions: Question[]
  lecture?: string
  section?: string
}

export interface Lecture {
  _id: string
  title: string
  videoUrl: string
  duration: number
  completed?: boolean
}

export interface Section {
  _id: string
  title: string
  lectures: Lecture[]
}
