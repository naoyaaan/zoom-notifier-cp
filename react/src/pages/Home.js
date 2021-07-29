import { Container, Button, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import api from '../api';
import TodaySchedule from "../components/TodaySchedule";
import WeekSchedule from '../components/WeekSchedule';
import Tasktable from '../components/Tasktable'

function Home() {
  const dayOfWeekStr = [ "日", "月", "火", "水", "木", "金", "土" ];
  const [date, setDate] = useState([new Date().getMonth()+1, new Date().getDate(), dayOfWeekStr[new Date().getDay()]]);
  const [todaySchedules,setTodaySchedules] = useState([]);
  const [thisweekSchedules,setThisWeekSchedules] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [targetDay, setTargetDay] = useState(new Date());
  const [deltaDay, setDeltaDay] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth()+1);

  useEffect(() => {
    const url = deltaDay > 0 ? `/after/${deltaDay}` : `/before/${-deltaDay}`;
    let day = new Date();
    day.setDate(day.getDate() + deltaDay);
    setTargetDay(day);
    setDate([day.getMonth()+1, day.getDate(), dayOfWeekStr[day.getDay()]]);
    api.get(`/classes/schedules${url}`).then(resp => {
      setTodaySchedules(resp.data);
      setErrorMessage("");
    }).catch(err => {
      console.log(err);
      // setErrorMessage(err.response.data.message);
    });
}, [deltaDay]);

  useEffect(() => {
      let day = new Date();
      const d = new Date().getDay();
      day.setDate(day.getDate() + (d === 6 ? 1 : 1-d));
      setMonth(day.getMonth()+1);
    api.get('/classes/schedules/thisweek').then(resp => {
      setThisWeekSchedules(resp.data);
      setErrorMessage("");
    }).catch(err => {
      console.log(err);
      // setErrorMessage(err.response.data.message);
    });
  }, []);


  return (<Container>
    <div>
        <div>
          <h2><Row>
            <Col sm={2}>
              {date[0]}/{date[1]}({date[2]})
            </Col>
            <Col sm={10}>
              <Button variant="link" onClick={() => setDeltaDay(deltaDay-1)}>↓</Button><Button variant="link" onClick={() => setDeltaDay(deltaDay+1)}>↑</Button>
            </Col>
          </Row></h2>
          <TodaySchedule todaySchedules={todaySchedules}/>
        </div>

        <div>
          <h2>課題</h2>
          <Tasktable completed={false}/>
        </div>

        <div>
          <h2>{month}月</h2>
          <WeekSchedule weekSchedule={thisweekSchedules}/>
        </div>
    </div>
  </Container>);
}

export default Home;
