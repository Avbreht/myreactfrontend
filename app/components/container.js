import React, {useEffect} from "react";

export function Container(props) {
    return (
        <div className={"container py-md-5 " + (props.wide ? '' : 'container--narrow')}>
            {props.children}
        </div>
    )
}