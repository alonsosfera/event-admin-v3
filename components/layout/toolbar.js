import { PageHeader } from "antd"
import { UserAvatar } from "./user-avatar"
import Link from "next/link"

export const Toolbar = () => (
  <PageHeader extra={<UserAvatar />} title={<Link href="/dashboard">Salón La Joya</Link>} />
)
