import React, {useEffect, useContext, useState} from "react";
import {Link} from "react-router-dom";
import StateContext from "../stateContext";
import DispatchContext from "../dispatchContext";
import ReactTooltip from "react-tooltip";
import {ButtonGroup} from "@chakra-ui/react";

export default function headerLoggedIn() {
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    function handleLogout() {
        appDispatch({type: "logout"})
    }

    function handleSearchIcon(e) {
        e.preventDefault()
        appDispatch({type: "openSearch"})
    }

    return (
        <ButtonGroup size={"sm"} spacing={3}>
            <a data-for="search" data-tip="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
                <i className="fas fa-search"></i>
            </a>
            <ReactTooltip place="bottom" id="search" className="custom-tooltip"/>
            {" "}<span onClick={() => appDispatch({type:"toggleChat"})} data-for="chat" data-tip="Chat" className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white")}>
            <i className="fas fa-comment"></i>
            {appState.unreadChatCount ? <span className="chat-count-badge text-white">{appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}</span> : ""}
          </span>
            <ReactTooltip place="bottom" id="chat" className="custom-tooltip"/>
            {" "}<Link data-for="profile" data-tip="My Profile" to={`/profile/${appState.user.username}`} className="mr-2">
                <img className="small-header-avatar"
                     src={appState.user.avatar}/>
            </Link>
            <ReactTooltip place="bottom" id="profile" className="custom-tooltip"/>
            {" "}<Link className="btn btn-sm btn-success mr-2" to="/create-post">
                Create Post
            </Link>
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </ButtonGroup>
    )
}