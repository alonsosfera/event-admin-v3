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

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result
    if (!destination) return
  
    if (draggableId === 'cover') return
  
    const sourceList = source.droppableId === 'active' ? activeSectionOrder : inactiveSectionOrder
    const destinationList = destination.droppableId === 'active' ? activeSectionOrder : inactiveSectionOrder
    const setSourceList = source.droppableId === 'active' ? setActiveSectionOrder : setInactiveSectionOrder
    const setDestinationList = destination.droppableId === 'active' ? setActiveSectionOrder : setInactiveSectionOrder
  
    let moved = null
  
    if (source.droppableId === destination.droppableId) {
      const updated = [...sourceList]
      ;[moved] = updated.splice(source.index, 1)
      updated.splice(destination.index, 0, moved)
  
      if (destination.droppableId === 'active') {
        const coverIndex = updated.indexOf('cover')
        if (coverIndex > 0) {
          updated.splice(coverIndex, 1)
          updated.unshift('cover')
        }
  
        if (destination.index === 0 && draggableId !== 'cover') {
          const index = updated.indexOf(draggableId)
          updated.splice(index, 1)
          updated.splice(1, 0, draggableId)
        }
      }
  
      setSourceList(updated)
  
      if (destination.droppableId === 'active') {
        setTimeout(() => {
          const sectionEl = document.getElementById(`section-${draggableId}`)
          if (sectionEl) {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 300)
      }
  
    } else {
      const updatedSource = [...sourceList]
      const updatedDestination = [...destinationList]
      ;[moved] = updatedSource.splice(source.index, 1)
  
      let targetIndex = destination.index
      if (destination.droppableId === 'active' && targetIndex === 0) {
        targetIndex = 1
      }
  
      updatedDestination.splice(targetIndex, 0, moved)
  
      if (destination.droppableId === 'active') {
        const coverIndex = updatedDestination.indexOf('cover')
        if (coverIndex > 0) {
          updatedDestination.splice(coverIndex, 1)
          updatedDestination.unshift('cover')
        }
      }
  
      setSourceList(updatedSource)
      setDestinationList(updatedDestination)
  
      if (destination.droppableId === 'active') {
        setTimeout(() => {
          const sectionEl = document.getElementById(`section-${draggableId}`)
          if (sectionEl) {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 200)
      }
    }
  }
   
  

  const handleCardClick = (id) => {
    const sectionEl = document.getElementById(`section-${id}`)
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Sider
      width={260}
      style={{
        background: '#fafafa',
        padding: '24px 16px',
        height: '100vh',
        overflowY: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        borderRight: '1px solid #e5e5e5'
      }}
    >
      <Title level={4} style={{ marginBottom: 32, textAlign: 'center', color: '#333' }}>
        ✨ Personalizar Secciones
      </Title>

      <Text
        type="secondary"
        style={{ display: 'block', fontSize: 12, textAlign: 'center', marginBottom: 24 }}
      >
        Arrastra para mover entre listas
      </Text>

      {isClient && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Title level={5} style={{ marginBottom: 16 }}>📌 Secciones activas</Title>
          <Droppable droppableId="active">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 40 }}
              >
                {activeSectionOrder.map((id, index) => {
                const section = sections.find((s) => s.id === id)
                if (!section) return null

                if (id === 'cover') {
                  return (
                    <Card
                      key={id}
                      onClick={() => handleCardClick(id)}
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
                    onClick={() => handleCardClick(id)}
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

          <Title level={5} style={{ marginBottom: 16 }}>📂 Secciones disponibles</Title>
          <Droppable droppableId="inactive">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                {inactiveSectionOrder.map((id, index) => {
                  const section = sections.find((s) => s.id === id)
                  if (!section) return null

                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          onClick={() => handleCardClick(id)}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
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
                          <div {...provided.dragHandleProps}>
                            <Text strong>{section.label}</Text>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Sider>
  )
}

export default InvitationPremiumSideBar
