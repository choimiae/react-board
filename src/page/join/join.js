import React, {useEffect, useState} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";

import Title from "../../component/title/index";
import Button from "../../component/button/index";
import * as Common from "../../static/js/common";

function Join() {
    const history = useHistory();
    const [joinView, setJoinView] = useState([]); // 회원가입 정보 저장
    const [idFl, setIdFl] = useState(false); // 아이디 중복체크 Flag 저장

    // 입력한 가입정보 저장
    const setJoin = (e, names) => {
        // 아이디 입력할때 -> 중복체크 false 로 변경
        if(names === 'userId') setIdFl(false); 
        setJoinView(Object.assign(joinView, {[names] : e.target.value}));
    }

    // 아이디 중복체크
    const idCheck = () => {
        axios({
            method: 'post',
            url: '/user/checkId/',
            headers: {'Content-Type': 'application/json'},
            data: {
                userId: joinView.userId
            },
        }).then(Response => {
            if(Response.data === 'fail') {
                setIdFl(false);
                alert('이미 사용중인 아이디입니다.');
            }
            else {
                setIdFl(true);
                alert('사용할 수 있는 아이디입니다.');
            }
        }).catch((error) => {
            console.log(error);
        });
    }


    // 회원가입
    const join = () => {

        // 필수값 체크
        if(!joinView.userName) return Common.validate('이름을 입력해 주세요.');
        if(!joinView.userId) return Common.validate('아이디를 입력해 주세요.');
        if(!idFl) return Common.validate('아이디 중복체크해 주세요.');
        if(!joinView.userPw) return Common.validate('비밀번호를 입력해 주세요.');
        if(!joinView.userPw || !joinView.userPwOk) return Common.validate('비밀번호를 입력해 주세요.');
        if(joinView.userPw !== joinView.userPwOk) return Common.validate('입력한 비밀번호가 다릅니다.');

        axios({
            method: 'post',
            url: '/user/join/',
            headers: {'Content-Type': 'application/json'},
            data: {
                userName: joinView.userName,
                userId: joinView.userId,
                userPw: joinView.userPw,
                userPwOk: joinView.userPwOk,
            },
        }).then(Response => {
            if(Response.data === 'fail') alert('회원가입에 실패했습니다.');
            else {
                alert('회원가입에 성공했습니다.');
                history.push('/login');
            }
        }).catch((Error) => {
            console.log(Error);
        });
    }

    // 로그인으로 이동
    const login = () => history.push('/login');

    // 엔티키 -> 회원가입 클릭
    const enter = (e) => {
        if(e.key === 'Enter') join();
    }

    return (
        <>

            {/* 타이틀 */}
            <Title titleText='회원가입'/>

            <section className='comp-join'>
                <div className='comp-basic-row'>
                    <div className='tit'>이름</div>
                    <div className='desc'>
                        <input type="text" className='form-basic' title='이름 입력' placeholder='이름을 입력하세요.' autoComplete='off' onChange={ e => setJoin(e, 'userName')} />
                    </div>
                </div>
                <div className='comp-basic-row'>
                    <div className='tit'>아이디</div>
                    <div className='desc'>
                        <input type="text" className='form-basic' title='아이디 입력' placeholder='아이디를 입력하세요.' autoComplete='off' onChange={ e => setJoin(e, 'userId')} />
                        <div className='btn'>
                            <Button type='button' text='중복체크' style='info' position='center' functions={idCheck}/>
                        </div>
                    </div>
                </div>
                <div className='comp-basic-row'>
                    <div className='tit'>비밀번호</div>
                    <div className='desc'>
                        <input type="password" className='form-basic' title='비밀번호 입력' placeholder='비밀번호를 입력하세요.' autoComplete='off' onChange={ e => setJoin(e, 'userPw')} />
                    </div>
                </div>
                <div className='comp-basic-row'>
                    <div className='tit'>비밀번호 재입력</div>
                    <div className='desc'>
                        <input type="password" className='form-basic' title='비밀번호 입력' placeholder='비밀번호를 다시 입력하세요.' autoComplete='off' onChange={ e => setJoin(e, 'userPwOk')} onKeyPress={e => enter(e)} />
                    </div>
                </div>
            </section>

            {/* 버튼 */}
            <div className='comp-btn-wrap'>
                <Button type='button' text='가입하기' style='primary' position='center' functions={join} />
                <Button type='button' text='취소' style='default' position='center' functions={login} />
            </div>

        </>
    );
}

export default Join;