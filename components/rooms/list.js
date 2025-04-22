import { Col, Card, Space, Typography } from "antd"
import { withForm } from "../../helpers"
import { ActionsButton } from "../shared"

const RoomsList = ({ data, onDelete, onEdit }) => (
  <>
    {data?.map(room =>
      <Col className="list" key={room.id}>
        <Card
          extra={<ActionsButton onDelete={() => onDelete(room.id)} onEdit={() => onEdit(room)} />}
          title={room.name}
          variant="borderless">
          <Space direction="vertical">
            <img src={`/assets/${room.name.split(" ").join("_")}.jpg`} style={{ height: "120px" }} />
            <>
              <Typography.Text strong>Capacidad: </Typography.Text>
              <Typography.Text>{room.capacity}</Typography.Text>
            </>
            <>
              <Typography.Text strong>Dirección: </Typography.Text>
              <Typography.Text>{room.address}</Typography.Text>
            </>
          </Space>
        </Card>
      </Col>
    )}
  </>
)

export default withForm(RoomsList)
