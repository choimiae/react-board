import React, {useState} from "react";
import {BrowserRouter} from "react-router-dom";


function Paging(props) {
    const pageCount = Math.ceil(props.listTotal / props.listMax); // 총 페이지 숫자
    const countNum = []; // 화면에 노출될 페이징 배열 저장
    const [pagingActive, setPagingActive] = useState(0); // 현재 페이지 저장

    // 페이징 개수 확인
    (() => {
        for (let i = 1; i < pageCount + 1; i++)  countNum.push(i)
        return countNum;
    })();

    // 부모요소로부터 현재 페이징을 전달
    const sendPaging = (index, item) => {
        setPagingActive(index);
        props.getPaging(item);
    }

    return (
        <div className='comp-paging'>
            <BrowserRouter>
            {
                countNum.map((item, index) => {
                    return (
                        <button type='button' key={index} className={pagingActive === index ? 'comp-paging-item active' : 'comp-paging-item'} data-page={item} onClick={()=> sendPaging(index, item)} >
                            {item}
                        </button>
                    )
                })
            }
            </BrowserRouter>
        </div>
    );
}

export default Paging;
