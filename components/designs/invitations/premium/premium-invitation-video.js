import { useState, useEffect } from "react"
import { Input, Typography, Row, Col, Alert } from "antd"

const { Text } = Typography

const extractYouTubeId = (url) => {
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1)
    } else if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v")
    }
  } catch {
    return url
  }
  return url
}

const PremiumInvitationVideo = ({ isEditing, onDataChange, sectionData }) => {
  const [videoInput, setVideoInput] = useState("https://www.youtube.com/watch?v=7TWzV05kQ4w")
  const [showSaved, setShowSaved] = useState(false)

  const handleChange = (e) => {
    const input = e.target.value
    setVideoInput(input)

    const extractedId = extractYouTubeId(input)
    onDataChange?.({ videoId: extractedId })

    setShowSaved(true)
  }

  const videoId = extractYouTubeId(videoInput)
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`

  useEffect(() => {
    if (sectionData?.videoId) {
      const fullUrl = `https://www.youtube.com/watch?v=${sectionData.videoId}`
      setVideoInput(fullUrl)
    } else {
      setVideoInput("https://www.youtube.com/watch?v=7TWzV05kQ4w")
    }
  }, [sectionData])
  

  return (
    <>
      {isEditing && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Row gutter={[16,16]}>
            <Col md={24} style={{ display: 'flex', justifyContent: 'center' }}>
              <Alert
                showIcon
                type="info"
                message="Agrega tu link de youtube"
                style={{ fontSize: "12px", padding: "8px 16px", marginBottom: "4px", maxWidth: 500, width: "100%" }}
              />
            </Col>
            <Col md={24}>
            <Input
              placeholder="Ingresa el link del video de YouTube"
              value={`https://www.youtube.com/watch?v=${videoId}`}
              onChange={handleChange}
              style={{ maxWidth: 500 }}
              />
            </Col>
          </Row>
          {showSaved && (
            <Row style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
              <Text type="success" style={{ marginTop: 5, display: 'block' }}>
                ¡Link guardado!
              </Text>
              
            </Row>
            
          )}
        </div>
      )}

      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        <iframe
          src={embedUrl}
          allow="clipboard-write; encrypted-media; gyroscope;"
          allowFullScreen
          title="Video de YouTube"
          style={{
            border: "none",
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    </>
  )
}

export default PremiumInvitationVideo
