import { Card, Image, Typography } from "antd"

const { Title, Text } = Typography

const PremiumInvitationCover = () => {
  return (
    <div className='invitation-container-image'>
      <Card className='card-invitation'>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <Image
            preview={false}
            src="/assets/boda2.webp"
            alt="Banner de Boda"     
          />
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
              '@media (maxWidth: 768px)': {
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
            <div className="wp-block-uagb-countdown">
              <div className="countdown-container">
                <div className="countdown-item">
                  <span className="countdown-number" id="days">10</span>
                  <span className="countdown-label">Días</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number" id="hours">20</span>
                  <span className="countdown-label">Horas</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number" id="minutes">30</span>
                  <span className="countdown-label">Minutos</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number" id="seconds">40</span>
                  <span className="countdown-label">Segundos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PremiumInvitationCover