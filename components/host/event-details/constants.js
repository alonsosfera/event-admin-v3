import { Col, Row, Typography } from "antd"

export const JoyaColumns = {
  first: ["table-2", "table-4", "table-6", "table-8", "table-10", "table-12"],
  second: ["table-14", "table-16", "table-18", "table-20", "table-22", "table-24"],
  third: ["table-1", "table-3", "table-5", "table-7", "table-9", "table-11"],
  fourth: ["table-13", "table-15", "table-17", "table-19", "table-21", "table-23"]
}

export const JoyaLobby = () => {
  return (
    <Row className="lobby">
      <Col span={4}>
        <Typography.Title level={4}>Baño mujeres</Typography.Title>
      </Col>
      <Col span={4}>
        <Typography.Title level={4}>Baño hombres</Typography.Title>
      </Col>
      <Col span={8}>
        <Typography.Title level={4}>Entrada</Typography.Title>
      </Col>
      <Col span={8}>
        <Typography.Text className="bar" strong>Cantina</Typography.Text>
        <Typography.Title className="kitchen" level={4}>Cocina</Typography.Title>
      </Col>
    </Row>
  )
}
