import { Col, Modal, Row, notification, Tooltip, Button } from "antd"
import { DigitalInvitation } from "./index"
import { useMemo, useState, useEffect } from "react"
import axios from "axios"
import { parseCookies } from "nookies"
import short from "short-uuid"
import { CopyOutlined } from "@ant-design/icons"
import InvitationField from "./input-modal"

export const DigitalInvitationModal = ({ isVisible, onCancel, onSubmit, event }) => {
  const translator = short()
  const [isSaving, setIsSaving] = useState(false)
  const [state, setState] = useState({})
  const coordinates = event?.digitalInvitation?.canvaMap?.coordinates || []
  const { token } = parseCookies()
  const [customConfig, setCustomConfig] = useState({})

  useEffect(() => {
    if (coordinates.length > 0) {
      const initialState = coordinates.reduce((acc, coordinate) => {
        acc[coordinate.key] = coordinate.label || ""
        return acc
      }, {})
      setState(initialState)
    }
  }, [coordinates])

  const onValueChange = (event, key) => {
    event.persist()
    setState(prevState => ({ ...prevState, [key]: event.target?.value }))
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

  const modalTitle = useMemo(() => (
    <div>
      Invitación Digital&nbsp;
      <Tooltip title="Copiar link a portapapeles">
        <Button
          type="text"
          size="small"
          icon={<CopyOutlined />}
          onClick={handleCopyDigitalInviteToClipboard} />
      </Tooltip>
    </div>
  ), [])

  const getDigitalInvitation = () => {
    return {
      ...event?.digitalInvitation,
      canvaMap: {
        ...event?.digitalInvitation?.canvaMap,
        coordinates: coordinates.map(coordinate => {
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
      width={900}
      title={modalTitle}
      visible={isVisible}
      onCancel={onCancel}
      okText="Guardar"
      confirmLoading={isSaving}
      onOk={handleSubmit}>
      <Row style={{ marginBottom: "1rem" }}>
        <Col span={7}>
          {coordinates.sort(sortCoordinates).map(coordinate => (
            <InvitationField
              key={coordinate.key}
              label={coordinate.key}
              value={state[coordinate.key] || ""}
              linkValue={JSON.parse(coordinate.customConfig || "{}").link || ""}
              onChange={event => onValueChange(event, coordinate.key)}
              onLinkChange={link => onLinkChange(coordinate.key, link)} />
            ))}
        </Col>
        <Col span={17}>
          <DigitalInvitation event={{ ...event, digitalInvitation: getDigitalInvitation() }} />
        </Col>
      </Row>
    </Modal>
  )
}
