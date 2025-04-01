import { Col, Modal, Row, notification, Tooltip, Button, Collapse, Upload, Image, Alert } from "antd"
import { useMemo, useState, useEffect } from "react"
import axios from "axios"
import { parseCookies } from "nookies"
import short from "short-uuid"
import { CopyOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons"
import InvitationField from "./input-modal"
import { InvitationConfigMapHost } from "./invitation-config-map-host"
import { fileToArrayBuffer, arrayBufferToBase64 } from "../designs/helpers"
import { InvitationConfigItem } from "../designs/invitations/invitation-config-item"

export const DigitalInvitationModal = ({ isOpen, onCancel, onSubmit, event }) => {
  const translator = short()
  const [isSaving, setIsSaving] = useState(false)
  const [state, setState] = useState({})
  const coordinates = event?.digitalInvitation?.canvaMap?.coordinates || []
  const { token } = parseCookies()
  const [customConfig, setCustomConfig] = useState({})
  const [updatedCoordinates, setUpdatedCoordinates] = useState(coordinates)
  const [allInvitations, setAllInvitations] = useState([])
  const [previewFile, setPreviewFile] = useState(null)
  const [activeSource, setActiveSource] = useState(null)
  const [newItems, setNewItems] = useState([])  
  const [scaleFactor, setScaleFactor] = useState(1)
  const [deletedKeys, setDeletedKeys] = useState([])

  useEffect(() => {
    if (coordinates.length > 0) {
      const initialState = coordinates.reduce((acc, coordinate) => {
        acc[coordinate.key] = coordinate.label || ""
        return acc
      }, {})
      setState(initialState)
    }
  }, [coordinates])

  const [selectedInvitationId, setSelectedInvitationId] = useState(null)
  const [selectedInvitationUrl, setSelectedInvitationUrl] = useState(null)

  const handleSelectInvitation = (id) => {
    const selected = allInvitations.find(inv => inv.id === id)
  
    if (selected) {
      setSelectedInvitationId(id)
      setSelectedInvitationUrl(selected.fileUrl || null)
      setActiveSource('select')
      setNewItems([])
  
      const coords = selected.canvaMap?.coordinates || []
  
      const newState = coords.reduce((acc, coordinate) => {
        acc[coordinate.key] = coordinate.label || ""
        return acc
      }, {})
      setState(newState)
  
      const newCustomConfig = coords.reduce((acc, coordinate) => {
        const parsed = JSON.parse(coordinate.customConfig || "{}")
        if (parsed.link) {
          acc[coordinate.key] = parsed.link
        }
        return acc
      }, {})
      setCustomConfig(newCustomConfig)
  
      setUpdatedCoordinates(coords)
    }
  }
  
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
    
    newItems.length > 0 ?

    setNewItems(prevCoordinates =>
      prevCoordinates.map(coord =>
        coord.key === key
          ? { ...coord, coordinateX: newX, coordinateY: newY }
          : coord
      )
    )

    : 

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

  const handleSubmit = async () => {
    setIsSaving(true)
  
    try {
      let fileUrl = selectedInvitationUrl

      if (!fileUrl) {
        fileUrl = event?.digitalInvitation?.fileUrl
      }
  
      if (activeSource === 'upload' && previewFile?.file) {
      const arrayBuffer = await fileToArrayBuffer(previewFile.file)
      const fileBuffer = arrayBufferToBase64(arrayBuffer)
      const fileType = previewFile.file.type.split("/")[1]

      const { data } = await axios.post("/api/storage/upload", {
        fileName: previewFile.file.name,
        fileType,
        folder: "invitations",
        fileBuffer
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      fileUrl = data.fileUrl
  
        const response = await axios.get("/api/design/invitations", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAllInvitations(response.data?.invitations || [])
      }
  
      const { room, room_name, ...eventToSave } = event
  
     const finalCoordinates = newItems.length > 0 ? newItems : updatedCoordinates;
      await axios.put(`/api/events/update/${event.id}`, {
        ...eventToSave,
        digitalInvitation: {
          ...event?.digitalInvitation,
          fileUrl,
          canvaMap: {
            ...event?.digitalInvitation?.canvaMap,
            coordinates: finalCoordinates.map(coordinate => {
              const coordCustomConfig = JSON.parse(coordinate.customConfig || "{}")
              return {
                ...coordinate,
                label: newItems.length > 0 ? coordinate.label : state[coordinate.key],
                customConfig: JSON.stringify({
                  ...coordCustomConfig,
                  link: customConfig[coordinate.key] || coordCustomConfig.link || undefined
                })
              }
            })
          }
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      handleCopyDigitalInviteToClipboard()
      onSubmit()
  
    } catch (error) {
      console.error("Error al guardar:", error)
      notification.error({
        message: "Error al guardar",
        description: "Hubo un problema al guardar la invitación.",
        placement: "topRight"
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 12

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

  const resetCoordinates = () => {
    setUpdatedCoordinates([])
  }
  
  const modalTitle = useMemo(() => (
    <>
      <Row gutter={[24, 8]}>
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
          <Collapse style={{ marginTop: 8 }}>
            <Collapse.Panel header="Seleccionar diseño" key="1">
              <Upload
                beforeUpload={file => {
                  const previewUrl = URL.createObjectURL(file)
                  setUpdatedCoordinates([])
                  setPreviewFile({ file, previewUrl })
                  setActiveSource('upload')
                  return false
                }}
                showUploadList={false}
                accept="image/*"
              >
                <Button type="primary" style={{ marginBottom: 16 }}>
                  Cargar nuevo diseño
                </Button>
              </Upload>

              <Row justify="center" align="middle">
                <Button
                  shape="circle"
                  icon={<LeftOutlined />}
                  size="large"
                  style={{ marginRight: 16 }}
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                />

                <Row gutter={[16, 16]} style={{ flex: 1, justifyContent: "center" }}>
                {previewFile?.previewUrl && (
                  <Col xs={12} sm={6} md={4}>
                    <Image
                      preview={false}
                      src={previewFile.previewUrl}
                      alt="Vista previa subida"
                      onClick={() => {
                        setActiveSource('upload')
                        setSelectedInvitationId(null)
                        setSelectedInvitationUrl(null)
                      }}
                      style={{
                        objectFit: "contain",
                        borderRadius: "4px",
                        border: activeSource === 'upload' ? '1px solid #1890ff' : '1px solid #f0f0f0',
                        boxShadow: activeSource === 'upload' ? '0 0px 30px rgba(24,144,255,0.6)' : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  </Col>
                )}

                  {paginatedInvitations.map(invite => (
                    <Col key={invite.id} xs={12} sm={6} md={4}>
                      <Image
                        onClick={() => handleSelectInvitation(invite.id)}
                        preview={false}
                        alt={invite.fileName}
                        src={invite.fileUrl}
                        style={{
                          objectFit: "contain",
                          borderRadius: "4px",
                          border: invite.id === selectedInvitationId ? '1px solid #1890ff' : '1px solid #f0f0f0',
                          boxShadow: invite.id === selectedInvitationId ? '0 0px 30px rgba(24,144,255,0.6)' : 'none',
                          cursor: 'pointer'
                        }}
                      />
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
            </Collapse.Panel>
          </Collapse>
        </Col>
        <Col align="center" xs={8}>
        {updatedCoordinates.length > 0 &&
          <Button
            type="primary" danger
            onClick={resetCoordinates}>
            Borrar elementos
          </Button>}
        </Col>
        <Col align="center" xs={16}>
          <Alert
            showIcon
            type="info"
            message="Arrastra los elementos para reorganizarlos"
            style={{
              fontSize: "12px",
              padding: "8px 16px",
               }}/>
        </Col>
      </Row>
    </>
  ), [allInvitations, paginatedInvitations, currentPage])
  
  const sortCoordinates = (a, b) => {
    const yDiff = a.coordinateY - b.coordinateY
    const xDiff = a.coordinateX - b.coordinateX
    if (Math.abs(yDiff) < 30) return xDiff
    return yDiff
  }

  useEffect(() => {
    if(activeSource === "upload") {
      setUpdatedCoordinates([])
    }
  }, [activeSource])

  const handleAddItem = (newItem) => {
  console.log("newItem recibido:", newItem);

  const itemExists = newItems.some(item => item.key === newItem.key);

  if (itemExists) {
    notification.warning({
      message: "Este elemento ya existe",
      description: `El texto "${newItem.key}" ya ha sido agregado. No se puede repetir.`,
      placement: "topRight",
    });
    return;
  }

  const customConfigString = JSON.stringify(newItem.customConfig || {
    fontSize: 12,
    fontColor: "000000", 
    fontFamily: "Merienda, cursive"
  });

  setNewItems(prevItems => {
    const updatedItems = [
      ...prevItems,
      {
        key: newItem.key,
        coordinateX: 200,
        coordinateY: 200,
        label: newItem.key,
        customConfig: customConfigString,
      }
    ];
    return updatedItems;
  });
};
  
  const handleScaleFactorChange = (newScaleFactor) => {
    setScaleFactor(newScaleFactor)
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
        {updatedCoordinates.length > 0 ? (
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
        ) : (
          <Col span={8}>
            <InvitationConfigItem
              onSubmit={handleAddItem}
              scaleFactor={scaleFactor}
              selectedFile={event?.digitalInvitation}
            />
          </Col> 
          )}        
        <Col span={16}>
          <InvitationConfigMapHost
            onScaleFactorChange={handleScaleFactorChange}
            selectedInvitationUrl={
              activeSource === 'upload'
                ? previewFile?.previewUrl
                : activeSource === 'select'
                ? selectedInvitationUrl
                : event?.digitalInvitation?.fileUrl
            }
            event={{
              ...event,
              digitalInvitation: {
                ...event.digitalInvitation,
                canvaMap: {
                  ...event.digitalInvitation?.canvaMap,
                  coordinates: newItems.length > 0 ? newItems : updatedCoordinates
                }
              }
            }}
            onDeleteItem={item => {
              setDeletedKeys(prev => [...prev, item.key])
              newItems.length > 0
                ? setNewItems(prev => prev.filter(i => i.key !== item.key))
                : setUpdatedCoordinates(prev => prev.filter(i => i.key !== item.key))
            }}
            onPositionChange={handlePositionChange} />
        </Col>
      </Row>
    </Modal>
  )
} 
