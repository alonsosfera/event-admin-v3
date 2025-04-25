import { useState } from "react";
import { Carousel, Typography, Image, Upload, Row, Col, Empty, Button } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const PremiumInvitationCarousel = ({ isEditing, onDataChange }) => {
  const [carouselImages, setCarouselImages] = useState([
    { src: "/assets/carousel1.jpg", alt: "Recuerdo 1" },
    { src: "/assets/carousel2.jpeg", alt: "Recuerdo 2" },
    { src: "/assets/carousel3.webp", alt: "Recuerdo 3" },
    { src: "/assets/carousel4.webp", alt: "Recuerdo 4" }
  ]);

  const [title, setTitle] = useState("Recuerdos Especiales");
  const [subtitle, setSubtitle] = useState("Un vistazo a los momentos que nos han traído hasta aquí");

  const updateParent = (images) => {
    setCarouselImages(images);
    onDataChange?.({
      images,
      title,
      subtitle,
    });
  };

  const handleEditImage = (index) => (file) => {
    const newUrl = URL.createObjectURL(file)
    const updatedImages = [...carouselImages]
    updatedImages[index] = { src: newUrl, alt: `Recuerdo ${index + 1}`, file }
    updateParent(updatedImages)
    return false
  }

  const handleDeleteImage = (index) => {
    const updated = [...carouselImages];
    updated.splice(index, 1);
    updateParent(updated);
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    onDataChange?.({ images: carouselImages, title: val, subtitle });
  };

  const handleSubtitleChange = (val) => {
    setSubtitle(val);
    onDataChange?.({ images: carouselImages, title, subtitle: val });
  };

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

      <Carousel arrows autoplay effect="fade">
        {carouselImages.length > 0 ? (
          carouselImages.map((image, index) => (
            <div className="image-container" key={index} style={{ position: "relative" }}>
              <Image
                src={image.src}
                alt={image.alt}
                preview={false}
                width="100%"
                style={{ objectFit: "cover", borderRadius: "10px", maxHeight: "600px" }}
              />
              {isEditing && (
                <>
                  <div
                    className="delete-button"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <DeleteOutlined style={{ fontSize: "30px", color: "#fff" }} />
                  </div>
                  <div className="change-button">
                    <Upload
                      accept="image/*"
                      showUploadList={false}
                      listType="picture"
                      beforeUpload={handleEditImage(index)}
                    >
                      <EditOutlined style={{ fontSize: "30px", color: "#fff" }} />
                    </Upload>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div style={{ padding: "40px 0" }}>
            <Empty description="No hay imágenes" />
          </div>
        )}
      </Carousel>
      <Row justify="center" style={{ marginTop: 20 }}>
        <Col xs={24} sm={22} md={20} lg={16}>
          <Upload
            accept="image/*"
            beforeUpload={handleEditImage(carouselImages.length)}
          >
            <Button type="primary">
              <PlusOutlined />
              Agregar Fotos
            </Button>
          </Upload>
        </Col>
      </Row>
    </>
  );
};

export default PremiumInvitationCarousel;

