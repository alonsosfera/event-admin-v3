import React, { useLayoutEffect, useRef, useState } from "react"
import { Text } from "react-konva"

const PassConfigMapItem = ({ item, scaleFactor, dragBoundFunc, onDragEnd, onDragMove }) => {
  const elementRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useLayoutEffect(() => {
    if (elementRef.current) {
      // Apply different positioning based on text alignment
      const width = elementRef.current.width()
      const height = elementRef.current.height()
      
      if (item.customConfig?.textAlign === "left") {
        // For left alignment, don't center horizontally
        setPosition({
          x: item.coordinateX * scaleFactor,
          y: item.coordinateY * scaleFactor - (height / 2)
        })
      } else {
        // For center alignment (default), center horizontally
        setPosition({
          x: item.coordinateX * scaleFactor - (width / 2),
          y: item.coordinateY * scaleFactor - (height / 2)
        })
      }
    }
  }, [item, scaleFactor])

  const fontSize = item.customConfig?.fontSize || 38
  const fontColor = item.customConfig?.fontColor || "#000"
  const textAlign = item.customConfig?.textAlign || "center"

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
      align={textAlign}
      dragBoundFunc={pos => dragBoundFunc(pos, item)}
      onDragMove={onDragMove}
      onDragEnd={event => onDragEnd(event, item)}
      name="object" />
  )
}

export default PassConfigMapItem
