import React, {useContext, useEffect, useState} from "react";
import {Page} from "./page";
import Axios from 'axios'
import {useImmerReducer} from "use-immer";
import {CSSTransition} from "react-transition-group";
import DispatchContext from "../dispatchContext";
import {
    Flex, Heading, Box, Text, Button, SimpleGrid, FormControl,
    FormLabel, FormErrorMessage, FormHelperText, Input, Spacer, Container,
} from "@chakra-ui/react";

export function HomeGuest() {
    const appDispatch = useContext(DispatchContext)
    const initialState = {
        username: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: false,
            checkCount: 0
        },
        email: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: false,
            checkCount: 0
        },
        password: {
            value: "",
            hasErrors: false,
            message: ""
        },
        submitCount: 0
    }

    function ourReducer(draft, action) {
        // action.value kaj nam vrne server
        switch (action.type) {
            case "usernameImmediately":
                draft.username.hasErrors = false
                draft.username.value = action.value
                if (draft.username.value.length > 30) {
                    draft.username.hasErrors = true
                    draft.username.message = "Username cannot exceed 30 characters, dont be a full n-"
                }
                if (draft.username.value && !/^([a-zA-Z0-9])+$/.test(draft.username.value)) {
                    draft.username.hasErrors = true
                    draft.username.message = "Username can only have ordinary characters"
                }
                return
            case "usernameAfterDelay":
                if (draft.username.value.length < 4) {
                    draft.username.hasErrors = true
                    draft.username.message = "Username must be at least 4 characters"
                }
                if (!draft.username.hasErrors && !action.noRequest) {
                    draft.username.checkCount ++
                }
                return
            case "usernameUniqueResults":
                if (action.value) {
                    draft.username.hasErrors = true
                    draft.username.isUnique = false
                    draft.username.message = "This username is already taken"
                } else {
                    draft.username.isUnique = true
                }
                return
            case "emailImmediately":
                draft.email.hasErrors = false
                draft.email.value = action.value
                return
            case "emailAfterDelay":
                if (!/^\S+@\S+$/.test(draft.email.value)) {
                    draft.email.hasErrors = true
                    draft.email.message = "You must provide a valid email"
                }
                if (!draft.email.hasErrors && !action.noRequest) {
                    draft.email.checkCount ++
                }
                return
            case "emailUniqueResults":
                if (action.value) {
                    draft.email.hasErrors = true
                    draft.email.isUnique = false
                    draft.email.message = "This email is already taken"
                } else {
                    draft.email.isUnique = true
                }
                return
            case "passwordImmediately":
                draft.password.hasErrors = false
                draft.password.value = action.value
                if (draft.password.value.length > 50) {
                    draft.password.hasErrors = true
                    draft.password.message = "Pass incorrect"
                }
                return
            case "passwordAfterDelay":
                if (draft.password.value.length < 12) {
                    draft.password.hasErrors = true
                    draft.password.message = "Password must be at least 12 characters"
                }
                return
            case "submitForm":
                if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
                    draft.submitCount ++
                }
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if (state.username.value) {
            const delay = setTimeout(() => dispatch({type:"usernameAfterDelay"}), 1000)
            return () => clearTimeout(delay)
        }
    }, [state.username.value])

    useEffect(() => {
        if (state.email.value) {
            const delay = setTimeout(() => dispatch({type:"emailAfterDelay"}), 1000)
            return () => clearTimeout(delay)
        }
    }, [state.email.value])

    useEffect(() => {
        if (state.password.value) {
            const delay = setTimeout(() => dispatch({type:"passwordAfterDelay"}), 1000)
            return () => clearTimeout(delay)
        }
    }, [state.password.value])

    useEffect(() => {
        if (state.username.checkCount) {
            const ourRequest = Axios.CancelToken.source()

            async function ServerRequest() {
                try {
                    const response = await Axios.post(`/doesUsernameExist`, {username: state.username.value},{cancelToken: ourRequest.token})
                    dispatch({type: "usernameUniqueResults", value: response.data})
                } catch (e) {
                    console.log("There was a problem")
                }
            }
            ServerRequest()
            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.username.checkCount])

    useEffect(() => {
        if (state.email.checkCount) {
            const ourRequest = Axios.CancelToken.source()

            async function ServerRequest() {
                try {
                    const response = await Axios.post(`/doesEmailExist`, {email: state.email.value},{cancelToken: ourRequest.token})
                    dispatch({type: "emailUniqueResults", value: response.data})
                } catch (e) {
                    console.log("There was a problem")
                }
            }
            ServerRequest()
            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.email.checkCount])

    useEffect(() => {
        if (state.submitCount) {
            const ourRequest = Axios.CancelToken.source()

            async function ServerRequest() {
                try {
                    const response = await Axios.post(`/register`, {username: state.username.value, email: state.email.value, password: state.password.value},{cancelToken: ourRequest.token})
                    appDispatch({type: "login", data: response.data})
                    appDispatch({type: "flashMessage", value: "Hello you have successfully registered"})
                } catch (e) {
                    console.log("There was a problem")
                }
            }
            ServerRequest()
            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.submitCount])

    async function handleSubmit (e) {
        e.preventDefault()
        dispatch({type:"usernameImmediately", value: state.username.value})
        dispatch({type:"usernameAfterDelay", value: state.username.value, noRequest: true})
        dispatch({type:"emailImmediately", value: state.email.value})
        dispatch({type:"emailAfterDelay", value: state.email.value, noRequest:true})
        dispatch({type:"passwordImmediately", value: state.password.value})
        dispatch({type:"passwordAfterDelay", value: state.password.value, noRequest: true})
        dispatch({type:"submitForm"})

    }
    return (
        <Page title="Home" wide={true}>
            <Flex>
                <Container>
                    <SimpleGrid m={5} gridGap={5}>
                        <Box alignContent={"center"}>
                            <Heading as={"h2"} size={"2xl"}>Remember Writing?</Heading>
                        </Box>
                        <Box>
                            <Text fontSize={20}>
                                Are you sick of short tweets and
                                impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email
                                forwards? We believe getting back to actually writing is the key to enjoying the internet
                                again.
                            </Text>
                        </Box>
                    </SimpleGrid>
                </Container>
                <Spacer />
                <SimpleGrid m={2} p={2} mx={2}>
                    <form onSubmit={handleSubmit}>
                    <FormControl id={"submit"}>
                        <FormLabel>Username</FormLabel>
                        <Input onChange={e => dispatch({type: "usernameImmediately", value:e.target.value})} id="username-register" name="username" placeholder="Pick a username" autoComplete="off"/>
                        <CSSTransition in={state.username.hasErrors} timeout={330} unmountOnExit>
                            <FormErrorMessage>{state.username.message}</FormErrorMessage>
                        </CSSTransition>
                        <FormLabel mt={"5px"}>Email</FormLabel>
                        <Input onChange={e => dispatch({type: "emailImmediately", value:e.target.value})} id="email-register" name="email" placeholder="you@example.com" autoComplete="off"/>
                        <CSSTransition in={state.email.hasErrors} timeout={330} unmountOnExit>
                            <FormErrorMessage>{state.email.message}</FormErrorMessage>
                        </CSSTransition>
                        <FormLabel mt={"5px"}>Password</FormLabel>
                        <Input onChange={e => dispatch({type: "passwordImmediately", value:e.target.value})} id="password-register" name="password" placeholder="Create a password" autoComplete="off" type={"password"}/>
                        <CSSTransition in={state.password.hasErrors} timeout={330} unmountOnExit>
                            <FormErrorMessage>{state.password.message}</FormErrorMessage>
                        </CSSTransition>
                        <Button mt={"10px"} type="submit">
                            Sign up for ComplexApp
                        </Button>
                    </FormControl>
                    </form>
                </SimpleGrid>
            </Flex>
        </Page>
    )
}

