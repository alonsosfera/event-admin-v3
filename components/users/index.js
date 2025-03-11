import { Row, message } from "antd"
import { useState, useEffect } from "react"
import { parseCookies } from "nookies"
import axios from "axios"
import { Heading } from "../shared"
import UsersTable from "./table"
import { NewUser } from "./new-user"
import { deletUserByUuid } from "./helpers"
import { useSession } from "next-auth/react"

export const Users = () => {
  const [state, setState] = useState({
    isModalOpen: false,
    isLoading: true,
    users: []
  })
  const { token } = parseCookies()

  const { data: { user: loggedUser } = {} }  = useSession()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/auth/users", { headers: { "Authorization": `Bearer ${token}` } })
      const { data = [] } = res
      setState({ ...state, isLoading: false, users: data })
    } catch (err) {
      console.error(err)
    }
  }

  const onNew = () => {
    setState({ ...state, isModalOpen: true })
  }

  const onCancel = () => {
    setState({ ...state, isModalOpen: false })
  }

  const inviteUser = async (values, uri) => {
    const { data } = await axios.post(uri, values)
    return data
  }

  const onSuccess = newUser => {
    setState(prevState => ({ ...state, isModalOpen: false, users: [...prevState.users, newUser] }))
  }

  const onDeleteUser = async uuid => {
    try {
      const deleting = message.loading("Borrando...")
      await deletUserByUuid(uuid)
      await fetchUsers()
      message.success("Borrado exitosamente")
      deleting()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Row className="event users" gutter={[10, 8]}>
      {state?.isModalOpen &&
        <NewUser
          inviteUser={inviteUser}
          onCancel={onCancel}
          onSuccess={onSuccess}
          open={state.isModalOpen} />
      }
      <Heading
        isLoading={state.isLoading}
        title="Usuarios"
        onClick={onNew} />
      <UsersTable
        loggedUser={loggedUser}
        data={state.users}
        isLoading={state.isLoading}
        onDeleteUser={onDeleteUser} />
    </Row>
  )
}
