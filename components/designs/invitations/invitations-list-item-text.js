import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import WebFont from "webfontloader"
import { Button, Modal, InputNumber, message } from "antd"
import { CheckOutlined } from "@ant-design/icons"
import axios from "axios"

const InvitationsListItemText = ({ item, scaleFactor, inDigitalInvitation, invitationId, invitation }) => {
  const elementRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [confirmedGuests, setConfirmedGuests] = useState(invitation?.numberGuests)

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

  const customConfig = JSON.parse(item.customConfig || "{}")

  const handleClick = () => {
    if (customConfig.link) {
      window.open(customConfig.link, "_blank")
    }
  }

  useEffect(() => {
    if (WebFont && customConfig.fontFamily) {
      WebFont.load({ google: { families: [customConfig.fontFamily] } })
    }
  }, [customConfig.fontFamily])

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

  if (item.key === "confirmButton") {
    return (
      <div
        ref={elementRef}
        style={{
          position: "absolute",
          top: `${position.y}px`,
          left: `${position.x}px`,
          transform: "rotate(270deg)",
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
    )
  }

  return (
    <div
      ref={elementRef}
      style={{
        textAlign: "center",
        position: "absolute",
        top: `${position.y}px`,
        left: `${position.x}px`,
        fontFamily: customConfig.fontFamily || "Merienda, cursive",
        color: customConfig?.fontColor || "black",
        fontSize: `${customConfig?.fontSize * scaleFactor}px`,
        cursor: customConfig.link ? "pointer" : "",
        textDecoration: customConfig.link ? "underline" : ""
      }}
      onClick={handleClick}>
      {inDigitalInvitation ? item.label : item.label || item.key}
    </div>
  )
}

export default InvitationsListItemText
