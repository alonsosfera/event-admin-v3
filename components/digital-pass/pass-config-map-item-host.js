import React, { useLayoutEffect, useRef, useState, useEffect } from "react"
import { Group, Text } from "react-konva"
import WebFont from "webfontloader"

const PassConfigMapItemHost = ({ item, scaleFactor, dragBoundFunc, onDragEnd, onDragMove }) => {
  const elementRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const customConfig = item.customConfig

  const loadFont = font => {
    if (!font) return
    WebFont.load({ google: { families: [font] } })
  }

  useEffect(() => {
    if (WebFont && customConfig.fontFamily) {
      loadFont(customConfig.fontFamily)
    }
  }, [customConfig.fontFamily])

  useLayoutEffect(() => {
    if (elementRef.current) {
      const width = elementRef.current.children[0].width()
      const height = elementRef.current.children[0].height()
      
      // Set position based on text alignment
      if (customConfig.textAlign === "left") {
        // For left-aligned text, use the x coordinate directly
        setPosition({
          x: item.coordinateX * scaleFactor,
          y: item.coordinateY * scaleFactor - height / 2
        })
      } else {
        // For center-aligned text, subtract half the width to center it
        setPosition({
          x: item.coordinateX * scaleFactor - width / 2,
          y: item.coordinateY * scaleFactor - height / 2
        })
      }
    }
  }, [item, scaleFactor, item.label, customConfig.textAlign])

  return (
    <Group
      draggable
      key={item.key}
      x={position.x}
      y={position.y}
      ref={elementRef}
      dragBoundFunc={pos => dragBoundFunc(pos, item)}
      onDragMove={onDragMove}
      onDragEnd={event => onDragEnd(event, item)}
      name="object">
      <Text
        key={item.key}
        text={item.label || item.key}
        fill={customConfig.fontColor}
        fontFamily={customConfig.fontFamily}
        fontSize={(customConfig.fontSize) * scaleFactor}
        align={customConfig.textAlign || "center"}
      />
    </Group>
  )
}

export default React.memo(PassConfigMapItemHost) 