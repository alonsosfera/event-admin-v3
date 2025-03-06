import { Designs, Layout } from "../../components"
import { pageAuth } from "../../helpers/auth/page-auth"

export default function DesignPage() {
  return (
    <Layout>
      <Designs />
    </Layout>
  )
}

export async function getServerSideProps(ctx){
  return pageAuth(ctx, "ADMIN")
}
