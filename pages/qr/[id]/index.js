import { Invitation, Layout } from "../../../components"
import { pageAuth } from "../../../helpers/auth/page-auth"
import { useRouter } from "next/router"

export default function QRPage() {
  const router = useRouter()
  const { query } = router
  return (
    <Layout>
      <Invitation id={query.id} />
    </Layout>
  )
}

export async function getServerSideProps(ctx){
  return pageAuth(ctx, "ADMIN")
}
