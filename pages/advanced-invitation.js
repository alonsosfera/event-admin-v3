import { Col, Row, Typography } from 'antd'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

import PremiumInvitationCover from '@/components/designs/invitations/premium/premium-invitation-cover.js';
import PremiumInvitationPass from '@/components/designs/invitations/premium/premium-invitation-pass';
import PremiumInvitationPlace from '@/components/designs/invitations/premium/premium-invitation-place';
import PremiumInvitationCarousel from '@/components/designs/invitations/premium/premium-invitation-carousel';
import PremiumInvitationAttendance from '@/components/designs/invitations/premium/premium-invitation-attendance';
import PremiumInvitationFamily from '@/components/designs/invitations/premium/premium-invitation-family';
import PremiumInvitationVideo from '@/components/designs/invitations/premium/premium-invitation-video';
import PremiumInvitationGift from '@/components/designs/invitations/premium/premium-invitation-gifts';
import PremiumInvitationContact from '@/components/designs/invitations/premium/premium-invitation-contact';

const { Text } = Typography;

const sections = [
  { Component: PremiumInvitationCover, translateX: [0, 0] },
  { Component: PremiumInvitationPass },
  { Component: PremiumInvitationPlace },
  { Component: PremiumInvitationCarousel },
  { Component: PremiumInvitationVideo },
  { Component: PremiumInvitationFamily },
  { Component: PremiumInvitationGift },
  { Component: PremiumInvitationContact },
  { Component: PremiumInvitationAttendance },
];

const PremiumInvitationPage = () => {
  return (
    <div className='invitation-container'>
      <ParallaxProvider>
        <Row justify="center">
          <Col xs={24} sm={22} md={20} lg={16}>
            {sections.map(({ Component, translateX }, index) => {
              const customTranslateX = translateX || [(index % 2 === 0 ? -3 : 3), 0];

              return (
                <Parallax
                  key={index}
                  speed={0}
                  translateX={customTranslateX}
                  opacity={[0, 5]}
                  easing="ease"
                >
                  <Component />
                </Parallax>
              );
            })}
            <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e1e1e1' }}>
              <Text style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Gracias por ser parte de nuestro día especial.
              </Text>
            </div>
          </Col>
        </Row>
      </ParallaxProvider>
    </div>
  );
};

export default PremiumInvitationPage;
