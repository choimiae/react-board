import React, {useEffect} from "react";
import axios from "axios";
import Button from "../button";
import UserContext from "../userSession";
import {useHistory} from "react-router-dom";
import {useContext} from "react";

function UserInfo() {
    const history = useHistory();
    const {setSession} = useContext(UserContext); // 유저 컨텍스트 사용

    // 초기 -> 세션값 체크
    useEffect(() => {
        axios({
            method: 'post',
            url: '/user/checkSession',
            headers: {'Content-Type': 'application/json', 'X-AUTH-TOKEN': setSession()},
        }).then(Response => {
            if(Response.data === 'logout') {
                alert('세션이 만료되었습니다.');
                history.push('/login');
                return false;
            } else {
                window.localStorage.setItem('userId', Response.data.userId);
                window.localStorage.setItem('userNm', Response.data.userName);
            }
        }).catch((error) => {
            history.push('/login');
        });
    }, [setSession()]);


    /* 로그아웃 */
    const logout = () => {
        axios({
            method: 'post',
            url: '/user/logout',
            headers: {'Content-Type': 'application/json'},
        }).then(Response => {
            alert('로그아웃 되었습니다.');
            history.push('/login');
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <section className='user-info'>
            <div className='text'><strong className='name'>{window.localStorage.getItem('userNm')}</strong>님 환영합니다.</div>
            <div className='btn'>
                <Button type='button' text='로그아웃' style='info' position='center' functions={logout} />
            </div>
        </section>
    )
}

export default UserInfo;