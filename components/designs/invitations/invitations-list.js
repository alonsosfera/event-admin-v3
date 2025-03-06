import { Col, Row } from "antd"
import { InvitationConfigModal } from "./invitation-config-modal"
import { InvitationsListItem } from "./invitations-list-item"

export const InvitationsList = ({ editingFile, fetchData, list = [], setEditingFile }) => {
  return (
    <Row gutter={[24, 12]}>
      {list.map((item, index) => (
        <Col key={index} span={4}>
          <InvitationsListItem
            item={item}
            showTitle={true}
            onClick={() => setEditingFile(item)} />
        </Col>
      ))}
      {!!editingFile &&
        <InvitationConfigModal
          onSuccess={fetchData}
          selectedFile={editingFile}
          onClose={() => setEditingFile(null)} />
      }
    </Row>
  )
}
