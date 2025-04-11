import { Layout, Typography, Card } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'

const { Sider } = Layout
const { Text, Title } = Typography

const InvitationPremiumSideBar = ({
  sections,
  activeSectionOrder,
  setActiveSectionOrder,
  inactiveSectionOrder,
  setInactiveSectionOrder
}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(`section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

    if (destination.droppableId === 'active') {
      if (targetIndex === 0) targetIndex = 1
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
    <>
      <Title level={5} style={{ marginBottom: 16 }}>{title}</Title>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 20, minHeight: "40px" }}
          >
            {list.map((id, index) => {
              const section = sections.find(s => s.id === id)
              if (!section) return null

              if (id === 'cover') {
                return (
                  <Card
                    key={id}
                    onClick={() => scrollToSection(id)}
                    size="small"
                    hoverable
                    style={{
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
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      onClick={() => scrollToSection(id)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      size="small"
                      hoverable
                      style={{
                        userSelect: 'none',
                        boxShadow: snapshot.isDragging
                          ? '0 4px 12px rgba(0,0,0,0.1)'
                          : '0 2px 6px rgba(0,0,0,0.05)',
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
    </>
  )

  return (
    <Sider
      width={260}
      theme='light'
      style={{
        padding: '24px 16px',
        height: '100vh',
        overflowY: 'auto',
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: '1px solid #e5e5e5'
      }}
    >
      <Title level={4} style={{ marginBottom: 20, textAlign: 'center', color: '#333' }}>
         Personalizar Secciones
      </Title>

      <Text
        type="secondary"
        style={{ display: 'block', fontSize: 12, textAlign: 'center', marginBottom: 24 }}
      >
        Arrastra para mover las secciones
      </Text>

      {isClient && (
        <DragDropContext onDragEnd={handleDragEnd}>
          {renderDroppableList('active', '📌 Secciones activas', activeSectionOrder)}
          {renderDroppableList('inactive', '📂 Secciones disponibles', inactiveSectionOrder)}
        </DragDropContext>
      )}
    </Sider>
  )
}

export default InvitationPremiumSideBar
