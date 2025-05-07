import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Layout, Typography, Row, Col, Card, Spin } from 'antd'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax'
import axios from 'axios'

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

const PremiumInvitationPage = () => {
  const router = useRouter()
  const { invitationId } = router.query
  console.log(invitationId);
  

  const [activeSectionOrder, setActiveSectionOrder] = useState(defaultActiveSections)
  const [sectionData, setSectionData] = useState({})
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [cardBackgroundImage, setCardBackgroundImage] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [musicUrl, setMusicUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [invitated, setInvitated] = useState(null)

  console.log("invitated ", invitated);
  

  useEffect(() => {
    if (!invitationId) return

    const fetchPremiumInvitation = async () => {
      try {
        const { data } = await axios.get(`/api/premium-invitation/i/${invitationId}`)
        const premiumInvitation = data.event.premiumInvitation
        const invitated = data
        setInvitated(invitated)
         
        
        if (data) {
          setBackgroundImage(premiumInvitation.backgroundUrl || "/assets/background1.jpg")
          setCardBackgroundImage(premiumInvitation.sectionBackgroundUrl || "/assets/background1.jpg")
          setMusicUrl(premiumInvitation.songUrl || "/assets/thousand-years.mp3")

          const newSectionData = {}

          if (Array.isArray(premiumInvitation.sections) && premiumInvitation.sections.length > 0) {
            const sectionOrder = premiumInvitation.sections.map(section => section.type)
            setActiveSectionOrder(sectionOrder)

            premiumInvitation.sections.forEach(section => {
              newSectionData[section.type] = section.data
            })
          } else {
            setActiveSectionOrder(defaultActiveSections)
          }

          setSectionData(newSectionData)
        }
      } catch (error) {
        console.error('Error fetching premium invitation data', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPremiumInvitation()
  }, [invitationId])

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#fff'
      }}>
        <Spin size="large" />
        <Text style={{ marginTop: '20px', fontSize: '18px', color: '#555' }}>Cargando invitación...</Text>
      </div>
    )
  }

  return (
    <Layout className='layout-sidebar' style={{ minHeight: '100vh' }}>
      <Content>
        <PremiumInvitationMusicPlayer musicUrl={musicUrl} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        <div className="invitation-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
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
                      <div className={`section-${id}`} id={`section-${id}`}>
                        <Card className='card-invitation' style={{ textAlign: "center", backgroundImage: `url(${cardBackgroundImage})` }}>
                          <Component
                            invitated={invitated}
                            invitationId={invitationId}
                            isEditing={false}
                            sectionData={sectionData[id]}
                            cardBackgroundImage={cardBackgroundImage}
                          />
                        </Card>
                      </div>
                    </Parallax>
                  )
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
      </Content>
    </Layout>
  )
}

export default PremiumInvitationPage
