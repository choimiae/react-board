import React from "react";

function Common() {
    return (
        <></>
    )
}


// 날짜 치환
export function dateReplace(date) {
    const replace = (date|| '').split('T');
    return `${replace[0]} ${replace[1]}`;
}

// 값체크 -> 알림
export function validate(text) {
    alert(text);
    return false;
}

export default Common;