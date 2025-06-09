'use client'

import React from 'react'
import ReactPlayer from 'react-player'

interface Props {
  src: string
}

export default function CustomVideoPlayer({ src }: Props) {
  return (
    <div
      className='player-wrapper'
      style={{ position: 'relative', paddingTop: '56.25%' }}
    >
      <ReactPlayer
        url={src}
        controls
        width='100%'
        height='100%'
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  )
}
