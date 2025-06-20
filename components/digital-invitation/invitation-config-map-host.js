import React, { useState, useRef, useCallback, useEffect } from "react"
import { Spin, Image } from "antd"
import dynamic from "next/dynamic"
import { getLineGuideStops, getObjectSnappingEdges,
  getGuides, drawGuides, adjustPositionBasedOnGuides } from "../../helpers/coordinatesGuide"
import CounterInvitation from "../../helpers/counterInvitation"

const Stage = dynamic(() => import("react-konva").then(mod => mod.Stage), { ssr: false })
const Layer = dynamic(() => import("react-konva").then(mod => mod.Layer), { ssr: false })
const InvitationConfigMapItemHost = dynamic(() => import("./invitation-config-map-item-host"), { ssr: false })

export const InvitationConfigMapHost = ({ event, onPositionChange, selectedInvitationUrl, onScaleFactorChange, onDeleteItem }) => {
  const { eventDate ,digitalInvitation } = event || {}
  const getDefaultItems = canvaMap => {
    return canvaMap?.coordinates.map(coordinate => ({
      ...coordinate, customConfig: JSON.parse(coordinate.customConfig)
    })) || []
  }

  const [scaleFactor, setScaleFactor] = useState(1)
  const [displaySize, setDisplaySize] = useState({ width: 800, height: 600 })
  const [items, setItems] = useState(getDefaultItems(digitalInvitation.canvaMap))
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setItems(getDefaultItems(digitalInvitation.canvaMap))
  }, [digitalInvitation.canvaMap.coordinates])

  const stageRef = useRef(null)
  const layerRef = useRef(null)

  const handleImageLoad = e => {
    const naturalWidth = e.target.naturalWidth
    const displayWidth = e.target.width
    const displayHeight = e.target.height
    const scale = displayWidth / naturalWidth

    setDisplaySize({ width: displayWidth, height: displayHeight })
    setScaleFactor(scale)

    if (onScaleFactorChange) {
      onScaleFactorChange(scale)
    }
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

  const onUpdateItemPosition = (item, coordinates) => {
    setItems(prevState => prevState.map(i => i.key === item.key ? { ...i, ...coordinates } : i))
  }

  const onDragEnd = useCallback((event, item) => {
    const layer = event.target.getLayer()
    layer.find(".guid-line").forEach(l => l.destroy())

    const coordinateX = event.target.x() + event.target.children[0].width() / 2
    const coordinateY = event.target.y() + event.target.children[0].height() / 2
    onUpdateItemPosition(item, {
      coordinateX: parseInt(coordinateX / scaleFactor),
      coordinateY: parseInt(coordinateY / scaleFactor)
    })

    onPositionChange(
      item.key,
      parseInt(coordinateX / scaleFactor),
      parseInt(coordinateY / scaleFactor)
    )
  }, [ onPositionChange, onUpdateItemPosition, scaleFactor])

  const dragBoundFunc = (pos, item) => {
    const text = item.label || item.key
    const textWidth = text.length * item.customConfig.fontSize * scaleFactor * 0.4
    const textHeight = item.customConfig.fontSize * scaleFactor
    const isButton = item.customConfig.isButton
    
    const newX = isButton ? Math.max(0, Math.min(pos.x, displaySize.width)) : Math.max(0, Math.min(pos.x, displaySize.width - textWidth))
    const newY = isButton ? Math.max(0, Math.min(pos.y, displaySize.height)) : Math.max(0, Math.min(pos.y, displaySize.height - textHeight))
    return { x: newX, y: newY }
  }

  if (!event || !isClient) {
    return (
      <Spin
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }} />
    )
  }

  return (
    <div style={{ position: "relative" }}>
      <Image
        preview={false}
        onLoad={handleImageLoad}
        src={selectedInvitationUrl ? selectedInvitationUrl : digitalInvitation.fileUrl}
        alt={digitalInvitation.fileName}
        style={{ maxWidth: "100%", height: "auto", display: "block" }} />
      <Stage
        ref={stageRef}
        width={displaySize.width}
        height={displaySize.height}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}>
        <Layer ref={layerRef}>
          {items.map(item => (
            <InvitationConfigMapItemHost
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
      <div style={{ position: "absolute", bottom: "1px", left: "50%", transform: "translate(-50%, 0)", zIndex: 1, pointerEvents: "none" }}>
        <CounterInvitation date={eventDate} />
      </div>
    </div>
  )
}