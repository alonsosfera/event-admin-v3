import { Layout, Rooms } from "../../components"
import { pageAuth } from "../../helpers/auth/page-auth"

export default function RoomsPage() {
  return (
    <Layout>
      <Rooms />
    </Layout>
  )
}

export async function getServerSideProps(ctx){
  return pageAuth(ctx, "ADMIN")
}
