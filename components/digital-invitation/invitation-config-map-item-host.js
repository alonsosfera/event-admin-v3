import React, { useLayoutEffect, useRef, useState } from "react"
import { Group, Text } from "react-konva"

const InvitationConfigMapItemHost = ({ item, scaleFactor, dragBoundFunc, onDragEnd, onDragMove }) => {
  const elementRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

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
        fontSize={item.customConfig.fontSize * scaleFactor} />
    </Group>
  )
}

export default React.memo(InvitationConfigMapItemHost)
