import { Card, Col, Input } from "antd"

export const SearchBar = ({ onSearch }) => {
  return (
    <Col span={24}>
      <Card variant="borderless" styles={{ body: { padding: "0" } }}>
        <Input.Search placeholder="Buscar..." onSearch={onSearch} />
      </Card>
    </Col>
  )
}
