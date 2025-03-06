import React, { useRef } from "react"

const PassListItemText = ({ item, scaleFactor }) => {
  const elementRef = useRef(null)

  return (
    <div
      ref={elementRef}
      style={{
        color: item.customConfig?.fontColor || undefined,
        position: "absolute",
        fontFamily: "Helvetica",
        fontSize: `${(item.customConfig?.fontSize || 38) * scaleFactor}px`,
        top: `${item.coordinateY * scaleFactor - (38 * scaleFactor / 0.7 / 2)}px`,
        left: `${item.coordinateX * scaleFactor - (item.key.length * 38 * scaleFactor * 0.45 / 2)}px`
      }}>
      {item.key}
    </div>
  )
}

export default PassListItemText
