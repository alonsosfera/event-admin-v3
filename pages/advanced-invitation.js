import { Layout, Typography, Row, Col } from 'antd'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax'
import { useState } from 'react'

import PremiumInvitationCover from '@/components/designs/invitations/premium/premium-invitation-cover'
import PremiumInvitationPass from '@/components/designs/invitations/premium/premium-invitation-pass'
import PremiumInvitationPlace from '@/components/designs/invitations/premium/premium-invitation-place'
import PremiumInvitationCarousel from '@/components/designs/invitations/premium/premium-invitation-carousel'
import PremiumInvitationAttendance from '@/components/designs/invitations/premium/premium-invitation-attendance'
import PremiumInvitationFamily from '@/components/designs/invitations/premium/premium-invitation-family'
import PremiumInvitationVideo from '@/components/designs/invitations/premium/premium-invitation-video'
import PremiumInvitationGift from '@/components/designs/invitations/premium/premium-invitation-gifts'
import PremiumInvitationContact from '@/components/designs/invitations/premium/premium-invitation-contact'
import PremiumInvitationMusicPlayer from '@/components/designs/invitations/premium/premium-invitation-music'
import InvitationPremiumSideBar from '@/components/designs/invitations/premium/premium-invitation-sidebar'

const { Text } = Typography
const { Content } = Layout

const initialSections = [
  { id: 'cover', label: 'Portada', Component: PremiumInvitationCover },
  { id: 'pass', label: 'Pase', Component: PremiumInvitationPass },
  { id: 'place', label: 'Lugar', Component: PremiumInvitationPlace },
  { id: 'carousel', label: 'Galería', Component: PremiumInvitationCarousel },
  { id: 'video', label: 'Video', Component: PremiumInvitationVideo },
  { id: 'family', label: 'Familia', Component: PremiumInvitationFamily },
  { id: 'gift', label: 'Regalos', Component: PremiumInvitationGift },
  { id: 'contact', label: 'Contacto', Component: PremiumInvitationContact },
  { id: 'attendance', label: 'Asistencia', Component: PremiumInvitationAttendance },
]

const defaultActiveSections = ['cover', 'pass', 'place', 'carousel', 'attendance']
const defaultInactiveSections = ['video', 'family', 'gift', 'contact']

const PremiumInvitationPage = () => {
  const [activeSectionOrder, setActiveSectionOrder] = useState(defaultActiveSections)
  const [inactiveSectionOrder, setInactiveSectionOrder] = useState(defaultInactiveSections)
  const [isEditing, setIsEditing] = useState(true)
  const [sectionData, setSectionData] = useState({})
  console.log("sectionData : ", sectionData);
  


  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isEditing && (
        <InvitationPremiumSideBar
          sections={initialSections}
          activeSectionOrder={activeSectionOrder}
          setActiveSectionOrder={setActiveSectionOrder}
          inactiveSectionOrder={inactiveSectionOrder}
          setInactiveSectionOrder={setInactiveSectionOrder}
        />
      )}
    
      <Content
        style={{
          marginLeft:  isEditing ? "260px" : "0px"
        }}>
        <PremiumInvitationMusicPlayer />
        <div className="invitation-container">
        <ParallaxProvider>
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={16}>
              {activeSectionOrder.map((id, index) => {
                const section = initialSections.find((s) => s.id === id)
                if (!section) return null

                const { Component } = section
                const customTranslateX = id === 'cover' ? [0, 0] : [(index % 2 === 0 ? -3 : 3), 0]

                return (
                  <Parallax
                    key={id}
                    speed={0}
                    translateX={customTranslateX}
                    opacity={[0, 5]}
                    easing="ease"
                  >
                    <div id={`section-${id}`}>
                    <Component
                      isEditing={isEditing}
                      onDataChange={(data) =>
                        setSectionData(prev => ({ ...prev, [id]: data }))
                      }
                    />
                    </div>
                  </Parallax>
                )
              })}

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '50px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e1e1e1',
                }}
              >
                <Text style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  Gracias por ser parte de nuestro día especial.
                </Text>
              </div>
            </Col>
          </Row>
        </ParallaxProvider>
        </div>
      </Content>
    </Layout>
  )
}

export default PremiumInvitationPage
