import { Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import api from '../api';
import {updateCredential} from '../api';

function Whoami() {
  const [user, setUser] = useState({
    "rss_url": "",
    "id": 0,
    "ical_url": "",
    "username": ""
  });
  const [errorMessage, setErrorMessage] = useState("foo");
  const [token, setToken] = useState("");
  
  useEffect(() => {
    api.get('/users/me').then(resp => {
      setUser(resp.data);
      setErrorMessage("");
    }).catch(err => {
      console.log(err);
      // setErrorMessage(err.response.data.message);
    });
  }, [token]);

  const onTokenUpdate = event => {
    const val = event.target.value;
    setToken(val);
    updateCredential(val);
  }

  return (<Container>
    <h3>Who am I?</h3>
    {errorMessage !== '' && <Alert variant="danger">Error: {errorMessage}</Alert>}<Form>
    <Form.Group controlId="formToken">
        <Form.Label>Token</Form.Label>
        <Form.Control type="text" placeholder="Enter token" onChange={onTokenUpdate} />
        <Form.Text className="text-muted">
          トークンはJson Web Token形式です．
        </Form.Text>
      </Form.Group>
    </Form>
    <ul className="list-group list-group-flush">
      <li className="list-group-item">Token: {token}</li>
      <li className="list-group-item">Username: {user.username}</li>
      <li className="list-group-item">RSS: {user.rss_url}</li>
      <li className="list-group-item">iCal: {user.ical_url}</li>
    </ul>
  </Container>);
}

export default Whoami;
