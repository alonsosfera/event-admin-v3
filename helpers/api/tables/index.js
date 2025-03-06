export const addExtraTables = tableDistribution => {
  for (let x = 0; x <= 5; x++) {
    tableDistribution[`table-main${  x}`] = {
      spaces: 12,
      occupiedSpaces: 0
    }
  }
  return tableDistribution
}

export const addMainTable = tableDistribution => {
  tableDistribution["table-main"] = { spaces: 8, occupiedSpaces: 0 }
  return tableDistribution
}

export const generateTableSchema = (numberGuests, startFrom) => {
  const tableDistribution = {}
  const tableNumbers = Math.floor(numberGuests / 10)

  for(let i = 0; i < tableNumbers; i++){
    if(startFrom){
      startFrom++
      tableDistribution[`table-${startFrom}`] = {
        spaces: 12,
        occupiedSpaces: 0
      }
    }
    else {
      tableDistribution[`table-${i + 1}`] = {
        spaces: 12,
        occupiedSpaces: 0
      }
    }
  }
  return tableDistribution
}
