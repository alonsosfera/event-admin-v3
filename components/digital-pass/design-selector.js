import { Button, Collapse, Upload, Image, Row, Col } from "antd"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"

const pageSize = 12

export const DesignSelector = ({ previewFile, setPreviewFile, activeSource, setActiveSource, selectedDesignId, setSelectedDesignId, 
  setSelectedDesignUrl, allDesigns, handleSelectDesign, currentPage, setCurrentPage, setUpdatedCoordinates }) => {
  const totalPages = Math.ceil((allDesigns || []).length / pageSize)

  const paginatedDesigns = (allDesigns || []).slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  )

  const handleUploadPreview = (file) => {
    const previewUrl = URL.createObjectURL(file)
    setPreviewFile({ file, previewUrl })
    setUpdatedCoordinates([])
    setActiveSource("upload")
    return false
  }

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1)
  }

  return (
    <Collapse style={{ marginTop: 8 }}>
      <Collapse.Panel header="Seleccionar diseño" key="1">
        <Upload
          beforeUpload={handleUploadPreview}
          showUploadList={false}
          accept="image/*">
          <Button type="primary" style={{ marginBottom: 16 }}>
            Cargar nuevo diseño
          </Button>
        </Upload>

        <Row justify="center" align="middle">
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            size="large"
            style={{ marginRight: 16 }}
            onClick={handlePrev}
            disabled={currentPage === 0}
          />

          <Row gutter={[16, 16]} style={{ flex: 1, justifyContent: "center" }}>
            {previewFile?.previewUrl && (
              <Col xs={12} sm={6} md={4}>
                <Image
                  preview={false}
                  src={previewFile.previewUrl}
                  alt="Vista previa subida"
                  onClick={() => {
                    setActiveSource("upload")
                    setSelectedDesignId(null)
                    setSelectedDesignUrl(null)
                    setUpdatedCoordinates([])
                  }}
                  style={{
                    objectFit: "contain",
                    borderRadius: "4px",
                    border: activeSource === "upload" ? "1px solid #1890ff" : "1px solid #f0f0f0",
                    boxShadow: activeSource === "upload" ? "0 0px 30px rgba(24,144,255,0.6)" : "none",
                    cursor: "pointer"
                  }}
                />
              </Col>
            )}

            {paginatedDesigns.map(design => (
              <Col key={design.id} xs={12} sm={6} md={4}>
                <Image
                  onClick={() => handleSelectDesign(design.id)}
                  preview={false}
                  alt={design.fileName}
                  src={design.fileUrl}
                  style={{
                    objectFit: "contain",
                    borderRadius: "4px",
                    border: design.id === selectedDesignId ? "1px solid #1890ff" : "1px solid #f0f0f0",
                    boxShadow: design.id === selectedDesignId ? "0 0px 30px rgba(24,144,255,0.6)" : "none",
                    cursor: "pointer"
                  }}
                />
              </Col>
            ))}
          </Row>

          <Button
            shape="circle"
            icon={<RightOutlined />}
            size="large"
            style={{ marginLeft: 16 }}
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
          />
        </Row>
      </Collapse.Panel>
    </Collapse>
  )
} 