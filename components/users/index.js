import { Row, message } from "antd"
import { useState, useEffect } from "react"
import { parseCookies } from "nookies"
import axios from "axios"
import { Heading, SearchBar } from "../shared"
import UsersTable from "./table"
import { NewUser } from "./new-user"
import { deletUserByUuid } from "./helpers"
import { useSession } from "next-auth/react"

const levenshteinDistance = (a, b) => {
  if (!a.length) return b.length
  if (!b.length) return a.length

  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, 
        matrix[i][j - 1] + 1, 
        matrix[i - 1][j - 1] + cost 
      )
    }
  }
  return matrix[a.length][b.length]
}

export const Users = () => {
  const [state, setState] = useState({
    isModalOpen: false,
    isLoading: true,
    users: [],
    filteredUsers: undefined
  })
  const { token } = parseCookies()
  const { data: { user: loggedUser } = {} } = useSession()

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

  const onSearch = value => {
    if (!value || value.length === 0) {
      setState({ ...state, filteredUsers: undefined })
      return
    }

    value = value.toLowerCase()

    const newUsers = [...state.users].filter(user => {
      const nameMatch = user.name.toLowerCase().includes(value)
      const phoneMatch = user.phone.includes(value)

      const distance = levenshteinDistance(user.phone, value)
      const typoMatch = distance <= 3

      return nameMatch || phoneMatch || typoMatch
    })

    setState({ ...state, filteredUsers: newUsers })
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
      <SearchBar onSearch={onSearch} />
      <UsersTable
        loggedUser={loggedUser}
        data={state.filteredUsers || state.users}
        isLoading={state.isLoading}
        onDeleteUser={onDeleteUser} />
    </Row>
  )
}
