import React, {useState, useContext, useReducer, useEffect, Suspense} from "react"
import ReactDOM from "react-dom"
import {useImmerReducer} from "use-immer";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {CSSTransition} from 'react-transition-group'
import Axios from "axios";
Axios.defaults.baseURL = process.env.BACKENDURL || "https://backendzareact.herokuapp.com/"

import StateContext from "./stateContext";
import DispatchContext from "./dispatchContext";
import {ChakraProvider} from "@chakra-ui/react";


// my components
import {Header} from "./components/header";
import {HomeGuest} from "./components/homeGuest";
import {Footer} from "./components/footer";
import {About} from "./components/about";
import {Terms} from "./components/terms";
import Home from "./components/home";
// with lazy loaded our component only loads when we need it to
const CreatePost = React.lazy(() => import("./components/createPost"))
const ViewSinglePost = React.lazy(() => import("./components/viewSinglePost"))
import FlashMessages from "./components/flashMessages";
import Profile from "./components/profile";
import EditPost from "./components/editPost";
import NotFound from "./components/notFound";
const Search = React.lazy(() => import("./components/search"))
const Chat = React.lazy(() => import("./components/chat"))
import LoadingDotsIcon from "./components/loadingDotsIcon";


function Main() {
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("complexappToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("complexappToken"),
            username: localStorage.getItem("complexappUsername"),
            avatar: localStorage.getItem("complexappAvatar")
        },
        isSearchOpen: false,
        isChatOpen: false,
        unreadChatCount: 0
    }

    function ourReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true
                // info that server passes back to us when we login
                draft.user = action.data
                return
            case "logout":
                draft.loggedIn = false
                return;
            case "flashMessage":
                draft.flashMessages.push({message:action.value, color:action.color})
                return
            case "openSearch":
                draft.isSearchOpen = true
                return
            case "closeSearch":
                draft.isSearchOpen = false
                return
            case "toggleChat":
                draft.isChatOpen = !draft.isChatOpen
                return
            case "closeChat":
                draft.isChatOpen = false
                return
            case "incrementUnreadChatCount":
                draft.unreadChatCount ++
                return
            case "clearUnreadChatCount":
                draft.unreadChatCount = 0
                return
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    // save data to local browser storage
    //it runes anytime state of logged in changes
    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("complexappToken", state.user.token)
            localStorage.setItem("complexappUsername", state.user.username)
            localStorage.setItem("complexappAvatar", state.user.avatar)
        } else {
            localStorage.removeItem("complexappToken")
            localStorage.removeItem("complexappUsername")
            localStorage.removeItem("complexappAvatar")
        }
    }, [state.loggedIn])

    // Check if token has expired or not on first render
    useEffect(() => {
        if (state.loggedIn) {
            const ourRequest = Axios.CancelToken.source()

            async function ServerRequest() {
                try {
                    const response = await Axios.post(`/checkToken`, {token: state.user.token, searchTerm: state.searchTerm},{cancelToken: ourRequest.token})
                    if (!response.data) {
                        dispatch({type:"logout"})
                        dispatch({type:"flashMessage", value: "Your session has expired. Please log in again."})
                    }
                } catch (e) {
                    console.log("There was a problem")
                }
            }
            ServerRequest()
            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.requestCount])


  return (
      <ChakraProvider>
      <StateContext.Provider value = {state}>
          <DispatchContext.Provider value={dispatch}>
            <BrowserRouter>
                <FlashMessages messages={state.flashMessages}/>
                <Header  />
                <Suspense fallback={<LoadingDotsIcon />}>
                        <Switch>
                            <Route path="/profile/:username">
                                <Profile />
                            </Route>
                            <Route path="/" exact>
                                {state.loggedIn ? <Home /> : <HomeGuest />}
                            </Route>
                            <Route path="/create-post">
                                <CreatePost />
                            </Route>
                            <Route path="/post/:id" exact>
                                <ViewSinglePost />
                            </Route>
                            <Route path="/post/:id/edit" exact>
                                <EditPost />
                            </Route>
                            <Route path="/about-us">
                                <About />
                            </Route>
                            <Route path="/terms">
                                <Terms />
                            </Route>
                            <Route>
                                <NotFound />
                            </Route>
                        </Switch>
                </Suspense>
                <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
                    <div className="search-overlay">
                        <Suspense fallback="">
                            <Search />
                        </Suspense>
                    </div>
                </CSSTransition>
                <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
                <Footer />
            </BrowserRouter>
          </DispatchContext.Provider>
      </StateContext.Provider>
      </ChakraProvider>
  )

}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
  module.hot.accept()
}
