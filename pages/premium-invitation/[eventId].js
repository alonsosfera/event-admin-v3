import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Layout, Typography, Row, Col, Card, Spin } from 'antd'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax'
import axios from 'axios'
import { parseCookies } from "nookies"
import { fileToArrayBuffer, arrayBufferToBase64 } from '@/components/designs/helpers'

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
import PremiumInvitationPreview from '@/components/designs/invitations/premium/premium-invitation-preview'

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

  const router = useRouter();
  const { eventId } = router.query
  const { token } = parseCookies()

  const [activeSectionOrder, setActiveSectionOrder] = useState(defaultActiveSections)
  const [inactiveSectionOrder, setInactiveSectionOrder] = useState(defaultInactiveSections)
  const [isEditing, setIsEditing] = useState(true)
  const [sectionData, setSectionData] = useState({})
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [cardBackgroundImage, setCardBackgroundImage] = useState(null)
  const [musicUrl, setMusicUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPreviewShown, setIsPreviewShown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (!eventId) return
  
    const fetchPremiumInvitation = async () => {
      try {
        const { data } = await axios.get(`/api/premium-invitation/${eventId}`)
  
        if (data) {
          setBackgroundImage(data.backgroundUrl || "/assets/background1.jpg")
          setCardBackgroundImage(data.sectionBackgroundUrl || "/assets/background1.jpg")
          setMusicUrl(data.songUrl || "/assets/thousand-years.mp3")

          const newSectionData = {}
  
          if (Array.isArray(data.sections) && data.sections.length > 0) {
            const sectionOrder = data.sections.map((section) => section.type);
          
            setActiveSectionOrder(sectionOrder);
          
            const newInactiveSectionOrder = defaultInactiveSections.filter(
              (sectionId) => !sectionOrder.includes(sectionId)
            );
            setInactiveSectionOrder(newInactiveSectionOrder);
          } else {
            setActiveSectionOrder(defaultActiveSections);
            setInactiveSectionOrder(defaultInactiveSections);
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
  }, [eventId])
  
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

  const saveInvitation = async () => {
    try {
      let uploadedBackgroundUrl = backgroundImage;
      let uploadedSectionBackgroundUrl = cardBackgroundImage;
      let uploadedMusicUrl = musicUrl;
  
      if (sectionData.backgroundImageFile) {
        const buffer = await fileToArrayBuffer(sectionData.backgroundImageFile);
        const fileBuffer = arrayBufferToBase64(buffer);
        const sanitizedFileName = sectionData.backgroundImageFile.name.replace(/\s+/g, '-');

        const uploadRes = await axios.post("/api/storage/upload", {
          fileName: sanitizedFileName,
          folder: "premium-invitations",
          fileBuffer,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
  
        uploadedBackgroundUrl = uploadRes.data.fileUrl;
      }
  
      if (sectionData.cardBackgroundImageFile) {
        const buffer = await fileToArrayBuffer(sectionData.cardBackgroundImageFile);
        const fileBuffer = arrayBufferToBase64(buffer);
        const sanitizedFileName = sectionData.cardBackgroundImageFile.name.replace(/\s+/g, '-');

        const uploadRes = await axios.post("/api/storage/upload", {
          fileName: sanitizedFileName,
          folder: "premium-invitations",
          fileBuffer,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
  
        uploadedSectionBackgroundUrl = uploadRes.data.fileUrl;
      }
  
      // if (sectionData.musicFile) {
      //   const buffer = await fileToArrayBuffer(sectionData.musicFile);
      //   const fileBuffer = arrayBufferToBase64(buffer);
  
      //   // Usa otro endpoint (ej: /api/storage/upload-audio) que NO pase por sharp
      //   const uploadRes = await axios.post("/api/storage/upload-audio", {
      //     fileName: sectionData.musicFile.name,
      //     folder: "premium-invitations",
      //     fileBuffer,
      //   });
  
      //   uploadedMusicUrl = uploadRes.data.fileUrl;
      // }
  
      const metadata = {
        activeSections: activeSectionOrder,
        inactiveSections: inactiveSectionOrder,
        otherData: {
          ...sectionData,
          backgroundUrl: uploadedBackgroundUrl,
          sectionBackgroundUrl: uploadedSectionBackgroundUrl,
          songUrl: uploadedMusicUrl,
          eventId,
        },
      };
  
      await axios.post('/api/premium-invitation/update', metadata);
  
      console.log('Guardado correctamente');
    } catch (error) {
      console.error('Error guardando la invitación:', error);
    }
  };
  
  
  return (
    
    <Layout className='layout-sidebar' style={{ minHeight: '100vh' }}>
      {isEditing && (
        <InvitationPremiumSideBar
          sections={initialSections}
          activeSectionOrder={activeSectionOrder}
          setActiveSectionOrder={setActiveSectionOrder}
          inactiveSectionOrder={inactiveSectionOrder}
          setInactiveSectionOrder={setInactiveSectionOrder}
          onDataChange={(data) => {
            setSectionData((prev) => ({ ...prev, ...data }))
            if (data.backgroundImage) setBackgroundImage(data.backgroundImage)
            if (data.cardBackgroundImage) setCardBackgroundImage(data.cardBackgroundImage)
            if (data.musicUrl) setMusicUrl(data.musicUrl)
          }}
          setIsPlaying={setIsPlaying}
          saveInvitation={saveInvitation}
        />
        
        )}

      <Content
        style={{
          marginLeft:  isEditing ? "260px" : "0px"
        }}>
        <PremiumInvitationMusicPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} musicUrl={musicUrl} />
        {(isEditing || isPreviewShown) && (
        <PremiumInvitationPreview isEditing={isEditing} setIsEditing={setIsEditing} setIsPreviewShown={setIsPreviewShown} />
      )}
        <div 
          className="invitation-container"
          style={{ backgroundImage:  `url(${backgroundImage})` }}>
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
                          isEditing={isEditing}
                          cardBackgroundImage={cardBackgroundImage}
                          onDataChange={(data) =>
                          setSectionData(prev => ({ ...prev, [id]: data }))
                          }
                        />
                      </Card>
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
