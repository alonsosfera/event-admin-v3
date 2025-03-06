import { Button, Popover, Popconfirm, Space } from "antd"
import { MenuOutlined } from "@ant-design/icons"

export const ActionsButton = ({ onDelete, onEdit }) => {
  const content = (
    <Space direction="vertical">
      <Button onClick={onEdit} style={{ width: "100%" }}>
        Editar
      </Button>
      <Popconfirm
        title="¿Estas seguro?"
        onConfirm={onDelete}
        okText="Si"
        cancelText="No">
        <Button>Eliminar</Button>
      </Popconfirm>
    </Space>
  )

  return (
    <Popover content={content} trigger="click">
      <Button
        icon={<MenuOutlined />}
        size="small"
        type="text" />
    </Popover>
  )
}
