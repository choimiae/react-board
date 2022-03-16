import React from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import Login from '../../page/login/login';
import Join from '../../page/join/join';
import BoardList from '../../page/boardList/boardList';
import BoardWrite from '../../page/boardWrite/boardWrite';
import BoardView from '../../page/boardView/boardView';
import Chat from "../../page/chat/chat";
import Chatting from "../../page/chatting/chatting";
import Readiness from '../readiness'
import UserContext from "../userSession";

/* router: url과 component 세팅 */
function Routers() {

    // 유저 컨텍스트 함수로 value return
    const setSession = (session) => {
        if(!session) return window.localStorage.getItem('session');
        else window.localStorage.setItem('session',session);
    }

    return (
        <>
            <UserContext.Provider value={{setSession}}>
                <BrowserRouter>
                    <Switch>
                        <Route path={['/', '/login']} exact component={Login} />
                        <Route path='/join' exact component={Join} />
                        <Route path='/board/list' exact component={BoardList} />
                        <Route path='/board/write' exact  component={BoardWrite} />
                        <Route path='/board/view' exact  component={BoardView} />
                        <Route path='/readiness' exact  component={Readiness} />
                        <Route path='/chat' exact  component={Chat} />
                        <Route path='/chatting' exact  component={Chatting} />
                    </Switch>
                </BrowserRouter>
            </UserContext.Provider>
        </>
    );
}

export default Routers;