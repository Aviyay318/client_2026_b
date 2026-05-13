import {useNavigate} from "react-router-dom";
import {logout} from "../service/authApi.js";

function LogoutButton(){


    const navigate = useNavigate();
    const handleLogout =()=>{
        logout()
            .then(response =>{
                if (response.data.success){
                    console.log("LOGOUT",response.data);
                    navigate("/");
                }
            })
            .catch(error => console.log(error));

    }


    return(
        <div>
            <button
                className="logout-btn"
                onClick={handleLogout}
            >


                Logout
            </button>
        </div>
    )





}
export default LogoutButton;