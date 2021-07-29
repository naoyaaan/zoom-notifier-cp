import { Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Container, Form, Button, Col, Spinner } from 'react-bootstrap';
import api from '../api';

function Settings() {
  const [user, setUser] = useState({
    "rss_url": "",
    "id": 0,
    "ical_url": "",
    "username": ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [item, setItem] = useState("");
  const [spin, setSpin] = useState(false);

  const [form, setForm] = useState({
    "old_pass": "",
    "new_pass": "",
    "rss_url": "",
    "ical_url": ""
  });

  useEffect(() => {
    api.get('/users/me').then(resp => {
      setUser(resp.data);
      setForm({
          "old_pass": "",
          "new_pass": "",
          "rss_url": resp.data.rss_url,
          "ical_url": resp.data.ical_url
      })
    }).catch(err => {
      console.log(err);
    });
}, []);

  useEffect(() => {
    if(item === "") return;
    else if(item != "パスワード") setSpin(true);
    const to = (item == "パスワード" ? "password" : "url");
    api.put(`/users/me/${to}`, {
      "password_old": form.old_pass,
      "password_new": form.new_pass,
      "rss_url": form.rss_url,
      "ical_url": form.ical_url
    }).then(resp => {
      // console.log(resp);
      setSuccessMessage(`${item}を変更しました．`);
      setErrorMessage("");
      setItem("");
      setSpin(false);
      console.log(resp)
    }).catch(err => {
      setSuccessMessage("");
      setErrorMessage('data' in err.response && 'message' in err.response.data ? err.response.data.message : "Something is wrong.");
      setItem("");
      setSpin(false);
    });
}, [item]);

  const changeForm = (event) => {
      var data = form;
      data[event.target.name] = event.target.value;
      setForm(data);
  }

  return (<Container>
    <h3>Settings</h3>
    {successMessage !== '' && <Alert variant="success">Success: {successMessage}</Alert>}
    {errorMessage !== '' && <Alert variant="danger">Error: {errorMessage}</Alert>}
    {spin && <tr><Spinner animation="border" variant="primary" /></tr>}

    <Form.Group>
      <Form.Label>・パスワードの変更</Form.Label>
      <Form.Row>
        <Form.Label column md={{ offset: 1, span: 3 }} >現在のパスワード</Form.Label>
        <Col md={8}><Form.Control type="password" name="old_pass" onChange={changeForm}/></Col>
      </Form.Row>
      <Form.Row>
        <Form.Label column md={{ offset: 1, span: 3 }} >新規パスワード</Form.Label>
        <Col md={8}><Form.Control type="password" name="new_pass" onChange={changeForm}/></Col>
      </Form.Row>
      <Form.Row>
        <Col md={{ offset: 9, span: 3 }}>
        <Button variant="primary" onClick={() => setItem("パスワード")}>パスワードの変更</Button>
        </Col>
      </Form.Row>
      <Form.Label>・RSS URL，iCal URLの変更</Form.Label>
      <Form.Row>
        <Form.Label column md={{ offset: 1, span: 3 }} >RSS URL</Form.Label>
        <Col md={8}><Form.Control type="text" name="rss_url" placeholder={user.rss_url} defaultValue={user.rss_url} onChange={changeForm}/></Col>
      </Form.Row>
      <Form.Row>
        <Form.Label column md={{ offset: 1, span: 3 }} >iCal URL</Form.Label>
        <Col md={8}><Form.Control type="text" name="ical_url" placeholder={user.ical_url} defaultValue={user.ical_url} onChange={changeForm}/></Col>
      </Form.Row>
      <Form.Row>
        <Col md={{ offset: 9, span: 3 }}>
        <Button variant="primary" onClick={() => setItem("RSS URL，iCal URL")}>URLの変更</Button>
        </Col>
      </Form.Row>
    </Form.Group>
  </Container>);
}

export default Settings;
