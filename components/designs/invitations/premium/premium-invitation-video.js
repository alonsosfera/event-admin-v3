import { useState, useEffect } from "react"
import { Input, Typography, Row, Col, Alert, Flex } from "antd"
import { CheckCircleTwoTone } from "@ant-design/icons"

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
  const [videoId, setVideoId] = useState("")
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (sectionData?.videoId) {
      setVideoId(sectionData.videoId)
    } else {
      setVideoId("7TWzV05kQ4w")
    }
  }, [sectionData])

  const handleChange = (e) => {
    const input = e.target.value
    const extractedId = extractYouTubeId(input)
    setVideoId(extractedId)
    onDataChange?.({ videoId: extractedId })
    setShowSaved(true)
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`

  return (
    <>
      {isEditing && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Row gutter={[16, 16]}>
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
            <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "15px" }}>
            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 24 }} />
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
