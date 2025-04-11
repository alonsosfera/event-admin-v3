import { Layout, Typography, Card } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { Sider } = Layout;
const { Text, Title } = Typography;

const InvitationPremiumSideBar = ({ sectionOrder, setSectionOrder, sections }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updated = Array.from(sectionOrder);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setSectionOrder(updated);
  };

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
        borderRight: '1px solid #e5e5e5',
      }}
    >
      <Title level={4} style={{ marginBottom: 32, textAlign: 'center', color: '#333' }}>
        ✨ Personalizar Secciones
      </Title>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {sectionOrder.map((id, index) => {
                const section = sections.find(s => s.id === id);
                if (!section) return null;

                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided, snapshot) => (
                      <Card
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
                          ...provided.draggableProps.style,
                        }}
                      >
                        <Text strong style={{ color: '#333' }}>{section.label}</Text>
                      </Card>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Sider>
  );
};

export default InvitationPremiumSideBar;
