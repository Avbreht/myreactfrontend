import React, { useState, useEffect, useContext } from "react";

import DispatchContext from "../dispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import LoadingDotsIcon from "./loadingDotsIcon";
import { Link } from "react-router-dom";
import Post from "./post";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Icon,
  IconButton,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { GoSearch } from "react-icons/go";

function Search() {
  const appDispatch = useContext(DispatchContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // immer can have multiple state properties instead of using multiple useStates that will update immutable
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  function handleCloseIcon() {
    appDispatch({ type: "closeSearch" });
  }

  // we want to listen for escape key press only when we open search and not after we typing in search bar
  useEffect(() => {
    // listen to document wide key press and after we need to clean after ourselfs
    document.addEventListener("keyup", searchKeyPressHandler);

    // in this return we stop browser from listening for the key
    return () => document.removeEventListener("keyup", searchKeyPressHandler);
  }, []);

  // useEffect so we dont overrun the server with requests for every keystroke
  // inside we make a setTimeout function that cancels if we press a key in its interval
  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 900);
      // each key stroke that is inside x ms will call our return function that will clear our timeout
      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);

  // useEffect that watches request count for changes
  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source();

      async function ServerRequest() {
        try {
          const response = await Axios.post(
            `/search`,
            { searchTerm: state.searchTerm },
            { cancelToken: ourRequest.token }
          );
          setState((draft) => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (e) {
          console.log("There was a problem");
        }
      }
      ServerRequest();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.requestCount]);

  function searchKeyPressHandler(e) {
    if (e.keyCode === 27) {
      appDispatch({ type: "closeSearch" });
    }
  }

  function handleInput(e) {
    const value = e.target.value;
    // useImmer function with 1 parameter normally in react we wouldn't directly muted a state but in immer we are encouraged to do so
    setState((draft) => {
      draft.searchTerm = value;
    });
  }

  return (
    <>
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            onChange={handleInput}
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
          />
          <span onClick={handleCloseIcon} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show === "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show === "results" ? "live-search-results--visible" : "")
            }
          >
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> ({state.results.length}{" "}
                {state.results.length > 1 ? "items" : "item"} found)
              </div>
              {state.results.map((post) => {
                return <Post post={post} key={post._id} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
