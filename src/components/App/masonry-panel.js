import React, {Component} from 'react'
import * as Isotope from 'isotope-layout'
import styled, {css} from 'styled-components'
import Highlighter from 'react-highlight-words'

export class MassonryPanel extends Component {
  rootElem = null
  isotope = null

  constructor(props) {
    super(props)
    this.state = {
      lastSelection: [],
    }
  }

  initIsotope = rootElem => {
    this.rootElem = rootElem
    if (rootElem) {
      this.isotope = new Isotope(rootElem, {
        itemSelector: '.massonry-panel__item',
        layoutMode: 'fitRows',
        getSortData: {
          selected: elem => (Number(elem.dataset.selected) !== 0 ? elem.dataset.selected : Number.MAX_VALUE),
          priority: elem => (Number(elem.dataset.priority) !== 0 ? elem.dataset.priority : Number.MAX_VALUE),
          name: elem => elem.dataset.label,
        },
        sortBy: ['selected', 'priority', 'name'],
        sortAscending: true,
      })
    }
  }

  onItemClick = item => {
    if (this.props.onChange) {
      let selectedItems = this.getSelectedItems()
      if (selectedItems.some(x => x.value === item.value)) {
        // Unselect
        selectedItems = selectedItems.filter(x => x.value !== item.value)
        this.props.onChange(selectedItems)
      } else {
        // Select
        selectedItems = [...selectedItems, item]
        this.props.onChange(selectedItems)
      }
    }
  }

  componentDidUpdate() {
    if (this.props.selectedItems !== this.lastSelection) {
      this.isotope.updateSortData()
      this.isotope.arrange()
      this.lastSelection = this.props.selectedItems
    }
    if (this.props.items !== this.lastItems) {
      this.isotope.reloadItems()
      this.isotope.arrange()
      this.lastItems = this.props.items
    }
  }

  isSelectedItem = item => {
    let selectedItems = this.getSelectedItems()
    return selectedItems.findIndex(x => x.value === item.value) + 1
  }

  getItemPriority = item => {
    return this.props.priorityValues.findIndex(x => x === item.value) + 1
  }

  getSelectedItems() {
    return this.props.selectedItems.length !== undefined ? this.props.selectedItems : [this.props.selectedItems]
  }

  itemMatchSearch = item => {
    return !this.props.searchTerm || item.label.toLowerCase().indexOf(this.props.searchTerm.toLowerCase()) >= 0
  }

  StyledItem = styled.div`
    padding: 3px 7px;
    color: darkred;
    border: transparent 1px solid;
    margin: 2px;
    &:hover {
      color: red;
      cursor: pointer;
    }
    ${props =>
      this.isSelectedItem(props.item) &&
      css`
        color: red;
        border: 1px solid darkred;
      `};
  `

  render() {
    return (
      <div className="massonry-panel__root" ref={this.initIsotope}>
        {this.props.items.map(item => (
          <this.StyledItem
            className="massonry-panel__item"
            item={item}
            onClick={() => this.onItemClick(item)}
            key={item.value}
            data-label={item.label}
            data-selected={this.isSelectedItem(item)}
            data-priority={this.getItemPriority(item)}
            data-match-search={this.itemMatchSearch(item) || undefined}>
            {this.props.searchTerm ? (
              <Highlighter
                highlightClassName="YourHighlightClass"
                searchWords={[this.props.searchTerm]}
                autoEscape={true}
                textToHighlight={item.label}
              />
            ) : (
              item.label
            )}
          </this.StyledItem>
        ))}
      </div>
    )
  }
}
