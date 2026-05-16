import {useEffect, useState} from "react";
import dayjs from "dayjs";
import EmployeeNavbar from "../../Navbar/navbar-employee/NavbarEmployee.jsx";
import WorkHoursTable from "../../components/WorkHoursTable.jsx";
import {getHoursReport} from "../../service/workApi.js";
import "./WorkHoursPage.css";
import {calculateTotalHours, formatDuration} from "../../utils/timeUtils.js";



function WorkHoursPage() {


const [rows, setRows] = useState([]);
const [selectMonth, setSelectMonth] = useState("all");
const months= [
             {id:1,name:"January"}
            ,{id:2, name:"February"}
            ,{id:3,name:"March"}
            ,{id:4, name: "April"}
            ,{id:5, name:"May"}
            ,{id:6,name:"June"}
            ,{id:7,name:"July"}
            ,{id:8,name:"August"},
            {id:9,name:"September"}
            ,{id:10,name:"October"}
            ,{id:11,name:"November"}
            ,{id:12, name:"December"}
    ];


    const filteredRows =
        selectMonth ==="all"
        ? rows:
        rows.filter((row) =>
        dayjs(row.enterTime).month()+1 ===Number(selectMonth)
        );

    const totalHours = calculateTotalHours(filteredRows);



    const hoursReport =()=> {
        getHoursReport()
            .then(response => {
                console.log("SITES",response.data);
                console.log(response.data.workDays);
                setRows(response.data.workDays ||[]);
            })
            .catch(err => {
                console.log("ERROR:", err);
            });
    }
    // לבדוק עם אביה אופציה ב של חישוב total מהשרת
    // const getTotalHours =()=>{
    //     getHoursReport()
    //         .then(response => {
    //             console.log("TOTAL",response.data);
    //             setTotalHours(response.data);
    //
    //         })
    //         .catch(err => {
    //             console.log("ERROR:", err);
    //         });
    // }


    useEffect(() => {
        hoursReport()
        // getTotalHours()



    }, []);



    return (
        <div className="work-hours-page">

            <div className="work-hours-wrapper">

                <EmployeeNavbar active={"HoursReport"} />

                <div className="work-hours-card">

                    <h1 className="work-hours-title">
                        Work Hours Report
                    </h1>

                    <div className="month-filter">

                        <label>Select month:</label>

                        <select
                            className="month-select"
                            value={selectMonth}
                            onChange={(e) => setSelectMonth(e.target.value)}
                        >
                            <option value="all">
                                📅 All
                            </option>

                            {months.map((m) => (
                                <option
                                    key={m.id}
                                    value={m.id}
                                >
                                    {m.name}
                                </option>
                            ))}

                        </select>

                    </div>

                    <WorkHoursTable rows={filteredRows} />

                    {/* TOTAL HOURS */}

                    <div className="total-hours-box">

                        <div className="total-hours-left">

                        <span className="total-hours-icon">
                            🕒
                        </span>

                            <span className="total-hours-text">
                            Total Hours
                        </span>

                        </div>

                        <div className="total-hours-number">
                            {formatDuration(totalHours)}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
export default WorkHoursPage;