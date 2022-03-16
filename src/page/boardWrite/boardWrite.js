import axios from "axios";
import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from "react-router-dom";

import Title from "../../component/title/index";
import Button from "../../component/button/index";
import * as Common from "../../static/js/common";
import UserInfo from "../../component/userInfo";
import UserSession from "../../component/userSession";


function BoardWrite(props) {
    const history = useHistory(); // 컴포넌트간 이동
    const [view, setView] = useState(''); // case: 수정 -> 해당 게시물 저장
    const writeType = props.location.state ? props.location.state.type : '';// 등록 or 수정 분기 저장 (writeType:write / writeType:mod)
    const modBoardIdx = props.location.state ? props.location.state.boardIdx : ''; // case: 수정 -> 게시물 idx 저장
    const {setSession} = useContext(UserSession); // 세션 컨텍스트 사용
    const sessionUserId = window.localStorage.getItem('userId'); // 현재 userId 정보 저장
    const sessionUserNm = window.localStorage.getItem('userNm'); // 현재 userNm 정보 저장
    const [fileList, setFileList] = useState(''); // case: 수정 -> 미리보기 파일 저장
    let fileDelItem = []; // 삭제한 파일 저장



    // case: 수정 -> 해당 게시물 내용 가져오기
    useEffect( () => {
        // axios 섹션 헤더 전달
        axios.defaults.headers.common['X-AUTH-TOKEN'] = setSession();

        if(writeType === 'mod') {
            axios({
                method: 'post',
                url: '/board/list/',
                headers: {'Content-Type': 'application/json'},
                data: {
                    viewType: 'detailView',
                    boardIdx: modBoardIdx
                },
            }).then(Response => {
                setView({
                    title:Response.data.one.title,
                    contents:Response.data.one.contents
                });
                setFileList(Response.data.fileList);
            }).catch((error) => {
                console.log(error);
            })
        }
    }, [1]);

    // 등록/수정 데이터 저장
    const save = () => {

        // 필수값 체크
        if(!view.title) return Common.validate('제목을 입력해 주세요.');
        if(!view.contents) return Common.validate('내용을 입력해 주세요.');

        // 등록/수정 데이터 분기처리 및 전송
        const saveData = (idx) => {
            axios({
                method: writeType === 'write' ? 'post' : 'patch',
                url: writeType === 'write' ? '/board/save/' : '/board/update/',
                headers: {'Content-Type': 'application/json'},
                data: {
                    boardIdx: idx ?? '',
                    title: view.title,
                    userId:sessionUserId,
                    contents:view.contents,
                    boardType: 'free',
                    fileDelList:fileDelItem
                },
            }).then(response => {
                if(response.data) goBoardList();
                else alert('에러 발생!!');
            }).catch((error) => {
                console.log(error)
            });
        }

        // 파일전송 분기처리 및 전송
        if(view.files) {
            const formData = new FormData();
            for(let i = 0; i < view.files.length; i++) formData.append('files', view.files[i]);

            axios({
                method: 'post',
                url: writeType === 'write' ? '/board/file/upload/write' : '/board/file/upload/'+modBoardIdx,
                headers: {'Content-Type': 'multipart/form-data'},
                data: formData,
            }).then(response => {
                if(response.data.result === 'success') {
                    saveData(response.data.boardIdx);
                } else alert('에러발생');
            }).catch((error) => {
                console.log(error)
            });
        } else {
            saveData(modBoardIdx);
        }
    }

    // 목록으로 이동
    const goBoardList = () => history.push('/board/list');

    // 이미지 삭제
    const fileDel = (target, idx) => {
        target.parentNode.remove();
        fileDelItem.push(idx);
    }

    return (
        <>
            {/* 로그인 정보 */}
            <UserInfo />

            {/* 타이틀 */}
            <Title titleText='일반게시판 글쓰기'/>

            {/* 게시판 글쓰기 */}
            <section className='comp-board-write'>
                <div className='comp-basic-row'>
                    <div className='tit'>제목</div>
                    <div className='desc'>
                        <input type="text" className='form-basic' title='제목 입력' placeholder='제목을 입력하세요.' defaultValue={view.title} onChange={e => setView(Object.assign(view, {title: e.target.value}))} />
                    </div>
                </div>
                <div className='comp-basic-row'>
                    <div className='tit'>작성자</div>
                    <div className='desc'>
                        <input type="text" className='form-basic' title='작성자 입력' defaultValue={sessionUserNm} readOnly />
                    </div>
                </div>
                <div className='comp-basic-row'>
                    <div className='tit'>내용</div>
                    <div className='desc'>
                        <textarea className='form-basic' rows='8' title='내용 입력' placeholder='내용을 입력하세요.' defaultValue={view.contents} onChange={e => setView(Object.assign(view, {contents:e.target.value}))} />
                    </div>
                </div>
                <div className='comp-basic-row'>
                    <div className='tit'>이미지</div>
                    <div className='desc'>
                        <input type='file' className='form-basic' title='이미지 등록' defaultValue={writeType === 'write' ? view.files : ''} onChange={e => setView(Object.assign(view, {files:e.target.files}))} multiple accept="image/png, image/gif, image/jpeg, image/jpg"/>
                    </div>
                </div>


                <div className='img-preview'>
                    {
                        fileList && fileList.map((item, index)=>{
                            return (
                                <div className='img' key={index}>
                                    <img src={'/board/file/download/'+item.fileNm} alt=''/>
                                    <button type='button' className='close' onClick={e => {fileDel(e.target, item.boardFileIdx)}}>삭제</button>
                                </div>
                            )
                        })
                    }
                </div>
            </section>


            {/* 버튼 */}
            <div className='comp-btn-wrap'>
                <Button type='button' text={writeType === 'write' ? '등록' : '수정'} style='primary' position='center' functions={save} />
                <Button type='button' text='취소' style='default' position='center' functions={goBoardList} />
            </div>
        </>
    );
}

export default BoardWrite;