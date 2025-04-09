import { Col, Row, Typography, Card, Button } from 'antd'
import PremiumInvitationCover from '@/components/designs/invitations/premium/premium-invitation-cover.js';
import PremiumInvitationPass from '@/components/designs/invitations/premium/premium-invitation-pass';
import PremiumInvitationPlace from '@/components/designs/invitations/premium/premium-invitation-place';
import PremiumInvitationCarousel from '@/components/designs/invitations/premium/premium-invitation-carousel';
import PremiumInvitationAttendance from '@/components/designs/invitations/premium/premium-invitation-attendance';
import PremiumInvitationFamily from '@/components/designs/invitations/premium/premium-invitation-family';
import PremiumInvitationVideo from '@/components/designs/invitations/premium/premium-invitation-video';
import PremiumInvitationGift from '@/components/designs/invitations/premium/premium-invitation-gifts';

const { Text, Title } = Typography

const PremiumInvitationPage = () => {

  return (
    <div className='invitation-container'>
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={16}>
          <PremiumInvitationCover />
          <PremiumInvitationPass />  
          <PremiumInvitationPlace />
          <PremiumInvitationCarousel /> 
          <PremiumInvitationAttendance />
          <PremiumInvitationFamily />
          <PremiumInvitationVideo />
          <PremiumInvitationGift />
                    
          <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e1e1e1' }}>
            <Text style={{ fontSize: '14px', color: '#7f8c8d' }}>
              Gracias por ser parte de nuestro día especial.
            </Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PremiumInvitationPage
