import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Layout, Typography, Row, Col, Card, Spin, Modal } from 'antd'
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [premiumInvitationSections, setPremiumInvitationSections] = useState(null)

  console.log(activeSectionOrder);
  

  useEffect(() => {
    if (!eventId) return
  
    const fetchPremiumInvitation = async () => {
      try {
        const { data } = await axios.get(`/api/premium-invitation/${eventId}`);
    
        if (data) {
          setBackgroundImage(data.backgroundUrl || "/assets/background1.jpg");
          setCardBackgroundImage(data.sectionBackgroundUrl || "/assets/background1.jpg");
          setMusicUrl(data.songUrl || "/assets/thousand-years.mp3");
          setPremiumInvitationSections(data.sections);
    
          const newSectionData = {};
    
          if (Array.isArray(data.sections) && data.sections.length > 0) {
            const sectionOrder = data.sections.map((section) => section.type);
            setActiveSectionOrder(sectionOrder);
    
            const newInactiveSectionOrder = defaultInactiveSections.filter(
              (sectionId) => !sectionOrder.includes(sectionId)
            );
            setInactiveSectionOrder(newInactiveSectionOrder);
    
            data.sections.forEach((section) => {
              newSectionData[section.type] = section.data;
            });
          } else {
            setActiveSectionOrder(defaultActiveSections);
            setInactiveSectionOrder(defaultInactiveSections);
          }
    
          setSectionData(newSectionData);
        }
      } catch (error) {
        console.error('Error fetching premium invitation data', error);
      } finally {
        setIsLoading(false);
      }
    };    
  
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

  const uploadStorage = async (file, folder, endpoint = '/api/storage/upload') => {
    const buffer = await fileToArrayBuffer(file);
    const fileBuffer = arrayBufferToBase64(buffer);
    const sanitizedFileName = file.name.replace(/\s+/g, '-');
  
    const response = await axios.post(endpoint, {
      fileName: sanitizedFileName,
      folder,
      fileBuffer,
    }, {
      headers: { Authorization: `Bearer ${token}` },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      }
    });
  
    return response.data.fileUrl;
  };
  

  const saveInvitation = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
  
      let uploadedBackgroundUrl = backgroundImage;
      let uploadedSectionBackgroundUrl = cardBackgroundImage;
      let uploadedMusicUrl = musicUrl;
  
      if (sectionData.backgroundImageFile) {
        uploadedBackgroundUrl = await uploadStorage(sectionData.backgroundImageFile, "premium-invitations");
      }
  
      if (sectionData.cardBackgroundImageFile) {
        uploadedSectionBackgroundUrl = await uploadStorage(sectionData.cardBackgroundImageFile, "premium-invitations");
      }
  
      if (sectionData.musicFile) {
        uploadedMusicUrl = await uploadStorage(sectionData.musicFile, "premium-invitations", "/api/storage/upload-song");
      }
  
      const processedSectionData = { ...sectionData };
  
      for (const sectionId of activeSectionOrder) {
        const section = sectionData[sectionId];
        if (!section) continue;
  
        const newSection = { ...section };
  
        // Subir archivos simples terminados en File
        for (const key in newSection) {
          if (key.endsWith("File") && newSection[key] instanceof File) {
            const fileKey = key;
            const baseKey = key.replace("File", "");
  
            const uploadedUrl = await uploadStorage(newSection[fileKey], "premium-invitations");
            newSection[baseKey] = uploadedUrl;
            delete newSection[fileKey];
          }
        }
  
        // Subir imágenes del arreglo 'images' (carousel)
        if (Array.isArray(newSection.images)) {
          newSection.images = await Promise.all(
            newSection.images.map(async (imgObj) => {
              if (imgObj?.file instanceof File) {
                const uploadedUrl = await uploadStorage(imgObj.file, "premium-invitations");
                return { ...imgObj, src: uploadedUrl, file: undefined };
              }
              return imgObj;
            })
          );
        }
  
        // Subir avatares del arreglo 'familyMembers'
        if (Array.isArray(newSection.familyMembers)) {
          newSection.familyMembers = await Promise.all(
            newSection.familyMembers.map(async (member) => {
              if (member?.avatarFile instanceof File) {
                const uploadedUrl = await uploadStorage(member.avatarFile, "premium-invitations");
                return { ...member, avatar: uploadedUrl, avatarFile: undefined };
              }
              return member;
            })
          );
        }
  
        // Subir avatares del arreglo 'contacts'
        if (Array.isArray(newSection.contacts)) {
          newSection.contacts = await Promise.all(
            newSection.contacts.map(async (contact) => {
              if (contact?.avatarFile instanceof File) {
                const uploadedUrl = await uploadStorage(contact.avatarFile, "premium-invitations");
                return { ...contact, avatar: uploadedUrl, avatarFile: undefined };
              }
              return contact;
            })
          );
        }
  
        processedSectionData[sectionId] = newSection;
      }
  
      const sectionsPayload = activeSectionOrder.map((id, index) => {
        const updated = processedSectionData[id];
        const backup = premiumInvitationSections?.find(sec => sec.type === id)?.data;
        return {
          type: id,
          version: "1.0.0",
          order: index,
          data: updated || backup || {}
        };
      });
  
      const metadata = {
        activeSections: activeSectionOrder,
        inactiveSections: inactiveSectionOrder,
        sections: sectionsPayload,
        otherData: {
          ...processedSectionData,
          backgroundUrl: uploadedBackgroundUrl,
          sectionBackgroundUrl: uploadedSectionBackgroundUrl,
          songUrl: uploadedMusicUrl,
          eventId,
        },
      };
  
      await axios.post('/api/premium-invitation/update', metadata);
  
      Modal.success({
        title: '¡Invitación guardada!',
        content: 'Tu invitación ha sido guardada correctamente.',
        centered: true,
        okText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error guardando la invitación:', error);
      Modal.error({
        title: 'Error al guardar',
        content: 'Ocurrió un problema al guardar la invitación. Intenta de nuevo.',
        centered: true,
        okText: 'Aceptar'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
          isUploading={isUploading}
          uploadProgress={uploadProgress} 
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
                          sectionData={sectionData[id]} 
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
