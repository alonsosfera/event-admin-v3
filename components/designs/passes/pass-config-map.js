import { Image } from "antd"
import QRCode from "qrcode"
import PassConfigMapItem from "./pass-config-map-item"
import React, { useEffect, useRef, useState, useCallback } from "react"
import { Layer, Stage, Image as KonImage } from "react-konva"
import { getLineGuideStops, getObjectSnappingEdges, getGuides, drawGuides,
         adjustPositionBasedOnGuides } from "../../../helpers/coordinatesGuide"


const FONT_SIZE = 38

const PassConfigMap = ({ items, selectedFile, scaleFactor, setScaleFactor, onUpdateItemPosition }) => {
  const [qrImage, setQRImage] = useState("")
  const imageRef = useRef(null)
  const stageRef = useRef(null)
  const layerRef = useRef(null)
  const [displaySize, setDisplaySize] = useState({ width: 800, height: 600 })

  const loadImage = async () => {
    const img = new window.Image()
    img.src = await QRCode.toDataURL(crypto.randomUUID())
    img.crossOrigin = "Anonymous"
    imageRef.current = img
    imageRef.current.addEventListener("load", handleLoad)
  }

  const handleLoad = () => {
    setQRImage(imageRef.current)
  }

  useEffect(() => {
    loadImage()
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", handleLoad)
      }
    }
  }, [])

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


  const onDragEnd = useCallback(e => {
    const layer = e.target.getLayer()
    layer.find(".guid-line").forEach(l => l.destroy())
  }, [])

  const dragBoundFunc = (pos, item) => {
    const textWidth = item.key.length * FONT_SIZE * scaleFactor * 0.4
    const textHeight = FONT_SIZE * scaleFactor
    const newX = Math.max(0, Math.min(pos.x, displaySize.width - textWidth))
    const newY = Math.max(0, Math.min(pos.y, displaySize.height - textHeight))
    return { x: newX, y: newY }
  }

  const handleDragEnd = useCallback((event, item) => {
    const coordinateX = item.key === "QR_CODE"
      ? event.target.x()
      : event.target.x() + event.target.width() / 2
    const coordinateY = item.key === "QR_CODE"
      ? event.target.y()
      : event.target.y() + event.target.height() / 2
    onUpdateItemPosition(item, {
      coordinateY: parseInt(coordinateY / scaleFactor),
      coordinateX: parseInt(coordinateX / scaleFactor)
    })
    onDragEnd(event)
  }, [onUpdateItemPosition, onDragEnd, scaleFactor])

  const { texts, qr } = items.reduce((acc, curr) => {
    if (curr.key === "QR_CODE") {
      return { ...acc, qr: curr }
    } else {
      return { ...acc, texts: [...acc.texts, curr] }
    }
  }, { texts: [], qr: {} })

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
          {texts.map(item => (
            <PassConfigMapItem
              item={item}
              key={item.key}
              onDragMove={onDragMove}
              onDragEnd={event => handleDragEnd(event, item)}
              scaleFactor={scaleFactor}
              dragBoundFunc={pos => dragBoundFunc(pos, item)}
              className="object" />
          ))}
          <KonImage
            draggable
            image={qrImage}
            width={250 * scaleFactor}
            height={250 * scaleFactor}
            x={qr.coordinateX * scaleFactor}
            y={qr.coordinateY * scaleFactor}
            dragBoundFunc={pos => dragBoundFunc(pos, qr)}
            onDragMove={onDragMove}
            onDragEnd={event => handleDragEnd(event, qr)}
            className="object" />
        </Layer>
      </Stage>
    </div>
  )
}

export default PassConfigMap
