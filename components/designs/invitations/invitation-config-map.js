import { Image } from "antd"
import React, { useState, useRef, useCallback } from "react"
import { Layer, Stage } from "react-konva"
import InvitationConfigMapItem from "./invitation-config-map-item"
import { getLineGuideStops, getObjectSnappingEdges, getGuides, drawGuides,
         adjustPositionBasedOnGuides } from "../../../helpers/coordinatesGuide"

const InvitationConfigMap = ({ items, onDeleteItem, selectedFile, scaleFactor, setScaleFactor, onUpdateItemPosition }) => {
  const [displaySize, setDisplaySize] = useState({ width: 800, height: 600 })
  const stageRef = useRef(null)
  const layerRef = useRef(null)

  const handleImageLoad = e => {
    const naturalWidth = e.target.naturalWidth
    const displayWidth = e.target.width
    const displayHeight = e.target.height
    setDisplaySize({ width: displayWidth, height: displayHeight })
    setScaleFactor(displayWidth / naturalWidth)
  }

  const onDragMove = useCallback(e => {
    const layer = e.target.getLayer()
    layer.find(".guid-line").forEach(l => l.destroy())

    const lineGuideStops = getLineGuideStops(e.target)
    const itemBounds = getObjectSnappingEdges(e.target)
    const guides = getGuides(lineGuideStops, itemBounds)

    if (guides.length) {
      drawGuides(guides, layer)
      adjustPositionBasedOnGuides(guides, e.target)
    }
  }, [])

  const onDragEnd = useCallback((event, item) => {
    const layer = event.target.getLayer()
    layer.find(".guid-line").forEach(l => l.destroy())

    const coordinateX = event.target.x() + event.target.children[0].width() / 2
    const coordinateY = event.target.y() + event.target.children[0].height() / 2
    onUpdateItemPosition(item, {
      coordinateX: parseInt(coordinateX / scaleFactor),
      coordinateY: parseInt(coordinateY / scaleFactor)
    })
  }, [onUpdateItemPosition, scaleFactor])

  const dragBoundFunc = (pos, item) => {
    const text = item.label || item.key
    const textWidth = text.length * item.customConfig.fontSize * scaleFactor * 0.4
    const textHeight = item.customConfig.fontSize * scaleFactor
    const isButton = item.customConfig.isButton
    
    const newX = isButton ? Math.max(0, Math.min(pos.x, displaySize.width)) : Math.max(0, Math.min(pos.x, displaySize.width - textWidth))
    const newY = isButton ? Math.max(0, Math.min(pos.y, displaySize.height)) : Math.max(0, Math.min(pos.y, displaySize.height - textHeight))
    return { x: newX, y: newY }
  }

  return (
    <div style={{ position: "relative" }}>
      <Image
        preview={false}
        onLoad={handleImageLoad}
        src={selectedFile.fileUrl}
        alt={selectedFile.fileName}
        style={{ maxWidth: "100%", height: "auto", display: "block" }} />
      <Stage
        ref={stageRef}
        width={displaySize.width}
        height={displaySize.height}
        style={{ position: "absolute", top: 0, left: 0 }}>
        <Layer ref={layerRef}>
          {items.map(item => (
            <InvitationConfigMapItem
              item={item}
              key={item.key}
              onDragEnd={e => onDragEnd(e, item)}
              onDragMove={onDragMove}
              scaleFactor={scaleFactor}
              onDeleteItem={onDeleteItem}
              dragBoundFunc={pos => dragBoundFunc(pos, item)} />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default InvitationConfigMap
