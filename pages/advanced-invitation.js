import React from 'react';
import { Button, Card, Col, Row, Typography, Image } from 'antd';


const { Title, Text } = Typography;

const InvitationPage = () => {

  const handleRSVP = () => {
    
    alert('Thank you for confirming your attendance!');
  };

  return (
    <div className='invitation-container' style={{ backgroundColor: '#f9f9f9' }}>
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={16}>
          <Card
            className='card-invitation'
          >
            {/* Header */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <Image
                preview={false}
                src="/assets/boda2.webp"
                alt="Wedding Banner"     
              />
              {/* Primer texto - Título */}
              <div style={{
                position: 'absolute',
                top: '30%',  // Puedes ajustar este valor
                left: '50%',
                transform: 'translate(-50%, -50%)',

              }}>
                <Title level={1} style={{ 
                  fontSize: '50px', 
                  fontWeight: 'bold', 
                  color: '#4c4c4c',
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
                  You are invited to share this very special day with us!
                </Text>
              </div>

              <div className="text">
                  <div class="wp-block-uagb-countdown">
                    <div class="countdown-container">
                      <div class="countdown-item">
                        <span class="countdown-number" id="days">10</span>
                        <span class="countdown-label">Days</span>
                      </div>
                      <div class="countdown-item">
                        <span class="countdown-number" id="hours">20</span>
                        <span class="countdown-label">Hours</span>
                      </div>
                      <div class="countdown-item">
                        <span class="countdown-number" id="minutes">30</span>
                        <span class="countdown-label">Minutes</span>
                      </div>
                      <div class="countdown-item">
                        <span class="countdown-number" id="seconds">40</span>
                        <span class="countdown-label">Seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {/* Event Details */}
            <div style={{ marginTop: '30px' }}>
              <Title level={2} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
                Event Details
              </Title>
              <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                Location: Iglesia San José
              </Text>
              <br />
              <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                We would love to have you celebrate with us!
              </Text>
            </div>

            {/* RSVP Section */}
            <div style={{ marginTop: '30px' }}>
              <Title level={2} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
                RSVP
              </Title>
              <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                Please confirm your attendance by clicking the button below.
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
                  Confirm Attendance
                </Button>
              </div>
            </div>

            {/* Family Section */}
            <div style={{ marginTop: '40px', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
              <Title level={3} style={{ color: '#4c4c4c', fontWeight: 'bold', marginBottom: '15px' }}>
                Our Family & Friends
              </Title>
              <ul style={{ listStyleType: 'none', padding: '0' }}>
                <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
                  Parents of the Bride: María & Carlos
                </li>
                <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
                  Parents of the Groom: Ana & Juan
                </li>
                <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
                  Best Man: José
                </li>
                <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
                  Maid of Honor: Carmen
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e1e1e1' }}>
              <Text style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Thank you for being a part of our special day.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InvitationPage;
