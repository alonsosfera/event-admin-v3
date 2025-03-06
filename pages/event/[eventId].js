import { useRouter } from "next/router"
import { HostDashboard, Layout } from "../../components"
import { pageAuth } from "../../helpers/auth/page-auth"

const EventAdminDetails = () => {
  const router = useRouter()
  const { eventId } = router.query

  return (
    <Layout>
      <HostDashboard  eventId={eventId} />
    </Layout>
  )
}

export default EventAdminDetails

export async function getServerSideProps(ctx){
  return pageAuth(ctx)
}
