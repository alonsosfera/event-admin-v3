import { Button, Input, Space, Tooltip } from "antd"
import { EditOutlined, SaveOutlined } from "@ant-design/icons"
import React, { useState } from "react"

export const EditableModalTitle = ({ title, onChange, tooltipLabel = "Editar nombre" }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  return isEditingTitle ? (
    <Space>
      <Input
        value={title}
        onChange={({ target: { value } }) => onChange(value)} />
      <Button
        type="text"
        icon={<SaveOutlined />}
        onClick={() => setIsEditingTitle(false)} />
    </Space>
    ) : (
      <Space>
        <span>{title}</span>
        <Tooltip title={tooltipLabel}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setIsEditingTitle(true)} />
        </Tooltip>
      </Space>
    )
}
