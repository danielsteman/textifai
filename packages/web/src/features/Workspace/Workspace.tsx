import {
  ChatIcon,
  SmallCloseIcon,
  HamburgerIcon,
  ChevronDownIcon,
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
  Heading,
  Input,
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
import { ConversationContext } from "../../app/providers/ConversationProvider";
import { getCurrentProjectTitle } from "../Projects/getCurrentProjectTitle";
import fetchProjectUid from "../Projects/fetchProjectId";
import { setActiveProjectForUser } from "../Projects/setActiveProjectForUser";
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
import { startConversation, deleteConversation } from "../Chat/ChatFuncs";
import { setCurrentConversationId } from "../Chat/chatSlice";
import { deleteProject } from "../Projects/deleteProject";
import { handleEditProjectName } from "../Projects/changeProjectName";
import { keyframes } from "@emotion/react";
import { shortenString } from "../../common/utils/shortenString";
import { initializeSelectedDocuments } from "../DocumentCollection/librarySlice";

export type ITab = {
  name: string;
  panel: ReactNode;
  openChatSupport: boolean;
  openMiniLibrary: boolean;
  openPdfViewer: boolean;
  isActive?: boolean;
  uploadName?: string;
};

const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blinkCaret = keyframes`
  50% { border-color: transparent; }
`;

const Workspace = () => {
  const { colorMode } = useColorMode();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [mailResent, setMailResent] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [prevTitle, setPrevTitle] = useState("");

  const currentUser = useContext(AuthContext);
  const conversations = useContext(ConversationContext);
  const projects = useContext(ProjectContext);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const openTabs = useSelector((state: RootState) => state.tabs.openTabs);
  const currentConversationId = useSelector(
    (state: RootState) => state.chat.currentConversationId
  );
  const activeTabIndex = useSelector(
    (state: RootState) => state.tabs.activeTabIndex
  );
  const activeProjectName = useSelector(
    (state: RootState) => state.activeProject.projectName
  );
  const activeProjectId = useSelector(
    (state: RootState) => state.activeProject.projectId
  );
  const selectedDocuments = useSelector(
    (state: RootState) => state.library.selectedDocuments
  );
  const isActiveTabSelected = selectedDocuments.some(
    (doc) => shortenString(doc, 10) === openTabs[activeTabIndex]?.name
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAddNewProject = () => {
    navigate("/features/onboarding");
  };

  const setActivateTab = (tab: any) => {
    if (tab.panel.type.name === "PdfViewer") {
      dispatch(initializeSelectedDocuments([tab.uploadName]));
    }
    dispatch(activateTab(tab));
  };

  useEffect(() => {
    const activeConversation = conversations.find(
      (conversation) => conversation.uid === currentConversationId
    );

    if (activeConversation && activeConversation.title !== prevTitle) {
      setPrevTitle(activeConversation.title);
    }
  }, [currentConversationId, conversations]);

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

  const sortedConversations = [...conversations].sort((a, b) => {
    return b.updatedDate.toDate().getTime() - a.updatedDate.toDate().getTime();
  });

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
          w="17.5em"
          p={2}
          overflowY="auto"
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
            {({ onClose }) => (
              <>
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
                    {projects.map((project, index) => (
                      <Box
                        key={project.uid}
                        onClick={() => handleProjectClick(project)}
                        cursor="pointer"
                        _hover={{
                          bgColor:
                            theme.colors[colorMode].surfaceContainerHighest,
                        }}
                      >
                        <HStack
                          justifyContent="space-between"
                          width="100%"
                          p={2}
                        >
                          {editMode && activeProjectId === project.uid ? (
                            <Input
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              onBlur={() => {
                                handleEditProjectName(project.uid!, editedName);
                                setEditMode(false);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleEditProjectName(
                                    project.uid!,
                                    editedName
                                  );
                                  dispatch(setProjectName(editedName));
                                  setEditMode(false);
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <Text isTruncated>{project.name}</Text>
                          )}
                          <HStack spacing={0}>
                            {/* <Tooltip label="Edit project name">
                              <IconButton
                                icon={<FaPen />}
                                aria-label="Edit"
                                size="sm"
                                variant="ghost"
                                _hover={{
                                  color: theme.colors[colorMode].primary,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditMode(true);
                                  setEditedName(project.name);
                                }}
                              />
                            </Tooltip> */}
                            <Tooltip label="Delete project">
                              <IconButton
                                icon={<FaTrash />}
                                aria-label="Delete"
                                size="sm"
                                variant="ghost"
                                _hover={{
                                  color: theme.colors[colorMode].primary,
                                }}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  await deleteProject(
                                    project.uid,
                                    currentUser!.uid
                                  );

                                  if (projects.length >= 2) {
                                    let targetIndex;
                                    if (index === 0) {
                                      targetIndex = projects.length - 1;
                                    } else {
                                      targetIndex = 0;
                                    }
                                    await setActiveProjectForUser(
                                      projects[targetIndex].name,
                                      currentUser!.uid
                                    );
                                  } else {
                                    await setActiveProjectForUser(
                                      "",
                                      currentUser!.uid
                                    );
                                    console.log("reset project");
                                  }

                                  onClose();
                                  history.go(0);
                                }}
                              />
                            </Tooltip>
                          </HStack>
                        </HStack>
                      </Box>
                    ))}
                    <MenuDivider />
                    <MenuItem onClick={handleAddNewProject}>
                      + New project
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              </>
            )}
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
            (openTabs[activeTabIndex].name === "Chat" ||
              (openTabs[activeTabIndex].name !== "Library" &&
                openTabs[activeTabIndex].openChatSupport)) && (
              <VStack w="100%" overflowY="scroll">
                <Heading size="sm" py={2} alignSelf="flex-start" px={4}>
                  Conversations
                </Heading>

                {sortedConversations.map((conversation) => (
                  <HStack
                    key={conversation.uid}
                    w="100%"
                    borderWidth="1px"
                    borderColor={
                      conversation.uid === currentConversationId
                        ? theme.colors[colorMode].primary
                        : theme.colors[colorMode].surfaceContainerHigh
                    }
                    borderRadius="lg"
                    px={4}
                    py={3}
                    cursor="pointer"
                    _hover={{
                      bgColor:
                        conversation === currentConversationId
                          ? theme.colors[colorMode].activeTabBg
                          : theme.colors[colorMode].surfaceContainerHighest,
                      color:
                        conversation === currentConversationId
                          ? theme.colors[colorMode].activeTabText
                          : theme.colors[colorMode].onSurfaceContainerHover,
                    }}
                    onClick={async () => {
                      dispatch(setCurrentConversationId(conversation.uid));
                    }}
                  >
                    <Tooltip
                      label={conversation.title}
                      aria-label="Full conversation text"
                      placement="top"
                    >
                      <Text
                        fontSize="0.85rem"
                        fontWeight={500}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        css={{
                          maxWidth: "100%",
                          borderRight: "2px solid transparent",
                          animation:
                            conversation.uid === currentConversationId &&
                            conversation.title !== prevTitle
                              ? `${typing} ${
                                  conversation.title.length / 10
                                }s steps(${conversation.title.length}, end),
                            ${blinkCaret} .75s step-end infinite`
                              : "none",
                          animationFillMode: "forwards",
                        }}
                      >
                        {conversation.title}
                      </Text>
                    </Tooltip>
                    <Spacer />
                    <Box
                      color={theme.colors[colorMode].onSurface}
                      _hover={{
                        color: theme.colors[colorMode].primary,
                      }}
                    >
                      <FaTrash
                        onClick={async (e) => {
                          e.stopPropagation();
                          await deleteConversation(
                            conversation.uid,
                            currentUser!.uid,
                            activeProjectId!,
                            dispatch
                          );
                          if (sortedConversations.length > 1) {
                            const nextConversationId =
                              sortedConversations[0].uid === conversation.uid
                                ? sortedConversations[1].uid
                                : sortedConversations[0].uid;
                            dispatch(
                              setCurrentConversationId(nextConversationId)
                            );
                          }
                        }}
                      />
                    </Box>
                  </HStack>
                ))}
                <HStack
                  w="100%"
                  borderStyle="dashed"
                  borderWidth={1}
                  borderRadius={8}
                  px={4}
                  py={3}
                  cursor="pointer"
                  onClick={async () => {
                    const newConversationId = await startConversation(
                      currentUser!.uid,
                      activeProjectId!
                    );
                    dispatch(setCurrentConversationId(newConversationId));
                  }}
                  _hover={{
                    bgColor: theme.colors[colorMode].surfaceContainerHigh,
                  }}
                >
                  <Heading size="sm" fontSize={"0.85rem"}>
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
          onChange={(index) => setActivateTab(openTabs[index])}
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
                      onClick={() => setActivateTab(tab)}
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
            {openTabs[activeTabIndex].name === "Chat" && (
              <>
                <Box w={2} />
                <Tooltip label="Open mini library">
                  <IconButton
                    aria-label={"mini-library"}
                    icon={<FaBookOpen />}
                    onClick={() => {
                      dispatch(openMiniLibrary("Chat"));
                    }}
                  />
                </Tooltip>
                <Box w={2} />
              </>
            )}
            {isActiveTabSelected && (
              <>
                <Box w={2} />
                <Tooltip label="Open support chat">
                  <IconButton
                    aria-label={"chat-support"}
                    icon={<ChatIcon />}
                    onClick={() => {
                      dispatch(openChatSupport(openTabs[activeTabIndex].name));
                    }}
                  />
                </Tooltip>
                <Box w={2} />
                <Tooltip label="Open mini library">
                  <IconButton
                    aria-label={"library-support"}
                    icon={<FaBookOpen />}
                    onClick={() => {
                      dispatch(openMiniLibrary(openTabs[activeTabIndex].name));
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
            {openTabs.map((tab, index) => {
              const isActiveTab = index === activeTabIndex;
              return (
                <PanelWrapper
                  key={tab.name}
                  tab={tab}
                  isActiveTab={isActiveTab}
                />
              );
            })}
          </TabPanels>
        </Tabs>
      )}
    </HStack>
  );
};

export default Workspace;
