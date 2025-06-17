// 'use client'

// import React from 'react'
// import ReactPlayer from 'react-player'

// interface Props {
//   src: string
// }

// export default function CustomVideoPlayer({ src }: Props) {
//   return (
//     <div
//       className='player-wrapper'
//       style={{ position: 'relative', paddingTop: '56.25%' }}
//     >
//       <ReactPlayer
//         url={src}
//         controls
//         width='100%'
//         height='100%'
//         style={{ position: 'absolute', top: 0, left: 0 }}
//       />
//     </div>
//   )
// }

'use client'

import React, { useRef, useEffect, useState } from 'react'

interface Props {
  src: string
  onComplete?: () => void
}

const CustomVideoPlayer: React.FC<Props> = ({ src, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }

    const handleEnded = () => {
      if (onComplete) onComplete()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onComplete])

  return (
    <div className='bg-black rounded-xl overflow-hidden'>
      <video
        ref={videoRef}
        src={src}
        controls
        className='w-full aspect-video'
      />
      <div className='h-1 bg-gray-200'>
        <div className='h-full bg-blue-600' style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default CustomVideoPlayer
