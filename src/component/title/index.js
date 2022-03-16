import React from 'react';

function Title(props) {
    return (
        <div className="comp-title-box">
            <h1 className='comp-title'>{props.titleText}</h1>
        </div>
    );
}

export default Title;