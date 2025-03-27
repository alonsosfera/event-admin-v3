import React, { useState, useEffect } from "react"
import { Input, Tooltip, Button } from "antd"
import { LinkOutlined, CheckOutlined } from "@ant-design/icons"

const InvitationField = ({ label, value, onChange, onLinkChange, linkValue }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [link, setLink] = useState(linkValue || "")

  useEffect(() => {
    setLink(linkValue || "")
  }, [linkValue])

  const handleLinkChange = () => {
    if (link !== value) {
      onLinkChange(link)
    }
    setIsTooltipVisible(false)
  }

  return (
    <div style={{ marginBottom: "1rem", position: "relative" }}>
      <Input
        placeholder={label}
        style={{ marginRight: "2rem" }}
        value={value}
        onChange={onChange} />
      <Tooltip
        color="white"
        title={
          <div style={{ display: "flex" }}>
            <Input
              placeholder="Enlace"
              value={link}
              onChange={e => setLink(e.target.value)}
              style={{ marginRight: "0.5rem" }} />
            <Button
              icon={<CheckOutlined />}
              onClick={handleLinkChange} />
          </div>
        }
        open={isTooltipVisible}
        onOpenChange={setIsTooltipVisible}
        trigger="click"
        placement="topRight">
        <Button
          icon={<LinkOutlined />}
          style={{ position: "absolute", right: 0, top: 0, backgroundColor: "#ffffff" }}
          onClick={() => setIsTooltipVisible(!isTooltipVisible)} />
      </Tooltip>
    </div>
  )
}

export default InvitationField
