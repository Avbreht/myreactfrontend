import React from "react";
import {Link} from "react-router-dom";
import {Button, Flex, Input, useColorMode, useColorModeValue} from "@chakra-ui/react";

export function Footer() {
    const {toggleColorMode} = useColorMode()
    return (
        <footer className="border-top text-center small text-muted py-3">
            <p>
                <Link to="/" className="mx-1">Home</Link>
                <Link className="mx-1" to="/about-us">About Us</Link>
                <Link className="mx-1" to="/terms">Terms</Link>
            </p>
            <p className="m-0">Copyright &copy; 2020 <Link to="/" className="text-muted">ComplexApp</Link>. All rights
                reserved.</p>
            <Button onClick={toggleColorMode}>Change color mode</Button>
        </footer>
    )
}