import React, {createContext} from "react";

const UserSession = createContext({
    session: '',
    setSession: () => {}
});

export default UserSession;