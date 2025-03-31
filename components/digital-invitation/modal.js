import { Modal, Button, Tooltip, Alert, Row, Col, notification } from "antd"
import { useEffect, useMemo, useState } from "react"
import { parseCookies } from "nookies"
import short from "short-uuid"
import { CopyOutlined } from "@ant-design/icons"
import axios from "axios"

import { DesignSelector } from "./design-selector"
import { InvitationEditorLayout } from "./invitation-editor-layout"
import { fileToArrayBuffer, arrayBufferToBase64 } from "../designs/helpers"

export const DigitalInvitationModal = ({ isOpen, onCancel, onSubmit, event }) => {
  const translator = short()
  const { token } = parseCookies()

  const [isSaving, setIsSaving] = useState(false)
  const [state, setState] = useState({})
  const [customConfig, setCustomConfig] = useState({})
  const [updatedCoordinates, setUpdatedCoordinates] = useState([])
  const [newItems, setNewItems] = useState([])
  const [deletedKeys, setDeletedKeys] = useState([])
  const [previewFile, setPreviewFile] = useState(null)
  const [selectedInvitationId, setSelectedInvitationId] = useState(null)
  const [selectedInvitationUrl, setSelectedInvitationUrl] = useState(null)
  const [allInvitations, setAllInvitations] = useState([])
  const [activeSource, setActiveSource] = useState(null)
  const [scaleFactor, setScaleFactor] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)

  const coordinates = event?.digitalInvitation?.canvaMap?.coordinates || []

  useEffect(() => {
    setUpdatedCoordinates(coordinates)
    if (coordinates.length > 0) {
      const initialState = coordinates.reduce((acc, c) => {
        acc[c.key] = c.label || ""
        return acc
      }, {})
      setState(initialState)
    }
  }, [coordinates])

  useEffect(() => {
    const fetchAllInvitations = async () => {
      try {
        const res = await axios.get("/api/design/invitations", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAllInvitations(res.data?.invitations || [])
      } catch (err) {
        console.error("Error al obtener invitaciones:", err)
      }
    }

    fetchAllInvitations()
  }, [])

  const handleSelectInvitation = (id) => {
    const selected = allInvitations.find(inv => inv.id === id)
    if (!selected) return

    setSelectedInvitationId(id)
    setSelectedInvitationUrl(selected.fileUrl || null)
    setActiveSource("select")
    setNewItems([])

    const coords = selected.canvaMap?.coordinates || []
    setUpdatedCoordinates(coords)

    const newState = coords.reduce((acc, c) => {
      acc[c.key] = c.label || ""
      return acc
    }, {})
    setState(newState)

    const newConfig = coords.reduce((acc, c) => {
      const parsed = JSON.parse(c.customConfig || "{}")
      if (parsed.link) acc[c.key] = parsed.link
      return acc
    }, {})
    setCustomConfig(newConfig)
  }

  const onValueChange = (e, key) => {
    const newValue = e.target.value
    setState(prev => ({ ...prev, [key]: newValue }))

    setUpdatedCoordinates(prev =>
      prev.map(c =>
        c.key === key
          ? {
              ...c,
              label: newValue,
              customConfig: JSON.stringify({
                ...JSON.parse(c.customConfig || "{}"),
                label: newValue
              })
            }
          : c
      )
    )
  }

  const onLinkChange = (key, link) => {
    setCustomConfig(prev => ({ ...prev, [key]: link }))
  }

  const handlePositionChange = (key, newX, newY) => {
    if (newItems.length > 0) {
      setNewItems(prev =>
        prev.map(c => (c.key === key ? { ...c, coordinateX: newX, coordinateY: newY } : c))
      )
    } else {
      setUpdatedCoordinates(prev =>
        prev.map(c => (c.key === key ? { ...c, coordinateX: newX, coordinateY: newY } : c))
      )
    }
  }

  const handleAddItem = (newItem) => {
    const exists = newItems.some(item => item.key === newItem.key)
    if (exists) {
      return notification.warning({
        message: "Este elemento ya existe",
        description: `"${newItem.key}" ya fue agregado.`,
        placement: "topRight"
      })
    }

    setNewItems(prev => [
      ...prev,
      {
        key: newItem.key,
        coordinateX: 200,
        coordinateY: 200,
        label: newItem.key,
        customConfig: JSON.stringify(newItem.customConfig || {
          fontSize: 12,
          fontColor: "000000",
          fontFamily: "Merienda, cursive"
        })
      }
    ])
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URI}/digital/e-${translator.fromUUID(event.id)}`)
    notification.info({
      message: "Link de invitación digital copíado al portapapeles",
      placement: "topRight"
    })
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      let fileUrl = selectedInvitationUrl || event?.digitalInvitation?.fileUrl

      if (activeSource === "upload" && previewFile?.file) {
        const buffer = await fileToArrayBuffer(previewFile.file)
        const fileBuffer = arrayBufferToBase64(buffer)
        const fileType = previewFile.file.type.split("/")[1]

        const uploadRes = await axios.post("/api/storage/upload", {
          fileName: previewFile.file.name,
          fileType,
          folder: "invitations",
          fileBuffer
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        fileUrl = uploadRes.data.fileUrl
      }

      const coordsToSave = (newItems.length > 0 ? newItems : updatedCoordinates).map(c => {
        const parsedConfig = JSON.parse(c.customConfig || "{}")
        return {
          ...c,
          label: c.label || state[c.key],
          customConfig: JSON.stringify({
            ...parsedConfig,
            link: customConfig[c.key] || parsedConfig.link
          })
        }
      })

      const { room, room_name, ...eventToSave } = event

      await axios.put(`/api/events/update/${event.id}`, {
        ...eventToSave,
        digitalInvitation: {
          ...event?.digitalInvitation,
          fileUrl,
          canvaMap: { coordinates: coordsToSave }
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      handleCopyLink()
      onSubmit()

    } catch (err) {
      console.error("Error al guardar:", err)
      notification.error({
        message: "Error al guardar",
        description: "No se pudo guardar la invitación.",
        placement: "topRight"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const modalTitle = useMemo(() => (
    <Row gutter={[24, 8]}>
      <Col xs={24}>
        Invitación Digital&nbsp;
        <Tooltip title="Copiar link al portapapeles">
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={handleCopyLink}
          />
        </Tooltip>
      </Col>

      <Col xs={24}>
        <DesignSelector
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
          activeSource={activeSource}
          setActiveSource={setActiveSource}
          selectedInvitationId={selectedInvitationId}
          setSelectedInvitationId={setSelectedInvitationId}
          setSelectedInvitationUrl={setSelectedInvitationUrl}
          allInvitations={allInvitations}
          setAllInvitations={setAllInvitations}
          handleSelectInvitation={handleSelectInvitation}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setUpdatedCoordinates={setUpdatedCoordinates}
        />
      </Col>

      <Col xs={8} style={{ textAlign: "center" }}>
        {updatedCoordinates.length > 0 && (
          <Button type="primary" danger onClick={() => setUpdatedCoordinates([])}>Borrar elementos</Button>
        )}
      </Col>

      <Col xs={16}>
        <Alert
          showIcon
          type="info"
          message="Arrastra los elementos para reorganizarlos"
          style={{ fontSize: "12px", padding: "8px 16px", marginBottom: "4px" }}
        />
      </Col>
    </Row>
  ), [ previewFile, activeSource, selectedInvitationId, allInvitations, currentPage, updatedCoordinates ])

  return (
    <Modal
      centered
      width={800}
      title={modalTitle}
      open={isOpen}
      onCancel={onCancel}
      cancelText="Cancelar"
      okText="Guardar"
      confirmLoading={isSaving}
      onOk={handleSubmit}
    >
      <InvitationEditorLayout
        updatedCoordinates={updatedCoordinates}
        newItems={newItems}
        state={state}
        customConfig={customConfig}
        onValueChange={onValueChange}
        onLinkChange={onLinkChange}
        handleAddItem={handleAddItem}
        scaleFactor={scaleFactor}
        selectedFile={event?.digitalInvitation}
        selectedInvitationUrl={selectedInvitationUrl}
        previewFile={previewFile}
        activeSource={activeSource}
        event={event}
        onScaleFactorChange={setScaleFactor}
        onPositionChange={handlePositionChange}
        onDeleteItem={(item) => {
          setDeletedKeys(prev => [...prev, item.key])
          newItems.length > 0
            ? setNewItems(prev => prev.filter(i => i.key !== item.key))
            : setUpdatedCoordinates(prev => prev.filter(i => i.key !== item.key))
        }}
      />
    </Modal>
  )
}
