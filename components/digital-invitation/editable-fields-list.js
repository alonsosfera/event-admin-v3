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
      {[
        ...coordinates
          .filter(coordinate => coordinate.key !== "confirmButton")
          .sort(sortCoordinates),
        ...coordinates
          .filter(coordinate => coordinate.key === "confirmButton")
      ].map(coordinate => {
        const isButton = coordinate.key === "confirmButton"
        const config = getCustomConfig(coordinate)
        return (
          <InvitationField
            key={coordinate.key}
            label={coordinate.key}
            value={state[coordinate.key] || ""}
            linkValue={isButton ? JSON.stringify({
                        ...getCustomConfig(coordinate),
                        isButton: isButton
                      }) : (config.link || "")}
            isButton={isButton}
            buttonConfig={isButton ? config : undefined}
            onChange={event => onValueChange(event, coordinate.key)}
            onLinkChange={link => onLinkChange(coordinate.key, link)} />
        )
      })}
    </Col>
   )
}
