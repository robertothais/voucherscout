import { Navbar, Nav, NavItem, Modal, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import request from 'superagent'
import CSRF from '../classes/csrf'


class PageNavbar extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = { showModal: false, subscribed: false }
  }

  close = () => {
    this.setState({ showModal: false });
  }

  open = () => {
    this.setState({ showModal: true });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.email.value) {
      alert('Please enter a valid email')
      return
    }
    this.setState({isPosting: true})
    request
      .post('/subscribe')
      .set(CSRF.header(), CSRF.token())
      .send({email: e.target.email.value})
      .end((err, res) => {
        if (err) {
          alert('Error! Did you subscribe already?')
          this.setState({isPosting: false})
        } else {
          this.setState({isPosting: false, subscribed: true})
          setTimeout(this.close, 2000)
        }
      })
  }

  render() {
    return (<Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">{this.props.title}</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem eventKey={1} href="/">Find Shows</NavItem>
          <NavItem eventKey={2} href="/about">About</NavItem>
          <NavItem eventKey={2} onClick={this.open}>Sign Up For Show Updates</NavItem>
        </Nav>
      </Navbar.Collapse>
      <Modal show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Get updates on your email when new shows become available</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form inline onSubmit={this.handleSubmit}>
            <FormGroup bsSize='large'>
              <FormControl
                type='text'
                name='email'
                disabled={this.state.isPosting || this.state.subscribed}
                placeholder='Your Email'/>
              <Button
                type='submit'
                bsSize='large'
                bsStyle='primary'
                disabled={this.state.isPosting || this.state.subscribed}>
                {this.state.subscribed ? 'Thanks!' : 'Subscribe'}
              </Button>
            </FormGroup>
          </Form>
          <h5>We will never spam you or give your email out to anyone</h5>
        </Modal.Body>
      </Modal>
    </Navbar>);
  }
}

export default PageNavbar;