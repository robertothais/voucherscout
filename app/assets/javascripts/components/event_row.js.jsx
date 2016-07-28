import moment from 'moment'

class EventRow extends React.Component {

  render() {
    const url = `http://concerts.livenation.com/event/${this.props.event_id}`
    return (<div className='event-row'>
      <div className='row'>
        <div className='col-md-10 col-md-pull-left'>
          <h4>
            <a href={url} target='_blank'>{this.props.name}</a>{' '}
            { this.props.isHot(this.props) ? <i className='glyphicon glyphicon-fire'/> : ''}
          </h4>
          <div><em>{this.props.artists.join(", ")}</em></div>
          <div>{this.props.venue_name}</div>
          <div>{moment(this.props.time).format('dddd, MMMM Do YYYY')}</div>
          <div>{moment(this.props.time).format('h:mm A')}</div>
        </div>
        <div className='col-md-2 col-md-pull-right'>
          <div>{this.props.venue_city}, {this.props.venue_state}</div>
        </div>
      </div>
    </div>);
  }
}

export default EventRow;