import { Col } from "antd"
import { MapTable } from "./table"

export const MapColumn = ({ distribution, onSelect, state, tables }) => {
  return (
    <Col span={3}>
      {tables.map(el => (
        <MapTable
          active={!!distribution[el]}
          disabled={distribution[el]?.occupiedSpaces === 12}
          key={el}
          onSelect={() => onSelect(el)}
          selected={state.selected[el]?.current > 0}
          table={el.split("-")[1]}
          used={distribution[el]?.occupiedSpaces} />
      ))}
    </Col>
  )
}
