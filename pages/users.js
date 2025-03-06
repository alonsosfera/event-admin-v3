import { Layout, Users } from "../components"
import { pageAuth } from "../helpers/auth/page-auth"

export default function UsersPage() {
  return (
    <Layout>
      <Users />
    </Layout>
  )
}

export async function getServerSideProps(ctx){
  return pageAuth(ctx, "ADMIN")
}
