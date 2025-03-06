import { Col, Row } from "antd"
import { MapTable } from "./table"

export const GraduationTables = ({ distribution, onSelect, state }) => {
  return (
    <Row className="graduation-tables" gutter={[15, 0]}>
      <Col span={8}>
        <MapTable
          active={!!distribution["table-main0"]}
          disabled={distribution["table-main0"]?.occupiedSpaces === 12}
          onSelect={() => onSelect("table-main0", 11)}
          selected={state.selected["table-main0"]?.current > 0}
          used={state.distribution["table-main0"]?.occupiedSpaces}
          table="extra 1" />
        <MapTable
          active={!!distribution["table-main3"]}
          disabled={distribution["table-main3"]?.occupiedSpaces === 12}
          onSelect={() => onSelect("table-main3", 11)}
          selected={state.selected["table-main3"]?.current > 0}
          used={state.distribution["table-main3"]?.occupiedSpaces}
          table="extra 4" />
      </Col>
      <Col span={8}>
        <MapTable
          active={!!distribution["table-main1"]}
          disabled={distribution["table-main1"]?.occupiedSpaces === 12}
          onSelect={() => onSelect("table-main1", 11)}
          selected={state.selected["table-main1"]?.current > 0}
          used={state.distribution["table-main1"]?.occupiedSpaces}
          table="extra 2" />
        <MapTable
          active={!!distribution["table-main4"]}
          disabled={distribution["table-main4"]?.occupiedSpaces === 11}
          onSelect={() => onSelect("table-main4", 11)}
          selected={state.selected["table-main4"]?.current > 0}
          used={state.distribution["table-main4"]?.occupiedSpaces}
          table="extra 5" />
      </Col>
      <Col span={8}>
        <MapTable
          active={!!distribution["table-main2"]}
          disabled={distribution["table-main2"]?.occupiedSpaces === 12}
          onSelect={() => onSelect("table-main2", 11)}
          selected={state.selected["table-main2"]?.current > 0}
          used={state.distribution["table-main2"]?.occupiedSpaces}
          table="extra 3" />
        <MapTable
          active={!!distribution["table-main5"]}
          disabled={distribution["table-main5"]?.occupiedSpaces === 12}
          onSelect={() => onSelect("table-main5", 11)}
          selected={state.selected["table-main5"]?.current > 0}
          used={state.distribution["table-main5"]?.occupiedSpaces}
          table="extra 6" />
      </Col>
    </Row>
  )
}
