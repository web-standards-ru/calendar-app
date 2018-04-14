import * as queryString from 'querystring-es3'

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
    let search = window.location.search;
    if (search && search[0] == '?') {
      search = search.substr(1); // bug in queryString
    }
    let urlParams = queryString.parse(search)
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
