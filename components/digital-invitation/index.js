import axios from "axios"
import React, { useState, useEffect } from "react"
import { CheckOutlined } from "@ant-design/icons"
import { Button, Spin, Modal, InputNumber, message } from "antd"

import CounterInvitation from "../../helpers/counterInvitation"
import dynamic from "next/dynamic"
const InvitationsListItemText = dynamic(() => import("../designs/invitations/invitations-list-item-text"), { ssr: false })

export const DigitalInvitation = ({ event, invitationId, invitation, isFullscreen }) => {
  const { eventDate, digitalInvitation } = event || {}
  const [scaleFactor, setScaleFactor] = useState(1)
  const [confirmedGuests, setConfirmedGuests] = useState(invitation?.numberGuests)

  useEffect(() => {
    if (invitation) {
      setConfirmedGuests(invitation.numberGuests)
    }
  }, [invitation])

  const handleImageLoad = e => {
    const naturalWidth = e.target.naturalWidth
    const displayWidth = e.target.width

    setScaleFactor(displayWidth / naturalWidth)
  }

  const { confirm } = Modal

  const showConfirm = () => {
    let currentConfirmed = confirmedGuests

    confirm({
      title: "Confirmación",
      content: (
        <div>
          <p>¿Confirmar invitados para {invitation?.invitationName}?</p>
          <InputNumber
            value={currentConfirmed}
            min={1}
            max={invitation?.numberGuests}
            type="number"
            onChange={value => { currentConfirmed = value; setConfirmedGuests(value) }} />
        </div>
      ),
      onOk() {
        handleConfirmation(currentConfirmed)
      },
      onCancel() {}
    })
  }

  const handleConfirmation = async confirmed => {
    if (!confirmed) return
    try {
      await axios.post("/api/invitations/confirm", {
        invitationId,
        confirmed
      })
      message.success("Confirmación enviada")
    } catch (error) {
      console.error("Error al confirmar la invitación:", error)
    }
  }

  if (!event) {
    return (
      <Spin
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }} />
    )
  }

  return (
    <div style={{ display: "flex", height: "100%", alignItems: "center", backgroundColor: isFullscreen ? "#2f2d2c" : "white" }}>
      <div
        style={{
          margin: "0 auto",
          position: "relative",
          width: "max-content",
          height: "max-content"
        }}>
        <img
          onLoad={handleImageLoad}
          alt="Diseño de invitación"
          src={digitalInvitation.fileUrl}
          style={{
            maxWidth: "100vw",
            borderRadius: "10px",
            maxHeight: isFullscreen ? "100vh" : "65vh",
            boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)"
          }} />
        {digitalInvitation.canvaMap.coordinates.map(coordinate => (
          <InvitationsListItemText
            inDigitalInvitation={true}
            key={coordinate.key}
            item={coordinate}
            scaleFactor={scaleFactor} />
        ))}
        <div style={{ position: "absolute", bottom: "1px", left: "50%", transform: "translate(-50%, 0)", maxWidth: "100%" }}>
          <CounterInvitation date={eventDate} />
        </div>
        {invitation && (
          <div
            style={{
              position: "absolute",
              transform: "rotate(270deg)",
              bottom: "200px",
              right: "-64px",
              zIndex: 1000
            }}>
            <Button
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                maxWidth: "170px",
                height: "25px"
              }}
              type="primary"
              size="small"
              icon={<CheckOutlined style={{ marginLeft: "8px" }} />}
              onClick={showConfirm}>
              Confirmar Asistencia
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
