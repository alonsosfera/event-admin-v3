import { Layout, Typography, Card, Collapse, Button, Divider, Row, Col, Upload, Progress, Modal, Spin, ColorPicker, Space } from 'antd'
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
   
  const getNextAvailableNumber = (baseId, list) => {
    const existingNumbers = list
      .filter(id => id.startsWith(baseId))
      .map(id => {
        const match = id.match(/-(\d+)$/)
        return match ? parseInt(match[1]) : 0
      })
    return Math.max(0, ...existingNumbers) + 1
  }

  const handleDragEnd = ({ source, destination, draggableId }) => {
  if (!destination || draggableId === 'cover') return

  const isSameList = source.droppableId === destination.droppableId
  const getList = (id) => id === 'active' ? activeSectionOrder : inactiveSectionOrder
  const setList = (id) => id === 'active' ? setActiveSectionOrder : setInactiveSectionOrder

  const sourceList = [...getList(source.droppableId)]
  const destinationList = isSameList ? sourceList : [...getList(destination.droppableId)]

  const baseId = draggableId.split('-')[0]
  const isRepeatableSection = ['carousel', 'video', 'family'].includes(baseId)

  if (!isRepeatableSection) {
    // No repetibles: sólo mover sin duplicar
    const [moved] = sourceList.splice(source.index, 1)
    destinationList.splice(destination.index, 0, moved)
  } else {
    if (source.droppableId === 'active' && destination.droppableId === 'inactive') {
      // Solo BORRAR si va de activas a disponibles (drop en inactive)
      sourceList.splice(source.index, 1)
    } else if (source.droppableId === 'inactive' && destination.droppableId === 'active') {
      // Solo AGREGAR si va de disponibles a activas
      const nextNumber = getNextAvailableNumber(baseId, destinationList)
      const newSectionId = `${baseId}-${nextNumber}`
      destinationList.splice(destination.index, 0, newSectionId)
    } else if (isSameList) {
      // Si se mueve dentro del mismo listado, solo reordenar
      const [moved] = sourceList.splice(source.index, 1)
      destinationList.splice(destination.index, 0, moved)
    }
  }

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
              const baseId = id.split('-')[0]
              const section = sections.find(s => s.id === baseId)
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

              if (baseId === 'cover') {
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

              const label = id.includes('-') 
                ? `${section.label} ${id.split('-')[1]}`
                : section.label

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
                      <Text strong>{label}</Text>
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
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Fondo general</Text>
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
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Fondo de las secciones</Text>
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
        width={340}
      >
        <Row align="middle" justify="center" gutter={32}>
          <Col>
            <Progress
              type="circle"
              percent={uploadProgress}
              status="active"
              strokeColor="#1890ff"
            />
          </Col>
          <Col>
            <Space direction="vertical" align="center">
              <Spin size="large" />
              <Typography.Text style={{ fontSize: 16, color: '#555' }}>
                Guardando...
              </Typography.Text>
            </Space>
          </Col>
        </Row>
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
