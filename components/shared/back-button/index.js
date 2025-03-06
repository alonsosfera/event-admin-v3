import { Button } from "antd"
import { CaretLeftOutlined } from "@ant-design/icons"
import Link from "next/link"

export const BackButton = () => (
  <Link href="/dashboard">
    <Button icon={<CaretLeftOutlined />} />
  </Link>
)
