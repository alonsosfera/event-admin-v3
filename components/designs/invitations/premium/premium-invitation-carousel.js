import { useState } from "react"
import { Carousel, Typography, Image, Upload, Button, Row, Col, Card, Empty } from "antd"
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"

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

  const handleImageChange = ({ fileList }) => {
    const updatedImages = [...carouselImages]
    if (fileList.length > 0) {
      updatedImages.push({ src: fileList[0].url || URL.createObjectURL(fileList[0].originFileObj), alt: `Recuerdo ${carouselImages.length + 1}`, file: fileList[0] })
    }
    updateParent(updatedImages)
  }

  const handleDeleteImage = (index) => {
    const updated = [...carouselImages]
    updated.splice(index, 1)
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
          editable={isEditing ? { triggerType: ['icon', 'text'], onChange: handleTitleChange } : false}
        >
          {title}
        </Title>
        <Text
          style={{ fontSize: '18px', color: '#7f8c8d' }}
          editable={isEditing ? { triggerType: ['icon', 'text'], onChange: handleSubtitleChange } : false}
        >
          {subtitle}
        </Text>
      </div>

      <Carousel arrows autoplay>
        {carouselImages.length > 0 ? (
          carouselImages.map((image, index) => (
            <div key={index}>
              <Image
                src={image.src}
                alt={image.alt}
                preview={false}
                width="100%"
                style={{ objectFit: 'cover', borderRadius: '10px', maxHeight: "600px" }}
              />
            </div>
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
              Cambiar imagen
            </Text>
          </Col>
          <Row gutter={[16, 16]}>
            {carouselImages.map((image, index) => (
              <Col xs={24} md={12} xl={6} key={index}>
                <Card
                  hoverable
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '150px',
                  }}
                  cover={
                    <Image
                      alt={image.alt}
                      src={image.src}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  }
                  onMouseEnter={(e) => {
                    const deleteButton = e.currentTarget.querySelector('.delete-button')
                    if (deleteButton) {
                      deleteButton.style.display = 'block'
                    }
                  }}
                  onMouseLeave={(e) => {
                    const deleteButton = e.currentTarget.querySelector('.delete-button')
                    if (deleteButton) {
                      deleteButton.style.display = 'none'
                    }
                  }}
                >
                  <div
                    className="delete-button"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      padding: '5px',
                      display: 'none',
                    }}
                    onClick={() => handleDeleteImage(index)}
                  >
                    <DeleteOutlined />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Upload
                accept="image/*"
                showUploadList={false}
                onChange={handleImageChange}
                beforeUpload={() => false}
              >
                <Button
                  icon={<PlusOutlined />}
                  size="small"
                  type="primary"
                  block
                >
                  Subir imagen
                </Button>
              </Upload>
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}

export default PremiumInvitationCarousel
