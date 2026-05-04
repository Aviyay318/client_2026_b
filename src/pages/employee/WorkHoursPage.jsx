import {useEffect, useState} from "react";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import NavigationTabs from "../../components/NavigationTabs.jsx";
import WorkHoursTable from "../../components/WorkHoursTable.jsx";
import {getHoursReport} from "../../service/WorkApi.js";
import "./WorkHoursPage.css";

// import {all} from "axios";

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


const token=Cookies.get("token");



    const filteredRows =
        selectMonth ==="all"
        ? rows:
        rows.filter((row) =>
        dayjs(row.enterTime).month()+1 ===Number(selectMonth)
        );


    useEffect(() => {
        getHoursReport(token)
            .then(response => {
                setRows(response.data.workDays);
            })
            .catch(err => {
                console.log("ERROR:", err);
            });
    }, []);

    return (
        <div className="work-hours-page">
            <div className="work-hours-wrapper">

                <NavigationTabs active={"HoursReport"} />

                <div className="work-hours-card">
                    <h1 className="work-hours-title">Work Hours Report</h1>

                    <div className="month-filter">
                        <label>Select month:</label>

                        <select
                            className="month-select"
                            value={selectMonth}
                            onChange={(e) => setSelectMonth(e.target.value)}
                        >
                            <option value="all">📅 All </option>

                            {months.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <WorkHoursTable rows={filteredRows} />
                </div>

            </div>
        </div>
    );
}
export default WorkHoursPage;