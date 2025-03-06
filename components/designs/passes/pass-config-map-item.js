import React, { useLayoutEffect, useRef, useState } from "react"
import { Text } from "react-konva"

const PassConfigMapItem = ({ item, scaleFactor, dragBoundFunc, onDragEnd, onDragMove }) => {
  const elementRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useLayoutEffect(() => {
    if (elementRef.current) {
      setPosition({
        x: item.coordinateX * scaleFactor - (elementRef.current?.width() / 2),
        y: item.coordinateY * scaleFactor - (elementRef.current?.height() / 2)
      })
    }
  }, [item, scaleFactor])

  const fontSize = item.customConfig?.fontSize || 38
  const fontColor = item.customConfig?.fontColor || "#000"

  return (
    <Text
      draggable
      key={item.key}
      x={position.x}
      y={position.y}
      text={item.key}
      ref={elementRef}
      fontFamily="Helvetica"
      fontSize={fontSize * scaleFactor}
      fill={fontColor}
      dragBoundFunc={pos => dragBoundFunc(pos, item)}
      onDragMove={onDragMove}
      onDragEnd={event => onDragEnd(event, item)}
      name="object" />
  )
}

export default PassConfigMapItem
