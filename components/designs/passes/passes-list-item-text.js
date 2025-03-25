import React, { useRef, useEffect, useState } from "react"

const PassListItemText = ({ item, scaleFactor }) => {
  const elementRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (elementRef.current) {
      setDimensions({
        width: elementRef.current.offsetWidth,
        height: elementRef.current.offsetHeight
      })
    }
  }, [])

  return (
    <div
      ref={elementRef}
      style={{
        color: item.customConfig?.fontColor || undefined,
        position: "absolute",
        fontFamily: "Helvetica",
        fontSize: `${(item.customConfig?.fontSize || 38) * scaleFactor}px`,
        top: `${item.coordinateY * scaleFactor - (dimensions.height / 2)}px`,
        left: `${item.coordinateX * scaleFactor - (dimensions.width / 2)}px`
      }}>
      {item.key}
    </div>
  )
}

export default PassListItemText
