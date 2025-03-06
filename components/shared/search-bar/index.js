import { Card, Col, Input } from "antd"

export const SearchBar = ({ onSearch }) => {
  return (
    <Col span={24}>
      <Card bordered={false} bodyStyle={{ padding: "0" }}>
        <Input.Search placeholder="Buscar..." onSearch={onSearch} />
      </Card>
    </Col>
  )
}
