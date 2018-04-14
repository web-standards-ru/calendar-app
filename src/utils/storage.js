import * as queryString from 'query-string'

class Storage {
  getSelectedCountry() {
    return this.getItem('selectedCountry') || ''
  }

  getSelectedCity() {
    return this.getItem('selectedCity') || ''
  }

  setSelectedCountry(country) {
    return this.setItem('selectedCoutry', country)
  }

  setSelectedCity(city) {
    return this.setItem('selectedCity', city)
  }

  setItem(key, value) {
    let urlParams = queryString.parse(window.location.search)
    urlParams[key] = value
    window.history.pushState(
      urlParams,
      '',
      window.location.origin + window.location.pathname + '?' + queryString.stringify(urlParams),
    )
    return localStorage.setItem(key, value)
  }

  getItem(key) {
    let urlParams = queryString.parse(window.location.search)
    return urlParams[key] || localStorage.getItem(key)
  }
}

export default Storage
