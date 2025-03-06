import { Col, Table ,Space , Button,Popconfirm } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { withForm } from "../../helpers"
import ROLES from "../../enums/roles"

const UsersTable = ({ data, onDeleteUser, loggedUser }) => {
  const filters = [
    { text: "Admin", value: ROLES.ADMIN },
    { text: "Host", value: ROLES.HOST }
  ]

  return (
    <Col span={24}>
      <Table
        dataSource={data}
        rowKey={row => row.id}
        scroll={{ x: true }}>
        <Table.Column
          dataIndex="name"
          title="Nombre" />
        <Table.Column
          dataIndex="phone"
          title="Teléfono" />
        <Table.Column
          render={(t, row) => ROLE_DISPLAY[row?.role]}
          filters={filters}
          onFilter={(value, row) => row.role.indexOf(value) === 0}
          sorter={(a, b) => a.role.localeCompare(b.role)}
          title="Rol" />
        <Table.Column
          render={(t, row) => row.id !== loggedUser.id &&
            <Space>
              <Popconfirm
                cancelText="No"
                onConfirm={() => onDeleteUser(row.id)}
                okText="Sí"
                title="¿Eliminar?">
                <Button
                  icon={<DeleteOutlined />}
                  shape="circle" />
              </Popconfirm>
            </Space>
          }
          width={1} />
      </Table>
    </Col>
  )
}

const ROLE_DISPLAY = {
  ADMIN: "Administrador",
  HOST: "Anfitrión"
}

export default withForm(UsersTable)
