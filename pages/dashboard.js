import { Layout, AdminDashboard, HostDashboard } from "../components"
import { pageAuth } from "../helpers/auth/page-auth"

export default function Dashboard({ user }) {
  const dashboard = user.role === "ADMIN" ? <AdminDashboard /> : <HostDashboard />

  return (
    <Layout>
      {dashboard}
    </Layout>
  )
}

export async function getServerSideProps(ctx){
  return pageAuth(ctx)
}
