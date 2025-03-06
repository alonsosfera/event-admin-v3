import React, { useEffect, useState } from "react"
import axios from "../../helpers/axios"
import WebFont from "webfontloader"
import { Select } from "antd"

const FontPicker = ({ value, onChange }) => {
  const [fontList, setFontList] = useState([])

  const loadFont = font => {
    WebFont.load({ google: { families: [font] } })
  }

  useEffect(() => {
    if (WebFont) {
      loadFont(value)
    }
  }, [value])

  useEffect(() => {
    axios.get("/api/fonts")
      .then(({ data }) => setFontList(data.fonts))
  }, [])

  return (
    <Select
      showSearch
      value={value}
      placeholder={value}
      onSelect={value => onChange(value)}>
      {fontList?.map(font => (
        <Select.Option key={font.family} value={font.family}>{font.family}</Select.Option>
      ))}
    </Select>
  )
}

export default FontPicker
