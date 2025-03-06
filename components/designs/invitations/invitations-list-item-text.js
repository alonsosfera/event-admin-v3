import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import WebFont from "webfontloader"

const InvitationsListItemText = ({ item, scaleFactor }) => {
  const elementRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

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

  const customConfig = JSON.parse(item.customConfig)

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

  return (
    <div
      ref={elementRef}
      style={{
        textAlign: "center",
        position: "absolute",
        top: `${position.y}px`,
        left: `${position.x}px`,
        fontFamily: customConfig.fontFamily || "Merienda, cursive",
        color: customConfig.link ? "#0000EE" : customConfig?.fontColor || "black",
        fontSize: `${customConfig?.fontSize * scaleFactor}px`,
        cursor: customConfig.link ? "pointer" : ""
      }}
      onClick={handleClick}>
      {item.label || item.key}
    </div>
  )
}

export default InvitationsListItemText
