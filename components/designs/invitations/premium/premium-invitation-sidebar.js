import { Layout, Typography, Card, Collapse, Button, Divider, Row, Col, Upload } from 'antd'
import { AudioOutlined, PictureOutlined, AppstoreAddOutlined, UploadOutlined } from '@ant-design/icons'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'

const { Sider } = Layout
const { Text, Title } = Typography

const InvitationPremiumSideBar = ({
  sections,
  activeSectionOrder,
  setActiveSectionOrder,
  inactiveSectionOrder,
  setInactiveSectionOrder,
  onDataChange
}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  const scrollToSection = (id) => {
    const el = document.getElementById(`section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleImageUpload = (type) => {
    return (file) => {
      const url = URL.createObjectURL(file)
  
      if (type === 'background') {
        onDataChange?.({ backgroundImage: url, backgroundImageFile: file })
      }
  
      if (type === 'card') {
        onDataChange?.({ cardBackgroundImage: url, cardBackgroundImageFile: file })
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
                bodyStyle: { padding: '6px 8px' },
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

      <Collapse ghost>
        <Collapse.Panel header="🎨 Color y canción" key="1">
          <div className='collapse-buttons' style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button icon={<AudioOutlined />} block>
              Elegir Canción
            </Button>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleImageUpload('background')}
            className="upload-full-width"
          >
            <Button icon={<PictureOutlined />} block>
              Fondo General
            </Button>
          </Upload>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleImageUpload('card')}
            className="upload-full-width"
          >
            <Button icon={<AppstoreAddOutlined />} block>
              Fondo de las Cards
            </Button>
          </Upload>

          </div>
        </Collapse.Panel>

      </Collapse>

      <Row gutter={16} style={{ marginTop: 16, marginBottom: "16px" }}>
        <Col sm={12}>
          <Button type='primary' danger style={{ width: "100%" }}>
            Cancelar
          </Button>
        </Col>
        <Col sm={12}>
          <Button type="primary" style={{ width: "100%" }}>
            Guardar
          </Button>
        </Col>
      </Row>

      <Divider />
    </Sider>
  )
}

export default InvitationPremiumSideBar
