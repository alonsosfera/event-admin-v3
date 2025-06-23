import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import WebFont from "webfontloader"
import { CheckOutlined } from "@ant-design/icons"

const InvitationsListItemText = ({ 
  item, 
  scaleFactor, 
  inDigitalInvitation, 
  invitation,
  showConfirm,
  invitationList
}) => {
  const elementRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [confirmedGuests, setConfirmedGuests] = useState(invitation?.numberGuests)
  const [isHovered, setIsHovered] = useState(false);

  const customConfig = typeof item.customConfig === 'string' ? JSON.parse(item.customConfig) : item.customConfig
  const isButton = customConfig?.isButton

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


  const handleClick = () => {  
    if (isButton && invitation) {
      showConfirm()
    } else if (isButton && !invitation) {
      null
    } else if (customConfig.link) {
      window.open(customConfig.link.link, "_blank")
    }
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
    left: invitationList && isButton ? `${position.x - 2}px`  : `${position.x}px`,
    fontFamily: customConfig.fontFamily || "Merienda, cursive",
    color: customConfig?.fontColor || "black",
    fontSize: `${customConfig?.fontSize * scaleFactor}px`,
    cursor: customConfig.link || isButton && !invitationList ? "pointer" : "",
    textDecoration: customConfig.link && !isButton ? "underline" : "",
    whiteSpace: "nowrap",
    ...(isButton && {
      backgroundColor: isHovered && !invitationList ? "#00bfff" : (customConfig.buttonStyle?.backgroundColor || "#1890ff"),
      padding: invitationList ? "2px 4px" : "5px 10px",
      borderRadius: invitationList ? "2px" : "5px",
      transform: "rotate(-90deg)",
      transformOrigin: "top left",
    })
  }

  return (
    <div
      ref={elementRef}
      style={buttonStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {inDigitalInvitation ? item.label : item.label || item.key}
      {isButton && <CheckOutlined style={{ marginLeft: "8px" }} />}
    </div>
  )
}

export default InvitationsListItemText
