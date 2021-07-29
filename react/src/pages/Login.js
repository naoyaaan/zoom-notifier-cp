import { Container, Form, Button, Col, Alert, Spinner} from 'react-bootstrap';
import { useState} from 'react';
import api from '../api';
import {updateCredential} from '../api';

function Login() {
    const [user, setUser] = useState({
        "username": "",
        "password": ""
    });

    const [message, setMessage] = useState("初利用の場合は、ユーザ名とパスワードを入力し、'Sign up'を押してください。");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [spin, setSpin] = useState(false);

    /* Sign in */
    const signIn = () => {
        setSpin(true);
        api.post('/credential', {
            "username": user.username,
            "password": user.password
        }).then(resp => {
            updateCredential(resp.data.token);  //tokenの設定
            setMessage("");
            setSuccessMessage("サインインしました。")
            setErrorMessage("");
            setSpin(false);
            console.log(resp);
        }).catch(err => {
            setSpin(false);
            console.log(err);
            setMessage("");
            setSuccessMessage("");
            setErrorMessage('data' in err.response && 'message' in err.response.data ? err.response.data.message : "Something is wrong.");
        });
    }

    /* Sign up */
    const signUp = () => {
        setSpin(true);
        api.post('/users', {
            "username": user.username,
            "password": user.password
        }).then(resp => {
            setMessage("");
            setSuccessMessage("サインアップしました。サインインを押してセッティング画面に移ってください。")
            setErrorMessage("");
            setSpin(false);
            console.log(resp);
        }).catch(err => {
            setSpin(false);
            console.log(err);
            setMessage("");
            setSuccessMessage("");
            setErrorMessage('data' in err.response && 'message' in err.response.data ? err.response.data.message : "Something is wrong.");
        });
    }

    const changeForm = event => {
        let data = user;
        data[event.target.name] = event.target.value;
        setUser(data);
    }

    return(<Container>
        {spin && <Spinner animation="border" variant="primary" />}
        {message !== '' && <Alert variant="info">{message}</Alert>}
        {successMessage !== '' && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage !== '' && <Alert variant="danger">Error: {errorMessage}</Alert>}

        <Form.Group> 
        <p><Form.Row>
            <Form.Label >ユーザー名：</Form.Label>
            <Col ><Form.Control type="text" name="username" onChange={changeForm}/></Col>
        </Form.Row></p>
        <p><Form.Row>
            <Form.Label >パスワード：</Form.Label>
            <Col ><Form.Control type="password" name="password" onChange={changeForm}/></Col>
        </Form.Row></p>
        <Form.Row>
            <Col md={{ offset: 1, span: 3 }}>
            <Button variant="primary" onClick={signIn}>Sign in</Button>
            <p></p>
            <Button variant="primary" onClick={signUp}>Sign up</Button>
            </Col>
      </Form.Row>
        </Form.Group>
    </Container>);
}

export default Login;

