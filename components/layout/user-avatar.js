import { Button, Dropdown, Menu, Space, Typography } from "antd"
import { UserOutlined } from "@ant-design/icons"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import ROLES from "../../enums/roles"

export const UserAvatar = () => {
  const { data: { user } = {} } = useSession()

  const menu = (
    <Menu>
      <Menu.Item disabled>{user?.name}</Menu.Item>
      <Menu.Item>
        <Link href="/dashboard">
          Home
        </Link>
      </Menu.Item>
      {user?.role === ROLES.ADMIN && (
        <Menu.Item>
          <Link href="/users">
            Usuarios
          </Link>
        </Menu.Item>,
          <Menu.Item>
            <Link href="/events">
              Eventos
            </Link>
          </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item onClick={signOut}>Cerrar sesion</Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Space>
        <Typography.Text style={{ color: "white", cursor: "pointer" }}>{user?.name}</Typography.Text>
        <Button
          size="large"
          shape="circle"
          icon={<UserOutlined />} />
      </Space>
    </Dropdown>
  )
}
