import { Auth } from "../components"
import { getSession } from "next-auth/react"

export default function Home() {
  return (
    <Auth login />
  )
}

export async function getServerSideProps(ctx){
  const session = await getSession(ctx)

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
