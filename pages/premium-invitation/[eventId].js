import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Layout, Typography, Row, Col, Card, Spin, Modal } from 'antd'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax'
import axios from 'axios'
import { parseCookies } from "nookies"
import { uploadStorage } from '@/helpers/upload-storage'

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

const IMAGE_FOLDER = "premium-invitations/images";
const AUDIO_FOLDER = "premium-invitations/audio";

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
  const router = useRouter()
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [premiumInvitationSections, setPremiumInvitationSections] = useState(null)
  const [eventDate, setEventDate] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(null)
  const [globalTitleColor, setGlobalTitleColor] = useState('#4c4c4c')
  const [globalSubtitleColor, setGlobalSubtitleColor] = useState('#7f8c8d')
  const [globalTypography, setGlobalTypography] = useState('')

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        const message = "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?";
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?");
        if (!confirmLeave) {
          router.events.emit("routeChangeError");
          throw "routeChangeError";
        }
      }
    };

    router.events.on("beforeHistoryChange", handleRouteChange);

    return () => {
      router.events.off("beforeHistoryChange", handleRouteChange);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!eventId) return

    const fetchPremiumInvitation = async () => {
      try {
        const { data } = await axios.get(`/api/premium-invitation/${eventId}`)

        if (data) {
          setBackgroundImage(data.backgroundUrl || "/assets/background1.jpg")
          setCardBackgroundImage(data.sectionBackgroundUrl || "/assets/background1.jpg")
          setMusicUrl(data.songUrl || "/assets/thousand-years.mp3")
          setPremiumInvitationSections(data.sections)
          setEventDate(data.event.eventDate)

          if (data.styles) {
            setGlobalTitleColor(data.styles.globalTitleColor || '#4c4c4c')
            setGlobalSubtitleColor(data.styles.globalSubtitleColor || '#7f8c8d')
            setGlobalTypography(data.styles.globalTypography || '')
          }

          const newSectionData = {}

          if (Array.isArray(data.sections) && data.sections.length > 0) {
            const allIds = initialSections.map(s => s.id)
            const sectionOrder = data.sections.map(section => section.type)
            setActiveSectionOrder(sectionOrder)

            const newInactive = allIds.filter(id => !sectionOrder.includes(id))
            setInactiveSectionOrder(newInactive)

            data.sections.forEach(section => {
              newSectionData[section.type] = section.data
            })
          } else {
            setActiveSectionOrder(defaultActiveSections)
            setInactiveSectionOrder(defaultInactiveSections)
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
    setIsUploading(true)
    setUploadProgress(0)
    setHasUnsavedChanges(false);

    let uploadedBackgroundUrl = backgroundImage
    let uploadedSectionBackgroundUrl = cardBackgroundImage
    let uploadedMusicUrl = musicUrl

    if (sectionData.backgroundImageFile) {
      uploadedBackgroundUrl = await uploadStorage(
        sectionData.backgroundImageFile,
        IMAGE_FOLDER,
        '/api/storage/premium-image-song',
        setUploadProgress,
        token
      )
    }

    if (sectionData.cardBackgroundImageFile) {
      uploadedSectionBackgroundUrl = await uploadStorage(
        sectionData.cardBackgroundImageFile,
        IMAGE_FOLDER,
        '/api/storage/premium-image-song',
        setUploadProgress,
        token
      )
    }

    if (sectionData.musicFile) {
      uploadedMusicUrl = await uploadStorage(
        sectionData.musicFile,
        AUDIO_FOLDER,
        '/api/storage/premium-image-song',
        setUploadProgress,
        token
      )
    }

    const processedSectionData = { ...sectionData }

    for (const sectionId of activeSectionOrder) {
      const section = sectionData[sectionId]
      if (!section) continue

      const newSection = { ...section }

      for (const key in newSection) {
        if (key.endsWith("File") && newSection[key] instanceof File) {
          const uploadedUrl = await uploadStorage(
            newSection[key],
            IMAGE_FOLDER,
            '/api/storage/premium-image-song',
            setUploadProgress,
            token
          )
          newSection[key.replace("File", "")] = uploadedUrl
          delete newSection[key]
        }
      }

      if (Array.isArray(newSection.images)) {
        newSection.images = await Promise.all(
          newSection.images.map(async (imgObj) => {
            if (imgObj?.file instanceof File) {
              const uploadedUrl = await uploadStorage(
                imgObj.file,
                IMAGE_FOLDER,
                '/api/storage/premium-image-song',
                setUploadProgress,
                token
              )
              return { ...imgObj, src: uploadedUrl, file: undefined }
            }
            return imgObj
          })
        )
      }

      if (Array.isArray(newSection.familyMembers)) {
        newSection.familyMembers = await Promise.all(
          newSection.familyMembers.map(async (member) => {
            if (member?.avatarFile instanceof File) {
              const uploadedUrl = await uploadStorage(
                member.avatarFile,
                IMAGE_FOLDER,
                '/api/storage/premium-image-song',
                setUploadProgress,
                token
              )
              return { ...member, avatar: uploadedUrl, avatarFile: undefined }
            }
            return member
          })
        )
      }

      if (Array.isArray(newSection.contacts)) {
        newSection.contacts = await Promise.all(
          newSection.contacts.map(async (contact) => {
            if (contact?.avatarFile instanceof File) {
              const uploadedUrl = await uploadStorage(
                contact.avatarFile,
                IMAGE_FOLDER,
                '/api/storage/premium-image-song',
                setUploadProgress,
                token
              )
              return { ...contact, avatar: uploadedUrl, avatarFile: undefined }
            }
            return contact
          })
        )
      }

      processedSectionData[sectionId] = newSection
    }

    const allSectionIds = [...activeSectionOrder, ...inactiveSectionOrder]
    const sectionsPayload = allSectionIds.map((id, index) => {
      const updated = processedSectionData[id]
      const backup = premiumInvitationSections?.find(sec => sec.type === id)?.data
      return {
        type: id,
        version: "1.0.0",
        order: index,
        data: updated || backup || {}
      }
    })

      const metadata = {
        activeSections: activeSectionOrder,
        inactiveSections: inactiveSectionOrder,
        sections: sectionsPayload,
        otherData: {
          ...processedSectionData,
          backgroundUrl: uploadedBackgroundUrl,
          sectionBackgroundUrl: uploadedSectionBackgroundUrl,
          songUrl: uploadedMusicUrl,
          styles: {
          globalTitleColor,
          globalSubtitleColor,
          globalTypography,
        },
          eventId,
        },
      }

      await axios.post('/api/premium-invitation/update', metadata)

      Modal.success({
        title: '¡Invitación guardada!',
        content: 'Tu invitación ha sido guardada correctamente.',
        centered: true,
        okText: 'Aceptar'
      })
    } catch (error) {
      console.error('Error guardando la invitación:', error)
      Modal.error({
        title: 'Error al guardar',
        content: 'Ocurrió un problema al guardar la invitación. Intenta de nuevo.',
        centered: true,
        okText: 'Aceptar'
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

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
            setHasUnsavedChanges(true);
            setSectionData(prev => ({ ...prev, ...data }))
            if (data.backgroundImage) setBackgroundImage(data.backgroundImage)
            if (data.cardBackgroundImage) setCardBackgroundImage(data.cardBackgroundImage)
            if (data.musicUrl) setMusicUrl(data.musicUrl)
            if (data.globalTitleColor) setGlobalTitleColor(data.globalTitleColor)
            if (data.globalSubtitleColor) setGlobalSubtitleColor(data.globalSubtitleColor)
            if (data.globalTypography) setGlobalTypography(data.globalTypography)
          }}
          setIsPlaying={setIsPlaying}
          saveInvitation={saveInvitation}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
      )}

      <Content style={{ marginLeft: isEditing ? "260px" : "0px" }}>
        <PremiumInvitationMusicPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} musicUrl={musicUrl} />
        {(isEditing || isPreviewShown) && (
          <PremiumInvitationPreview isEditing={isEditing} setIsEditing={setIsEditing} setIsPreviewShown={setIsPreviewShown} />
        )}
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
                            isEditing={isEditing}
                            sectionData={sectionData[id]}
                            cardBackgroundImage={cardBackgroundImage}
                            globalTitleColor={globalTitleColor}
                            globalSubtitleColor={globalSubtitleColor}
                            globalTypography={globalTypography}
                            onDataChange={(data) => {
                              setHasUnsavedChanges(true)
                              setSectionData(prev => ({ ...prev, [id]: data }))
                            }}
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
