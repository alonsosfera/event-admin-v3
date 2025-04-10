import React, { useState, useRef, useCallback, useEffect } from "react"
import { Spin, Image, Alert } from "antd"
import dynamic from "next/dynamic"
import QRCode from "qrcode"
import { getLineGuideStops, getObjectSnappingEdges,
  getGuides, drawGuides, adjustPositionBasedOnGuides } from "../../helpers/coordinatesGuide"

const Stage = dynamic(() => import("react-konva").then(mod => mod.Stage), { ssr: false })
const Layer = dynamic(() => import("react-konva").then(mod => mod.Layer), { ssr: false })
const KonImage = dynamic(() => import("react-konva").then(mod => mod.Image), { ssr: false })
const PassConfigMapItemHost = dynamic(() => import("./pass-config-map-item-host"), { ssr: false })

export const PassConfigMapHost = ({ event, onPositionChange, selectedDesignUrl, onScaleFactorChange }) => {
  const { digitalPass } = event || {}
  const getDefaultItems = canvaMap => {
    return canvaMap?.coordinates.map(coordinate => ({
      ...coordinate, customConfig: JSON.parse(coordinate.customConfig || "{}")
    })) || []
  }

  const [scaleFactor, setScaleFactor] = useState(1)
  const [displaySize, setDisplaySize] = useState({ width: 800, height: 600 })
  const [items, setItems] = useState(getDefaultItems(digitalPass.canvaMap))
  const [isClient, setIsClient] = useState(false)
  const [qrImage, setQRImage] = useState("")
  const imageRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setItems(getDefaultItems(digitalPass.canvaMap))
  }, [digitalPass.canvaMap.coordinates])

  const loadQRImage = async () => {
    const img = new window.Image()
    img.src = await QRCode.toDataURL(crypto.randomUUID())
    img.crossOrigin = "Anonymous"
    imageRef.current = img
    imageRef.current.addEventListener("load", handleQRLoad)
  }

  const handleQRLoad = () => {
    setQRImage(imageRef.current)
  }

  useEffect(() => {
    loadQRImage()
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", handleQRLoad)
      }
    }
  }, [])

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

    let coordinateX
    if (item.key === "QR_CODE") {
      coordinateX = event.target.x()
    } else {
      // Handle different text alignments
      if (item.customConfig.textAlign === "left") {
        // For left-aligned text, use the x position directly
        coordinateX = event.target.x()
      } else {
        // For center-aligned text, add half the width to get the center point
        coordinateX = event.target.x() + event.target.children[0].width() / 2
      }
    }
    
    const coordinateY = item.key === "QR_CODE"
      ? event.target.y()
      : event.target.y() + event.target.children[0].height() / 2

    onUpdateItemPosition(item, {
      coordinateX: parseInt(coordinateX / scaleFactor),
      coordinateY: parseInt(coordinateY / scaleFactor)
    })

    onPositionChange(
      item.key,
      parseInt(coordinateX / scaleFactor),
      parseInt(coordinateY / scaleFactor)
    )
  }, [onPositionChange, onUpdateItemPosition, scaleFactor])

  const dragBoundFunc = (pos, item) => {
    if (item.key === "QR_CODE") {
      const qrSize = (item.customConfig.qrSize || 250) * scaleFactor
      const newX = Math.max(0, Math.min(pos.x, displaySize.width - qrSize))
      const newY = Math.max(0, Math.min(pos.y, displaySize.height - qrSize))
      return { x: newX, y: newY }
    }

    const text = item.label || item.key
    const textWidth = text.length * item.customConfig.fontSize * scaleFactor * 0.4
    const textHeight = item.customConfig.fontSize * scaleFactor
    
    // Use different logic based on text alignment
    let newX
    if (item.customConfig.textAlign === "left") {
      // For left alignment, we want to preserve the original x position
      newX = Math.max(0, Math.min(pos.x, displaySize.width - textWidth))
    } else {
      // For center alignment, we need to account for the text width
      newX = Math.max(0, Math.min(pos.x, displaySize.width - textWidth))
    }
    
    const newY = Math.max(0, Math.min(pos.y, displaySize.height - textHeight))
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

  const { texts, qr } = items.reduce((acc, curr) => {
    if (curr.key === "QR_CODE") {
      return { ...acc, qr: curr }
    } else {
      return { ...acc, texts: [...acc.texts, curr] }
    }
  }, { texts: [], qr: null })

  return (
    <>
      <Alert
        showIcon
        type="info"
        message="Arrastra los elementos para reorganizarlos"
        style={{ fontSize: "12px", padding: "8px 16px", marginTop: "-10px" }}
      />
      <div style={{ position: "relative" }}>
        <Image
          preview={false}
          onLoad={handleImageLoad}
          src={selectedDesignUrl ? selectedDesignUrl : digitalPass.fileUrl}
          alt={digitalPass.fileName}
          style={{ maxWidth: "100%", height: "auto", display: "block" }} />
        <Stage
          ref={stageRef}
          width={displaySize.width}
          height={displaySize.height}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}>
          <Layer ref={layerRef}>
            {texts.map(item => (
              <PassConfigMapItemHost
                item={item}
                key={item.key}
                onDragEnd={e => onDragEnd(e, item)}
                onDragMove={onDragMove}
                scaleFactor={scaleFactor}
                dragBoundFunc={pos => dragBoundFunc(pos, item)} />
            ))}
            {qr && qrImage && (
              <KonImage
                draggable
                image={qrImage}
                width={(qr.customConfig.qrSize || 250) * scaleFactor}
                height={(qr.customConfig.qrSize || 250) * scaleFactor}
                x={qr.coordinateX * scaleFactor}
                y={qr.coordinateY * scaleFactor}
                dragBoundFunc={pos => dragBoundFunc(pos, qr)}
                onDragMove={onDragMove}
                onDragEnd={event => onDragEnd(event, qr)}
                name="object"
              />
            )}
          </Layer>
        </Stage>
      </div>
    </>
  )
} 