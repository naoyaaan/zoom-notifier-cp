import { useState, useEffect } from 'react';
import { Container, Form, Col } from 'react-bootstrap';
import api from '../api';
import Tasktable from "../components/Tasktable";
import Taskentry from "../components/Taskentry";

function Tasks() {
  const [filter, setFilter] = useState({
      "completed":"all",
      "class":"all"
  });
  const [classes, setClasses] = useState([]);
  const [counter, setCounter] = useState(0);

useEffect(() => {
    api.get('/classes').then(resp => {
      setClasses(resp.data);
    }).catch(err => {
      console.log(err);
    });
}, []);

  const changeFilter = (event) => {
      var data = JSON.parse(JSON.stringify(filter));
      data[event.target.name] = event.target.value;
      setFilter(data);
  }

  const getClassId = (name) => {
      const result = classes.find( ({ name }) => name === filter.class );
      return result === undefined ? result : result.id;
  }

  return (<Container>
    <h3>Tasks</h3>

    <Taskentry classes={classes} update={() => setCounter(counter^1)}/>

    <Form.Group>
      <Form.Row>
        <Form.Label column md={{ span: 1, offset: 1 }}>提出状況：</Form.Label>
        <Col md={2}>
          <Form.Control as="select" name="completed" defaultValue="all" onChange={changeFilter}>
            <option value="all">全て</option>
            <option value="false">未提出</option>
            <option value="true">提出済</option>
          </Form.Control>
        </Col>
        <Form.Label column md={{ span: 1, offset: 1 }}>講義名：</Form.Label>
        <Col md={3}>
        <Form.Control as="select" name="class" defaultValue="all" onChange={changeFilter}>
            <option value="all">全て</option>
            {classes.map((c) => ( <option key={c.id}>{c.name}</option> ))}
        </Form.Control>
        </Col>
      </Form.Row>
    </Form.Group>
    <Tasktable
        class_id={getClassId(filter.class)}
        completed={filter.completed === "all" ? undefined : filter.completed === "true"}
        reload={counter}
    />
  </Container>);
}

export default Tasks;
