import React , {useEffect} from "react";
import {Container} from "./container";

export function Page(props) {
    useEffect(() => {
        // we need to refresh everytime title updates so we put props.title as second argument
        document.title = `${props.title} | ComplexApp`
        window.scrollTo(0, 0)
        }, [props.title])
    return (
        <Container wide={props.wide}>
            {props.children}
        </Container>
    )
}