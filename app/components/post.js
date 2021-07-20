import React from "react";
import {Link} from "react-router-dom";
import {Box, Image} from '@chakra-ui/react'

function Post(props) {
    const post = props.post
    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    return (
        <Box borderWidth={"1px"} borderRadius={"lg"} overflow={"hidden"} p={3}>
        <Link key={post._id} to={`/post/${post._id}`}>
            <Image boxSize={"30px"} src={post.author.avatar}/> <strong>{post.title}</strong> {" "}
            <span className="text-muted small">{!props.noAuthor && <>by {post.author.username}</>} on {dateFormatted}</span>
        </Link>
        </Box>
    )

}

export default Post