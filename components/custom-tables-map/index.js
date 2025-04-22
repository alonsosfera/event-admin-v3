import { Group, Layer, Stage, Text, Shape } from "react-konva"
import { JoyaLobby } from "../host/event-details/constants"
import { DraggableTable } from "./draggable-table"
import { useEffect, useRef, useState } from "react"
import { Alert, message } from "antd"
import { DEFAULT_POSITION } from "./helpers"

const CustomTablesMap = ({
   state,
   setState,
   stageRef,
   className,
   invitations,
   distribution,
   onDeleteTable,
   onCoordinateChange,
   initialCoordinates,
   allowEditTablesPosition = false,
   allowAddInvitations = false
}) => {

  if (allowAddInvitations && state.amount === undefined) {
    return <Alert message="Indica el numero de invitados" type="warning" />
  }

  const [distributionMap, setDistributionMap] = useState({})
  const [tablesCoordsMap, setTablesCoordsMap] = useState({})

  useEffect(() => {
    if (!initialCoordinates) return
    const newTablesCoordsMap = initialCoordinates.reduce((acc, coord) => {
      acc[coord.key] = { ...coord, customConfig: coord.customConfig }
      return acc
    }, {})
    setTablesCoordsMap(newTablesCoordsMap)
  }, [initialCoordinates])

  const getDistribution = invitations => {
    const invitationTables = invitations.flatMap(invitation => invitation.invitationTables)
    const invitationsByTableMap = invitationTables.reduce((acc, invitation) => {
      if(!acc[invitation.table]) acc[invitation.table] = 0
      acc[invitation.table] = acc[invitation.table] + invitation.amount
      return acc
    }, {})

    return Object.entries(distribution).reduce((acc, tableDataArray) => {
      const tableName  = tableDataArray[0]
      const spacesOnTable = tableDataArray[1].spaces
      const occupiedSpaces = invitationsByTableMap[tableName] || 0

      acc[tableName] = { occupiedSpaces, spaces: spacesOnTable }
      return acc
    }, {})
  }

  useEffect(() => {
    if(!invitations) return
    const newDistribution = getDistribution(invitations)
    setDistributionMap(newDistribution)

  }, [invitations])

  const onSelect = (table, tableSize = 12) => {
    if (!allowAddInvitations) return
    let selected = [...state.selected]

    let occupiedSpaces = distributionMap[table].occupiedSpaces
    let amount = 0

    const selectedTable = selected.find(el => el.table === table)

    if (selectedTable) {
      amount = state.amount + selectedTable.amount
      occupiedSpaces = occupiedSpaces - selectedTable.amount

      selected = selected.filter(el => el !== selectedTable)
    } else {
      if (state.amount === 0) {
        message.warning("Ya has acomodado a todos los invitados")
        return
      }

      const newSpaces = occupiedSpaces + state.amount
      if (newSpaces >= tableSize) {
        const invited = tableSize - occupiedSpaces
        occupiedSpaces = tableSize
        amount = newSpaces - occupiedSpaces
        selected.push({ table, amount: invited })
      } else {
        occupiedSpaces = occupiedSpaces + state.amount
        amount = 0
        selected.push({ table, amount: state.amount })
      }
    }
    const newDistributionMap = {
      ...distributionMap,
      [table]: { ...distributionMap[table], occupiedSpaces }
    }

    setDistributionMap(newDistributionMap)
    setState({ distribution: newDistributionMap, amount, selected })
  }
  const danceArea = useRef(null)

  const setNewTableCoords = (table, { coordinateX, coordinateY, id, customConfig }) => {
    const newCoordsMap = { ...tablesCoordsMap, [table]: { coordinateX, coordinateY, id, customConfig } }
    setTablesCoordsMap(newCoordsMap)
    onCoordinateChange && onCoordinateChange(
      Object.entries(newCoordsMap).map(([key, value]) => ({ ...value, key }))
    )
  }

  const onDeleteItem = tableName => {
    setDistributionMap(prev => {
      const filteredArray = Object.entries(prev).filter(([key]) => key !== tableName)
      return Object.fromEntries(filteredArray)
    })
    onDeleteTable && onDeleteTable(tableName)
  }

  return (
    <div style={{ padding: 0 }} className={`event distribution map ${className}`}>
      <Stage
        ref={stageRef}
        width={902}
        height={760}>
        <Layer>
          <Group
            x={321}
            y={185}
            name="danceArea">
            <Shape
              sceneFunc={(context, shape) => {
                context.beginPath()
                context.moveTo(50, 0)
                context.lineTo(205, 0)
                context.lineTo(255, 80)
                context.lineTo(255, 375)
                context.lineTo(205, 455)
                context.lineTo(50, 455)
                context.lineTo(0, 375)
                context.lineTo(0, 80)
                context.closePath()
                context.fillStrokeShape(shape)
              }}
              ref={danceArea}
              width={260}
              height={460}
              fill="gray" />
            <Text
              x={260 / 2 - 45}
              y={460 / 2}
              fontSize={36} // Aproximado para h1
              fontStyle="bold"
              align="center"
              text="Pista"
              fill="black"
              verticalAlign="middle" />
          </Group>
          {Object.entries(distributionMap).map(([tableName, tableData]) => {
            const customConfig = tablesCoordsMap[tableName]?.customConfig
            if (customConfig && !JSON.parse(customConfig || "{}").displayElement) return
            const table = tableName.split("-")[1]
            const occupiedSpaces = tableData.occupiedSpaces
            const spaces = tableData.spaces
            return <DraggableTable
              key={tableName}
              table={table}
              spaces={spaces}
              tableName={tableName}
              bounceRef={[danceArea]}
              updateTableCount={onSelect}
              onDeleteItem={onDeleteItem}
              customConfig={customConfig}
              occupiedSpaces={occupiedSpaces}
              setNewTableCoords={setNewTableCoords}
              tableId={tablesCoordsMap[tableName]?.id}
              allowEditTablesPosition={allowEditTablesPosition}
              coordinateX={tablesCoordsMap[tableName]?.coordinateX || DEFAULT_POSITION[tableName]?.x || 50}
              coordinateY={tablesCoordsMap[tableName]?.coordinateY || DEFAULT_POSITION[tableName]?.y || 50} />
          })}
        </Layer>
      </Stage>
      <JoyaLobby />
    </div>
  )
}

export default CustomTablesMap

//NOTE: Export example
// import dynamic from "next/dynamic"
// const Map = dynamic(() => import("./custom-tables-map"), {
//   ssr: false
// })
