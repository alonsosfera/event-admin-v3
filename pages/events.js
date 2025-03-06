import { Layout, Events } from "../components"
import { pageAuth } from "../helpers/auth/page-auth"

export default function EventsPage() {
  return (
    <Layout>
      <Events />
    </Layout>
  )
}

export async function getServerSideProps(ctx){
  return pageAuth(ctx)
}
