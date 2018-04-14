import React, {Component} from 'react'
import styled, {css} from 'styled-components'
import Events from '../Events'
import Preloader from '../Preloader'
import {getEvents} from '../../utils/api'
import Footer from '../Footer'
import {MassonryPanel} from './masonry-panel'
import SearchIcon from '../Icons/SearchIcon'

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 15px;
  position: relative;
`
const Header = styled.h1`
  font-size: 36px;
`
const Search = styled.div`
  flex: 1 1 30%;
  min-width: 230px;
`
const EventsContainer = styled.div`
  flex: 1 1 70%;
`

const ContentContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
`

const SearchPanelTitleContainer = styled.div`
  display: flex;
`
const SearchInput = styled.input`
  max-width: 140px;
  flex: 1 1 auto;
  height: 1em;
  margin: auto;
  margin-right: 0;
  border: none;
  background: transparent;
  max-width: 120px;
  font-size: 1.5em;
  font-style: italic;

  ${props =>
    props.hasValue &&
    css`
      border-bottom: 1px solid gray;
    `};
`
const SearchInputLabel = styled.label`
  margin: auto;
  margin-right: 0;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 20px;
  margin-left: 0;
  flex: 0 0 auto;
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
    const {entries, countries} = await getEvents()

    const {storage} = this.props
    let selectedCountry = storage.getSelectedCountry()
    let selectedCity = storage.getSelectedCity()
    try {
      let countryParsed = JSON.parse(selectedCountry)
      selectedCountry =
        (countryParsed &&
          countryParsed.length &&
          countryParsed.map(countryValue => {
            return {value: countryValue, label: countryValue} // countries.find(c => c.name == countryValue);
          })) ||
        []
      let cityParsed = JSON.parse(selectedCity)
      if (cityParsed && cityParsed.length !== undefined) {
        //let cities = countries
        //  .map(x => x.cities)
        //  .reduce((current, next) => current.concat(next), [])
        //  .map(x => ({label: x, value: x}))
        selectedCity = cityParsed.map(cityValue => {
          return {value: cityValue, label: cityValue} //cities.find(c => c.value == cityValue);
        })
      }
    } catch (err) {
      selectedCountry = []
      this.props.storage.setItem('selectedCountry', JSON.stringify(selectedCountry))

      selectedCity = []
      this.props.storage.setItem('selectedCity', JSON.stringify(selectedCity))
    }

    if (typeof selectedCountry !== 'object') this.props.storage.setItem('selectedCountry', '[]')
    if (typeof selectedCity !== 'object') this.props.storage.setItem('selectedCity', '[]')

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
          this.props.storage.setItem(stateProperty, JSON.stringify(value.map(x => x.value)))
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
    this.setState({selectedCity: newSelectedCity.map(x => x.value)})
    this.props.storage.setItem('selectedCity', JSON.stringify(newSelectedCity.map(x => x.value)))
  }

  createCountrySelectHandler() {
    const generalPropHandler = this.createSelectHandler('selectedCountry')
    return selectedOption => {
      generalPropHandler(selectedOption)
    }
  }

  onSearchCountry = event => {
    this.setState({
      countrySearchTerm: event.target.value,
    })
  }

  onSearchCity = event => {
    this.setState({
      citySearchTerm: event.target.value,
    })
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
    } else {
      cities = countries
        .map(x => x.cities)
        .reduce((current, next) => current.concat(next), [])
        .map(x => ({label: x, value: x}))
    }

    return (
      <Container>
        <Header>Календарь событий по&nbsp;фронтенду</Header>
        {loading ? (
          <Preloader />
        ) : (
          <ContentContainer>
            <Search>
              <SearchPanelTitleContainer>
                <h2>Страна:</h2>
                <SearchInput
                  id="country-search"
                  onChange={this.onSearchCountry}
                  hasValue={this.state.countrySearchTerm}
                />
                <SearchInputLabel htmlFor="country-search">
                  <SearchIcon />
                </SearchInputLabel>
              </SearchPanelTitleContainer>
              <MassonryPanel
                items={countriesList}
                selectedItems={selectedCountries}
                priorityValues={['Россия', 'Украина', 'Беларусь']}
                searchTerm={this.state.countrySearchTerm}
                onChange={this.handleCountrySelect}
              />
              <SearchPanelTitleContainer>
                <h2>Город:</h2>
                <SearchInput id="city-search" onChange={this.onSearchCity} hasValue={this.state.citySearchTerm} />
                <SearchInputLabel htmlFor="city-search">
                  <SearchIcon />
                </SearchInputLabel>
              </SearchPanelTitleContainer>
              <MassonryPanel
                items={cities}
                priorityValues={['Москва', 'Санкт-Петербург', 'Минск', 'Киев']}
                selectedItems={selectedCities}
                searchTerm={this.state.citySearchTerm}
                onChange={this.handleCitySelect}
              />
            </Search>
            <EventsContainer>
              <h2>События:</h2>
              <Events country={selectedCountries} city={selectedCities} entries={entries} />
            </EventsContainer>
          </ContentContainer>
        )}
        {this.renderFooter()}
      </Container>
    )
  }
}

export default App
