import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/es'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localeData)

dayjs.tz.setDefault('America/Mexico_City')
dayjs.locale('es')

export const parseDate = (date) => {
  if (!date) return null
  return dayjs.utc(date).tz('America/Mexico_City')
}

export default dayjs
