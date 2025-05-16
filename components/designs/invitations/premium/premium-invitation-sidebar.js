import { Layout, Typography, Card, Collapse, Button, Divider, Row, Col, Upload, Progress, Modal, Spin, ColorPicker } from 'antd'
import { AudioOutlined, PictureOutlined, AppstoreAddOutlined, LinkOutlined } from '@ant-design/icons'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const FontPicker = dynamic(() => import('@/components/shared/font-picker'), { ssr: false })

const { Sider } = Layout
const { Text, Title } = Typography

const InvitationPremiumSideBar = ({
  sections,
  activeSectionOrder,
  setActiveSectionOrder,
  inactiveSectionOrder,
  setInactiveSectionOrder,
  onDataChange,
  setIsPlaying,
  saveInvitation,
  isUploading,
  uploadProgress,
  setHasUnsavedChanges,
  globalTypography,
  globalTitleColor,
  globalSubtitleColor,
  backgroundImage,
  cardBackgroundImage
}) => {
  const [isClient, setIsClient] = useState(false)
  const [titleColor, setTitleColor] = useState(globalTitleColor || '#2c3e50')
  const [subtitleColor, setSubtitleColor] = useState(globalSubtitleColor || '#7f8c8d')
  const [fontFamily, setFontFamily] = useState(globalTypography || 'Poppins')

  useEffect(() => setIsClient(true), [])

  const scrollToSection = (id) => {
    const el = document.getElementById(`section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleUpload = (type) => {
    return (file) => {
      const url = URL.createObjectURL(file)

      if (type === 'background') {
        onDataChange?.({ backgroundImage: url, backgroundImageFile: file })
      }

      if (type === 'card') {
        onDataChange?.({ cardBackgroundImage: url, cardBackgroundImageFile: file })
      }

      if (type === 'audio') {
        onDataChange?.({ musicUrl: url, musicFile: file })
        setIsPlaying(true)
      }

      return false
    }
  }

  const handleDragEnd = ({ source, destination, draggableId }) => {
    if (!destination || draggableId === 'cover') return

    const isSameList = source.droppableId === destination.droppableId
    const getList = (id) => id === 'active' ? activeSectionOrder : inactiveSectionOrder
    const setList = (id) => id === 'active' ? setActiveSectionOrder : setInactiveSectionOrder

    const sourceList = [...getList(source.droppableId)]
    const destinationList = isSameList ? sourceList : [...getList(destination.droppableId)]

    const [moved] = sourceList.splice(source.index, 1)
    let targetIndex = destination.index

    if (destination.droppableId === 'active' && targetIndex === 0) {
      targetIndex = 1
    }

    destinationList.splice(targetIndex, 0, moved)

    if (destination.droppableId === 'active') {
      const coverIndex = destinationList.indexOf('cover')
      if (coverIndex > 0) {
        destinationList.splice(coverIndex, 1)
        destinationList.unshift('cover')
      }
    }

    if (isSameList) {
      setList(destination.droppableId)(destinationList)
    } else {
      setList(source.droppableId)(sourceList)
      setList(destination.droppableId)(destinationList)
    }

    if (destination.droppableId === 'active') {
      setTimeout(() => scrollToSection(draggableId), 300)
    }

    setHasUnsavedChanges(true);
  }

  const handleTitleColorChange = (color) => {
    const newColor = color.toHexString()
    setTitleColor(newColor)
    onDataChange?.({ globalTitleColor: newColor })
    setHasUnsavedChanges(true)
  }

  const handleSubtitleColorChange = (color) => {
    const newColor = color.toHexString()
    setSubtitleColor(newColor)
    onDataChange?.({ globalSubtitleColor: newColor })
    setHasUnsavedChanges(true)
  }

  const handleFontFamilyChange = (newFontFamily) => {
    setFontFamily(newFontFamily)
    onDataChange?.({ globalTypography: newFontFamily })
    setHasUnsavedChanges(true)
  }

  const handleBackgroundColorChange = (color) => {
    const newColor = color.toHexString()
    onDataChange?.({ backgroundImage: newColor })
    setHasUnsavedChanges(true)
  }

  const handleCardBackgroundColorChange = (color) => {
    const newColor = color.toHexString()
    onDataChange?.({ cardBackgroundImage: newColor })
    setHasUnsavedChanges(true)
  }

  const renderDroppableList = (droppableId, title, list) => (
    <div style={{ marginBottom: 24 }}>
      <Title level={5} style={{ marginBottom: 8, fontSize: 14 }}>{title}</Title>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              minHeight: 1
            }}
          >
            {list.map((id, index) => {
              const section = sections.find(s => s.id === id)
              if (!section) return null

              const cardStyle = {
                width: '100%',
                maxWidth: '210px',
                fontSize: 11,
                padding: '2px 6px',
                margin: '0 auto'
              }

              const cardProps = {
                onClick: () => scrollToSection(id),
                size: "small",
                hoverable: true,
                styles: { body: { padding: '6px 8px' } },
                fontSize: 11
              }

              if (id === 'cover') {
                return (
                  <Card
                    key={id}
                    {...cardProps}
                    style={{
                      ...cardStyle,
                      background: '#f0f0f0',
                      border: '1px dashed #ccc',
                      cursor: 'default'
                    }}
                  >
                    <Text strong>{section.label}</Text>
                  </Card>
                )
              }

              return (
                <Draggable draggableId={id} index={index} key={id}>
                  {(provided, snapshot) => (
                    <Card
                      key={id}
                      {...cardProps}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...cardStyle,
                        userSelect: 'none',
                        boxShadow: snapshot.isDragging
                          ? '0 2px 8px rgba(0,0,0,0.1)'
                          : '0 1px 4px rgba(0,0,0,0.05)',
                        background: '#fff',
                        ...provided.draggableProps.style
                      }}
                    >
                      <Text strong>{section.label}</Text>
                    </Card>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )

  const collapseItems = [
    {
      key: "1",
      label: "🎨 Fondo y canción",
      children: (
        <div className='collapse-buttons' style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Upload
            accept="audio/*"
            showUploadList={false}
            beforeUpload={handleUpload('audio')}
            className="upload-full-width"
          >
            <Button icon={<AudioOutlined />} block>
              Elegir Canción
            </Button>
          </Upload>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>fondo general</Text>
            <div style={{ display: 'flex', justifyContent: "center", gap: 8 }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handleUpload('background')}
                className="upload-full-width"
            >
              <Button icon={<PictureOutlined />} block>
                Imagen
              </Button>
            </Upload>
              <ColorPicker
                value={backgroundImage}
                onChange={handleBackgroundColorChange}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Color de fondo de cards</Text>
            <div style={{ display: 'flex', justifyContent: "center", gap: 8 }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handleUpload('card')}
                className="upload-full-width"
            >
              <Button icon={<AppstoreAddOutlined />} block>
                Imagen
              </Button>
            </Upload>
              <ColorPicker
                value={cardBackgroundImage}
                onChange={handleCardBackgroundColorChange}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      key: "2",
      label: "🎨 Colores y tipografía",
      children: (
        <div className='collapse-buttons' style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Color de títulos</Text>
            <ColorPicker
              value={titleColor}
              onChange={handleTitleColorChange}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Color de subtítulos</Text>
            <ColorPicker
              value={subtitleColor}
              onChange={handleSubtitleColorChange}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Tipo de letra
              &nbsp;
              <a
                href="https://fonts.google.com/"
                target="_blank"
                rel="noreferrer"><LinkOutlined />
              </a>
            </Text>
            <div style={{ display: 'flex', justifyContent: "center", gap: 8 }}>
            <FontPicker
              value={fontFamily}
              onChange={handleFontFamilyChange}
            />
            </div>
          </div>
        </div>
      )
    },
    {
      key: "2",
      label: "🎨 Colores y tipografía",
      children: (
        <div className='collapse-buttons' style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Color de títulos</Text>
            <ColorPicker
              value={titleColor}
              onChange={handleTitleColorChange}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Color de subtítulos</Text>
            <ColorPicker
              value={subtitleColor}
              onChange={handleSubtitleColorChange}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Tipo de letra
              &nbsp;
              <a
                href="https://fonts.google.com/"
                target="_blank"
                rel="noreferrer"><LinkOutlined />
              </a>
            </Text>
            <div style={{ display: 'flex', justifyContent: "center", gap: 8 }}>
            <FontPicker
              value={fontFamily}
              onChange={handleFontFamilyChange}
            />
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <Sider
      width={260}
      theme='light'
      style={{
        padding: '16px 12px',
        height: '100vh',
        overflowY: 'auto',
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: '1px solid #e5e5e5'
      }}
    >
      <Title level={4} style={{ marginBottom: 16, textAlign: 'center', fontSize: 16 }}>
        Personalizar Secciones
      </Title>

      <Text
        type="secondary"
        style={{
          display: 'block',
          fontSize: 11,
          textAlign: 'center',
          marginBottom: 16
        }}
      >
        Arrastra para mover secciones
      </Text>

      {isClient && (
        <DragDropContext onDragEnd={handleDragEnd}>
          {renderDroppableList('active', '📌 Activas', activeSectionOrder)}
          {renderDroppableList('inactive', '📂 Disponibles', inactiveSectionOrder)}
        </DragDropContext>
      )}

      <Collapse ghost items={collapseItems} />

      <Modal
        open={isUploading}
        closable={false}
        footer={null}
        centered
        maskClosable={false}
        keyboard={false}
        style={{ textAlign: 'center', padding: 30 }}
      >
      <Spin tip="Subiendo archivos..." size="large">
        <div style={{ marginTop: 20 }}>
          <Progress
            type="circle"
            percent={uploadProgress}
            status="active"
            strokeColor="#1890ff"
          />
        </div>
      </Spin>
    </Modal>



      <Row gutter={16} style={{ marginTop: 16, marginBottom: "16px" }}>
        <Col sm={24}>
          <Button type="primary" style={{ width: "100%" }} onClick={saveInvitation} disabled={isUploading}>
            {isUploading ? 'Guardando...' : 'Guardar'}
          </Button>
        </Col>
      </Row>
      <Divider />
    </Sider>
  )
}

export default InvitationPremiumSideBar
