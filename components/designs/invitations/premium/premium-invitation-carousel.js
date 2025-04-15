import { useState } from "react"
import { Carousel, Card, Typography, Image, Upload, Button, Row, Col, Popconfirm } from "antd"
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const PremiumInvitationCarousel = ({ isEditing, onDataChange }) => {
  const [carouselImages, setCarouselImages] = useState([
    { src: "/assets/carousel1.jpg", alt: "Recuerdo 1" },
    { src: "/assets/carousel2.jpeg", alt: "Recuerdo 2" },
    { src: "/assets/carousel3.webp", alt: "Recuerdo 3" },
    { src: "/assets/carousel4.webp", alt: "Recuerdo 4" }
  ])

  const updateParent = (images) => {
    setCarouselImages(images)
    onDataChange?.(images)
  }

  const handleImageChange = (index) => (file) => {
    const newUrl = URL.createObjectURL(file)
    const updatedImages = [...carouselImages]
    updatedImages[index] = { src: newUrl, alt: `Recuerdo ${index + 1}`, file }
    updateParent(updatedImages)
    return false
  }

  const handleAddImage = (file) => {
    const newUrl = URL.createObjectURL(file)
    const newImage = {
      src: newUrl,
      alt: `Recuerdo ${carouselImages.length + 1}`,
      file
    }
    updateParent([...carouselImages, newImage])
    return false
  }

  const handleDeleteImage = (index) => {
    const updated = [...carouselImages]
    updated.splice(index, 1)
    updateParent(updated)
  }

  return (
    <Card className='card-invitation'>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Title level={2} style={{ color: '#4c4c4c', fontWeight: 'bold' }}>
          Recuerdos Especiales
        </Title>
        <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
          Un vistazo a los momentos que nos han traído hasta aquí
        </Text>
      </div>

      <Carousel arrows autoplay>
        {carouselImages.map((image, index) => (
          <div key={index}>
            <Image
              src={image.src}
              alt={image.alt}
              preview={false}
              width="100%"
              style={{ objectFit: 'cover', borderRadius: '10px', maxHeight: "600px" }}
            />
          </div>
        ))}
      </Carousel>

      {isEditing && (
        <div style={{ marginTop: 20, textAlign: "center", }}>
          <Col style={{ marginBottom: 20 }}>
          <Text  style={{ fontSize: '36px', color: '#7f8c8d' }}>
            Cambiar imagenes
          </Text>
          </Col>
          <Row gutter={[16, 16]}>
            {carouselImages.map((_, index) => (
              <Col xs={24} md={12} xl={6} key={index}>
                <Row gutter={8}>
                  <Col span={12} className="buttons-carousel">
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
                        style={{ width: "100%" }}
                      >
                        Imagen {index + 1}
                      </Button>
                    </Upload>
                  </Col>
                  <Col span={12}>
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
                        style={{ width: "100%" }}
                        block
                      >
                        Eliminar
                      </Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Card>
  )
}

export default PremiumInvitationCarousel
