import { ButtonToolbar, Checkbox, DropdownButton, MenuItem, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import Typeahead from 'react-bootstrap-typeahead'

class Search extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      gettingLocation: false,
      locationString: null
    }
  }

  handleLocationKeyPress = (e) => {
    if (e.key == 'Enter') { this.getLocation(e) }
  }

  handleLocationChange = (e) => {
    if (e.target.value == '' || e.target.value == null) { this.getLocation(e) }
  }

  getLocation = (e) => {
    const locationString = e.target.value
    if (locationString == "" || locationString == null) {
      this.props.onLocationSelection(null, null)
      this.setState({locationString: null})
      return
    }
    if (locationString == this.state.locationString) { return }
    const geocoder = new google.maps.Geocoder()
    this.setState({gettingLocation: true, locationString: locationString})
    geocoder.geocode({'address': e.target.value}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.setState({gettingLocation: false})
        const lat = results[0].geometry.location.lat()
        const lng = results[0].geometry.location.lng()
        this.props.onLocationSelection(lat, lng)
      } else {
        this.setState({gettingLocation: false, locationString: null})
        alert('Invalid location')
      }
    })
  }

  render() {
    const artists = this.props.artists.map(function(a, i) { return {id: i, label: a} })
    return (<Form inline>
      <FormGroup bsSize='large'>
        <Typeahead
          placeholder='Artist'
          options={artists}
          onChange={this.props.onArtistSelection}/>
      </FormGroup>
      <FormGroup bsSize='large'>
        <FormControl
          type='text'
          placeholder='Near City'
          onKeyPress={this.handleLocationKeyPress}
          onChange={this.handleLocationChange}
          onBlur={this.getLocation}/>
      </FormGroup>
      <FormGroup>
        <DropdownButton
          id='genre-dropdown'
          bsSize='large'
          title={this.props.selectedGenre || 'Genre'}
          onSelect={this.props.onGenreSelection}>
          {this.props.genres.map((genre, i) => {
            return <MenuItem eventKey={genre} key={i}>{genre}</MenuItem>
          })}
          <MenuItem divider/>
          <MenuItem eventKey={null} key={this.props.genres.length}>All</MenuItem>
        </DropdownButton>
      </FormGroup>
      <FormGroup>
        <input type='checkbox' className='magic-checkbox' id='hot' onChange={this.props.onHotSelection}/>
        <label htmlFor='hot'>
          Hot
          {' '}
          <i className='glyphicon glyphicon-fire'/>
        </label>
      </FormGroup>
    </Form>)
  }
}

export default Search;
