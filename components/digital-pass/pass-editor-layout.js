import { Col, Row } from "antd"
import { PassConfigMapHost } from "./pass-config-map-host"

export const PassEditorLayout = ({ updatedCoordinates, selectedDesignUrl, previewFile, activeSource, event, onScaleFactorChange, onPositionChange }) => {
  return (
    <Row gutter={24}>
      <Col span={24}>
        <PassConfigMapHost
          selectedDesignUrl={
            activeSource === "upload"
              ? previewFile?.previewUrl
              : activeSource === "select"
              ? selectedDesignUrl
              : event?.digitalPass?.fileUrl
          }
          onScaleFactorChange={onScaleFactorChange}
          event={{
            ...event,
            digitalPass: {
              ...event.digitalPass,
              canvaMap: {
                ...event.digitalPass?.canvaMap,
                coordinates: updatedCoordinates
              }
            }
          }}
          onPositionChange={onPositionChange}
        />
      </Col>
    </Row>
  )
} 