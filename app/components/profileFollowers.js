import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./loadingDotsIcon"
import StateContext from "../stateContext"
import {Box, Image, SimpleGrid} from "@chakra-ui/react";

function ProfileFollowers(props) {
    const appState = useContext(StateContext)
    const { username } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/followers`, { cancelToken: ourRequest.token })
                setPosts(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log("There was a problem.")
            }
        }
        fetchPosts()
        return () => {
            ourRequest.cancel()
        }
    }, [username])

    if (isLoading) return <LoadingDotsIcon />

    return (
        <SimpleGrid>
            {posts.length > 0 &&
            posts.map((follower, index) => {
                return (
                    <Box borderWidth={"1px"} borderRadius={"lg"} overflow={"hidden"} w={"100%"} p={3}>
                    <Link key={index} to={`/profile/${follower.username}`}>
                        <Image boxSize={"30px"} src={follower.avatar} /> {follower.username}
                    </Link>
                    </Box>
                )
            })}
            {posts.length == 0 && appState.user.username == username && <p className="lead text-muted text-center">You don&rsquo;t have any followers yet.</p>}
            {posts.length == 0 && appState.user.username != username && (
                <p className="lead text-muted text-center">
                    {username} doesn&rsquo;t have any followers yet.
                    {appState.loggedIn && " Be the first to follow them!"}
                    {!appState.loggedIn && (
                        <>
                            {" "}
                            If you want to follow them you need to <Link to="/">sign up</Link> for an account first.{" "}
                        </>
                    )}
                </p>
            )}
        </SimpleGrid>
    )
}

export default ProfileFollowers