export const getNextTable = tablesDistribution => {
  const tableNumbers = Object.keys(tablesDistribution)
    .map(key => parseInt(key.split("-")[1]))
    .filter(el => {
      return !isNaN(el)
    })
    .toSorted((a, b) => a - b)

  const missingNumberIndex = tableNumbers.findIndex((num, i) =>
    num !== i + 1
  )
  const lastNumber = tableNumbers.pop()

  return missingNumberIndex > -1
    ? missingNumberIndex + 1
    : (lastNumber || 0) + 1
}
