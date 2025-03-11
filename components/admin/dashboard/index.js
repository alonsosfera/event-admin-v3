import { Col, Card, Row, Space, Typography } from "antd"
import { CalendarTwoTone, FileImageOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import Link from "next/link"

export const AdminDashboard = () => {
  return (
    <Row
      className="event admin dashboard full-height" align="middle"
      justify="center">
      <Col span={20}>
        <Card className="heading">
          <Typography.Title level={1}>Dashboard</Typography.Title>
        </Card>
        <Card className="links">
          <Link href="/design" passHref>
            <Card.Grid className="grid-link">
              <Space direction="vertical">
                <FileImageOutlined />
                <Typography.Text>Diseños</Typography.Text>
              </Space>
            </Card.Grid>
          </Link>
          <Link href="/events" passHref>
            <Card.Grid className="grid-link">
              <Space direction="vertical">
                <CalendarTwoTone />
                <Typography.Text>Eventos</Typography.Text>
              </Space>
            </Card.Grid>
          </Link>
          <Link href="/users" passHref>
            <Card.Grid className="grid-link">
              <Space direction="vertical">
                <UsergroupAddOutlined />
                <Typography.Text>Usuarios</Typography.Text>
              </Space>
            </Card.Grid>
          </Link>
        </Card>
      </Col>
    </Row>
  )
}
