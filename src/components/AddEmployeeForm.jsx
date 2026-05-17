import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {createEmployee} from "../service/employerApi.js";

function AddEmployeeForm () {
 const [user, setUser] = useState({
     id:"",
     userName:"",
     firstName:"",
     lastName:"",
     password:"",
     phone:"",
     email:"",
     userType:""
 });

const navigate = useNavigate();
const [massage, setMassage] = useState("");

const isFormValid = ()=> {
    if (!/^\d{1,9}$/.test(user.id.trim())) {
        setMassage("Id must contain up to 9 digits");
        return false;
    }
    if (!/^\d{1,9}$/.test(user.userName.trim())) {
        setMassage("Username must contain only numbers");
        return false;
    }
    if (user.firstName.trim() === "") {
        setMassage("First name is missing")
        return false;
    }
    if (user.lastName.trim() === "") {
        setMassage("Last name is missing")
        return false;
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (user.password.trim() === "") {
        setMassage("Password is missing");
        return false;
    }

    if (!strongPasswordRegex.test(user.password)) {
        setMassage("Password must be at least 8 characters long and include uppercase, lowercase, numbers, and a special character");
        return false;
    }
    if (!/^\d{10}$/.test(user.phone.trim())) {
        setMassage("Phone number must contain 10 digits");
        return false;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (user.email.trim() === "") {
        setMassage("Email is missing");
        return false;
    }
    if (!emailRegex.test(user.email.trim())) {
        setMassage("Email is not valid");
        return false;
    }
    if(user.userType.trim()===""){
        setMassage("Need to choose role type")
        return false;
    }
    return true;
    };
    const register = (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }

        createEmployee(user)

            .then((response) => {
                if (response.data !== null) {
                    console.log(response.data);
                }
                if (response.data.success === true) {
                    setMassage("The registration was successful, you are being redirected to the login screen ")
                    setTimeout(() => {
                        navigate("/");
                    }, 5000);
                } else {
                    setMassage("The registration failed");
                }
            })
            .catch(() => {
                setMassage("Request failed");
            });
    };


    return (
     <form onSubmit={register}>
         <h1>Register</h1>

         <input
         type={"number"}
         value={user.id}
         placeholder={"Enter id"}
         onChange={(e)=>setUser({...user,id:e.target.value})}
         />

         <input
         type={"text"}
         value={user.userName}
         placeholder={"Enter user name"}
         onChange={(e)=>setUser({...user,userName:e.target.value})}/>

         <input
         type={"text"}
         value={user.firstName}
         placeholder={"Enter first name"}
         onChange={(e)=>setUser({...user,firstName: e.target.value})}/>

         <input
         type={"text"}
         value={user.lastName}
         placeholder={"Enter last name"}
         onChange={(e)=>setUser({...user,lastName: e.target.value})}/>

         <input
         type={"password"}
         value={user.password}
         placeholder={"enter password"}
         onChange={(e)=>setUser({...user,password: e.target.value})}/>

         <input
         type={"number"}
         value={user.phone}
         placeholder={"Enter phone number"}
         onChange={(e)=>setUser({...user,phone: e.target.value})}/>

         <input
         type={"email"}
         value={user.email}
         placeholder={"Enter email"}
         onChange={(e)=>setUser({...user,email: e.target.value})}/>

         <select
             value={user.userType}
             onChange={(e) => setUser({...user, userType: e.target.value})}
         >
             <option value="">Choose role type</option>
             <option value="EMPLOYEE">Employee</option>
             <option value="EMPLOYER">Employer</option>

         </select>

              <button type="submit">Register</button>
              <p>{massage}</p>

     </form>



    );
}
export default AddEmployeeForm;