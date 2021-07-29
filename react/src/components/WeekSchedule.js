import { Container,Table } from 'react-bootstrap';
import {React} from "react"


// 今週の日付を取得
function GenerateWeek(){
    let today = new Date();
    let this_year = today.getFullYear();
    let this_month = today.getMonth();
    let date = today.getDate();
    let day_num = today.getDay();
    let this_monday = date - day_num + 1;
    let thisweek = [];
    for(let i = 0;i<7;i++){
        let this_date = new Date(this_year, this_month, this_monday+i);
        thisweek.push(this_date.getDate());
    }
    
    return thisweek;
}


function WeekSchedule(props) {
    var t = 0;
    var timeTable=["08:50","10:40","14:20","16:15"];
    var endTable =["10:30","12:20","16:00","17:55"];
    var thisweek = GenerateWeek();
    var today = new Date().getDate()
    var gray = "#c0c0c0",pink = "#ffd1e8",skyblue = "#D7EEFF",deepgray = "#87cefa";
    
    // 行を作成
    function CreateWeekSchedule(props){
        function weekid(num){
            return props.classes[num].class_id == 0 ? "":"week"
        }
        function bgcolor(num){
            return props.classes[num].class_id == 0 ? gray:(thisweek[num]==today ? pink:skyblue)
        }
        return(
            <tr>
                <td><center>{timeTable[props.classes[5]]}<br/><br/>{endTable[props.classes[5]]}</center></td>
                <td id={weekid(0)} bgcolor={bgcolor(0)}><center><a href={`/classes/${props.classes[0].class_id}`}>{props.classes[0].classname}</a></center></td>
                <td id={weekid(1)} bgcolor={bgcolor(1)}><center><a href={`/classes/${props.classes[1].class_id}`}>{props.classes[1].classname}</a></center></td>
                <td id={weekid(2)} bgcolor={bgcolor(2)}><center><a href={`/classes/${props.classes[2].class_id}`}>{props.classes[2].classname}</a></center></td>
                <td id={weekid(3)} bgcolor={bgcolor(3)}><center><a href={`/classes/${props.classes[3].class_id}`}>{props.classes[3].classname}</a></center></td>
                <td id={weekid(4)} bgcolor={bgcolor(4)}><center><a href={`/classes/${props.classes[4].class_id}`}>{props.classes[4].classname}</a></center></td>
            </tr>
        )
    }


    var empty = {
        "class_id": 0,
        "classname": "",
        "location": "",
        "starts_at": "",
        "ends_at": "",
        "url": "",
        "passcode": ""
    }
    var weekTable = []
    for(let i=0;i<4;i++){
        weekTable.push([empty,empty,empty,empty,empty,i])
    }

    // 渡されたリストを表にまとめなおす
    props.weekSchedule.map(item => {
        var day = Number(item.starts_at.substr(8,2));
        var time = item.starts_at.substr(11,5);
        for(let i=0;i<5;i++){
            if(thisweek[i] == day){
                for(let j=0;j<4;j++){
                    if(timeTable[j] === time){
                        weekTable[j][i] = item;
                    }
                }
            }
        }
    })


    return(<Container>
        <Table striped bordered >
            <tbody>
                <tr>
                    <th width="10%"></th>
                    <th width="18%" bgcolor={thisweek[0]==today ? deepgray:""}><center>{thisweek[0]}<br />月</center></th>
                    <th width="18%" bgcolor={thisweek[1]==today ? deepgray:""}><center>{thisweek[1]}<br />火</center></th>
                    <th width="18%" bgcolor={thisweek[2]==today ? deepgray:""}><center>{thisweek[2]}<br />水</center></th>
                    <th width="18%" bgcolor={thisweek[3]==today ? deepgray:""}><center>{thisweek[3]}<br />木</center></th>
                    <th width="18%" bgcolor={thisweek[4]==today ? deepgray:""}><center>{thisweek[4]}<br />金</center></th>
                </tr>
                {weekTable.map(item => (
                    <CreateWeekSchedule classes={item}/>
                ))}
                
            </tbody>
        </Table>
      </Container>
    );
};



export default WeekSchedule;