import { useState, useEffect } from 'react';
import { Container, Button, Table, Nav, Modal, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';

function DescriptionModal(prop) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button variant="link" onClick={() => setShow(true)}>{prop.title}</Button>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{prop.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{whiteSpace: 'pre-line'}}>{prop.description}</Modal.Body>
      </Modal>
    </>
  );
}

function Tasktable({class_id, completed, reload, tasks}) {
  const [sortid, setSortid] = useState(0);
  const [classes, setClasses] = useState([]);
  const [task, setTask] = useState({});
  const [alltasks, setAlltasks] = useState([]);
  const [spin, setSpin] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    api.get('/classes').then(resp => {
        setClasses(resp.data);
        setSpin(false);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
      if(tasks !== undefined){
          setAlltasks(tasks);
          return;
      }
      const url = ((class_id === undefined || class_id === 0) ? '/tasks' : `/classes/${class_id}/tasks`);
    api.get(url).then(resp => {
        setAlltasks(resp.data.filter((t => {
            return (completed === undefined || t.completed === completed);
        })));
    }).catch(err => {
      console.log(err);
    });
}, [class_id, completed, counter, reload, tasks]);

  useEffect(() => {
      const result = classes.find( ({ name }) => name === task.class );
      if(result === undefined || !("id" in task && "class" in task)) return;
    api.put(`/classes/${result.id}/tasks/${task.id}`, {
  "title": task.title,
  "description": task.title,
  "deadline": task.deadline,
  "completed": !task.completed
}).then(resp => {
    // console.log(resp);
    setCounter(counter^1);
    }).catch(err => {
      console.log(err);
    });
}, [task]);



  const tasks2row = (task) => {
    const tz2yyyymmddhhmm = (time) => { return time.substr(0, 10) + " " + time.substr(11, 5); }
    const makelink = (className) => {
        const result = classes.find( ({ name }) => name === className );
        if(result === undefined) return <Link component={Nav.Link} disabled>{className}</Link>;
        return <Link to={`/classes/${result.id}`} component={Nav.Link}>{className}</Link>
    }
    return (
        <tr key={task.id}>
          <td><Button variant={task.completed ? "outline-success":"outline-danger"} onClick={() => setTask(task)} >=</Button></td>
          <td>{tz2yyyymmddhhmm(task.deadline)}</td>
          <td><Badge pill variant={task.completed ?"success":"danger"}>{task.completed ? "提出済" : "未提出"}</Badge></td>
          <td>{makelink(task.class)}</td>
          <td><DescriptionModal title={task.title} description={task.description}/></td>
          <td>{tz2yyyymmddhhmm(task.created_at)}</td>
        </tr>
    );
  }

  const tasksort = () => {
      const res = JSON.parse(JSON.stringify(alltasks));
      switch (sortid) {
        case 1:
        case 2:
          res.sort(function(l, r){
              return l.deadline === r.deadline ? 0 : (l.deadline < r.deadline) === (sortid === 1)  ? -1 : 1;
          });
          break;
        case 3:
        case 4:
          res.sort(function(l, r){
            return l.created_at === r.created_at ? 0 : (l.created_at < r.created_at) === (sortid === 3)  ? -1 : 1;
          });
          break;
        default:
          break;
      }
      return res;
  }

  return (<Container>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>{spin && <tr><Spinner animation="border" variant="primary" /></tr>}</th>
          <th>締切<Button variant="link" onClick={() => setSortid(1)}>↓</Button><Button variant="link" onClick={() => setSortid(2)}>↑</Button></th>
          <th>提出状況</th>
          <th>講義名</th>
          <th>課題タイトル</th>
          <th>公開日<Button variant="link" onClick={() => setSortid(3)}>↓</Button><Button variant="link" onClick={() => setSortid(4)}>↑</Button></th>
        </tr>
      </thead>
      <tbody>
        {spin || tasksort().map((task) => tasks2row(task))}
      </tbody>
    </Table>
  </Container>);
}

export default Tasktable;
