import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";

import Title from "../../component/title/index";
import Button from "../../component/button/index";
import * as Common from "../../static/js/common";
import UserSession from "../../component/userSession";


function Login() {
    const history = useHistory();
    const [loginView, setLoginView] = useState(''); // 로그인 정보 저장
    const {setSession} = useContext(UserSession); // 세션 컨텍스트 사용

    
    // 초기 -> 세션값 초기화
    useEffect(() => {
        setSession('');
        window.localStorage.setItem('userId', '');
        window.localStorage.setItem('userNm', '');
    },[1]);


    // 로그인
    const login = () => {
        // 필수값 체크
        if(!loginView.userId) return Common.validate('아이디를 입력해 주세요.');
        if(!loginView.userPw) return Common.validate('비밀번호를 입력해 주세요.');

        axios({
            method: 'post',
            url: '/user/login/',
            headers: {'Content-Type': 'application/json'},
            data: {
                userId: loginView.userId,
                userPw: loginView.userPw
            },
        }).then(Response => {
            if(Response.data === 'fail') alert('로그인에 실패했습니다.');
            else {
                // 로그인 -> 세션 저장
                setSession(Response.data.author);
                goBoardList();
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    // 회원가입으로 이동
    const join = () => history.push('/join');

    // 목록으로 이동
    const goBoardList = () => history.push('/board/list');

    // 입력한 로그인 정보 저장
    const setLogin = (e, names) => {
        setLoginView(Object.assign(loginView, {[names] : e.target.value}));
    }

    // 엔티키 -> 로그인 클릭
    const enter = (e) => {
        if(e.key === 'Enter') login();
    }

    return (
        <>
            {/* 타이틀 */}
            <Title titleText='로그인'/>

            <section className='comp-login'>
                <div className='comp-basic-row'>
                    <div className='tit'>아이디</div>
                    <div className='desc'>
                        <input type="text" className='form-basic' title='아이디 입력' placeholder='아이디를 입력하세요.' autoComplete='off' onChange={e => setLogin(e, 'userId')} />
                    </div>
                </div>
                <div className='comp-basic-row'>
                    <div className='tit'>비밀번호</div>
                    <div className='desc'>
                        <input type="password" className='form-basic' title='비밀번호 입력' placeholder='비밀번호를 입력하세요.' autoComplete='off' onChange={e => setLogin(e, 'userPw')} onKeyPress={e => enter(e)} />
                    </div>
                </div>
            </section>

            {/* 버튼 */}
            <div className='comp-btn-wrap'>
                <Button type='button' text='로그인' style='primary' position='center' functions={login} />
                <Button type='button' text='회원가입' style='default' position='center' functions={join} />
            </div>
        </>
    );
}

export default Login;