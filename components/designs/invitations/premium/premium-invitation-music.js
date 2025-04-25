import { useRef, useEffect } from 'react'
import { Tooltip, FloatButton } from 'antd'
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'

const PremiumInvitationMusicPlayer = ({ musicUrl, isPlaying, setIsPlaying }) => {
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [musicUrl, isPlaying])

  const toggleAudio = () => {
    setIsPlaying(prev => !prev)
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />

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
