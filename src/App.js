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

class App extends Component {
  state = {
    entries: [],
    countries: [],
    filter: '',
    type: '',
    selectedOption: '',
    loading: true,
  }
  componentDidMount = async () => {
    const {entries, countries} = await getEvents()
    this.setState({
      loading: false,
      entries,
      countries,
    })
  }

  handleChange = selectedOption => {
    if (selectedOption !== null) {
      const {value} = selectedOption
      this.setState({selectedOption: value, filter: value, type: 'country'})
    } else {
      this.setState({selectedOption: '', filter: '', type: 'country'})
    }
  }
  renderFooter = () => {
    const {loading} = this.state

    return loading ? null : <Footer />
  }
  render() {
    const {countries, selectedOption: value, loading, filter, type, entries} = this.state
    const countriesList = []
    countries.forEach(value => {
      countriesList.push({value, label: value})
    })

    return (
      <Container>
        <Header>Календарь событий по&nbsp;фронтенду</Header>
        <Search>
          <Select
            clearValueText="Очистить"
            placeholder="Выберите страну"
            noResultsText="Ничего не найдено"
            name="form-field-name"
            options={countriesList}
            value={value}
            onChange={this.handleChange}
          />
        </Search>
        {loading ? <Preloader /> : <Events filter={filter} type={type} entries={entries} />}
        {this.renderFooter()}
      </Container>
    )
  }
}

export default App
