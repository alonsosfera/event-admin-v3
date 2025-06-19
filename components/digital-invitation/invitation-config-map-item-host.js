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
  }, [item, scaleFactor, item.label, item.customConfig])

  const customConfig = typeof item.customConfig === 'string' ? JSON.parse(item.customConfig) : item.customConfig
  const isButton = customConfig?.isButton || item.key === "confirmButton"

  const getButtonDimensions = () => {
    const fontSize = customConfig.fontSize * scaleFactor
    const textWidth = item.label.length * fontSize * 0.6
    const textHeight = fontSize * 1.2
    const padding = customConfig.buttonStyle?.padding?.split(' ') || [5, 10]
    return {
      width: textWidth + parseInt(padding[0]) || textWidth + 5,
      height: textHeight + parseInt(padding[1]) || textHeight + 10
    }
  }

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
      name="object"
      rotation={isButton ? 90 : 0}>
      {isButton ? (
        <>
          <Rect
            width={getButtonDimensions().width}
            height={getButtonDimensions().height}
            fill={customConfig.buttonStyle?.backgroundColor || "#1890ff"}            
          />
          <Text
            key={item.key}
            text={item.label}
            fill={customConfig.fontColor || "#ffffff"}
            fontFamily={customConfig.fontFamily || "Merienda, cursive"}
            fontSize={customConfig.fontSize * scaleFactor}
            x={parseInt(customConfig.buttonStyle?.padding?.split(' ')[1]) || customConfig.fontSize * scaleFactor * 0.3}
            y={parseInt(customConfig.buttonStyle?.padding?.split(' ')[0]) || customConfig.fontSize * scaleFactor * 0.25}
          />
        </>
      ) : (
        <Text
          key={item.key}
          text={item.label || item.key}
          fill={customConfig.fontColor}
          fontFamily={customConfig.fontFamily || "Merienda, cursive"}
          fontSize={customConfig.fontSize * scaleFactor}
        />
      )}
      {!isButton && (
        <>
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
        </>
      )}
    </Group>
  )
}

export default React.memo(InvitationConfigMapItemHost)
