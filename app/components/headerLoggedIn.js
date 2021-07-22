import React, {useEffect, useContext, useState} from "react";
import {Link} from "react-router-dom";
import StateContext from "../stateContext";
import DispatchContext from "../dispatchContext";
import ReactTooltip from "react-tooltip";
import {ButtonGroup, Tooltip, IconButton, Image, Button} from "@chakra-ui/react";
import {GoSearch} from "react-icons/go";
import {BsChat} from "react-icons/bs";
import Search from "./search";

import SearchDrawer from "./searchDrawer";

export default function headerLoggedIn(props) {
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    function handleLogout() {
        appDispatch({type: "logout"})
        props.history.push("/")
    }

    function handleSearchIcon(e) {
        e.preventDefault()
        appDispatch({type: "openSearch"})
    }

    return (
        <ButtonGroup size={"sm"} spacing={3}>
            <SearchDrawer />
            <Tooltip label={"Chat"}>
            <IconButton onClick={() => appDispatch({type:"toggleChat"})} aria-label={"Chat"} icon={<BsChat />}/>
            </Tooltip>
            <Tooltip label={"My Profile"}>
            <Link to={`/profile/${appState.user.username}`} >
                <Image boxSize={"30px"} src={appState.user.avatar}/>
            </Link>
            </Tooltip>
            <Button>
                <Link to="/create-post">
                    Create Post
                </Link>
            </Button>
            <Button onClick={handleLogout}>
                Sign Out
            </Button>
        </ButtonGroup>
    )
}