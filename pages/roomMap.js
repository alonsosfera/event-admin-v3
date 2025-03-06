import { Layout } from "../components"
import { MapRoom } from "../components/roomMap"
import { pageAuth } from "../helpers/auth/page-auth"


export default function RoomMap() {
  return(
    <Layout>
      <MapRoom />
    </Layout>
  )
}

export async function getServerSideProps(ctx){
  return pageAuth(ctx)
}
