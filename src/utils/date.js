import moment from 'moment'
import 'moment/locale/ru'

export const getHumanDate = dateText => {
  const splitDate = dateText.split('.')
  const date = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
  return moment(date)
    .format('DD MMM YYYY')
    .replace(/ /g, '\u00A0')
}
