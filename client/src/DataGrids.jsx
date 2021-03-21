import React from "react";
import ReactDataGrid from "react-data-grid";
import DropDownEditor from "./DropDownEditor";
import "./DataGrids.css";

const issueTypes = [
  { id: "x0", value: "" },
  { id: "x1", value: "X1" },
  { id: "x2", value: "X2" },
  { id: "x3", value: "X3" },
  { id: "x4", value: "X4" },
  { id: "x5", value: "X5" },
  { id: "x6", value: "X6" },
  { id: "x7", value: "X7" },
];
const IssueTypeEditor = <DropDownEditor options={issueTypes} />;


const scheduleColumns = [
  { key: "task", name:" "},
  { key: "monday", name: "Monday", editor: IssueTypeEditor},
  { key: "tuesday", name: "Tuesday", editor: IssueTypeEditor },
  { key: "wednesday", name: "Wednesday" , editor: IssueTypeEditor},
  { key: "thursday", name: "Thursday" , editor: IssueTypeEditor},
  { key: "friday", name: "Friday" , editor: IssueTypeEditor},
];

const scheduleRows = [
  { task: "Morning UpStairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
  { task: "Morning Down Stairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
  { task: "Morning Parking Lot", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
  { task: "Lunch A", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
  { task: "Lunch B", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
  { task: "Lunch C", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
  { task: "Lunch D", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
  { task: "Afternoon Up Stairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
  { task: "Afternoon Down Stairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
  { task: "Afternoon Parking Lot", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
];

const loadColumns = ["Staff Member","Monday","Tuesday","Wednesday", "Thursday", "Friday","Total"]

const loadRows = [
  { staff: "X1", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
  { staff: "X2", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
  { staff: "X3", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
  { staff: "X4", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
  { staff: "X5", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
  { staff: "X6", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
  { staff: "X7", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
];

const tasks = {
  monday:[],
  tuesday:[],
  wednesday:[],
  thursday:[],
  friday:[]
}


class DataGrids extends React.Component {
  state = { scheduleColumns, loadColumns, scheduleRows, loadRows, refresh: false};

  refresh() {
    this.setState({
      refresh: true
    });
  }

  onGridRowsUpdated = ({ fromRow, updated }) => {
    const key = Object.keys(updated)[0]; // Monday, Tudesday ...
    const updateScheduleRows = this.state.scheduleRows.slice();
    const updatedLoadRows = this.state.loadRows.slice();
    const index = updatedLoadRows.findIndex(obj=> obj.staff == updated[key]);
    const operation = ["MorningUp","MorningDown","MorningPark","LunchA","LunchB","LunchC","LunchD","EveningUp","EveningDown","EveningPark"];
    const operator = ["X1","X2","X3","X4","X5","X6","X7"];

    const checkMaximum = () => {
      if (updatedLoadRows[index][key] >= 2) {
          alert(`${updated[key]} can't have more than 2 shifts per day.`);
          return true;
        }
      if (updatedLoadRows[index].total >= 7) {
          alert(`${updated[key]} can't have more than 7 shifts per week.`);
          return true;
      }
      return false;
    };

    //select null option 
    if(updateScheduleRows[fromRow][key] == "" && updated[key] == ""){
      return;
    }
    else if(updateScheduleRows[fromRow][key] != "" && updated[key] == "") {
      const oldStaff = tasks[key].filter(task => task.operation == operation[fromRow]);
      const oldIndex = updatedLoadRows.findIndex(obj=> obj.staff == oldStaff[0].operator);
      tasks[key] = tasks[key].filter(task => task.operation !== operation[fromRow]);
      updatedLoadRows[oldIndex][key]--;
      updatedLoadRows[oldIndex].total--;
    }
    // select the same option in the cell  
    else if(tasks[key].some(task => task.operation == operation[fromRow] && task.operator == updated[key])){
      return;
      // select same option in two places at once in the morning
    }else if ( fromRow == 0  && (tasks[key].some(task => task.operation == "MorningDown" && task.operator == updated[key]) || tasks[key].some(task => task.operation == "MorningPark" && task.operator == updated[key]))) {
      alert(`You can not schedule ${updated[key]} in two places at once.`);
      return;
    } else if ( fromRow == 1 && (tasks[key].some(task => task.operation == "MorningUp" && task.operator == updated[key]) || tasks[key].some(task => task.operation == "MorningPark" && task.operator == updated[key]))) {
      alert(`You can not schedule ${updated[key]} in two places at once.`);
      return;
    } else if ( fromRow == 2 && tasks[key].length >=1 && (tasks[key].some(task => task.operation == "MorningUp" && task.operator == updated[key]) || tasks[key].some(task => task.operation == "MorningDown" && task.operator == updated[key]))) {
      alert(`You can not schedule ${updated[key]} in two places at once.`);
      return;
      // select same option in consecutive lunch
    } else if (fromRow == 3 && tasks[key].some(task => task.operation == "LunchB" && task.operator == updated[key])) {
        alert(`You can not schedule ${updated[key]} in consecutive lunch slots on the same day.`);
       return;
    } else if (fromRow == 4 &&  (tasks[key].some(task => task.operation == "LunchA" && task.operator == updated[key]) || tasks[key].some(task => task.operation == "LunchC" && task.operator == updated[key]))) {
        alert(`You can not schedule ${updated[key]} in consecutive lunch slots on the same day.`);
       return;
    }else if (fromRow == 5 && (tasks[key].some(task => task.operation == "LunchB" && task.operator == updated[key]) || tasks[key].some(task => task.operation == "LunchD" && task.operator == updated[key]))) {
        alert(`You can not schedule ${updated[key]} in consecutive lunch slots on the same day.`);
       return;
    }  else if (fromRow == 6 && tasks[key].some(task => task.operation == "LunchC" && task.operator == updated[key])) {
        alert(`You can not schedule ${updated[key]} in consecutive lunch slots on the same day.`);
       return;
       // select same option in two places at once in the afternoon
    } else if ( fromRow == 7 && (tasks[key].some(task => task.operation == "EveningDown" && task.operator == updated[key]) || tasks[key].some(task => task.operation == "EveningPark" && task.operator == updated[key]))) {
      alert(`You can not schedule ${updated[key]} in two places at once.`);
      return;
    }else if ( fromRow == 8 && (tasks[key].some(task => task.operation == "EveningUp" && task.operator == updated[key]) || tasks[key].some(task => task.operation == "EveningPark" && task.operator == updated[key]))) {
      alert(`You can not schedule ${updated[key]} in two places at once.`);
      return;
    } else if ( fromRow == 9 && (tasks[key].some(task => task.operation == "EveningUp" && task.operator == updated[key]) || tasks[key].some(task => task.operation == "EveningDown" && task.operator == updated[key]))) {
      alert(`You can not schedule ${updated[key]} in two places at once.`);
      return;
      // select option when there is no previous option
    } else if (updateScheduleRows[fromRow][key] == ""){
        if (checkMaximum()) {return};
        tasks[key].push({ operation:operation[fromRow], operator:updated[key]});
        updatedLoadRows[index][key]++;
        updatedLoadRows[index].total++;
    }
    // update options when there is previous option
    else if (!updateScheduleRows[fromRow][key] == "") {
      if (checkMaximum()) {return};
      const oldStaff = tasks[key].filter(task => task.operation == operation[fromRow]);
      const oldIndex = updatedLoadRows.findIndex(obj=> obj.staff == oldStaff[0].operator);
      updatedLoadRows[oldIndex][key]--;
      updatedLoadRows[oldIndex].total--;
      updatedLoadRows[index][key]++;
      updatedLoadRows[index].total++;
      tasks[key] = tasks[key].filter(task => task.operation !== operation[fromRow]);
      tasks[key].push({ operation:operation[fromRow], operator:updated[key]});
    }

      updateScheduleRows[fromRow] = { ...updateScheduleRows[fromRow], ...updated };
      this.setState({scheduleRows:updateScheduleRows,loadRows:updatedLoadRows});
  }

  renderTableHeader = ()=> {
      return loadColumns.map((key, index) => {
         return <th key={index}>{key}</th>
      })
   }

  renderTableData = ()=> {
      return this.state.loadRows.map((row, index) => {
         const { staff, monday, tuesday, wednesday, thursday, friday, total } = row;
         return (
            <tr key={staff}>
               <td>{staff}</td>
               <td>{monday}</td>
               <td>{tuesday}</td>
               <td>{wednesday}</td>
               <td>{thursday}</td>
               <td>{friday}</td>
               <td>{total}</td>
            </tr>
         )
      })
   }
  handleAutoSchedule = () => {
    tasks.monday=[];
    tasks.tuesday=[];
    tasks.wednesday=[];
    tasks.thursday=[];
    tasks.friday=[];

    const autoScheduleRows = [
      { task: "Morning UpStairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Morning Down Stairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Morning Parking Lot", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Lunch A", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Lunch B", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Lunch C", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Lunch D", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Afternoon Up Stairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Afternoon Down Stairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Afternoon Parking Lot", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
    ];
    const autoLoadRows =  [
      { staff: "X1", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X2", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X3", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X4", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X5", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X6", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X7", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
    ];
    let calls = 0;
    let autoOptions = ["X1","X2","X3","X4","X5","X6","X7"];
    const generateRandomStaff = () =>{
      const random = Math.floor(Math.random() *(autoOptions.length));
      return autoOptions[random];
    }
    const week = ["monday","tuesday","wednesday","thursday","friday"];
    const autoOperation = ["MorningUp","MorningDown","MorningPark","LunchA","LunchB","LunchC","LunchD","EveningUp","EveningDown","EveningPark"];
    for (let i=0; i<5; i++) {
      for (let j=0; j<10; j++) {
        while(true) {
        const day = week[i];
        calls += 1;
        if (calls > 100) { 
          autoScheduleRows[j][day] = "";
          break; 
        }      
        autoScheduleRows[j][day] = generateRandomStaff();
        const autoIndex = autoLoadRows.findIndex(obj=> obj.staff == autoScheduleRows[j][day]);
        if (autoIndex == -1) {break;}
        if (autoLoadRows[autoIndex].total == 7 ) {
          autoOptions = autoOptions.filter(option => option != autoScheduleRows[j][day])
        }
        if( j == 0
          //daily maximum pass      
          && autoLoadRows[autoIndex][day]<2
          // weekly maximum pass
          && autoLoadRows[autoIndex].total<7
          ) {
              autoLoadRows[autoIndex][day]++;
              autoLoadRows[autoIndex].total++;
              tasks[day].push({ operation:autoOperation[j], operator:autoScheduleRows[j][day]});
              break;
            } 
        else if( j == 1
          // morning tasks pass
          && autoScheduleRows[1][day] != autoScheduleRows[0][day]
          // daily maximum pass
          && autoLoadRows[autoIndex][day] <2 
          // weekly maximum pass
          && autoLoadRows[autoIndex].total <7
          ) {
              autoLoadRows[autoIndex][day]++;
              autoLoadRows[autoIndex].total++;
              tasks[day].push({ operation:autoOperation[j], operator:autoScheduleRows[j][day]});
              break;
            } 
        else if( j == 2
          //morning tasks pass
          && autoScheduleRows[2][day] != autoScheduleRows[0][day] && autoScheduleRows[2][day] != autoScheduleRows[1][day]
          // daily maximum pass
          && autoLoadRows[autoIndex][day] <2 
          // weekly maximum pass
          && autoLoadRows[autoIndex].total <7
          ) {
              autoLoadRows[autoIndex][day]++;
              autoLoadRows[autoIndex].total++;
              tasks[day].push({ operation:autoOperation[j], operator:autoScheduleRows[j][day]});
              break;
            }
        else if( j == 3
          // daily maximum pass          
          && autoLoadRows[autoIndex][day] <2
          // weekly maximum pass
          && autoLoadRows[autoIndex].total <7
        ) {
            autoLoadRows[autoIndex][day]++;
            autoLoadRows[autoIndex].total++;
            tasks[day].push({ operation:autoOperation[j], operator:autoScheduleRows[j][day]});
            break;
            }
        else if( j == 4
          //lunch tasks pass
          && autoScheduleRows[4][day] != autoScheduleRows[3][day]
          // daily maximum pass 
          && autoLoadRows[autoIndex][day] <2
          // weekly maximum pass
          && autoLoadRows[autoIndex].total <7
          ) {
              autoLoadRows[autoIndex][day]++;
              autoLoadRows[autoIndex].total++;
              tasks[day].push({ operation:autoOperation[j], operator:autoScheduleRows[j][day]});
              break;
            }
        else if( j == 5
          //lunch tasks pass
          && autoScheduleRows[5][day] != autoScheduleRows[4][day]
          // daily maximum pass 
          && autoLoadRows[autoIndex][day] <2
        // weekly maximum pass
          && autoLoadRows[autoIndex].total <7
          ) {
              autoLoadRows[autoIndex][day]++;
              autoLoadRows[autoIndex].total++;
              tasks[day].push({ operation:autoOperation[j], operator:autoScheduleRows[j][day]});
              break;
            }
        else if( j == 6
          // lunch tasks pass
          && autoScheduleRows[6][day] != autoScheduleRows[5][day]
          // daily maximum pass
          && autoLoadRows[autoIndex][day] <2
          // weekly maximum pass
          && autoLoadRows[autoIndex].total <7
          ) {
              autoLoadRows[autoIndex][day]++;
              autoLoadRows[autoIndex].total++;
              tasks[day].push({ operation:autoOperation[j], operator:autoScheduleRows[j][day]});
              break;
            }   
        else if( j == 7
          // daily maximum pass
          && autoLoadRows[autoIndex][day] <2
          // weekly maximum pass
          && autoLoadRows[autoIndex].total <7
          ) {
              autoLoadRows[autoIndex][day]++;
              autoLoadRows[autoIndex].total++;
              tasks[day].push({ operation:autoOperation[j], operator:autoScheduleRows[j][day]});
              break;
          }
        else if( j == 8
          //afernoon tasks pass
          && autoScheduleRows[8][day] != autoScheduleRows[7][day]
          // daily maximum pass
          && autoLoadRows[autoIndex][day] <2
          // weekly maximum pass
          && autoLoadRows[autoIndex].total <7
          ) {
              autoLoadRows[autoIndex][day]++;
              autoLoadRows[autoIndex].total++;
              tasks[day].push({ operation:autoOperation[j], operator:autoScheduleRows[j][day]});
              break;
          }
        else if( j == 9
          //afernoon tasks pass
          && autoScheduleRows[9][day] != autoScheduleRows[7][day] && autoScheduleRows[9][day] != autoScheduleRows[8][day]
          // daily maximum pass
          && autoLoadRows[autoIndex][day] <2
          // weekly maximum pass
          && autoLoadRows[autoIndex].total <7
          ) {
              autoLoadRows[autoIndex][day]++;
              autoLoadRows[autoIndex].total++;
              tasks[day].push({ operation:autoOperation[j], operator:autoScheduleRows[j][day]});
              break;
          } 
        }
      }
    }
    
    this.setState({scheduleRows:autoScheduleRows,loadRows:autoLoadRows});
    this.refresh();

  }

   getSize() {
    let count = 10; // change this line to your app logic

    if (this.state.refresh) {
      count++; // hack for update data-grid
      this.setState({
        refresh: false
      });
    }

    return count;
  }

  handleClearSchedule = ()=>{
    tasks.monday=[];
    tasks.tuesday=[];
    tasks.wednesday=[];
    tasks.thursday=[];
    tasks.friday=[];

    const clearScheduleRows = [
      { task: "Morning UpStairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Morning Down Stairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Morning Parking Lot", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Lunch A", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Lunch B", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Lunch C", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Lunch D", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Afternoon Up Stairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Afternoon Down Stairs", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      { task: "Afternoon Parking Lot", monday: "", tuesday: "", wednesday:"", thursday:"", friday:""},
      ];
    const clearLoadRows = [
      { staff: "X1", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X2", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X3", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X4", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X5", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X6", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      { staff: "X7", monday: 0, tuesday: 0, wednesday:0, thursday:0, friday:0, total:0},
      ];
    this.setState({scheduleRows:clearScheduleRows,loadRows:clearLoadRows});
  }

  render() {
    return (
          <React.Fragment>
            <div className="data-grids-schedule">
            <p >Schedule</p>
            <ReactDataGrid
              columns={scheduleColumns}
              minHeight = {400}
              rowGetter={i => this.state.scheduleRows[i]}
              rowsCount={this.getSize()}
              enableCellSelect={true}
              onGridRowsUpdated={this.onGridRowsUpdated}
            />
            </div>
            <div>
              <h3 id='title'>Load</h3>
                <table id='load'>
                   <tbody>
                      <tr>{this.renderTableHeader()}</tr>
                      {this.renderTableData()}
                 </tbody>
                </table>
             </div>
             <div className= "data-grid-actions">
             <button className= "data-grid-button" onClick = {this.handleAutoSchedule}>Auto Schedule</button>
             <button className= "data-grid-button" onClick = {this.handleClearSchedule}>Clear Schedule</button>         
             </div>
          </React.Fragment>
    );
  }
}


export default DataGrids;