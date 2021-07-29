import { useEffect, useState } from 'react';
import { Container, Alert,Form,Modal,Button,Col} from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import Meetings from "../components/classdetails/Meetings";
import Notifications from "../components/classdetails/Notifications";
import Recordings from "../components/classdetails/Recordings";
import api from '../api';
import Tasktable from "../components/Tasktable"

function Classdetails() {
    const {class_id} = useParams();
    const [errorMessage,setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [defaultMeeting,setDefaultMeeting] = useState({
        "url":"",
        "passcode":""
    });
    const [details,setDetails] = useState({
      "name": "読み込み中",
      "next_class": {
        "location": "",
        "starts_at": "",
        "ends_at": ""
      },
      "meetings": [],
      "recordings": [],
      "notifications": [],
      "tasks": [],
      "schedules": []
    });

    useEffect(() => {
        api.get(`/classes/${class_id}`,).then(resp => {
            setDetails(resp.data);
            setErrorMessage("");
        }).catch(err => {
            console.log(err);
        });
    },[])

    const defaultURL=()=> {
        api.put(`/classes/${class_id}`,
        {
            "url":defaultMeeting.url,
            "passcode":defaultMeeting.passcode
        }).then(resp => {
            setErrorMessage("");
            setSuccessMessage("デフォルトのミーティングを設定しました")
        }).catch(err => {
            console.log(err);
        });
        setModalShow(false);
    }

    const [modalShow, setModalShow] = useState(false);
    const changeDedault = event => {
        let data = defaultMeeting;
        data[event.target.name] = event.target.value;
        setDefaultMeeting(data);
    }

    function UrlModal(props) {
        return(
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    デフォルトのミーティング設定
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{whiteSpace: 'pre-line'}}>
                <Form.Group> 
                    <p><Form.Row>
                        <Form.Label column md={{ offset: 1, span: 3 }}>URL：</Form.Label>
                        <Col><Form.Control type="text" name="url" onChange={changeDedault}/></Col>
                    </Form.Row></p>
                    <p><Form.Row>
                        <Form.Label column md={{ offset: 1, span: 3 }}>passcode（空白可）：</Form.Label>
                        <Col><Form.Control type="text" name="passcode" onChange={changeDedault}/></Col>
                    </Form.Row></p>
                    <p><Col md={{ offset: 9, span: 3 }}>
                        <Button variant="primary" onClick={defaultURL}>設定</Button>
                    </Col></p>
                </ Form.Group> 
            </Modal.Body>
            </Modal>
        );
    }



    return(<Container>
        {errorMessage !== '' && <Alert variant="danger">Error: {errorMessage}</Alert>}
        {successMessage !== '' && <Alert variant="success">{successMessage}</Alert>}
        <div>
        <h1>{details.name}</h1>
        <hr/>
        <div>
            <div className="urls">
                <h2>Zoom URLs</h2>
                <Button variant="link" onClick={() => setModalShow(true)}>
                    デフォルトのミーティングを設定する
                </Button>
                <UrlModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
                <Meetings meetings={details.meetings}/>
            </div>

            <div className="tasks">
                <h2>Tasks</h2>
                <Tasktable class_id={class_id} completed={false}/>
            </div>

            <div className="notifications">
                <h2>お知らせ</h2>
                <Notifications notifications={details.notifications}/>
            </div>

            <div className="recordings">
                <h2>Zoom Recordings</h2>
                <Recordings recordings={details.recordings}/>
            </div>

        </div>
    </div>
        </Container>);
}

export default Classdetails;