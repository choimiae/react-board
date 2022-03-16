import React from "react";

function Button (props) {
    return(
        <button type={props.type} className={'comp-btn comp-btn-'+props.style+' comp-btn-pos-'+props.position} onClick={props.functions} >
            {props.text}
        </button>
    );
}

export default Button;