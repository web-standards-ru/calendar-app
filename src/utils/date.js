import moment from 'moment'
import 'moment/locale/ru'

export const getHumanDate = dateText => {
  const splitDate = dateText.split('.')
  const date = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
  return moment(date)
    .format('DD MMM YYYY')
    .replace(/ /g, '\u00A0')
}

export const sortDate = (x, y) => {
  const a = x.date.start.split('.')
  const b = y.date.start.split('.')
  const dateA = Date.parse(`${a[2]}-${a[1]}-${a[0]}`)
  const dateB = Date.parse(`${b[2]}-${b[1]}-${b[0]}`)
  return new Date(dateA) - new Date(dateB)
}
