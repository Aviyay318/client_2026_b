
import {useState} from "react";
import {deleteEmployee} from "../service/emplyoerApi.js";

function DeleteEmployee (){
    const [userId, setUserId] = useState("");
    const [massage, setMassage] = useState("");

    const removeUser = (e) =>{
        e.preventDefault();

        if (!/^\d{1,9}$/.test(userId.trim())) {
            setMassage("Id must contain up to 9 digits");
            return false;
        }
        deleteEmployee (userId)
            .then((response)=>{
                if(response.data.success === true){
                    setMassage("User deletion succeeded");
                    setUserId("");
                } else {
                    setMassage("The user deletion failed")
                }
            })
            .catch(() => {
                setMassage("Request failed");
            });
    };

    return(
        <form onSubmit={removeUser}>
        <h2>Delete user</h2>
            <input
                type={"text"}
                value={userId}
                placeholder={"Enter user id"}
                onChange={(e)=>setUserId(e.target.value)}
            />

            <button
                type="submit"
            >
               Delete user
               <p>
                   {massage}
               </p>
            </button>
        </form>
    );

}
export default DeleteEmployee;