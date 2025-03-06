import { Col, Row } from "antd"
import { PassesListItem } from "./passes-list-item"
import { PassConfigModal } from "./pass-config-modal"

export const PassesList = ({ editingFile, fetchData, list = [], setEditingFile }) => {
  return (
    <Row gutter={[24, 12]}>
      {list.map(item => (
        <Col key={item.fileName} span={4}>
          <PassesListItem
            item={item}
            showTitle={true}
            onClick={() => setEditingFile(item)} />
        </Col>
      ))}
      {!!editingFile &&
        <PassConfigModal
          onSuccess={fetchData}
          selectedFile={editingFile}
          onClose={() => setEditingFile(null)} />
      }
    </Row>
  )
}
