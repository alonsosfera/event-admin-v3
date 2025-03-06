import React, { useEffect, useMemo, useRef, useCallback } from "react"
import { Group, Text, Rect } from "react-konva"
import { getLineGuideStops, getObjectSnappingEdges, getGuides, drawGuides,
         adjustPositionBasedOnGuides } from "../../helpers/coordinatesGuide"
const TABLE_SIDE = 64

export const DraggableTable = ({
  table,
  spaces = 0,
  tableId,
  tableName,
  coordinateX,
  coordinateY,
  customConfig,
  onDeleteItem,
  occupiedSpaces,
  updateTableCount,
  setNewTableCoords,
  allowEditTablesPosition = true
}) => {
  const tableDimensions = useMemo(() => ({
    width: table === "main" ? TABLE_SIDE * 2 : TABLE_SIDE,
    height: TABLE_SIDE
  }), [table])

  const textRef1 = useRef(null)
  const textRef2 = useRef(null)
  const groupRef = useRef(null)

  const handleClick = () => {
    updateTableCount(tableName, spaces)
  }

  const setDragBounce = ev => {
    const element = ev.currentTarget
    const position = element.getPosition()

    if (position.x <= 10) element.x(10)
    if (position.y <= 10) element.y(10)
    if (position.x >= 892 - tableDimensions.width) element.x(892 - tableDimensions.width)
    if (position.y >= 720 - tableDimensions.height - 20) element.y(720 - tableDimensions.height - 20)
  }

  useEffect(() => {
    const text1 = textRef1.current
    const text2 = textRef2.current

    if (text1) {
      const textWidth1 = text1.width()
      const textHeight1 = text1.height()
      text1.position({
        x: (tableDimensions.width - textWidth1) / 2,
        y: (tableDimensions.height - textHeight1) / 2
      })
    }

    if (text2) {
      const textWidth2 = text2.width()
      const textHeight2 = text1.height()
      text2.position({
        x: (tableDimensions.width - textWidth2) / 2,
        y: tableDimensions.height + textHeight2
      })
    }

    text1.getLayer().batchDraw()
    text2.getLayer().batchDraw()
  }, [tableDimensions, occupiedSpaces, table])

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

  return (
    <Group
      ref={groupRef}
      name="object"
      onClick={() => handleClick()}
      x={coordinateX}
      y={coordinateY}
      draggable={allowEditTablesPosition}
      onDragMove={e => {
        setDragBounce(e)
        onDragMove(e)
      }}
      onDragEnd={e => {
        setNewTableCoords(tableName, { coordinateX: e.target.x(), coordinateY: e.target.y(), id: tableId, customConfig })
      }}>
      <Rect
        width={tableDimensions.width}
        height={tableDimensions.height}
        fill={occupiedSpaces === 12 ? "#80808080" : "#00800080"} />
      <Text
        ref={textRef1}
        align="center"
        verticalAlign="middle"
        y={(tableDimensions.height / 2)}
        text={occupiedSpaces || "-"}
        fill="#00000080" />
      <Text
        ref={textRef2}
        align="center"
        verticalAlign="middle"
        text={`Mesa ${table === "main" ? "de honor" : table }`}
        fill="black" />
      {allowEditTablesPosition && table !== "main" &&
        <>
          <Rect
            y={-10}
            x={-10}
            width={20}
            height={20}
            cornerRadius={10}
            style={{ cursor: "pointer" }}
            fill="rgba(255, 255, 255, 0.8)"
            onClick={() => onDeleteItem(tableName)} />
          <Text
            y={-5}
            x={-5}
            text="X"
            fontSize={12}
            fill="#ff0000"
            onClick={() => onDeleteItem(tableName)} />
        </>
      }
    </Group>
  )
}
