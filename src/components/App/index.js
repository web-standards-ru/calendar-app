import React, {Component} from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import styled from 'styled-components'
import Events from '../Events'
import Preloader from '../Preloader'
import {getEvents} from '../../utils/api'
import Footer from '../Footer'

const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 15px;
  position: relative;
`
const Header = styled.h1`
  font-size: 36px;
`
const Search = styled.div`
  margin-bottom: 15px;
`
const StyledSelect = styled(Select)`
  margin-bottom: 10px;
`

class App extends Component {
  state = {
    entries: [],
    countries: [],
    filter: '',
    type: '',
    selectedOption: '',
    loading: true,
    selectedCountry: [],
    selectedCity: [],
  }

  constructor(props) {
    super(props)

    this.handleCountrySelect = this.createCountrySelectHandler()
    this.handleCitySelect = this.createSelectHandler('selectedCity')
  }

  componentDidMount = async () => {
    const {storage} = this.props
    let selectedCountry = storage.getSelectedCountry()
    let selectedCity = storage.getSelectedCity()
    try {
      selectedCountry = JSON.parse(selectedCountry)
      selectedCity = JSON.parse(selectedCity)
    } catch (err) {
      selectedCountry = []
      this.props.storage.setItem('selectedCountry', JSON.stringify(selectedCountry))

      selectedCity = []
      this.props.storage.setItem('selectedCity', JSON.stringify(selectedCity))
    }

    if (typeof selectedCountry !== 'object') this.props.storage.setItem('selectedCountry', '[]')
    if (typeof selectedCity !== 'object') this.props.storage.setItem('selectedCity', '[]')

    const {entries, countries} = await getEvents()
    this.setState({
      loading: false,
      entries,
      countries,
      selectedCountry,
      selectedCity,
    })
  }

  createSelectHandler(stateProperty) {
    return selectedOption => {
      const value = selectedOption ? selectedOption : ''
      this.setState(
        {
          [stateProperty]: value,
        },
        () => {
          this.props.storage.setItem(stateProperty, JSON.stringify(value))
          if (stateProperty === 'selectedCountry') {
            this.removeCity(value)
          }
        },
      )
    }
  }
  removeCity = value => {
    const {countries, selectedCity} = this.state
    const list = []
    const cities = []
    value.map(item => {
      const s = countries.find(({name}) => name === item.value)
      return list.push(s)
    })
    list.map(item => {
      return item.cities.map(item => {
        return cities.push({value: item, label: item})
      })
    })
    const newSelectedCity = []
    cities.map(item => {
      const s = selectedCity.find(({value}) => value === item.value)
      if (s) newSelectedCity.push(s)
      return false
    })
    this.setState({selectedCity: newSelectedCity})
    this.props.storage.setItem('selectedCity', JSON.stringify(newSelectedCity))
  }

  createCountrySelectHandler() {
    const generalPropHandler = this.createSelectHandler('selectedCountry')
    return selectedOption => {
      generalPropHandler(selectedOption)
    }
  }
  renderFooter = () => {
    const {loading} = this.state

    return loading ? null : <Footer />
  }
  render() {
    const {countries, selectedCountry, selectedCity, loading, entries} = this.state
    const countriesList = []
    countries.forEach(value => {
      countriesList.push({value: value.name, label: value.name})
    })
    let cities = []
    const list = []

    let selectedCountries = selectedCountry
    let selectedCities = selectedCity

    if (selectedCountry.length) {
      selectedCountry.map(item => {
        const country = countries.find(({name}) => name === item.value)
        if (country) list.push(country)
        return false
      })

      if (list.length) {
        list.map(item => {
          return item.cities.map(item => {
            return cities.push({value: item, label: item})
          })
        })
        let checkCity = []
        cities.map(item => {
          const city = selectedCity.find(({value}) => value === item.value)
          if (city) checkCity.push(city)
          return false
        })
        if (!checkCity.length) selectedCities = []
      } else {
        selectedCountries = []
      }
    }

    let citySelect = (
      <StyledSelect
        clearValueText="Очистить"
        placeholder="Выберите город"
        noResultsText="Ничего не найдено"
        name="form-field-city-name"
        options={cities}
        multi
        value={selectedCities}
        onChange={this.handleCitySelect}
      />
    )
    return (
      <Container>
        <Header>Календарь событий по&nbsp;фронтенду</Header>
        <Search>
          <StyledSelect
            clearValueText="Очистить"
            placeholder="Выберите страну"
            noResultsText="Ничего не найдено"
            name="form-field-country-name"
            options={countriesList}
            multi
            value={selectedCountries}
            onChange={this.handleCountrySelect}
          />
          {selectedCountries.length ? citySelect : ''}
        </Search>
        {loading ? <Preloader /> : <Events country={selectedCountries} city={selectedCities} entries={entries} />}
        {this.renderFooter()}
      </Container>
    )
  }
}

export default App
