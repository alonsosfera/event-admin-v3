import { useState, useEffect } from "react"
import { Image, Typography, Button, Upload, ColorPicker } from "antd"
import { UploadOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const PremiumInvitationCover = ({ isEditing, onDataChange, sectionData, eventDate }) => {
  
  const [titleText, setTitleText] = useState(sectionData?.titleText || "Carla & Luis")
  const [subtitleText, setSubtitleText] = useState(sectionData?.subtitleText || "¡Estás invitado a compartir este día tan especial con nosotros!")
  const [imageUrl, setImageUrl] = useState(sectionData?.image || "/assets/boda2.webp")
  const [titleColor, setTitleColor] = useState(sectionData?.titleColor || "#1677ff")
  const [subtitleColor, setSubtitleColor] = useState(sectionData?.subtitleColor || "#8f8f8f")
  
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  
  const targetDate = new Date(eventDate).getTime()

  const handleTitleChange = (value) => {
    setTitleText(value)
    onDataChange?.({ titleText: value, subtitleText, titleColor, subtitleColor })
  }

  const handleSubtitleChange = (value) => {
    setSubtitleText(value)
    onDataChange?.({ titleText, subtitleText: value, titleColor, subtitleColor })
  }

  const handleImageChange = (file) => {
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    onDataChange?.({ titleText, subtitleText, imageUrl: url, imageFile: file, titleColor, subtitleColor })
    return false 
  }

  const handleTitleColorChange = (color) => {
    const newColor = color.toHexString()
    setTitleColor(newColor)
    onDataChange?.({ titleText, subtitleText, titleColor: newColor, subtitleColor })
  }

  const handleSubtitleColorChange = (color) => {
    const newColor = color.toHexString()
    setSubtitleColor(newColor)
    onDataChange?.({ titleText, subtitleText, titleColor, subtitleColor: newColor })
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime()
      const timeRemaining = targetDate - now

      if (timeRemaining <= 0) {
        clearInterval(intervalId)
      } else {
        const d = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
        const h = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const m = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
        const s = Math.floor((timeRemaining % (1000 * 60)) / 1000)

        setDays(d)
        setHours(h)
        setMinutes(m)
        setSeconds(s)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [targetDate])

  return (
    <>
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <Image
          preview={false}
          src={imageUrl}
          alt="Banner de Boda"
        />
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <Title
            level={1}
            editable={
              isEditing
                ? {
                    triggerType: ['icon', 'text'],
                    onChange: handleTitleChange
                  }
                : false
            }
            style={{
              fontSize: '50px',
              fontWeight: 'bold',
              color: titleColor,
              margin: 0,
              '@media (maxWidth: 768px)': {
                fontSize: '30px',
              }
            }}
          >
            {titleText}
          </Title>
          {isEditing && (
            <ColorPicker
              value={titleColor}
              onChange={handleTitleColorChange}
              size="small"
            />
          )}
        </div>

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <Text
            editable={
              isEditing
                ? {
                    triggerType: ['icon', 'text'],
                    onChange: handleSubtitleChange
                  }
                : false
            }
            style={{
              fontSize: '20px',
              color: subtitleColor,
              display: 'block',
              '@media (maxWidth: 768px)': {
                fontSize: '16px',
              }
            }}
          >
            {subtitleText}
          </Text>
          {isEditing && (
            <ColorPicker
              value={subtitleColor}
              onChange={handleSubtitleColorChange}
              size="small"
            />
          )}
        </div>

        <div className="text">
          <div className="wp-block-uagb-countdown">
            <div className="countdown-container">
              <div className="countdown-item">
                <span className="countdown-number" id="days">{days}</span>
                <span className="countdown-label">Días</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number" id="hours">{hours}</span>
                <span className="countdown-label">Horas</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number" id="minutes">{minutes}</span>
                <span className="countdown-label">Minutos</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number" id="seconds">{seconds}</span>
                <span className="countdown-label">Segundos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div style={{ display: "flex", justifyContent: "center", margin: 20 }}>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => handleImageChange(file)}
          >
            <Button  
              icon={<UploadOutlined />} size="small"
              type="primary">
              Cargar imagen
            </Button>
          </Upload>
        </div>
      )}
    </>
  )
}

export default PremiumInvitationCover
