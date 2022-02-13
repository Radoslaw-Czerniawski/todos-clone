import { Navigate } from "react-router-dom";

const Authentication = ({children, isLogged, isAdmin}) => {
    if(isAdmin) {
        return <Navigate to='admin'/>
    } else if(!isAdmin && isLogged) {
        return children
    } else {
        return <Navigate to='login'/>
    }

}

export { Authentication };
