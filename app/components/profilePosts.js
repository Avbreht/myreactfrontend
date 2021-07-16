import React, {useContext, useEffect, useState} from "react";
import Axios from "axios";
import LoadingDotsIcon from "./loadingDotsIcon";

import {useParams, Link} from 'react-router-dom'
import Post from "./post";

function ProfilePosts() {
    const {username} = useParams()
    // ko pridemo na stran se nismo uspesno zloadali postov zato je intial state true
    // ko pa axios request pride skozi se spremeni state na false ker smo zloadal in ko je false pokazemo state
    const [isLoading, setIsLoading] = useState(true)

    const [posts, setPosts] = useState([])

    // rabimo se useEffect da ne klicemo serverja usakic ko rerandramo objekt
    useEffect(() => {
        const  ourRequest = Axios.CancelToken.source()

        async function fetchPosts() {
            try {
                // fetch posts from the backend client
                const response = await Axios.get(`profile/${username}/posts`, {cancelToken: ourRequest.token})
                setPosts(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log("problem found")
            }
        }
        fetchPosts()
        return () => {
            ourRequest.cancel()
        }
    }, [username])

    if (isLoading) return (
        <LoadingDotsIcon />
    )


    return (
        <div className="list-group">
            {posts.map(post => {
                return <Post noAuthor={true} post={post} key={post._id}/>
            })}
        </div>
    )
}

export default ProfilePosts