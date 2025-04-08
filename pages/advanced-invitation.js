import React from 'react';
import { Button, Card, Col, Row, Typography, Image, Flex } from 'antd';

const { Title, Text } = Typography;

const InvitationPage = () => {

  const handleRSVP = () => {
    alert('¡Gracias por confirmar tu asistencia!');
  };

  return (
    <div className='invitation-container'>
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={16}>
          <div className='invitation-container-image'>
            <Card className='card-invitation'>
              {/* Header */}
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <Image
                  preview={false}
                  src="/assets/boda2.webp"
                  alt="Banner de Boda"     
                />
                {/* Primer texto - Título */}
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',

                }}>
                  <Title level={1} style={{ 
                    fontSize: '50px', 
                    fontWeight: 'bold', 
                    color: 'green',
                    margin: 0,
                    '@media (max-width: 768px)': {
                      fontSize: '30px',
                    }
                  }}>
                    Carla & Luis
                  </Title>
                </div>

                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}>
                  <Text style={{ 
                    fontSize: '20px', 
                    color: '#8f8f8f', 
                    display: 'block',
                    '@media (max-width: 768px)': {
                      fontSize: '16px',
                    }
                  }}>
                    ¡Estás invitado a compartir este día tan especial con nosotros!
                  </Text>
                </div>

                <div className="text">
                  <div class="wp-block-uagb-countdown">
                    <div class="countdown-container">
                      <div class="countdown-item">
                        <span class="countdown-number" id="days">10</span>
                        <span class="countdown-label">Días</span>
                      </div>
                      <div class="countdown-item">
                        <span class="countdown-number" id="hours">20</span>
                        <span class="countdown-label">Horas</span>
                      </div>
                      <div class="countdown-item">
                        <span class="countdown-number" id="minutes">30</span>
                        <span class="countdown-label">Minutos</span>
                      </div>
                      <div class="countdown-item">
                        <span class="countdown-number" id="seconds">40</span>
                        <span class="countdown-label">Segundos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
            
          <Card className='card-invitation'>
            <Row gutter={[0, 24]} style={{ marginTop: '20px' }}>
              <Col xs={{ span: 24, order: 2 }} sm={{ span: 8, order: 1  }} style={{ textAlign: 'center' }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}  >
                  <Image
                    preview={false}
                    src="/assets/qr.png"
                    width={150}
                    alt="Banner de Boda"     
                    />
                  </div>
              </Col>
              <Col xs={{ span: 24, order: 1} } sm={{ span: 16, order: 2 }}>
                <Title level={2} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
                Invitación válida para:
                </Title>
                <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                  NOMBRE
                </Text>
                <br />
                <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                  Arturo Contreras Chaparro
                </Text>
                  <Row gutter={[ 100 ]}> 
                    <Col sm={12}>
                      <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                        PERSONAS
                      </Text>
                      <br />
                      <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                        4
                      </Text>
                    </Col>
                    <Col sm={12}>
                      <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                        MESA
                      </Text>
                      <br />
                      <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                        10
                      </Text>
                    </Col>
                  </Row>
                <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                  MENSAJE
                </Text>
                <br />
                <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                Con alegría en el corazón, los esperamos para compartir nuestra unión y recibir juntos la bendición de Dios
                </Text>
              </Col>
            </Row>
          </Card>
          <Card className='card-invitation'>
            <div style={{ textAlign: 'center' }}>
              <Row>
                <Col xs={24}>
                  <Title level={1} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
                    ¿Dónde & Cuándo?
                  </Title>
                </Col>
                <Col xs={24} sm={12}>
                  <Title level={3} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
                    Ceremonia
                  </Title>
                  <Image
                    preview={false}
                    width={400}
                    height={300}
                    src="/assets/basílica.jpg"
                    alt="ceremonia"
                    style={{ objectFit: "contain" }}
                  />
                  <Title level={3} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
                    Basílica de Guadalupe Monterrey
                  </Title>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                    Fecha:
                  </Text>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d'}}>
                    20 de junio de 2025 18:00 hrs
                  </Text>
                  <br/>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                    Dirección:
                  </Text>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d'}}>
                    Guanajuato 715, Independencia, 64720 Monterrey, N.L.
                  </Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Title level={3} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
                    Recepción
                  </Title>
                  <Image
                    preview={false}
                    width={400}
                    height={300}
                    src="/assets/La_joya.jpg"
                    alt="ceremonia"
                    style={{ objectFit: "contain" }}
                  />
                  <Title level={3} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
                    Salón La Joya
                  </Title>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                    Fecha:
                  </Text>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d'}}>
                    20 de junio de 2025 20:00 hrs
                  </Text>
                  <br/>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                    Dirección:
                  </Text>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d'}}>
                    Poner aqui la dirección real del salón
                  </Text>
                </Col>
              </Row>
            </div>
          </Card>
          <Card className='card-invitation'>    
          {/* RSVP Section */}
            <div style={{ marginTop: '30px' }}>
              <Title level={2} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
                Confirmar Asistencia
              </Title>
              <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                Por favor confirma tu asistencia haciendo clic en el botón de abajo.
              </Text>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    backgroundColor: '#8e44ad',
                    borderRadius: '8px',
                    padding: '15px 30px',
                    fontSize: '18px',
                    width: '100%',
                    maxWidth: '300px',
                  }}
                  onClick={handleRSVP}
                >
                  Confirmar Asistencia
                </Button>
              </div>
            </div>

            {/* Family Section */}
            <div style={{ marginTop: '40px', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
              <Title level={3} style={{ color: '#4c4c4c', fontWeight: 'bold', marginBottom: '15px' }}>
                Nuestra Familia y Amigos
              </Title>
              <ul style={{ listStyleType: 'none', padding: '0' }}>
                <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
                  Padres de la Novia: María & Carlos
                </li>
                <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
                  Padres del Novio: Ana & Juan
                </li>
                <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
                  Padrino: José
                </li>
                <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
                  Madrina: Carmen
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e1e1e1' }}>
              <Text style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Gracias por ser parte de nuestro día especial.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InvitationPage;
