import { Container,Table } from 'react-bootstrap';
import {React,useState} from "react";

function TodaySchedule(props) {
    if(props.todaySchedules.length==0){
        return(<h3><center>授業はありません</center></h3>)
    }
    else{
        return(<Container>
            <Table striped bordered hover>
                <tbody>
                    <tr>
                        <th>時間</th>
                        <th>講義名</th>
                        <th>zoom url</th>
                        <th>passcode</th>
                        <th>場所</th>
                    </tr>
                    {props.todaySchedules.map(item => (
                        <CreateClass 
                            name={item.classname} 
                            startTime={item.starts_at} 
                            endTime = {item.ends_at} 
                            location={item.location} 
                            url={item.url} 
                            passcode={item.passcode} 
                            class_id={item.class_id}
                        />
                    )
                    )}
                </tbody>
            </Table>
          </Container>
        );
    }
    
}

/* 各講義欄の作成 */
function CreateClass(props) {
    const startTime = props.startTime.substr(11,5);
    const endTime = props.endTime.substr(11,5);
    const class_id = props.class_id;
    const classlink = `/classes/${class_id}`;
    
    return(
        <tr>
            <td>{startTime}-{endTime}</td>
            <td><a href={classlink}>{props.name}</a></td>
            <td><a href={props.url} target="_blanck">{props.url}</a></td>
            <td>{props.passcode}</td>
            <td>{props.location}</td>
        </tr>
    );
};

export default TodaySchedule;