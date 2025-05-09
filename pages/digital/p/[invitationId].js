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

  const [activeSectionOrder, setActiveSectionOrder] = useState(defaultActiveSections)
  const [sectionData, setSectionData] = useState({})
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [cardBackgroundImage, setCardBackgroundImage] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [musicUrl, setMusicUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [invitated, setInvitated] = useState(null)
  const [invitationNotFound, setInvitationNotFound] = useState(false)

  const eventDate = invitated?.event?.eventDate
  
  useEffect(() => {
    if (!invitationId) return

    const fetchPremiumInvitation = async () => {
      try {
        const { data } = await axios.get(`/api/premium-invitation/i/${invitationId}`)
        
        if (!data || !data.event || !data.event.premiumInvitation) {
          setInvitationNotFound(true)
          return
        }

        const premiumInvitation = data.event.premiumInvitation
        const invitated = data
        setInvitated(invitated)
        
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
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setInvitationNotFound(true)
        } else {
          console.error('Error fetching premium invitation data', error)
        }
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

  if (invitationNotFound) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#fff'
      }}>
        <Text style={{ fontSize: '20px', color: '#ff0000' }}>Invitación no encontrada</Text>
        <Text style={{ fontSize: '16px', color: '#555' }}>No se ha encontrado la invitación con el link proporcionado.</Text>
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
                            eventDate={eventDate}
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
