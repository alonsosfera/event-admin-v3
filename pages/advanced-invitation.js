import React from 'react';
import { Button, Card, Col, Row, Typography, Image } from 'antd';


const { Title, Text } = Typography;

const InvitationPage = () => {

  const handleRSVP = () => {
    // Handle RSVP action here, for example, show a confirmation message
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
            <div style={{ textAlign: 'center' }}>
              <Image
                src="/assets/boda2.webp"
                alt="Wedding Banner"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  marginBottom: '20px',
                }}
              />
              <Title level={1} style={{ fontSize: '50px', fontWeight: 'bold', color: '#4c4c4c' }}>
                Carla & Luis
              </Title>
              <Text style={{ fontSize: '20px', color: '#8f8f8f', marginTop: '10px' }}>
                You are invited to share this very special day with us!
              </Text>
              <Text
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#8e44ad',
                  marginTop: '10px',
                }}
              >
                May 15, 2025 | 5:00 PM
              </Text>
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
