import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios';
import {useHistory, Link} from 'react-router-dom';

import UserInfo from "../../component/userInfo";
import Title from "../../component/title/index";
import Paging from "../../component/paging/index";
import Button from "../../component/button/index";
import * as Common from "../../static/js/common";
import UserSession from "../../component/userSession";

function BoardList() {
    const history = useHistory(); // 컴포넌트간 이동
    const [source, setSource] = useState(''); // 목록 데이터 저장
    const [paging, setPaging] = useState(1); // 현재 페이지 숫자
    const size = 6; // 한 페이지에 노출시킬 게시물 개수
    let num = source.total - ((paging - 1) * size) // 게시물 번호
    const {setSession} = useContext(UserSession); // 세션 컨텍스트 사용
    const [searchVal, setSearchVal] = useState('');

    // 데이터 전송 / 전달
    useEffect(() => {
        getList();
    },[paging]);

    // 목록 데이터 불러오기
    const getList = () => {
        // axios 섹션 헤더 전달
        axios.defaults.headers.common['X-AUTH-TOKEN'] = setSession();

        axios({
            method: 'post',
            url: '/board/list/',
            headers: {'Content-Type': 'application/json'},
            data: {
                paging:paging,
                boardType:'free',
                size:size,
                viewType:'list', // 목록: list, 상세: detailView
                searchType:searchVal.searchType ?? 'all',
                searchKeyword:searchVal.searchKeyword ?? ''
            },
        }).then(Response => {
            setSource({
                len: Response.data === 'fail' ? 0 : Response.data.list.length, // 서버 통신 실패시 -> 목록 없음으로 뜨게 설정
                total: Response.data.totalCnt,
                list: Response.data.list,
                boardType: 'free'
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    // 자식요소로부터 현재 페이징을 받아옴
    const getPaging = (num) => setPaging(num);

    // 쓰기로 이동
    const goBoardWrite = () => {
        history.push({
            pathname: '/board/write',
            state: {
                type:'write'
            }
        });
    }

    const enter = (e) => {
        if(e.key === 'Enter') getList();
    }

    // 검색
    const search = () => {
        setPaging(1);
        getList();
    }

    return (
        <>
            {/* 로그인 정보 */}
            <UserInfo />

            {/* 타이틀 */}
            <Title titleText='일반게시판 목록'/>

            {/* 검색조건 */}
            <section className='comp-search'>
                <div className='box'>
                    <div className='item sel'>
                        <select className='form-basic' title='검색 조건 선택' onChange={e => setSearchVal(Object.assign(searchVal, {searchType:e.target.value}))}>
                            <option value="all">전체</option>
                            <option value="title">제목</option>
                            <option value="contents">내용</option>
                        </select>
                    </div>
                    <div className='item inp'>
                        <input type="text" className='form-basic' placeholder='검색어를 입력하세요.' title='검색어 입력' id='searchKeyword' onChange={e => setSearchVal(Object.assign(searchVal, {searchKeyword:e.target.value}))} onKeyPress={e => enter(e)}/>
                    </div>
                    <div className='item btn'>
                        <Button type='button' text='검색' style='info' position='center' functions={search}/>
                    </div>
                </div>
            </section>

            {/* 게시판 목록 */}
            <section className='comp-board-list-wrap'>
                <ul className='comp-board-list'>

                    {/* case: 목록 없음 */}
                    {<li className={source.len <=0 ? 'comp-board-empty': 'comp-board-empty hide'}>목록이 없습니다.</li>}

                    {/* case: 목록 있음 */}
                    {
                        source.list && source.list.map((item, index) => {
                            return (
                                <li className='comp-board-list-item' key={index}>
                                    <Link to={{pathname: '/board/view', state: {boardIdx: item.boardIdx}}} className='comp-board-list-lnk'>
                                        {
                                            <>
                                                <div className='num'>{num--}</div>
                                                <div className='tit'>{item.title}</div>
                                                <div className='desc-box'>
                                                    <div className='desc-cont'>작성자: {item.userNm}</div>
                                                    <div className='desc-cont'>등록일: {Common.dateReplace(item.regDt)}</div>
                                                </div>
                                            </>
                                        }
                                    </Link>
                                </li>
                            );
                        })
                    }
                </ul>
            </section>

            {/* 게시판 페이징 */}
            <Paging listMax={size} listTotal={source.total} boardType={source.boardType} getPaging={getPaging} />

            {/* 버튼 */}
            <div className='comp-btn-wrap'>
                <Button type='button' text='글쓰기' style='primary' position='center' functions={goBoardWrite} />
            </div>
        </>
    );
}

export default BoardList;