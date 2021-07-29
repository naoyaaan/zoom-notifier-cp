import { useState } from 'react';
import { Alert, Container, Form, Button, Col, Accordion, Card } from 'react-bootstrap';
import api from '../api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Taskentry({classes, update}) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [className, setClassName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date());

  const handleChangeClass = (event) => {
      setClassName(event.target.value);
  }
  const handleChangeTitle = (event) => {
      setTitle(event.target.value);
  }
  const handleChangeDescription = (event) => {
      setDescription(event.target.value);
  }

  const submitNewTask = (event) => {
      const toJST = (time) => {
          time.setHours(time.getHours() + 9);
          return time.toJSON();
      }
      const result = classes.find( ({ name }) => name === className );
      if(result === undefined){
          setErrorMessage("講義名を選択してください．");
          return;
      }else if(title.length === 0){
          setErrorMessage("課題タイトルを入力してください．");
          return;
      }
      // console.log(result);
      api.post(`/classes/${result.id}/tasks`, {
        "title": title,
        "description": description,
        "created_at": toJST(new Date()),
        "deadline": toJST(new Date()),
        "completed": false
      }).then(resp => {
          setSuccessMessage("課題を登録しました．");
          setErrorMessage("");
          update();
        // console.log(resp);
      }).catch(err => {
        console.log(err);
      });
  }

  return (<Container>
      {successMessage !== '' && <Alert variant="success">Success: {successMessage}</Alert>}
      {errorMessage !== '' && <Alert variant="danger">Error: {errorMessage}</Alert>}
    <Accordion>

    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="0">
      新規課題登録
      </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey="0">

      <Form.Group>
        <Form.Row>
          <Form.Label column md={{ offset: 1, span: 3 }} >講義名</Form.Label>
          <Col md={8}>
          <Form.Control as="select" onChange={handleChangeClass}>
              <option>講義名を選択してください</option>
              {Array.isArray(classes) &&  classes.map((c) => ( <option key={c.id}>{c.name}</option> ))}
          </Form.Control>
          </Col>
        </Form.Row>
        <Form.Row>
          <Form.Label column md={{ offset: 1, span: 3 }} >課題タイトル</Form.Label>
          <Col md={8}>
          <Form.Control type="text" onChange={handleChangeTitle}/>
          </Col>
        </Form.Row>
        <Form.Row>
          <Form.Label column md={{ offset: 1, span: 3 }} >詳細</Form.Label>
          <Col md={8}>
          <Form.Control as="textarea" rows={6} onChange={handleChangeDescription}/>
          </Col>
        </Form.Row>
        <Form.Row>
          <Form.Label column md={{ offset: 1, span: 3 }} >締切</Form.Label>
          <DatePicker selected={deadline} onChange={date => setDeadline(date)} showTimeInput dateFormat="yyyy-MM-dd hh:mm aa"/>
        </Form.Row>
        <Form.Row>
          <Col md={{ offset: 9, span: 3 }}>
          <Button variant="primary" onClick={submitNewTask}>課題登録</Button>
          </Col>
        </Form.Row>
      </Form.Group>

      </Accordion.Collapse>

    </Accordion>
  </Container>);
}

export default Taskentry;
