import { useState } from "react"
import { Carousel, Card, Typography, Image, Upload, Button, Row, Col, Popconfirm, Empty } from "antd"
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const PremiumInvitationCarousel = ({ isEditing, onDataChange }) => {
  const [carouselImages, setCarouselImages] = useState([
    { src: "/assets/carousel1.jpg", alt: "Recuerdo 1" },
    { src: "/assets/carousel2.jpeg", alt: "Recuerdo 2" },
    { src: "/assets/carousel3.webp", alt: "Recuerdo 3" },
    { src: "/assets/carousel4.webp", alt: "Recuerdo 4" }
  ])

  const [title, setTitle] = useState("Recuerdos Especiales")
  const [subtitle, setSubtitle] = useState("Un vistazo a los momentos que nos han traído hasta aquí")

  const updateParent = (images) => {
    setCarouselImages(images)
    onDataChange?.({
      images,
      title,
      subtitle
    })
  }

  const handleImageChange = (index) => (file) => {
    const newUrl = URL.createObjectURL(file)
    const updatedImages = [...carouselImages]
    updatedImages[index] = { src: newUrl, alt: `Recuerdo ${index + 1}`, file }
    updateParent(updatedImages)
    return false
  }

  const handleDeleteImage = (index) => {
    const updated = [...carouselImages]
    updated[index] = {} // Mantén el slot, pero sin imagen
    updateParent(updated)
  }

  const handleTitleChange = (val) => {
    setTitle(val)
    onDataChange?.({ images: carouselImages, title: val, subtitle })
  }

  const handleSubtitleChange = (val) => {
    setSubtitle(val)
    onDataChange?.({ images: carouselImages, title, subtitle: val })
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Title
          level={2}
          style={{ color: '#4c4c4c', fontWeight: 'bold' }}
          editable={isEditing ? {
            triggerType: ['icon', 'text'],
            onChange: handleTitleChange
          } : false}
        >
          {title}
        </Title>
        <Text
          style={{ fontSize: '18px', color: '#7f8c8d' }}
          editable={isEditing ? {
            triggerType: ['icon', 'text'],
            onChange: handleSubtitleChange
          } : false}
        >
          {subtitle}
        </Text>
      </div>

      <Carousel arrows autoplay>
        {carouselImages.filter(img => img.src).length > 0 ? (
          carouselImages.map((image, index) => (
            image.src && (
              <div key={index}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  preview={false}
                  width="100%"
                  style={{ objectFit: 'cover', borderRadius: '10px', maxHeight: "600px" }}
                />
              </div>
            )
          ))
        ) : (
          <div style={{ padding: '40px 0' }}>
            <Empty description="No hay imágenes" />
          </div>
        )}
      </Carousel>

      {isEditing && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Col style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: '36px', color: '#7f8c8d' }}>
              Cambiar imágenes
            </Text>
          </Col>
          <Row gutter={[16, 16]}>
            {carouselImages.map((image, index) => (
              <Col xs={24} md={12} xl={6} key={index}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Upload
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={handleImageChange(index)}
                      className="upload-full-width"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        size="small"
                        type="primary"
                        block
                      >
                        Imagen {index + 1}
                      </Button>
                    </Upload>
                  </Col>
                  <Col span={12}>
                    {image.src && (
                      <Popconfirm
                        title="¿Eliminar esta imagen?"
                        onConfirm={() => handleDeleteImage(index)}
                        okText="Sí"
                        cancelText="No"
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          type="primary"
                          size="small"
                          danger
                          block
                        >
                          Eliminar
                        </Button>
                      </Popconfirm>
                    )}
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  )
}

export default PremiumInvitationCarousel
