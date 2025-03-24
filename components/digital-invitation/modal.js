import { Col, Modal, Row, notification, Tooltip, Button, Card } from "antd"
import { useMemo, useState, useEffect } from "react"
import axios from "axios"
import { parseCookies } from "nookies"
import short from "short-uuid"
import { CopyOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons"
import InvitationField from "./input-modal"
import { InvitationConfigMapHost } from "./invitation-config-map-host"
import { Image } from "antd"

export const DigitalInvitationModal = ({ isOpen, onCancel, onSubmit, event }) => {
  const translator = short()
  const [isSaving, setIsSaving] = useState(false)
  const [state, setState] = useState({})
  const coordinates = event?.digitalInvitation?.canvaMap?.coordinates || []
  const { token } = parseCookies()
  const [customConfig, setCustomConfig] = useState({})
  const [updatedCoordinates, setUpdatedCoordinates] = useState(coordinates)
  const [allInvitations, setAllInvitations] = useState([])

  useEffect(() => {
    if (coordinates.length > 0) {
      const initialState = coordinates.reduce((acc, coordinate) => {
        acc[coordinate.key] = coordinate.label || ""
        return acc
      }, {})
      setState(initialState)
    }
  }, [coordinates])

  useEffect(() => {
    const fetchAllInvitations = async () => {
      try {
        const response = await axios.get("/api/design/invitations", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setAllInvitations(response.data?.invitations || [])
      } catch (error) {
        console.error("Error al obtener las invitaciones digitales:", error)
      }
    }
  
    fetchAllInvitations()
  }, [])
  

  const handlePositionChange = (key, newX, newY) => {
    setUpdatedCoordinates(prevCoordinates =>
      prevCoordinates.map(coord =>
        coord.key === key
          ? { ...coord, coordinateX: newX, coordinateY: newY }
          : coord
      )
    )
  }

  const onValueChange = (event, key) => {
    const newValue = event.target.value
    setState(prevState => ({
      ...prevState,
      [key]: newValue
    }))

    setUpdatedCoordinates(prevCoordinates =>
      prevCoordinates.map(coord =>
        coord.key === key
          ? {
              ...coord,
              label: newValue,
              customConfig: JSON.stringify({
                ...JSON.parse(coord.customConfig || "{}"),
                label: newValue
              })
            }
          : coord
      )
    )
  }

  const onLinkChange = (key, link) => {
    setCustomConfig(prevConfig => ({
      ...prevConfig,
      [key]: link
    }))
  }

  const handleCopyDigitalInviteToClipboard = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URI}/digital/e-${translator.fromUUID(event.id)}`)
    notification.info({
      message: "Link de invitación digital copíado al portapapeles",
      placement: "topRight"
    })
  }

  const handleSubmit = () => {
    setIsSaving(true)
    const { room, room_name, ...eventToSave } = event
    axios.put(`/api/events/update/${event.id}`, { ...eventToSave,
      digitalInvitation: getDigitalInvitation() }, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(() => {
        handleCopyDigitalInviteToClipboard()
        onSubmit()
      })
      .catch(error => {
        console.error("Error al enviar datos:", error)
      })
      .finally(() => setIsSaving(false))
  }

  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 4

  const paginatedInvitations = allInvitations.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  )

  const totalPages = Math.ceil(allInvitations.length / pageSize)

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1)
  }
  
  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1)
  }
  
  const modalTitle = useMemo(() => (
    <>
      <Row>
        <Col xs={24}>
          Invitación Digital&nbsp;
          <Tooltip title="Copiar link a portapapeles">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopyDigitalInviteToClipboard}
            />
          </Tooltip>
        </Col>
  
        <Col xs={24}>
          <Row justify="center" align="middle" style={{ marginTop: 8 }}>
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              size="large"
              style={{ marginRight: 16 }}
              onClick={handlePrev}
              disabled={currentPage === 0}
            />   
              <Row gutter={[16, 16]} style={{ flex: 1, justifyContent: "center" }}>
                {paginatedInvitations.map(invite => (
                  <Col key={invite.id} xs={12} sm={8} md={6}>
                    <Card
                      hoverable
                      cover={
                         <Image 
                         alt={invite.fileName}
                         src={invite.fileUrl}
                         style={{ height: 200, objectFit: "cover", borderRadius: "4px" }} />                        
                      }
                    >
                      <Card.Meta title={invite.fileName} />
                    </Card>
                  </Col>
                ))}
              </Row>
    
              <Button
                shape="circle"
                icon={<RightOutlined />}
                size="large"
                style={{ marginLeft: 16 }}
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
              />
            </Row>
          </Col>
        </Row>
    </>
  ), [allInvitations, paginatedInvitations, currentPage])
  

  const getDigitalInvitation = () => {
    return {
      ...event?.digitalInvitation,
      canvaMap: {
        ...event?.digitalInvitation?.canvaMap,
        coordinates: updatedCoordinates.map(coordinate => {
          const coordCustomConfig = JSON.parse(coordinate.customConfig || "{}")
          return {
            ...coordinate,
            label: state[coordinate.key],
            customConfig: JSON.stringify({
              ...coordCustomConfig,
              link: customConfig[coordinate.key] || coordCustomConfig.link || undefined
            })
          }
        })
      }
    }
  }

  const sortCoordinates = (a, b) => {
    const yDiff = a.coordinateY - b.coordinateY
    const xDiff = a.coordinateX - b.coordinateX
    if (Math.abs(yDiff) < 30) return xDiff
    return yDiff
  }

  return (
    <Modal
      centered
      width={800}
      title={modalTitle}
      open={isOpen}
      onCancel={onCancel}
      okText="Guardar"
      confirmLoading={isSaving}
      onOk={handleSubmit}>
      <Row gutter={24}>
        <Col span={8}>
          {updatedCoordinates.sort(sortCoordinates).map(coordinate => (
            <InvitationField
              key={coordinate.key}
              label={coordinate.key}
              value={state[coordinate.key] || ""}
              linkValue={
                customConfig[coordinate.key] ||
                JSON.parse(coordinate.customConfig || "{}").link ||
                ""
              }
              onChange={event => onValueChange(event, coordinate.key)}
              onLinkChange={link => onLinkChange(coordinate.key, link)} />
            ))}
        </Col>
        <Col span={16}>
          <InvitationConfigMapHost
            event={{
              ...event,
              digitalInvitation: {
                ...event.digitalInvitation,
                canvaMap: {
                  ...event.digitalInvitation?.canvaMap,
                  coordinates: updatedCoordinates
                }
              }
            }}
            onPositionChange={handlePositionChange} />
        </Col>
      </Row>
    </Modal>
  )
}
