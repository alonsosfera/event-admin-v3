import { Button, Dropdown, Menu, Space, Typography } from "antd"
import { UserOutlined } from "@ant-design/icons"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import ROLES from "../../enums/roles"

export const UserAvatar = () => {
  const { data: { user } = {} } = useSession()

  const items = user?.role === ROLES.ADMIN ? [
    { label: user?.name, disabled: true },
    { label: (<Link href="/users">Usuarios</Link>), key: "users" },
    { label: (<Link href="/events">Eventos</Link>), key: "events" },
    { type: 'divider' },
    { label: "Cerrar sesión", key: "logout", onClick: signOut }
  ] : [
    { label: user?.name, disabled: true },
    { label: (<Link href="/dashboard">Home</Link>), key: "home" },
    { type: 'divider' },
    { label: "Cerrar sesión", key: "logout", onClick: signOut }
  ]

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
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
