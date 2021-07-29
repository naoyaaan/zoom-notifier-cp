import { useParams }  from "react-router-dom";
import { Container } from 'react-bootstrap';

function Echo() {
  let { id } = useParams();
  return (<Container>
    <h3>Hello, {id}!</h3>
  </Container>);
}

export default Echo;
