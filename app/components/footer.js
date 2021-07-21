import React from "react";
import {Link} from "react-router-dom";
import {Button, Center, Flex, Input, Box, useColorMode, Text} from "@chakra-ui/react";
import {FaMoon} from "react-icons/fa";

export function Footer() {
    const {toggleColorMode} = useColorMode()
    return (
        <footer className="border-top text-center small text-muted py-3">
            <Flex alignItems={"center"} justifyContent={"center"} p={2}>
                <Box>
                    <Link to="/">Home</Link>
                </Box>
                <Box ml={"5px"}>
                    <Link to="/about-us">About Us</Link>
                </Box>
                <Box ml={"5px"}>
                    <Link to="/terms">Terms</Link>
                </Box>
            </Flex>
            <Text color={"gray.500"} isTruncated p={2}>Copyright &copy; 2020 <Link to="/" className="text-muted">ComplexApp</Link>. All rights
                reserved.</Text>
            <Center>
            <Button boxShadow={"dark-lg"} leftIcon={<FaMoon/>} variant={"ghost"} onClick={toggleColorMode}>Change color mode</Button>
            </Center>
        </footer>
    )
}