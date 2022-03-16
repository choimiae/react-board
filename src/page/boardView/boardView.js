import React, {useEffect, useState} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {useContext} from "react";

import Title from "../../component/title/index";
import Button from "../../component/button/index";
import * as Common from "../../static/js/common";
import UserInfo from "../../component/userInfo";
import UserSession from "../../component/userSession";

function BoardView(props) {
    const history = useHistory(); // 컴포넌트간 이동
    const [view, setView] = useState(''); // 상세 페이지 내용 저장
    const sessionUser = window.localStorage.getItem('userId'); // 현재 userId 정보 저장
    const {setSession} = useContext(UserSession); // 세션 컨텍스트 사용

    // 게시물 상세 정보 가져오기
    useEffect(()=> {
        // axios 섹션 헤더 전달
        axios.defaults.headers.common['X-AUTH-TOKEN'] = setSession();

        axios({
            method: 'post',
            url: '/board/list/',
            headers: {'Content-Type': 'application/json'},
            data: {
                viewType:'detailView', // 목록: list, 상세: detailView
                boardIdx:props.location.state ? props.location.state.boardIdx : ''
            },
        }).then(Response => {
            setView({
                title:Response.data.one.title,
                userId:Response.data.one.userId,
                userNm:Response.data.one.userNm,
                contents:Response.data.one.contents,
                regDt:Response.data.one.regDt,
                modDt:Response.data.one.modDt,
                files:Response.data.fileList
            });
        }).catch((error) => {
            console.log(error);
        })
    }, [1]);


    // 목록으로 이동
    const goBoardList = () => {
        history.push('/board/list');
    }

    // 수정으로 이동
    const goBoardWrite = () => {
        history.push({
            pathname: '/board/write',
            state: {
                type:'mod',
                boardIdx: props.location.state.boardIdx
            }
        });
    }

    // 게시물 삭제
    const delBoardList = () => {
        if(window.confirm('정말 삭제하시겠습니까?')) {
            axios({
                method: 'delete',
                url: '/board/delete/',
                headers: {'Content-Type': 'application/json'},
                data: {
                    boardIdx:props.location.state.boardIdx
                },
            }).then(Response => {
                history.push('/board/list');
            }).catch((error) => {
                console.log(error);
            })
        }
    }

    return (
        <>
            {/* 로그인 정보 */}
            <UserInfo />

            {/* 타이틀 */}
            <Title titleText='일반게시판 글보기'/>

            {/* 게시판 글보기 */}
            <section className='comp-board-view'>
                <div className='comp-basic-row'>
                    <div className='tit'>제목</div>
                    <div className='desc'>{view.title}</div>
                </div>
                <div className='comp-basic-row'>
                    <div className='tit'>작성자</div>
                    <div className='desc'>{view.userNm}</div>
                </div>
                <div className='comp-basic-row'>
                    <div className='tit'>내용</div>
                    <div className='desc'>{view.contents}</div>
                </div>
                <div className={view.files !== undefined && view.files.length ? 'comp-basic-row' : 'comp-basic-row hide'}>
                    <div className='tit'>이미지</div>
                    <div className='desc'>
                        <div className='img-box'>
                            {
                                view.files && view.files.map((item, index) => {
                                    return (
                                        <div key={index} className='img'>
                                            <img src={'/board/file/download/'+item.fileNm} alt=''/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='comp-basic-row'>
                    <div className='tit'>등록일</div>
                    <div className='desc'>{Common.dateReplace(view.regDt)}</div>
                </div>
                <div className={view.modDt ? 'comp-basic-row' : 'comp-basic-row hide'}>
                    <div className='tit'>수정일</div>
                    <div className='desc'>{Common.dateReplace(view.modDt)}</div>
                </div>
            </section>

            {/* 버튼 */}
            <div className='comp-btn-wrap'>
                {sessionUser === view.userId ? <Button type='button' text='삭제' style='danger' position='right' functions={delBoardList} /> : ''}
                {sessionUser === view.userId ? <Button type='button' text='수정' style='default' position='center' functions={goBoardWrite} /> : ''}
                <Button type='button' text='목록' style='primary' position='center' functions={goBoardList} />
            </div>
        </>
    );
}

export default BoardView;