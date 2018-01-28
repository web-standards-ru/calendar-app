import React, {Component} from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import styled from 'styled-components'
import Events from './components/Events'
import Preloader from './components/Preloader'
import {getEvents} from './utils/api'
import Footer from './components/Footer'

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
  }

  constructor(props) {
    super(props)

    this.handleCountrySelect = this.createCountrySelectHandler()
    this.handleCitySelect = this.createSelectHandler('selectedCity')
  }

  componentDidMount = async () => {
    const {storage} = this.props
    const selectedCountry = storage.getSelectedCountry()
    const selectedCity = storage.getSelectedCity()
    const {entries, countries} = await getEvents()
    this.setState({
      loading: false,
      entries,
      countries,
      selectedCountry,
      selectedCity: selectedCountry ? selectedCity : '',
    })
  }

  createSelectHandler(stateProperty) {
    return selectedOption => {
      const value = selectedOption ? selectedOption.value : ''
      this.setState(
        {
          [stateProperty]: value,
        },
        () => {
          this.props.storage.setItem(stateProperty, value)
        },
      )
    }
  }

  createCountrySelectHandler() {
    const generalPropHandler = this.createSelectHandler('selectedCountry')
    return selectedOption => {
      generalPropHandler(selectedOption)
      this.setState({
        selectedCity: '',
      })
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
    if (selectedCountry) {
      const country = countries.find(({name}) => name === selectedCountry)
      cities = country.cities.map(city => {
        return {value: city, label: city}
      })
    }
    let citySelect = (
      <StyledSelect
        clearValueText="Очистить"
        placeholder="Выберите город"
        noResultsText="Ничего не найдено"
        name="form-field-city-name"
        options={cities}
        value={selectedCity}
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
            value={selectedCountry}
            onChange={this.handleCountrySelect}
          />
          {selectedCountry ? citySelect : ''}
        </Search>
        {loading ? <Preloader /> : <Events country={selectedCountry} city={selectedCity} entries={entries} />}
        {this.renderFooter()}
      </Container>
    )
  }
}

export default App
