import { Button, Col } from "antd"

export const MapTable = ({ active, disabled, onSelect, selected, table, used }) => {
  return (
    <Col
      className={`table ${!table && "main"} ${(active && !disabled) && "active"} ${selected && "selected"}`}
      span={3}>
      <Button
        disabled={!active || disabled}
        onClick={onSelect}
        shape={table ? "squad" : null}>
        {used ? used : "-"}
      </Button>
      <br />
      <small>Mesa {table ? table : "de honor"}</small>
    </Col>
  )
}
