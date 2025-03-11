import { Flex, Layout } from "antd"
import { UserAvatar } from "./user-avatar"
import Link from "next/link"

export const Toolbar = () => (
  <Layout.Header>
    <Flex style={{ width: "100%" }} justify="space-between">
      <Link href="/dashboard" className="toolbar-title">Salón La Joya</Link>
      <UserAvatar />
    </Flex>
  </Layout.Header>
)