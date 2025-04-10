import { Card } from "antd"


const PremiumInvitationVideo = () => {
  return (

    <Card className='card-invitation'> 
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        <iframe
          src="https://www.youtube.com/embed/7TWzV05kQ4w?rel=0&modestbranding=1"
          allow="clipboard-write; encrypted-media; gyroscope;"
          allowFullScreen
          title="Video de YouTube"
          style={{
            border: "none",
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    </Card>

  )
}

export default PremiumInvitationVideo