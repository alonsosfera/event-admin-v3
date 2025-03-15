import { Card, Image } from "antd"
import { useEffect , useMemo , useState } from "react"
import QRCode from "qrcode"
import PassListItemText from "./passes-list-item-text"

export const PassesListItem = ({ item, onClick, showTitle = false }) => {
  const [qrImage, setQRImage] = useState("")
  const [scaleFactor, setScaleFactor] = useState(1)

  const loadImage = async () => {
    const imageUrl = await QRCode.toDataURL(crypto.randomUUID())
    setQRImage(imageUrl)
  }

  useEffect(() => {
    loadImage()
  }, [])

  const handleImageLoad = e => {
    const naturalWidth = e.target.naturalWidth
    const displayWidth = e.target.width

    setScaleFactor(displayWidth / naturalWidth)
  }

  const { texts, qr } = useMemo(() => {
    if (!item?.canvaMap) return { texts: [], qr: {} }

    const { canvaMap } = item
    const coordinates = canvaMap?.coordinates?.map(coordinate => ({
      ...coordinate,
      customConfig: JSON.parse(coordinate.customConfig)
    })) || []

    return coordinates?.reduce((acc, curr) => {
      if (curr.key === "QR_CODE") {
        return { ...acc, qr: curr }
      } else {
        return { ...acc, texts: [...acc.texts, curr] }
      }
    }, { texts: [], qr: {} })
  }, [item])

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
            src={item?.fileUrl}
            onLoad={handleImageLoad} />
          {texts.map((coordinate, index) => (
            <PassListItemText
              item={coordinate}
              scaleFactor={scaleFactor}
              key={`${coordinate.key} ${scaleFactor} ${index}`} />
          ))}
          <div
            style={{
              position: "absolute",
              top: `${qr.coordinateY * scaleFactor}px`,
              left: `${qr.coordinateX * scaleFactor}px`
            }}
          >
            <Image
              preview={false}
              width={qr.customConfig?.qrSize * scaleFactor || 250 * scaleFactor}
              height={qr.customConfig?.qrSize * scaleFactor || 250 * scaleFactor}
              src={qrImage} />
          </div>
        </div>
      }>
      {showTitle && <Card.Meta title={item.fileName} description={item.description} />}
    </Card>
  )
}
