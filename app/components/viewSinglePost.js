import React, { useEffect, useState , useContext} from "react"
import {Page} from "./page";
import { useParams, Link , withRouter} from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./loadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./notFound";
import StateContext from "../stateContext";
import DispatchContext from "../dispatchContext";
import {Box, Flex, Heading, Image, Spacer, ButtonGroup, Tooltip, IconButton} from "@chakra-ui/react";
import {FaEdit, FaTrash} from "react-icons/fa";


function ViewSinglePost(props) {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPost] = useState()


    // with search we have a problem now useEffect doesnt rerun if we search other post while we are on a post
    // we give a 'pogoj' da nanovo klicemo useEffect in rerandamo usakic k je nov post id
    useEffect(() => {
        // creating our cancel axios token so we can call it when we waiting for server response
        const ourRequest = Axios.CancelToken.source()

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, {cancelToken: ourRequest.token})
                setPost(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log("There was a problem or the server request was canceled.")
            }
        }
        fetchPost()
        return () => {
            ourRequest.cancel()
        }
    }, [id])

    if (!isLoading && !post) {
        return <NotFound />
    }

    if (isLoading)
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        )

    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    function isOwner() {
        if (appState.loggedIn) {
            return appState.user.username === post.author.username
        }
        return false
    }

     async function deleteHandler() {
        const areYou4Real = window.confirm("Do you really want to delete this post?")
        if (areYou4Real) {
            try {
                // request deleting post with id from params
                const response = await Axios.delete(`/post/${id}`, {data: {token: appState.user.token}})
                if (response.data === "Success") {
                    // 1. display a flash message
                    appDispatch({type: "flashMessage", value: "Post was successfully deleted."})
                    // 2. redirect back to the current user's profile with withRouter and using props argument in our body function
                    // start with / for where to send you
                    props.history.push(`/profile/${appState.user.username}`)

                }
            } catch (e) {
                console.log("There was a problem")
            }
        }
    }

    return (
        <Page title={post.title}>
            <Flex>
                <Heading as={"h2"} size={"md"}>{post.title}</Heading>
                <Spacer />
                {isOwner() && (
                    <ButtonGroup>
                        <Tooltip>
                            <Link to={`/post/${post._id}/edit`}>
                                <IconButton aria-label={"Edit post"} icon={<FaEdit />} />
                            </Link>
                        </Tooltip>
                        <Tooltip>
                        <a onClick={deleteHandler}>
                            <IconButton aria-label={"Delete post"} icon={<FaTrash />} />
                        </a>
                        </Tooltip>
                    </ButtonGroup>
                )}
            </Flex>

            <Flex>
                <Link to={`/profile/${post.author.username}`}>
                    <Image boxSize={"30px"} src={post.author.avatar} />
                </Link>
                <Spacer />
                <Box p={1}>
                    Posted by
                    {<Link to={`/profile/${post.author.username}`}>{post.author.username}</Link>}
                    on {dateFormatted}
                </Box>
            </Flex>
            <Box>
                <ReactMarkdown children={post.body} />
            </Box>
        </Page>
    )
}

export default withRouter(ViewSinglePost)