import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import _ from 'lodash';
import Search from './search'
import EventList from './event_list'
import SoldOutMessage from './sold_out_message'
import haversine from 'haversine';
import quantile from 'compute-quantile'

class Home extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedGenre: null,
      selectedArtist: null,
      selectedLocation: null,
      selectedHot: false,
      events: [],
      allGenres: [],
      allArtists: []
    }
  }

  handleArtistSelection = (selection) => {
    let newState
    if (selection.length) {
      newState = selection[0].label
    } else {
      newState = null
    }
    this.setState({selectedArtist: newState})
  }

  componentWillMount() {
    this.setState({
      events: window.EVENTS,
      allGenres: this.extractGenres(window.EVENTS),
      allArtists: this.extractArtists(window.EVENTS),
      upperQuantile: quantile(_.compact(_.map(window.EVENTS, (e) => e.popularity)), 0.85)
    })
  }

  extractGenres(events) {
    return _.filter(_.uniq(events.map((e) => e['genre'])).sort(), (e) => e != 'More Concerts')
  }

  extractArtists(events) {
    return _.uniq(_.flatten(events.map((e) => e['artists']))).sort()
  }

  handleGenreSelection = (selection) => {
    this.setState({selectedGenre: selection})
  }

  handleLocationSelection = (latitude, longitude) => {
    if (latitude && longitude) {
      this.setState({selectedLocation: [latitude, longitude]})
    } else {
      this.setState({selectedLocation: null})
    }
  }

  handleHotSelection = (a) => {
    this.setState({selectedHot: a.target.checked})
  }

  matchesGenre(event) {
    return !this.state.selectedGenre || event.genre == this.state.selectedGenre
  }

  matchesArtist(event) {
    return !this.state.selectedArtist || _.includes(event.artists, this.state.selectedArtist)
  }

  matchesHotness(event) {
    return !this.state.selectedHot || this.isHot(event)
  }

  isHot = (event) => {
    return (event.popularity && event.popularity >= this.state.upperQuantile)
  }

  matchesLocation(event) {
    return !this.state.selectedLocation ||
      haversine(
        { latitude: this.state.selectedLocation[0], longitude: this.state.selectedLocation[1] },
        { latitude: event.coordinates[0], longitude: event.coordinates[1] },
        { threshold: 50, unit: 'mile' }
      )
  }

  applyFilters = (events) => {
    return _.filter(events, (event) => {
      return this.matchesGenre(event) && this.matchesArtist(event) && this.matchesLocation(event) && this.matchesHotness(event)
    })
  }

  render() {
    const matchingEvents = this.applyFilters(this.state.events)
    const searchableGenres = this.extractGenres(matchingEvents)
    const searchableArtists = this.extractArtists(matchingEvents)
    return (
      <div>
      <Row>
        <Col xs={12}>
          <Search
            genres={this.state.allGenres}
            artists={this.state.allArtists}
            selectedGenre={this.state.selectedGenre}
            onArtistSelection={this.handleArtistSelection}
            onLocationSelection={this.handleLocationSelection}
            onHotSelection={this.handleHotSelection}
            onGenreSelection={this.handleGenreSelection}/>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div>Update 7/5/2016: Ticketmaster has finished redeeming vouchers required by the lawsuit settlement. I will keep the full event list here as a record.</div>
          <br/>
          <EventList events={matchingEvents} isHot={this.isHot} />
        </Col>
      </Row>
      </div>
    )
  }
}

export default Home;