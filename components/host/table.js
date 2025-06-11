import { Col, Table } from "antd"
import dayjs from "../shared/time-zone"
import { withForm } from "../../helpers"

const EventsTable = ({ data, rooms, selectRow }) => {
  const filters = rooms?.map(room => ({ text: room.name, value: room.id }))
  return (
    <Col span={24} lg={12}>
      <Table
        dataSource={data}
        onRow={row => ({ onClick: () => selectRow(row) })}
        rowKey={row => row.id}
        scroll={{ x: true }}>
        <Table.Column
          dataIndex="name"
          sorter={(a, b) => (a.name || "").localeCompare(b.name || "")}
          title="Nombre" />
        <Table.Column
          dataIndex="eventDate"
          render={text => dayjs.utc(text).tz('America/Mexico_City').format("DD/MM/YYYY hh:mm a")}
          sorter={(a, b) => (a.eventDate || "").localeCompare(b.eventDate || "")}
          title="Fecha" />
        <Table.Column
          dataIndex="assistance"
          sorter={(a, b) => (a.assistance || 0) - (b.assistance || 0)}
          title="Numero de Invitados" />
        <Table.Column
          dataIndex="room_name"
          filters={filters}
          onFilter={(value, row) => row.roomId.indexOf(value) === 0}
          sorter={(a, b) => (a.room_name || "").localeCompare(b.room_name || "")}
          title="Salón" />
      </Table>
    </Col>
  )
}

export default withForm(EventsTable)
