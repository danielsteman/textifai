import {
  ChatIcon,
  SmallCloseIcon,
  HamburgerIcon,
  ChevronDownIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Tooltip,
  VStack,
  useColorMode,
  Divider,
  MenuItem,
  Menu,
  MenuList,
  MenuButton,
  MenuGroup,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  MenuDivider,
  CloseButton,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { ReactNode, useContext, useEffect, useState } from "react";
import ColorModeSwitcher from "../../common/components/ColorModeSwitcher";
import UserCard from "../../common/components/UserCard";
import EditorPanel from "../../features/Workspace/panels/EditorPanel";
import {
  FaBook,
  FaBookOpen,
  FaEdit,
  FaPlus,
  FaRegFilePdf,
  FaTrash,
} from "react-icons/fa";
import ChatPanel from "./panels/ChatPanel";
import PanelWrapper from "../../features/Workspace/PanelWrapper";
import MegaLibraryPanel from "./panels/MegaLibraryPanel";
import theme from "../../app/themes/theme";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { ProjectContext } from "../../app/providers/ProjectProvider";
import { getCurrentProjectTitle } from "../Projects/getCurrentProjectTitle";
import fetchProjectUid from "../Projects/fetchProjectId";
import { setActiveProjectForUser } from "../Projects/updateActiveProject";
import { resendVerificationEmail } from "../Authentication/resendVerificationMail";
import {
  activateTab,
  closeTab,
  openChatSupport,
  openMiniLibrary,
  openPdfViewer,
  openTab,
} from "./tabsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AuthContext } from "../../app/providers/AuthProvider";
import { setProjectId, setProjectName } from "./projectSlice";
import { Project } from "@shared/interfaces/firebase/Project";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";import { db } from "../../app/config/firebase";

export type ITab = {
  name: string;
  panel: ReactNode;
  openChatSupport: boolean;
  openMiniLibrary: boolean;
  openPdfViewer: boolean;
  isActive?: boolean;
};

const Workspace = () => {
  const { colorMode } = useColorMode();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [mailResent, setMailResent] = useState(false);
  const [conversations, setConversations] = useState<string[]>([]);

  const currentUser = useContext(AuthContext);
  const userProjects = useContext(ProjectContext);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const openTabs = useSelector((state: RootState) => state.tabs.openTabs);
  const activeTabIndex = useSelector(
    (state: RootState) => state.tabs.activeTabIndex
  );
  const activeProjectName = useSelector(
    (state: RootState) => state.activeProject.projectName
  );
  const activeProjectId = useSelector(
    (state: RootState) => state.activeProject.projectId
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAddNewProject = () => {
    navigate("/features/onboarding");
  };

  useEffect(() => {
    const fetchProjectTitle = async () => {
      const projectTitle = await getCurrentProjectTitle(currentUser!.uid);
      dispatch(setProjectName(projectTitle));
    };

    fetchProjectTitle();
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (currentUser) {
      const fetchAndSetProjectUid = async () => {
        const uid = await fetchProjectUid(currentUser.uid, activeProjectName!);
        dispatch(setProjectId(uid!));
      };

      fetchAndSetProjectUid();
    }
  }, [currentUser, activeProjectName]);

  useEffect(() => {
    const defaultTab: ITab = {
      name: "Library",
      panel: <MegaLibraryPanel />,
      openChatSupport: false,
      openMiniLibrary: false,
      openPdfViewer: false,
    };
    dispatch(openTab(defaultTab));
  }, []);

  const handleProjectClick = async (project: Project) => {
    await setActiveProjectForUser(project.name, currentUser!.uid);

    dispatch(setProjectName(project!.name));
  };

  const handleResendClick = () => {
    if (currentUser) {
      resendVerificationEmail(currentUser);
      setMailResent(true);
    }
  };

  const fetchMessages = async () => {
    try {
      const q = query(
        collection(db, "conversations"), 
        where("userId", "==", currentUser!.uid), 
        where("projectId", "==", activeProjectId)
      );
      const querySnapshot = await getDocs(q);
      const fetchedConversationIds = querySnapshot.docs.map(doc => doc.id);
      setConversations(fetchedConversationIds);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeProjectId, currentUser, dispatch]);

  return (
    <HStack h="100%">
      {!currentUser?.emailVerified && (
        <Modal
          isOpen={!currentUser?.emailVerified}
          onClose={() => {}}
          isCentered
          size="md"
        >
          <ModalOverlay />
          <ModalContent
            bgColor={theme.colors[colorMode].secondaryContainer}
            borderRadius="md"
          >
            <ModalHeader
              textColor={theme.colors[colorMode].onSecondaryContainer}
            >
              Verify your email
            </ModalHeader>
            <ModalBody>
              <Text mb={4}>
                We have sent an email to{" "}
                <span style={{ fontWeight: "bold" }}>{currentUser!.email}</span>
                .
                <br />
                <br />
                If you have not received the verification mail, please check
                your "Spam" folder. You can also click the resend button below
                to have another email sent to you.
              </Text>
            </ModalBody>
            <ModalFooter justifyContent="flex-start">
              <Button
                colorScheme={theme.colors[colorMode].onSecondaryContainer}
                textColor={theme.colors[colorMode].onSecondaryContainer}
                onClick={handleResendClick}
                p={0}
                isDisabled={mailResent}
              >
                {mailResent
                  ? "Just resent another verification mail"
                  : "Resend verification mail"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {isMenuOpen && (
        <VStack
          bgColor={theme.colors[colorMode].surfaceContainer}
          h="100%"
          p={2}
        >
          <Flex justifyContent="flex-end" w="100%">
            <IconButton
              aria-label="Close Menu"
              icon={<MdKeyboardDoubleArrowLeft />}
              onClick={toggleMenu}
              size="sm"
            />
          </Flex>
          <Menu>
            <MenuButton
              textAlign="left"
              mb={2}
              w="100%"
              as={Button}
              size="md"
              variant="ghost"
              rightIcon={<ChevronDownIcon />}
            >
              {activeProjectName}
            </MenuButton>
            <MenuList>
              <MenuGroup title="All projects">
                <MenuDivider />
                {userProjects.map((project) => (
                  <MenuItem
                    key={project.name}
                    onClick={() => {
                      handleProjectClick(project);
                    }}
                  >
                    {project.name}
                  </MenuItem>
                ))}
                <MenuDivider />
                <MenuItem onClick={handleAddNewProject}>+ New project</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
          <Button
            w="100%"
            justifyContent="flex-start"
            aria-label={"editor"}
            leftIcon={<FaEdit />}
            variant="ghost"
            size="md"
            onClick={() => {
              const tab = {
                name: "Editor",
                panel: <EditorPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
            }}
          >
            Editor
          </Button>
          <Button
            w="100%"
            justifyContent="flex-start"
            aria-label={"chat"}
            leftIcon={<ChatIcon />}
            variant="ghost"
            size="md"
            onClick={() => {
              const tab: ITab = {
                name: "Chat",
                panel: <ChatPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
            }}
          >
            Chat
          </Button>
          <Button
            w="100%"
            justifyContent="flex-start"
            aria-label={"documents"}
            leftIcon={<FaBook />}
            variant="ghost"
            size="md"
            onClick={() => {
              const tab: ITab = {
                name: "Library",
                panel: <MegaLibraryPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
            }}
          >
            Library
          </Button>
          <Divider />
          {openTabs &&
            activeTabIndex &&
            openTabs[activeTabIndex].name === "Chat" && (
              <VStack w="100%">
                {
                  conversations.map((conversation) => (
                  <HStack
                    key={conversation}
                    w="100%"
                    bgColor={theme.colors[colorMode].surfaceContainerHigh} 
                    borderRadius="lg" 
                    px={4}
                    py={3}
                    cursor="pointer"
                    _hover={{
                      bgColor: theme.colors[colorMode].surfaceContainerHighest, 
                    }}
                  >
                    <Heading size="sm" fontWeight={500}>
                      {conversation} {/* Display the message ID */}
                    </Heading>
                    <Spacer />
                    <Box
                      color={theme.colors[colorMode].onSurface}
                      _hover={{
                        color: theme.colors[colorMode].primary,
                      }}
                    >
                      <FaTrash />
                    </Box>
                  </HStack>
                  ))
                }
                <HStack
                  w="100%"
                  borderStyle="dashed"
                  borderWidth={1}
                  borderRadius={8}
                  px={4}
                  py={3}
                  cursor="pointer"
                  _hover={{
                    bgColor: theme.colors[colorMode].surfaceContainerHigh,
                  }}
                >
                  <Heading size="sm" fontWeight={500}>
                    New chat
                  </Heading>
                  <Spacer />
                  <Box
                    color={theme.colors[colorMode].onSurface}
                    _hover={{
                      color: theme.colors[colorMode].primary,
                    }}
                  >
                    <FaPlus />
                  </Box>
                </HStack>
              </VStack>
            )}
          <Spacer />
          <Divider />
          <UserCard />
        </VStack>
      )}
      {!isMenuOpen && (
        <VStack
          bgColor={theme.colors[colorMode].surfaceContainer}
          w="3.5rem"
          h="100%"
          justifyContent="start"
          alignItems="center"
          spacing={4}
          pb={3}
          pt={3}
          px={8}
        >
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            onClick={toggleMenu}
          />
          <IconButton
            aria-label={"Editor"}
            icon={<FaEdit />}
            onClick={() => {
              const tab = {
                name: "Editor",
                panel: <EditorPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
            }}
          />
          <IconButton
            aria-label={"Chat"}
            icon={<ChatIcon />}
            onClick={() => {
              const tab: ITab = {
                name: "Chat",
                panel: <ChatPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
            }}
          />
          <IconButton
            aria-label={"Library"}
            icon={<FaBook />}
            onClick={() => {
              const tab: ITab = {
                name: "Library",
                panel: <MegaLibraryPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
            }}
          />
          <Spacer />
          <ColorModeSwitcher />
        </VStack>
      )}
      {openTabs && openTabs.length > 0 && (
        <Tabs
          index={activeTabIndex}
          onChange={(index) => dispatch(activateTab(openTabs[index]))}
          w="100%"
          h="100%"
          maxH="100%"
          variant="unstyled"
          size="md"
          display="flex"
          flexDirection="column"
        >
          <Flex direction="row" p={2}>
            <TabList gap={2}>
              {openTabs.map((tab) => {
                const defaultProps = {
                  borderRadius: "8px",
                };
                const activeProps =
                  tab.name === openTabs[activeTabIndex].name
                    ? {
                        ...defaultProps,
                        backgroundColor:
                          theme.colors[colorMode].surfaceContainerHigh,
                      }
                    : {
                        _hover: {
                          ...defaultProps,
                          backgroundColor:
                            theme.colors[colorMode].surfaceContainer,
                        },
                      };
                return (
                  <Box
                    key={tab.name}
                    flex={1}
                    position={"relative"}
                    {...activeProps}
                  >
                    <Tab
                      px={12}
                      onClick={() => dispatch(activateTab(tab))}
                      whiteSpace="nowrap"
                      borderRadius="lg"
                    >
                      {tab.name}
                    </Tab>
                    <IconButton
                      position={"absolute"}
                      right={2}
                      variant="ghost"
                      borderRadius={4}
                      top={2}
                      size="xs"
                      aria-label={"close"}
                      icon={<SmallCloseIcon />}
                      onClick={() => {
                        dispatch(closeTab(tab));
                      }}
                    />
                  </Box>
                );
              })}
            </TabList>
            <Spacer />
            {openTabs[activeTabIndex].name === "Editor" && (
              <>
                <Tooltip label="Open mini library">
                  <IconButton
                    aria-label={"library-support"}
                    icon={<FaBookOpen />}
                    onClick={() => {
                      dispatch(openMiniLibrary("Editor"));
                    }}
                  />
                </Tooltip>
                <Box w={2} />
                <Tooltip label="Open support chat">
                  <IconButton
                    aria-label={"chat-support"}
                    icon={<ChatIcon />}
                    onClick={() => {
                      dispatch(openChatSupport("Editor"));
                    }}
                  />
                </Tooltip>
                <Box w={2} />
                <Tooltip label="Open PDF Viewer">
                  <IconButton
                    aria-label={"pdf-viewer"}
                    icon={<FaRegFilePdf />}
                    onClick={() => {
                      dispatch(openPdfViewer("Editor"));
                    }}
                  />
                </Tooltip>
                <Box w={2} />
              </>
            )}
          </Flex>
          <TabPanels
            flex="1"
            display="flex"
            flexDirection="column"
            px={2}
            pb={2}
            maxH="calc(100% - 58px)"
          >
            {openTabs.map((tab) => (
              <PanelWrapper key={tab.name} tab={tab} />
            ))}
          </TabPanels>
        </Tabs>
      )}
    </HStack>
  );
};

export default Workspace;
