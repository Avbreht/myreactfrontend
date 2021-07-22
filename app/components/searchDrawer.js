import React, { useEffect } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  RadioGroup,
  Stack,
  Radio,
  Button,
  Input,
  IconButton,
  Tooltip,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { useImmer } from "use-immer";
import Axios from "axios";
import Post from "./post";
import { GoSearch } from "react-icons/go";
import {SearchIcon} from "@chakra-ui/icons"

function SearchDrawer() {
  // immer can have multiple state properties instead of using multiple useStates that will update immutable
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

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

  function handleInput(e) {
    const value = e.target.value;
    // useImmer function with 1 parameter normally in react we wouldn't directly muted a state but in immer we are encouraged to do so
    setState((draft) => {
      draft.searchTerm = value;
    });
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Tooltip label={"Search"}>
        <IconButton onClick={onOpen} aria-label={"Search"} icon={<GoSearch />}>
          Search
        </IconButton>
      </Tooltip>
      <Drawer placement={"top"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex>
              <SearchIcon mt={"5px"} borderWidth={"1px"} alignContent={"center"} justifyContent={"center"}/>
              <Input ml={"10px"}
                onChange={handleInput}
                autoFocus
                type="text"
                autoComplete="off"
                id="live-search-field"
                placeholder="What are you interested in?"
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody onClick={onClose}>
            {state.results.map((post) => {
              return <Post post={post} key={post._id} />;
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SearchDrawer;
