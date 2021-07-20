import React, {useState, useEffect, useContext} from "react";
import {Page} from "./page";
import Axios from "axios";
import {withRouter} from "react-router-dom"
import StateContext from "../stateContext";
import DispatchContext from "../dispatchContext";
import {Textarea} from "@chakra-ui/react";

function CreatePost(props) {
    const [title, setTitle] = useState()
    const [body, setBody] = useState()
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    async function handleSubmit (e) {
        e.preventDefault()
        try {
            const response = await Axios.post('/create-post', {title, body, token: appState.user.token})
            // Redirect to new post url
            appDispatch({type: "flashMessage", value: "Congrats you created a new post"})
            props.history.push(`/post/${response.data}`)
            console.log("Post was created")
        } catch (e) {
            console.log("Problem found")
        }

    }
    return (
        <Page title={"Create new post"}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <Textarea onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" placeholder=""
                           autoComplete="off"/>
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <Textarea onChange={e => setBody(e.target.value)} name="body" id="post-body" placeholder={"Write something that's on your mind"}/>
                </div>
                <button className="btn btn-primary">{appState.isSaving ? "Saving": "Save New Post"}</button>
            </form>
        </Page>
    )
}

export default withRouter(CreatePost)