import EventRow from './event_row'
import { Pagination } from 'react-bootstrap';

class EventList extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.perPage = 12
    this.state = {
      page: 1
    }
  }

  handlePageSelect = (page) =>  {
    this.setState({page: page})
    window.scrollTo(0, 0)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({page: 1})
  }

  render() {
    const pages = Math.ceil(this.props.events.length / this.perPage)
    const index = this.perPage * (this.state.page - 1)
    return (<div>
      <div className='small'>{this.props.events.length} shows</div>
      <div>
        {this.props.events.slice(index, index + this.perPage).map((event)=> {
          return <EventRow {...event} key={event.event_id} isHot={this.props.isHot} />
        })}
      </div>
      <Pagination
        bsSize='large'
        ellipsis={true}
        boundaryLinks={true}
        maxButtons={10}
        items={pages}
        activePage={this.state.page}
        onSelect={this.handlePageSelect}
      />
    </div>)
  }
}

export default EventList;