import { useRef, useState } from 'react'
import { Tooltip, FloatButton } from 'antd'
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'

const PremiumInvitationMusicPlayer = () => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
        setIsPlaying(true)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/assets/thousand-years.mp3" loop preload="auto" />

      <Tooltip title={isPlaying ? 'Pausar música' : 'Reproducir música'} placement="left">
        <FloatButton
          icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          type="primary"
          style={{
            position: 'fixed',
            top: '50%',
            right: 24,
            transform: 'translateY(-50%)',
            zIndex: 1000
          }}
          onClick={toggleAudio}
        />
      </Tooltip>
    </>
  )
}

export default PremiumInvitationMusicPlayer
