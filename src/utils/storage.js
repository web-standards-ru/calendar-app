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
    return localStorage.setItem(key, value)
  }

  getItem(key) {
    return localStorage.getItem(key)
  }
}

export default Storage
