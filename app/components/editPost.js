import React, {useContext, useEffect, useState} from "react"
import {useImmerReducer} from "use-immer";
import {Page} from "./page";
import { useParams, Link , withRouter} from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./loadingDotsIcon";
import StateContext from "../stateContext";
import DispatchContext from "../dispatchContext";
import Home from "./home";
import {HomeGuest} from "./homeGuest";
import NotFound from "./notFound";
import {Button} from "@chakra-ui/react";


function EditPost(props) {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    // we declare our original state so later on we can force the user to give our post a title and body and return error if he doesnt
    const originalState = {
        title: {
            value: "",
            hasErrors: false,
            message: ""
        },
        body: {
            value: "",
            hasErrors: false,
            message: ""
        },
        isFetching: true,
        // but to keep it unusable while we wait for response from the server
        isSaving: false,
        id: useParams().id,
        sendCount: 0,
        notFound: false
    }

    // we dont want implement axios send request in our reducer rather in useEffect
    function ourReducer(draft, action) {
        switch (action.type) {
            case "fetchComplete":
                // we change our draft to the action we got back from the server
                draft.title.value = action.value.title
                draft.body.value = action.value.body
                draft.isFetching = false
                return
            case "titleChange" :
                draft.title.hasErrors = false
                draft.title.value = action.value
                return
            case "bodyChange" :
                draft.body.hasErrors = false
                draft.body.value = action.value
                return
            case "submitReq":
                if (!draft.title.hasErrors && !draft.body.hasErrors) {
                    draft.sendCount ++
                }
                return
            case "saveRequestStarted":
                draft.isSaving = true
                return
            case "saveRequestFinished":
                draft.isSaving = false
                return
            case "titleRules":
                if (!action.value.trim()) {
                    draft.title.hasErrors = true
                    draft.title.message = "You must provide a title."
                }
                return
            case "bodyRules":
                if (!action.value.trim()) {
                    draft.body.hasErrors = true
                    draft.body.message = "You must provide a body."
                }
                return
            case "notFound":
                draft.notFound = true
                return
        }
    }

    // our local reducer inside a file
    const [state, dispatch] = useImmerReducer(ourReducer, originalState)


    function submitHandler(e) {
        e.preventDefault()
        // first we check if we have valid submit before we dispatch it
        dispatch({type: "titleRules", value: state.title.value})
        dispatch({type: "bodyRules", value: state.body.value})
        dispatch({type: "submitReq"})
    }


    useEffect(() => {
        // creating our cancel axios token so we can call it when we waiting for server response
        const ourRequest = Axios.CancelToken.source()

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${state.id}`, {cancelToken: ourRequest.token})
                if (response.data) {
                    dispatch({type: "fetchComplete", value: response.data})
                    if (appState.user.username !== response.data.author.username) {
                        appDispatch({type: "flashMessage", value: "Stop right there criminal scum!", color:"danger"})
                        // redirect to homepage
                        props.history.push("/")
                    }
                } else {
                    dispatch({type: "notFound"})
                }

            } catch (e) {
                console.log("There was a problem or the server request was canceled.")
            }
        }
        fetchPost()
        return () => {
            ourRequest.cancel()
        }
    }, [])

    // we run this useEffect every time we change sendCount
    useEffect(() => {
        if (state.sendCount) {
            dispatch({type: "saveRequestStarted"})
            const ourRequest = Axios.CancelToken.source()
            async function fetchPost() {
                try {
                    const response = await Axios.post(`/post/${state.id}/edit`, {title: state.title.value, body: state.body.value, token: appState.user.token},{cancelToken: ourRequest.token})
                    dispatch({type: "saveRequestFinished"})
                    appDispatch({type: "flashMessage", value: "Post was updated"})

                } catch (e) {
                    console.log("There was a problem or the server request was canceled.")
                }
            }
            fetchPost()
            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.sendCount])

    if (state.notFound) {
        return (
            <NotFound />
        )
    }

    if (state.isFetching)
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        )

    return (
        <Page title={"Edit post"}>
            <Link className ="font-weight-bold" to={`/post/${state.id}`}>&laquo; Back to your post</Link>
            <form className="mt-3" onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input onBlur={e => dispatch({type: "titleRules", value: e.target.value})} onChange={(e) => dispatch({type: "titleChange", value: e.target.value})} value={state.title.value} autoFocus name="title" id="post-title"
                            className="form-control form-control-lg form-control-title" type="text" placeholder=""
                            autoComplete="off"/>
                    {state.title.hasErrors &&
                    <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>
                    }
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea onBlur={e => dispatch({type: "bodyRules", value: e.target.value})} onChange={e => dispatch({type:"bodyChange", value: e.target.value})} name="body" id="post-body" className="body-content tall-textarea form-control"
                              type="text" value={state.body.value}/>
                    {state.body.hasErrors &&
                    <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
                </div>
                <Button disabled={state.isSaving}>
                    {state.isSaving ? "Saving" : "Save Changes"}
                </Button>
            </form>
        </Page>
    )
}

export default withRouter(EditPost)