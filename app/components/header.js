import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { HeaderLoggedOut } from "./headerLoggedOut";
import HeaderLoggedIn from "./headerLoggedIn";
import StateContext from "../stateContext";
import { Box, Flex, Heading, Image, Spacer } from "@chakra-ui/react";

export function Header(props) {
  const appState = useContext(StateContext);
  const headerContent = appState.loggedIn ? (
    <HeaderLoggedIn />
  ) : (
    <HeaderLoggedOut />
  );

  return (
    <header className="header-bar bg-primary mb-3">
      <Flex ml={"400px"} mr={"200px"} alignContent={"center"} justifyContent={"center"}>
        <Box p={"5"}>
          <Heading as={"h4"} size={"md"}>
            <Link to="/" className="text-white">
              ComplexApp
            </Link>
          </Heading>
        </Box>
        <Spacer />
        <Box p={"5"}>{!props.staticEmpty ? headerContent : ""}</Box>
        <Box mt={"20px"} alignContent={"center"}>
          <Image boxSize={"20px"} src={"../public/germany.svg"} />
        </Box>
      </Flex>
    </header>
  );
}
