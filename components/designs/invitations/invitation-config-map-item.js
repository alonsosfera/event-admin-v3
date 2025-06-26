import React, { useLayoutEffect, useRef, useState, useEffect } from "react"
import { Group, Rect, Text } from "react-konva"
import WebFont from "webfontloader"

const InvitationConfigMapItem = ({ item, scaleFactor, dragBoundFunc, onDragEnd, onDeleteItem, onDragMove }) => {
  const elementRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const customConfig = typeof item.customConfig === 'string' ? JSON.parse(item.customConfig) : item.customConfig
  const isButton = customConfig?.isButton || item.key === "confirmButton"

  useEffect(() => {
    if (WebFont && customConfig.fontFamily) {
      WebFont.load({ google: { families: [customConfig.fontFamily] } })
    }
  }, [customConfig.fontFamily])

  useLayoutEffect(() => {
    if (elementRef.current) {
      const width = elementRef.current.children[0].width()
      const height = elementRef.current.children[0].height()
      setPosition({
        x: item.coordinateX * scaleFactor - width / 2,
        y: item.coordinateY * scaleFactor - height / 2
      })
    }
  }, [item, scaleFactor, item.label, customConfig])

  const getButtonDimensions = () => {
    const fontSize = customConfig.fontSize * scaleFactor
    const textWidth = (item.label?.length || item.key.length) * fontSize * 0.6
    const textHeight = fontSize * 1.2
    // padding: '5px 10px' por defecto
    let padding = [5, 10]
    if (customConfig.buttonStyle?.padding) {
      const pad = customConfig.buttonStyle.padding.split(' ')
      padding = [parseInt(pad[0]) || 5, parseInt(pad[1]) || 10]
    }
    return {
      width: textWidth + padding[1] * 2,
      height: textHeight + padding[0] * 2
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
      rotation={isButton ? -90 : 0}
    >
      {isButton ? (
        <>
          <Rect
            width={getButtonDimensions().width}
            height={getButtonDimensions().height}
            fill={customConfig.buttonStyle?.backgroundColor || "#1890ff"}
          />
          <Text
            key={item.key}
            text={item.label || item.key}
            fill={customConfig.fontColor || "#ffffff"}
            fontFamily={customConfig.fontFamily || "Merienda, cursive"}
            fontSize={customConfig.fontSize * scaleFactor}
            x={customConfig.buttonStyle?.padding ? parseInt(customConfig.buttonStyle.padding.split(' ')[1]) : (customConfig.fontSize * scaleFactor * 0.3)}
            y={customConfig.buttonStyle?.padding ? parseInt(customConfig.buttonStyle.padding.split(' ')[0]) : (customConfig.fontSize * scaleFactor * 0.25)}
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
            onClick={() => onDeleteItem(item)}
          />
          <Text
            y={-5}
            x={-5}
            text="X"
            fontSize={12}
            fill="#ff0000"
            onClick={() => onDeleteItem(item)}
          />
        </>
      )}
    </Group>
  )
}

export default InvitationConfigMapItem
