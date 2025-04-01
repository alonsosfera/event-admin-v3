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

  return (
    <Col span={8}>
      {coordinates.sort(sortCoordinates).map(coordinate => (
        <InvitationField
          key={coordinate.key}
          label={coordinate.key}
          value={state[coordinate.key] || ""}
          linkValue={
            customConfig[coordinate.key] ||
            JSON.parse(coordinate.customConfig || "{}").link ||
            ""
          }
          onChange={event => onValueChange(event, coordinate.key)}
          onLinkChange={link => onLinkChange(coordinate.key, link)}
        />
      ))}
    </Col>
  )
}
