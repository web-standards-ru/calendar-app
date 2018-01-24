import axios from 'axios'

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

export const getEvents = async () => {
  const response = await axios.get('https://frontendcalendar.tk/events')
  const {data} = response
  const entries = []
  const countries = []
  data.forEach(el => {
    const {name, city, date, time, link} = el
    const dateStart = date.split('-')[0]
    const d = dateStart.split('.')
    const more = Date.parse(`${d[2]}-${d[1]}-${d[0]}`) >= new Date().setHours(0, 0, 0, 0)
    if (more) {
      const location = city.replace(/, /g, ',').split(',')
      countries.push(location[1])
      const dateEnd = date ? date.split('-')[1] : ''
      const timeStart = time ? time.split('-')[0] : ''
      const timeEnd = time ? time.split('-')[1] : ''
      entries.push({
        name,
        location: {
          city: location[0],
          country: location[1],
        },
        date: {
          start: dateStart,
          end: dateEnd,
        },
        link,
        time: {
          start: timeStart,
          end: timeEnd,
        },
      })
    }
  })
  return {entries, countries: countries.filter(onlyUnique).sort()}
}
