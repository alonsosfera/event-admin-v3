import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import WebFont from "webfontloader"
import axios from "axios"
import { Modal, InputNumber, message } from "antd"

const InvitationsListItemText = ({ 
  item, 
  scaleFactor, 
  inDigitalInvitation, 
  invitationId, 
  invitation, 
  onConfirmationChange 
}) => {
  const elementRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [confirmedGuests, setConfirmedGuests] = useState(invitation?.numberGuests)

  useEffect(() => {
    if (invitation) {
      setConfirmedGuests(invitation.numberGuests)
    }
  }, [invitation])

  const calculatePosition = () => {
    if (elementRef.current) {
      const width = elementRef.current.clientWidth
      const height = elementRef.current.clientHeight
      setPosition({
        x: item.coordinateX * scaleFactor - width / 2,
        y: item.coordinateY * scaleFactor - height / 2
      })
    }
  }

  useLayoutEffect(() => {
    const fontReady = document.fonts ? document.fonts.ready : Promise.resolve()
    fontReady.then(calculatePosition)

    const resizeObserver = new ResizeObserver(() => calculatePosition())
    if (elementRef.current) {
      resizeObserver.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current)
      }
    }
  }, [item, scaleFactor])

  useEffect(() => {
    const handleResize = () => calculatePosition()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [item, scaleFactor])

  const customConfig = typeof item.customConfig === 'string' ? JSON.parse(item.customConfig) : item.customConfig
  const isButton = customConfig?.isButton

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
      if (onConfirmationChange) {
        onConfirmationChange(confirmed)
      }
    } catch (error) {
      console.error("Error al confirmar la invitación:", error)
    }
  }

  const handleClick = () => {
      showConfirm()
  }

  useEffect(() => {
    if (WebFont && customConfig.fontFamily) {
      WebFont.load({ google: { families: [customConfig.fontFamily] } })
    }
  }, [customConfig.fontFamily])

  const buttonStyle = {
    textAlign: "center",
    position: "absolute",
    top: `${position.y}px`,
    left: `${position.x}px`,
    fontFamily: customConfig.fontFamily || "Merienda, cursive",
    color: customConfig?.fontColor || "black",
    fontSize: `${customConfig?.fontSize * scaleFactor}px`,
    cursor: customConfig.link || isButton ? "pointer" : "",
    textDecoration: customConfig.link ? "underline" : "",
    ...(isButton && {
      backgroundColor: customConfig.buttonStyle?.backgroundColor || "#1890ff",
      padding: "5px 10px",
      borderRadius: `${4 * scaleFactor}px`,
      color: "#ffffff",
      display: "inline-block",
      minWidth: `${120 * scaleFactor}px`,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
      }
    })
  }

  return (
    <div
      ref={elementRef}
      style={buttonStyle}
      onClick={handleClick}>
      {inDigitalInvitation ? item.label : item.label || item.key}
    </div>
  )
}

export default InvitationsListItemText
