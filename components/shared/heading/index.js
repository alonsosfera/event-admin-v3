import { Button, Card, Col, List, Space, Spin, Typography } from "antd"
import { BackButton } from ".."

export const Heading = ({ backDisabled, isLoading, onClick, title, fullSize, customActions }) => {
  const actions = [
  ]

  if (onClick) actions.push((
    <Button
      key="New-btn"
      onClick={onClick}
      type="primary">
      Nuevo
    </Button>
  ))
  if (customActions) actions.push(...customActions)

  return (
    <Col
      span={!fullSize ? 24 : 18}
      offset={!fullSize ? 0 : 3}>
      <Card bordered={false} bodyStyle={{ padding: "0 20px" }}>
        <List>
          <List.Item actions={actions.length > 0 && actions}>
            <Space size="middle">
              {!backDisabled && <BackButton />}
              <Typography.Title level={3} style={{ marginBottom: 0 }}>{title}</Typography.Title>
              {isLoading && <Spin style={{ paddingTop: "5px" }} />}
            </Space>
          </List.Item>
        </List>
      </Card>
    </Col>
  )
}
