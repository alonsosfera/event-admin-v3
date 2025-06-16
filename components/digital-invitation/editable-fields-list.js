import React from "react"
import { Col } from "antd"
import InvitationField from "./input-modal"

export const EditableFieldsList = ({
  coordinates = [],
  state,
  customConfig,
  onValueChange,
  onLinkChange
}) => {
  const sortCoordinates = (a, b) => {
    const yDiff = a.coordinateY - b.coordinateY
    const xDiff = a.coordinateX - b.coordinateX
    if (Math.abs(yDiff) < 30) return xDiff
    return yDiff
  }

  const getCustomConfig = (coordinate) => {
    try {
      const parsedConfig = JSON.parse(coordinate.customConfig || "{}")
      return {
        ...parsedConfig,
        ...customConfig[coordinate.key]
      }
    } catch (e) {
      return customConfig[coordinate.key] || {}
    }
  }

  return (
    <Col span={8}>
      {coordinates.sort(sortCoordinates).map(coordinate => {
        // Determinar si es el botón de confirmación
        const isButton = coordinate.key === "confirmButton"
        
        return (
          <InvitationField
            key={coordinate.key}
            label={coordinate.key}
            value={state[coordinate.key] || ""}
            linkValue={JSON.stringify({
              ...getCustomConfig(coordinate),
              isButton: isButton
            })}
            onChange={event => onValueChange(event, coordinate.key)}
            onLinkChange={link => onLinkChange(coordinate.key, link)}
          />
        )
      })}
    </Col>
  )
}
