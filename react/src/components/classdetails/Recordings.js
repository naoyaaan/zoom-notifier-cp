import { Container,Table } from 'react-bootstrap';
import {React} from "react"

function CreateRecording(props){
    return(
        <tr>
            <td>{props.recording.created_at.substr(0,10)}</td>
            <td><a href={props.recording.url} target="_blank">ZOOM</a></td>
            <td>{props.recording.passcode}</td>
        </tr>
    );
};

function Recordings(props) {
  return (<Container>
      <Table striped bordered hover >
            <tbody>
                <tr>
                    <th>日付</th>
                    <th>Zoom Recordings URL</th>
                    <th>password</th>
                </tr>
                {props.recordings.map(item => (
                    <CreateRecording key={item.url} recording={item} />
                ))}
            </tbody>
        </Table>
</Container>);
}

export default Recordings;