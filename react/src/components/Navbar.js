import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {updateCredential} from '../api';

function MyNavBar() {
    // implement your navbar here
    // see: https://react-bootstrap.github.io/components/navbar/
    return (<>
        <Navbar exxpand="lg" bg="light" className="mb-3">
        <Navbar.Brand>Zoom Notifier</Navbar.Brand>
        <Navbar.Collapse>
          <Nav>
            <Link to="/" component={Nav.Link}> Home </Link>
            <Link to="/tasks" component={Nav.Link}> Tasks </Link>
            <Link to="/settings" component={Nav.Link}> Settings </Link>
            <Link to="/" component={Nav.Link} onClick={() => updateCredential("")}> Sign out </Link>
          </Nav>
        </Navbar.Collapse>
        </Navbar>
    </>);
}

export default MyNavBar;
