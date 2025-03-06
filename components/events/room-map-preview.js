import { JoyaColumns, JoyaLobby } from "../host/event-details/constants"
import React, { useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { useService } from "../../hooks/use-service"
import { getTableCoordinatesByRoomMaps } from "./helpers"
const CustomTablesMap = dynamic(() => import("../custom-tables-map"), {
  ssr: false
})

export const RoomMapPreview = ({ roomMapId }) => {
  const {
    data: roomMapData, refetch: roomMapRefetch, loading: loadingRoomMap
  } = useService(getTableCoordinatesByRoomMaps, null,  { shouldFetch: false })

  const tablesDistribution = useMemo(() => {
    return (roomMapData || []).reduce((acc, curr) => {
      acc[curr.key] = { spaces: 12, occupiedSpaces: 0 }
      return acc
    }, {})
  }, [roomMapData])

  useEffect(() => {
    if (!roomMapId) return
    roomMapRefetch({ roomMapId }).then()
  }, [roomMapId])

  return (
    <CustomTablesMap
      invitations={[]}
      initialCoordinates={loadingRoomMap ? [] : roomMapData}
      className={"joya"}
      columns={JoyaColumns}
      lobby={<JoyaLobby />}
      allowEditTablesPosition={false}
      allowAddInvitations={false}
      setState={() => {}}
      distribution={loadingRoomMap ? [] : tablesDistribution} />
  )
}
