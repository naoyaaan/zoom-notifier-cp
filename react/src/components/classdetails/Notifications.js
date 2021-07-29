import { Container,Table,Modal,Button } from 'react-bootstrap';
import { React,useState} from "react"

function DetailModal(props) {
    return(
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                {props.header}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{whiteSpace: 'pre-line'}}>
            <p>
                {props.message}
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
        </Modal>
    );
}

function CreateNotification(props){
    const [modalShow, setModalShow] = useState(false);
    const tz2yyyymmddhhmm = (time) => { return time.substr(0, 10) + " " + time.substr(11, 5); }
    return(
        <tr>
            <td>{tz2yyyymmddhhmm(props.noti.created_at)}</td>
            <td>
            <>
            <Button variant="link" onClick={() => setModalShow(true)}>{props.noti.message.substr(0,30)}</Button>

            <DetailModal
                show={modalShow}
                message={props.noti.message}
                onHide={() => setModalShow(false)}
            />
            </>
            </td>
        </tr>
    );
}

function Notifications(props) {
    return (<Container>
        <Table striped bordered hover>
            <tbody>
                <tr>
                    <th>日時</th>
                    <th>お知らせ</th>
                </tr>
                {props.notifications.map(item => (
                    <CreateNotification key={item.message} noti={item} />
                ))}
            </tbody>
        </Table>
    </Container>);
}

export default Notifications;