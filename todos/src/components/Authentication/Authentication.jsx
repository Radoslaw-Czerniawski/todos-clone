import { Navigate } from "react-router-dom";

const Authentication = ({children, isLogged, user}) => {
    if(user === "admin" && isLogged) {
        return children[1]
    }

    console.log(children);
    return isLogged ? children[0] : <Navigate to='login'/> ;
}

export { Authentication };
