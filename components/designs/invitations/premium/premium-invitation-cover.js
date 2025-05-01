import { useState } from "react"
import { Image, Typography, Button, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const PremiumInvitationCover = ({ isEditing, onDataChange, sectionData }) => {
  
  const [titleText, setTitleText] = useState(sectionData?.titleText || "Carla & Luis")
  const [subtitleText, setSubtitleText] = useState(sectionData?.subtitleText || "¡Estás invitado a compartir este día tan especial con nosotros!")
  const [imageUrl, setImageUrl] = useState(sectionData?.image || "/assets/boda2.webp")

  console.log("cover ", imageUrl);

  const handleTitleChange = (value) => {
    setTitleText(value)
    onDataChange?.({ titleText: value, subtitleText })
  }

  const handleSubtitleChange = (value) => {
    setSubtitleText(value)
    onDataChange?.({ titleText, subtitleText: value })
  }

  const handleImageChange = (file) => {
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    onDataChange?.({ titleText, subtitleText, imageUrl: url, imageFile: file })
    return false 
  }

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
              color: 'green',
              margin: 0,
              '@media (maxWidth: 768px)': {
                fontSize: '30px',
              }
            }}
          >
            {titleText}
          </Title>
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
              color: '#8f8f8f',
              display: 'block',
              '@media (maxWidth: 768px)': {
                fontSize: '16px',
              }
            }}
          >
            {subtitleText}
          </Text>
        </div>

        <div className="text">
          <div className="wp-block-uagb-countdown">
            <div className="countdown-container">
              <div className="countdown-item">
                <span className="countdown-number" id="days">10</span>
                <span className="countdown-label">Días</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number" id="hours">20</span>
                <span className="countdown-label">Horas</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number" id="minutes">30</span>
                <span className="countdown-label">Minutos</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number" id="seconds">40</span>
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
