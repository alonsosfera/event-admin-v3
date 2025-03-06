import { Alert, Col, message, Row, Typography } from "antd"
import { MapTable } from "./table"
import { MapColumn } from "./column"
import { GraduationTables } from "./graduation-tables"
import { useEffect, useState } from "react"

export const Map = ({ className, distribution, state, setState, columns, lobby, invitations }) => {
  if (state.amount === undefined) {
    return <Alert message="Indica el numero de invitados" type="warning" />
  }

  const [distributionMap, setDistributionMap] = useState({})
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
  return (
    <Row className={`event distribution map ${className}`} gutter={[10, 8]}>
      {className === "joya" && (
        <Col span={24} style={{ height: "max-content" }}>
          {distributionMap["table-main"]
              ? (
                <MapTable
                  active={!!distributionMap["table-main"]}
                  disabled={distributionMap["table-main"]?.occupiedSpaces === 8}
                  onSelect={() => onSelect("table-main", 8)}
                  selected={state.selected["table-main"]?.current > 0}
                  used={state.distribution["table-main"]?.occupiedSpaces} />
              ) : (
                <GraduationTables
                  distribution={distributionMap}
                  onSelect={onSelect}
                  state={state} />
              )
          }
        </Col>
      )}
      <MapColumn
        distribution={distributionMap}
        onSelect={onSelect}
        state={state}
        tables={columns.first} />
      <MapColumn
        distribution={distributionMap}
        onSelect={onSelect}
        state={state}
        tables={columns.second} />
      <Col className="stage-area" span={12}>
        <div className="stage">
          <Typography.Title>Pista</Typography.Title>
        </div>
      </Col>
      <MapColumn
        distribution={distributionMap}
        onSelect={onSelect}
        state={state}
        tables={columns.third} />
      <MapColumn
        distribution={distributionMap}
        onSelect={onSelect}
        state={state}
        tables={columns.fourth} />
      {lobby}
    </Row>
  )
}
