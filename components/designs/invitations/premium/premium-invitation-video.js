import { useState, useEffect } from "react"
import { Card, Input, Typography } from "antd"
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

const PremiumInvitationVideo = ({ isEditing, onDataChange }) => {
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

  return (
    <Card className='card-invitation'>
      {isEditing && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Input
              placeholder="Ingresa el link del video de YouTube"
              value={videoInput}
              onChange={handleChange}
              style={{ maxWidth: 500 }}
            />
            {showSaved && (
              <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 24 }} />
            )}
          </div>
          {showSaved && (
            <Text type="success" style={{ marginTop: 5, display: 'block' }}>
              ¡Link guardado!
            </Text>
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
    </Card>
  )
}

export default PremiumInvitationVideo
