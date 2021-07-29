import { Container,Table } from 'react-bootstrap';
import {React,useState} from "react"

function CreateTask(props){
    const completed = "未提出";
    if(props.task.completed){
        const completed = "提出済";
    }
    return(
        <tr>
            <td>{props.task.deadline.substr(0,10)}</td>
            <td>{completed}</td>
            <td>{props.task.title}</td>
            <td>{props.task.created_at.substr(0,10)}</td>
        </tr>
    );
};

function Tasks(props) {
  return (<Container>
    <Table striped bordered hover>
        <tbody>
            <tr>
                <th>課題締め切り日</th>
                <th>提出状況</th>
                <th>課題タイトル</th>
                <th>公開日</th>
            </tr>
            {props.tasks.map(item => (
                <CreateTask task={item} />
            ))}
        </tbody>
    </Table>
  </Container>);
}

export default Tasks;