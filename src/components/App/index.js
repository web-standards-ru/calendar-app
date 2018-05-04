import React, {Component} from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import styled from 'styled-components'
import Events from '../Events'
import Preloader from '../Preloader'
import {getEvents} from '../../utils/api'
import Footer from '../Footer'

const Container = styled.div`
  padding: 15px;
  position: relative;
`
const Header = styled.div`
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
`
const Title = styled.h1`
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
    const selectedCountry = storage.getSelectedCountry()
    const selectedCity = storage.getSelectedCity()
    const {entries, countries} = await getEvents()
    this.setState({
      loading: false,
      entries,
      countries,
      selectedCountry: selectedCountry.length ? JSON.parse(selectedCountry) : [],
      selectedCity: selectedCountry.length ? JSON.parse(selectedCity) : [],
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

    if (selectedCountry.length) {
      const list = []
      selectedCountry.map(item => {
        const s = countries.find(({name}) => name === item.value)
        return list.push(s)
      })
      list.map(item => {
        return item.cities.map(item => {
          return cities.push({value: item, label: item})
        })
      })
    }
    let citySelect = (
      <StyledSelect
        clearValueText="Очистить"
        placeholder="Выберите город"
        noResultsText="Ничего не найдено"
        name="form-field-city-name"
        options={cities}
        multi
        value={selectedCity}
        onChange={this.handleCitySelect}
      />
    )
    return (
      <Container>
        <Header>
          <Title>Календарь событий по&nbsp;фронтенду</Title>
          <Search>
            <StyledSelect
              clearValueText="Очистить"
              placeholder="Выберите страну"
              noResultsText="Ничего не найдено"
              name="form-field-country-name"
              options={countriesList}
              multi
              value={selectedCountry}
              onChange={this.handleCountrySelect}
            />
            {selectedCountry.length ? citySelect : ''}
          </Search>
        </Header>

        {loading ? <Preloader /> : <Events country={selectedCountry} city={selectedCity} entries={entries} />}
        {this.renderFooter()}
      </Container>
    )
  }
}

export default App
