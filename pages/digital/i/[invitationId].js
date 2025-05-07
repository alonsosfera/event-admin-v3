import { DigitalInvitation } from "@/components"
import { useEffect, useState } from "react"
import { getEventByInvitationId, getEventById  } from "@/components/digital-invitation/helpers"
import { useRouter } from "next/router"

const DigitalInvitationPage = () => {
  const router = useRouter()
  const { invitationId } = router.query
  const [event, setEvent] = useState(null)
  const [invitation, setInvitation] = useState(null)

console.log(DigitalInvitation);


  useEffect(() => {
    if (invitationId) {
      const [type, id] = invitationId.split("-")
      if (type === "i") getEventByInvitationId(id).then(setInvitation)
      else if (type === "e") getEventById(id).then(setEvent)
    }
  }, [invitationId])

  return (
    <DigitalInvitation
      isFullscreen={true}
      event={event || invitation?.event}
      invitation={invitation}
      invitationId={invitationId} />
  )
}

export default DigitalInvitationPage
