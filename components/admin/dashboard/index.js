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
          <Link href="/design">
            <a>
              <Card.Grid>
                <Space direction="vertical">
                  <FileImageOutlined />
                  <Typography.Text>Diseños</Typography.Text>
                </Space>
              </Card.Grid>
            </a>
          </Link>
          <Link href="/events">
            <a>
              <Card.Grid>
                <Space direction="vertical">
                  <CalendarTwoTone />
                  <Typography.Text>Eventos</Typography.Text>
                </Space>
              </Card.Grid>
            </a>
          </Link>
          <Link href="/users">
            <a>
              <Card.Grid>
                <Space direction="vertical">
                  <UsergroupAddOutlined />
                  <Typography.Text>Usuarios</Typography.Text>
                </Space>
              </Card.Grid>
            </a>
          </Link>
        </Card>
      </Col>
    </Row>
  )
}
