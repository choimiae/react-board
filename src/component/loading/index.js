import React from "react";
import {usePromiseTracker} from "react-promise-tracker";

function Loading() {
    const {promiseInProgress} = usePromiseTracker();
    return promiseInProgress && <div className='comp-loading'><div className='comp-loading-box'><div className='comp-loading-item'><div className='comp-loading-circle'></div></div></div></div>;
}

export default Loading;