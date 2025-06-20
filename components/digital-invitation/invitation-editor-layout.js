import { Col, Row } from "antd"
import { EditableFieldsList } from "./editable-fields-list"
import { InvitationConfigItem } from "../designs/invitations/invitation-config-item"
import { InvitationConfigMapHost } from "./invitation-config-map-host"

export const InvitationEditorLayout = ({ updatedCoordinates, newItems, state, customConfig, onValueChange, onLinkChange, handleAddItem,
   scaleFactor, selectedFile, selectedInvitationUrl, previewFile, activeSource, event, onScaleFactorChange, onPositionChange, onDeleteItem }) =>  {
  
  const finalCoordinates = newItems.length > 0 ? newItems : updatedCoordinates

  return (
    <Row gutter={24}>
      {updatedCoordinates.length > 1 ? (
        <EditableFieldsList
          coordinates={updatedCoordinates}
          state={state}
          customConfig={customConfig}
          onValueChange={onValueChange}
          onLinkChange={onLinkChange}
        />
      ) : (
        <Col span={8}>
          <InvitationConfigItem
            onSubmit={handleAddItem}
            scaleFactor={scaleFactor}
            selectedFile={selectedFile}
            customConfig={customConfig?.confirmButton}
            onCustomConfigChange={(newConfig) => {
              onLinkChange("confirmButton", JSON.stringify(newConfig))
            }}
          />
        </Col>
      )}

      <Col span={16}>
        <InvitationConfigMapHost
          selectedInvitationUrl={
            activeSource === "upload"
              ? previewFile?.previewUrl
              : activeSource === "select"
              ? selectedInvitationUrl
              : event?.digitalInvitation?.fileUrl
          }
          onScaleFactorChange={onScaleFactorChange}
          event={{
            ...event,
            digitalInvitation: {
              ...event.digitalInvitation,
              canvaMap: {
                ...event.digitalInvitation?.canvaMap,
                coordinates: finalCoordinates
              }
            }
          }}
          onDeleteItem={onDeleteItem}
          onPositionChange={onPositionChange}
        />
      </Col>
    </Row>
  )
}
