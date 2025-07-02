import Course, { ICourse, ISection, ILecture } from '../course/course.model'
import UserProgress from '../course/UserProgress.model'
import { Types } from 'mongoose'

interface CourseProgress {
  _id: Types.ObjectId
  title: string
  thumbnail: string
  instructor: string | Types.ObjectId
  progress: number
  totalLectures: number
  completedLectures: number
}

export const getCourseProgressService = async (
  userId: string
): Promise<CourseProgress[]> => {
  // Get all courses the user is enrolled in with proper typing
  const enrolledCourses = await Course.find(
    { students: userId },
    '_id title thumbnail instructor sections'
  ).lean<
    Pick<ICourse, '_id' | 'title' | 'thumbnail' | 'instructor' | 'sections'>[]
  >()

  // Get all completed lectures for this user
  const completedLectures = await UserProgress.find(
    { user: userId, completed: true },
    'lecture'
  ).lean<{ lecture: Types.ObjectId }[]>()

  const completedLectureIds = completedLectures.map((cl) =>
    cl.lecture.toString()
  )

  // Calculate progress for each course with proper typing
  const coursesWithProgress = enrolledCourses.map((course) => {
    // Count total lectures in course
    let totalLectures = 0
    let completedLecturesCount = 0

    // Add type annotations for section and lecture
    course.sections.forEach((section: ISection) => {
      section.lectures.forEach((lecture: ILecture) => {
        totalLectures++
        if (completedLectureIds.includes(lecture._id.toString())) {
          completedLecturesCount++
        }
      })
    })

    const progress =
      totalLectures > 0
        ? Math.round((completedLecturesCount / totalLectures) * 100)
        : 0

    return {
      _id: course._id,
      title: course.title,
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      progress,
      totalLectures,
      completedLectures: completedLecturesCount,
    } as CourseProgress // Type assertion here
  })

  return coursesWithProgress
}
