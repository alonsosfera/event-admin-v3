import { useState } from "react"
import { Row, Col, Card, Typography, Image, Upload, Button } from "antd"
import { UploadOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const PremiumInvitationPlace = ({ isEditing, onDataChange, sectionData, globalTitleColor, globalSubtitleColor, globalTypography }) => {
  const [data, setData] = useState({
    section1Title: sectionData?.section1Title || "Ceremonia",
    section1Title2: sectionData?.section1Title2 || "Basílica de Guadalupe Monterrey",
    section1Subtitle1: sectionData?.section1Subtitle1 || "20 de junio de 2025 18:00 hrs",
    section1Subtitle2: sectionData?.section1Subtitle2 || "Guanajuato 715, Independencia, 64720 Monterrey, N.L.",
    section1Image: sectionData?.section1Image || "/assets/basílica.jpg",

    section2Title: sectionData?.section2Title || "Recepción",
    section2Title2: sectionData?.section2Title2 || "Salón La Joya",
    section2Subtitle1: sectionData?.section2Subtitle1 || "20 de junio de 2025 20:00 hrs",
    section2Subtitle2: sectionData?.section2Subtitle2 || "Úrsulo Galván #27, Col. Desarrollo Urbano Quetzalcóatl, 09700 Ciudad de México, CDMX",
    section2Image: sectionData?.section2Image || "/assets/La_Joya.jpg",
  })

  const updateData = (key, value) => {
    const updated = { ...data, [key]: value }
    setData(updated)
    onDataChange?.(updated)
  }

  const handleImageChange = (key) => {
    return (file) => {
      const newUrl = URL.createObjectURL(file)
      setData((prev) => {
        const updated = {
          ...prev,
          [key]: newUrl,
          [`${key}File`]: file,
        }
        onDataChange?.(updated)
        return updated
      })
      return false
    }
  }
  
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Title level={1} style={{ color: globalTitleColor, marginBottom: '10px', fontWeight: 'bold', fontFamily: globalTypography }}>
              ¿Dónde & Cuándo?
            </Title>
          </Col>

          <Col xs={24} sm={12}>
            <Title level={3} style={{ color: globalTitleColor, marginBottom: '10px', fontWeight: 'bold', fontFamily: globalTypography }}
              editable={isEditing ? {
              triggerType: ['icon', 'text'],
              onChange: (val) => updateData("section1Title", val),
            } : false}>
              {data.section1Title}
            </Title>
            <Image
              preview={false}
              src={data.section1Image}
              alt="ceremonia"
              style={{ borderRadius: "8px" }}
            />
            {isEditing && (
              <div style={{ marginTop: 20, marginBottom: 20}}>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleImageChange("section1Image")}
                >
                  <Button icon={<UploadOutlined />} size="small" type="primary">
                    Cargar imagen
                  </Button>
                </Upload>
              </div>
            )}
            <Title
              level={3}
              editable={isEditing ? {
                triggerType: ['icon', 'text'],
                onChange: (val) => updateData("section1Title2", val),
              } : false}
              style={{ color: globalTitleColor, marginBottom: '10px', fontWeight: 'bold', fontFamily: globalTypography }}
            >
              {data.section1Title2}
            </Title>
            <Text style={{ fontSize: '18px', color: globalSubtitleColor, fontWeight: "bold", fontFamily: globalTypography }}>Fecha: </Text>
            <Text
              editable={isEditing ? {
                triggerType: ['icon', 'text'],
                onChange: (val) => updateData("section1Subtitle1", val),
              } : false}
              style={{ fontSize: '18px', color: globalSubtitleColor, fontFamily: globalTypography }}
            >
              {data.section1Subtitle1}
            </Text>
            <br />
            <Text style={{ fontSize: '18px', color: globalSubtitleColor, fontWeight: "bold", fontFamily: globalTypography }}>Dirección: </Text>
            <Text
              editable={isEditing ? {
                triggerType: ['icon', 'text'],
                onChange: (val) => updateData("section1Subtitle2", val),
              } : false}
              style={{ fontSize: '18px', color: globalSubtitleColor, fontFamily: globalTypography }}
            >
              {data.section1Subtitle2}
            </Text>
          </Col>

          <Col xs={24} sm={12}>
            <Title level={3} style={{ color: globalTitleColor, marginBottom: '10px', fontWeight: 'bold', fontFamily: globalTypography }}
                editable={isEditing ? {
                triggerType: ['icon', 'text'],
                onChange: (val) => updateData("section2Title", val),
              } : false}>
                {data.section2Title}
            </Title>
            <Image
              preview={false}
              src={data.section2Image}
              alt="recepción"
              style={{ borderRadius: "8px" }}
            />
            {isEditing && (
              <div style={{ marginTop: 20, marginBottom: 20}}>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleImageChange("section2Image")}
                >
                  <Button icon={<UploadOutlined />} size="small" type="primary">
                    Cargar imagen
                  </Button>
                </Upload>
              </div>
            )}
             <Title
              level={3}
              editable={isEditing ? {
                triggerType: ['icon', 'text'],
                onChange: (val) => updateData("section2Title2", val),
              } : false}
              style={{ color: globalTitleColor, marginBottom: '10px', fontWeight: 'bold', fontFamily: globalTypography }}
            >
              {data.section2Title2}
            </Title>
            <Text style={{ fontSize: '18px', color: globalSubtitleColor, fontWeight: "bold", fontFamily: globalTypography }}>Fecha: </Text>
            <Text
              editable={isEditing ? {
                triggerType: ['icon', 'text'],
                onChange: (val) => updateData("section2Subtitle1", val),
              } : false}
              style={{ fontSize: '18px', color: globalSubtitleColor, fontFamily: globalTypography }}
            >
              {data.section2Subtitle1}
            </Text>
            <br />
            <Text style={{ fontSize: '18px', color: globalSubtitleColor, fontWeight: "bold", fontFamily: globalTypography }}>Dirección: </Text>
            <Text
              editable={isEditing ? {
                triggerType: ['icon', 'text'],
                onChange: (val) => updateData("section2Subtitle2", val),
              } : false}
              style={{ fontSize: '18px', color: globalSubtitleColor, fontFamily: globalTypography }}
            >
              {data.section2Subtitle2}
            </Text>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default PremiumInvitationPlace
