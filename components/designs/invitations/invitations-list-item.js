import { Card, Image } from "antd"
import { useState } from "react"
import dynamic from "next/dynamic"
const InvitationsListItemText = dynamic(() => import("./invitations-list-item-text"), { ssr: false })

export const InvitationsListItem = ({ item, onClick, showTitle = false }) => {
  const [scaleFactor , setScaleFactor] = useState (1)

  const handleImageLoad = e => {
    const naturalWidth = e.target.naturalWidth
    const displayWidth = e.target.width

    setScaleFactor(displayWidth / naturalWidth)
  }

  return (
    <Card
      onClick={onClick}
      hoverable={!!onClick}
      cover={
        <div style={{ position: "relative" }}>
          <Image
            alt="example"
            preview={false}
            placeholder={true}
            src={item.fileUrl}
            onLoad={handleImageLoad} />
          {item.canvaMap?.coordinates?.map(coordinate => (
            <InvitationsListItemText
              item={coordinate}
              key={coordinate.key}
              scaleFactor={scaleFactor} />
          ))}
        </div>
      }>
      {showTitle && <Card.Meta title={item.fileName} description={item.description} />}
    </Card>
  )
}
