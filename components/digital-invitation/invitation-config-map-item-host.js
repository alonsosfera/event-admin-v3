import React, { useLayoutEffect, useRef, useState, useEffect } from "react"
import { Group, Text, Rect } from "react-konva"
import WebFont from "webfontloader"

const InvitationConfigMapItemHost = ({ item, scaleFactor, dragBoundFunc, onDragEnd, onDragMove, onDeleteItem }) => {
  const elementRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const loadFont = font => {
    WebFont.load({ google: { families: [font] } })
  }

  useEffect(() => {
    if (WebFont && item.customConfig.fontFamily) {
      loadFont(item.customConfig.fontFamily)
    }
  }, [item.customConfig.fontFamily])

  useLayoutEffect(() => {
    if (elementRef.current) {
      const width = elementRef.current.children[0].width()
      const height = elementRef.current.children[0].height()
      setPosition({
        x: item.coordinateX * scaleFactor - width / 2,
        y: item.coordinateY * scaleFactor - height / 2
      })
    }
  }, [item, scaleFactor, item.label])

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
        fill={item.customConfig.fontColor}
        fontFamily={item.customConfig.fontFamily || "Merienda, cursive"}
        fontSize={item.customConfig.fontSize * scaleFactor}
      />
      
      <Rect
        y={-10}
        x={-10}
        width={20}
        height={20}
        cornerRadius={10}
        style={{ cursor: "pointer" }}
        fill="rgba(255, 255, 255, 0.8)"
        onClick={() => onDeleteItem && onDeleteItem(item)}
      />
      <Text
        y={-5}
        x={-5}
        text="X"
        fontSize={12}
        fill="#ff0000"
        onClick={() => onDeleteItem && onDeleteItem(item)}
      />
    </Group>
  )
}

export default React.memo(InvitationConfigMapItemHost)
