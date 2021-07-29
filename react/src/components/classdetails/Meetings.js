import { Container,Table } from 'react-bootstrap';
import {React,useState} from "react"

function CreateMeeting(props){
    return(
        <tr>
            <td>{props.meeting.created_at.substr(0,10)}</td>
            <td><a href={props.meeting.url} target="_blank">ZOOM</a></td>
        </tr>
    );
}

function Meetings(props){
    return(<Container>
        <Table striped bordered hover>
                <tbody>
                    <tr>
                        <th>日付</th>
                        <th>Zoom URL</th>
                    </tr>
                    {props.meetings.map(item => (
                        <CreateMeeting key={item.starts_at} meeting={item} />
                    ))}
                </tbody>
            </Table>
    </Container>
    );
}

export default Meetings;