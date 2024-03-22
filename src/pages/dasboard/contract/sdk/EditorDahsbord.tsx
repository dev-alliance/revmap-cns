/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
import React, {
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import {
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  Box,
  Button,
  Typography,
  Divider,
  Tooltip,
  TextField,
  Menu,
  MenuItem,
  Card,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AdjustIcon from "@mui/icons-material/Adjust";
import ApprovalIcon from "@mui/icons-material/CheckCircle";
import { useForm, Controller } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import OverView from "@/pages/dasboard/contract/sdk/OverView";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ApprovalsComp from "@/pages/dasboard/contract/sdk/ApprovalsComp";
import TaskIcon from "@mui/icons-material/Task";
import ClauseComp from "@/pages/dasboard/contract/sdk/ClauseComp";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Attachement from "@/pages/dasboard/contract/sdk/Attachement";

import TimelineIcon from "@mui/icons-material/Timeline";
import TimelineComp from "@/pages/dasboard/contract/sdk/TimelineComp";
import HistoryIcon from "@mui/icons-material/History";
import LifeSycle from "@/pages/dasboard/contract/sdk/LifeSycle";
import ShareIcon from "@mui/icons-material/Share";
import ShareComp from "@/pages/dasboard/contract/sdk/ShareComp";
import ChatIcon from "@mui/icons-material/Chat";
import Discussion from "@/pages/dasboard/contract/sdk/Discussion";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DrawIcon from "@mui/icons-material/Draw";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Inject,
} from "@syncfusion/ej2-react-documenteditor";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-react-documenteditor/styles/material.css";
import SyncFesion from "@/pages/dasboard/contract/sdk/SyncFesion";
import { Link, useLocation } from "react-router-dom";
import SignatureDialog from "@/pages/dasboard/contract/sdk/SignatureDialog";
import QuickSign from "@/pages/dasboard/contract/sdk/QuickSign";
import { ContractContext } from "@/context/ContractContext";
import OpenSignatureDialog from "@/pages/dasboard/contract/sdk/OpenSignatureDialog";
import { debounce } from "lodash";
import { Close, PushPin } from "@mui/icons-material";

interface Module {
  icon: ReactNode;
  content?: ReactNode;
}

const MyComponent: React.FC = () => {
  const location = useLocation();
  const { setOpenDocoment, sidebarExpanded, setSidebarExpanded } =
    useContext(ContractContext);
  // const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const { signatories, setSignatories, selectedModule, setSelectedModule } =
    useContext(ContractContext);
  const { control, handleSubmit } = useForm();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const handlePinClick = () => {
    setIsPinned(!isPinned); // Toggle the pinned state
    setSidebarExpanded(true); // Ensure sidebar is expanded when pinning
  };

  const toggleSidebar = () => {
    if (!isPinned) {
      setSidebarExpanded((prev: any) => !prev);
      // Only allow toggling if not pinned
    }
  };

  const inputWidth =
    inputValue.length > 0 ? `${Math.max(100, inputValue.length * 8)}px` : "70%";

  const handleInputChange = useCallback(
    debounce((value: any) => {
      setInputValue(value);
    }, 100),
    []
  );

  useEffect(() => {
    if (location.pathname === "/dashboard/editor-dahsbord/open") {
      setOpenDocoment(true);
      console.log("ok");
    }
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const modules: Record<string, Module> = {
    overview: {
      icon: (
        <Tooltip title="Overview">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="23"
              height="22.9202"
              fill="currentColor"
              stroke="currentColor"
            />
            <g clip-path="url(#clip0_4158_11401)">
              <path
                d="M12.0007 18.6044C15.6825 18.6044 18.6673 15.6296 18.6673 11.9599C18.6673 8.29027 15.6825 5.31543 12.0007 5.31543C8.31875 5.31543 5.33398 8.29027 5.33398 11.9599C5.33398 15.6296 8.31875 18.6044 12.0007 18.6044Z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 9.30176V11.9596"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 14.6172H12.0067"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_4158_11401">
                <rect
                  width="16"
                  height="15.9468"
                  fill="currentColor"
                  transform="translate(4 3.98633)"
                />
              </clipPath>
            </defs>
          </svg>
        </Tooltip>
      ),
      content: <OverView />,
    },
    quickSign: {
      icon: (
        <Tooltip title="eSign">
          {/* <img src={writingIcon} alt="Logo" style={{ width: '5%' }} /> */}
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="1.30078"
              width="23"
              height="22.9202"
              fill="currentColor"
              stroke="currentColor"
            />
            <path
              d="M9.89648 20.7344H20.0001"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.4277 10.8544C4.52774 9.99543 4.13272 9.47044 4.01552 8.20962C3.90444 7.01468 4.40081 5.78259 5.14707 5.1532C6.18486 4.27795 7.41719 5.10143 8.10631 6.26239C8.85308 7.52048 9.49883 11.1574 9.54823 12.7172C9.60433 14.4881 9.34637 16.0971 8.68262 17.6364C8.22737 18.6921 7.5547 19.9367 6.65939 20.3582C5.84802 20.7403 4.96631 20.5979 4.80301 19.3054C4.60286 17.7212 5.15436 16.1778 5.75727 14.8686C6.55665 13.1328 7.56614 11.6957 8.9642 10.8544C14.3553 7.61052 11.1718 18.0559 12.9598 18.0559C14.7477 18.0559 14.8632 12.9245 16.1166 13.7448C17.3701 14.565 14.9737 19.6593 19.4591 16.44"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Tooltip>
      ),
      content: <QuickSign />,
    },
    approval: {
      icon: (
        <Tooltip title="Approvals">
          {/* <img src={userIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.901367"
              width="23"
              height="22.9202"
              fill="currentColor"
              stroke="currentColor"
            />
            <path
              d="M14.666 18.3412V17.0123C14.666 16.3074 14.3851 15.6314 13.885 15.1329C13.3849 14.6345 12.7066 14.3545 11.9993 14.3545H7.33268C6.62544 14.3545 5.94716 14.6345 5.44706 15.1329C4.94697 15.6314 4.66602 16.3074 4.66602 17.0123V18.3412"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.66667 11.6965C11.1394 11.6965 12.3333 10.5065 12.3333 9.03866C12.3333 7.5708 11.1394 6.38086 9.66667 6.38086C8.19391 6.38086 7 7.5708 7 9.03866C7 10.5065 8.19391 11.6965 9.66667 11.6965Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.334 11.6971L16.6673 13.026L19.334 10.3682"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Tooltip>
      ),
      content: <ApprovalsComp />,
    },
    clause: {
      icon: (
        <Tooltip title="Clause">
          {/* <img src={clipboardIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.702148"
              width="23"
              height="22.9202"
              fill="currentColor"
              stroke="currentColor"
            />
            <path
              d="M10.0118 18.8066H7.83268C7.39065 18.8066 6.96673 18.6316 6.65417 18.32C6.34161 18.0085 6.16602 17.586 6.16602 17.1454V7.1787C6.16602 6.73814 6.34161 6.31563 6.65417 6.00411C6.96673 5.69259 7.39065 5.51758 7.83268 5.51758H14.4993C14.9414 5.51758 15.3653 5.69259 15.6779 6.00411C15.9904 6.31563 16.166 6.73814 16.166 7.1787V13.8232M13.666 17.976L15.3327 19.6371L18.666 16.3149M9.49935 8.83982H12.8327M9.49935 12.1621H11.166"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Tooltip>
      ),
      content: <ClauseComp />,
    },
    attachement: {
      icon: (
        <Tooltip title="Attachement">
          {/* <img src={attachIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.501953"
              width="23"
              height="22.9202"
              fill="currentColor"
              stroke="currentColor"
            />
            <path
              d="M15.955 17.2663V13.4491C15.955 13.1825 16.0616 12.9268 16.2512 12.7383C16.4408 12.5498 16.698 12.4439 16.9662 12.4439C17.2344 12.4439 17.4916 12.5498 17.6812 12.7383C17.8708 12.9268 17.9773 13.1825 17.9773 13.4491V17.8869C17.9824 18.1541 17.9338 18.4197 17.8344 18.668C17.735 18.9164 17.5868 19.1425 17.3985 19.3333C17.2102 19.524 16.9855 19.6756 16.7376 19.779C16.4897 19.8824 16.2235 19.9357 15.9547 19.9357C15.6858 19.9357 15.4196 19.8824 15.1717 19.779C14.9238 19.6756 14.6991 19.524 14.5108 19.3333C14.3225 19.1425 14.1743 18.9164 14.0749 18.668C13.9755 18.4197 13.927 18.1541 13.932 17.8869V13.0143C13.932 12.2144 14.2517 11.4472 14.8207 10.8815C15.3897 10.3158 16.1615 9.99805 16.9662 9.99805C17.7709 9.99805 18.5427 10.3158 19.1117 10.8815C19.6807 11.4472 20.0004 12.2144 20.0004 13.0143V17.2663"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.6441 17.7726H5.06662C4.78374 17.7726 4.51244 17.6609 4.31241 17.462C4.11238 17.2632 4 16.9935 4 16.7123V5.04861C4 4.7674 4.11238 4.4977 4.31241 4.29885C4.51244 4.09999 4.78374 3.98828 5.06662 3.98828H12.6247C12.9074 3.98834 13.1785 4.09996 13.3785 4.29861L15.4207 6.32879C15.6205 6.52756 15.7328 6.79707 15.7329 7.07809V7.92635"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Tooltip>
      ),
      content: <Attachement />,
    },
    timeLine: {
      icon: (
        <Tooltip title="TimeLine">
          {/* <img src={timelineIcon} alt="Logo" style={{ width: "5%" }} /> */}
          <svg
            width="28"
            height="24"
            viewBox="0 0 28 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.86957 12C4.86957 13.332 3.78609 14.4 2.43478 14.4C1.09565 14.4 0 13.332 0 12C0 10.68 1.09565 9.6 2.43478 9.6C3.78609 9.6 4.86957 10.68 4.86957 12ZM3.65217 0V7.2H1.21739V0H3.65217ZM1.21739 24V16.8H3.65217V24H1.21739ZM28 4.8V19.2C28 20.532 26.9165 21.6 25.5652 21.6H10.9565C9.61739 21.6 8.52174 20.532 8.52174 19.2V14.4L6.08696 12L8.52174 9.6V4.8C8.52174 3.468 9.61739 2.4 10.9565 2.4H25.5652C26.9165 2.4 28 3.468 28 4.8ZM25.5652 4.8H10.9565V10.596L9.53217 12L10.9565 13.404V19.2H25.5652V4.8ZM13.3913 8.4H23.1304V10.8H13.3913V8.4ZM13.3913 13.2H20.6957V15.6H13.3913V13.2Z"
              fill="currentColor"
            />
          </svg>
        </Tooltip>
      ),
      content: <TimelineComp />,
    },
    lifeSycle: {
      icon: (
        <Tooltip title="Lifecycle">
          {/* <img src={lifecycleIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="23"
              height="22.9202"
              fill="currentColor"
              stroke="currentColor"
            />
            <path
              d="M10.334 11.9997C10.334 12.4417 10.5096 12.8656 10.8221 13.1782C11.1347 13.4907 11.5586 13.6663 12.0007 13.6663C12.4427 13.6663 12.8666 13.4907 13.1792 13.1782C13.4917 12.8656 13.6673 12.4417 13.6673 11.9997C13.6673 11.5576 13.4917 11.1337 13.1792 10.8212C12.8666 10.5086 12.4427 10.333 12.0007 10.333C11.5586 10.333 11.1347 10.5086 10.8221 10.8212C10.5096 11.1337 10.334 11.5576 10.334 11.9997Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.4713 7.99911C15.6611 7.09364 14.5951 6.45549 13.4143 6.16908C12.2335 5.88267 10.9936 5.9615 9.85861 6.39514C8.7236 6.82878 7.74699 7.5968 7.05799 8.59758C6.36898 9.59836 6.00005 10.7847 6 11.9998V12.5018"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.5293 16.0013C8.33946 16.9068 9.40541 17.5449 10.5861 17.8313C11.7668 18.1178 13.0067 18.039 14.1417 17.6054C15.2767 17.1718 16.2533 16.404 16.9424 15.4032C17.6314 14.4026 18.0004 13.2163 18.0006 12.0013V11.502"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.5 13L18 11.5L19.5 13"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.5 11L6 12.5L4.5 11"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Tooltip>
      ),
      content: <LifeSycle />,
    },
    // shere: {
    //   icon: <ShareIcon />,
    //   content: <ShareComp />,
    // },
    discussion: {
      icon: (
        <Tooltip title="discussion">
          {/* <img src={commentIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.75 25C8.41848 25 8.10054 24.8683 7.86612 24.6339C7.6317 24.3995 7.5 24.0815 7.5 23.75V20H2.5C1.83696 20 1.20107 19.7366 0.732233 19.2678C0.263392 18.7989 0 18.163 0 17.5V2.5C0 1.1125 1.125 0 2.5 0H22.5C23.163 0 23.7989 0.263392 24.2678 0.732233C24.7366 1.20107 25 1.83696 25 2.5V17.5C25 18.163 24.7366 18.7989 24.2678 19.2678C23.7989 19.7366 23.163 20 22.5 20H14.875L10.25 24.6375C10 24.875 9.6875 25 9.375 25H8.75ZM10 17.5V21.35L13.85 17.5H22.5V2.5H2.5V17.5H10ZM5 6.25H20V8.75H5V6.25ZM5 11.25H16.25V13.75H5V11.25Z"
              fill="currentColor"
            />
          </svg>
        </Tooltip>
      ),
      content: <Discussion />,
    },

    share: {
      icon: (
        <Tooltip title="share">
          {/* <img src={commentIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="23"
            height="19"
            viewBox="0 0 23 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23 8.86667L14.0556 0V5.06667C5.11111 6.33333 1.27778 12.6667 0 19C3.19444 14.5667 7.66667 12.54 14.0556 12.54V17.7333L23 8.86667Z"
              fill="currentColor"
            />
          </svg>
        </Tooltip>
      ),
      content: <Discussion />,
    },

    // Add more modules as needed
  };

  const handleModuleClick = (moduleName: string) => {
    setSelectedModule(moduleName);
  };

  return (
    <>
      <Box sx={{ display: "flex", width: "100%", height: "87vh" }}>
        <Box
          sx={{
            flexGrow: 1,
            pr: 1,
            height: "calc(100vh - 64px)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              py: 2,
              pr: 3,
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex" }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <TextField
                  placeholder="Untitled document"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      width: inputWidth, // Apply dynamic width
                      "::after": {
                        borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                      },
                      "::before": {
                        borderBottom: "none !important", // Hides the underline
                      },
                      ":hover:not(.Mui-disabled)::before": {
                        borderBottom: "none !important", // Ensures underline stays hidden on hover
                      },
                      "input:focus + fieldset": {
                        border: "none", // Optional: for outlined variant if ever used
                      },
                      "::placeholder": {
                        fontSize: "0.55rem",
                      },
                      input: {
                        fontSize: "0.875rem",
                        "&:focus": {
                          // Shows the underline when the input is focused
                          borderBottom: "2px solid", // Adjust color as needed
                        },
                      },
                    },
                  }}
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                />

                <Button
                  sx={{ ml: 2, textTransform: "none" }}
                  variant="outlined"
                >
                  Draft
                </Button>
              </Box>
            </div>
            <div>
              {/* <Box
                sx={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "green",
                  color: "#FFFFFF",
                  ml: "-13px",
                  fontSize: "10px",
                  mb: "-32px",
                }}
              >
                <Typography>pk</Typography>
              </Box>
              <Tooltip
                title={
                  ""
                  // user?.role?.permissions?.create_clauses
                  //   ? ""
                  //   : "You have no permission"
                }
                arrow
              >
                <span>
                  <Button
                    sx={{ ml: 2, textTransform: "none" }}
                    variant="contained"
                    color="success"
                  >
                    Owner
                  </Button>
                </span>
              </Tooltip> */}
              <Button
                sx={{ ml: 2, textTransform: "none" }}
                variant="outlined"
                color="success"
                onClick={handleClick}
              >
                <AddIcon /> Share
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ marginLeft: "-7rem", marginTop: "0.5rem" }}
              >
                <Card sx={{ m: 1.5, backgroundColor: "#9FBFC" }}>
                  <MenuItem onClick={handleClose}>
                    <Box
                      sx={{ display: "flex", alignItems: "center" }}
                      onClick={() => handleOpenDialog()}
                    >
                      <DrawIcon sx={{ color: "blue" }} />
                      {/* Replace with your logo path */}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1">
                          Add signatory
                        </Typography>
                        <Typography variant="body2">
                          Can sign and receive a copy of the document
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>

                  <MenuItem onClick={handleClose}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonAddAltIcon sx={{ color: "blue" }} />
                      {/* Replace with your logo path */}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1">
                          Add collaborator
                        </Typography>
                        <Typography variant="body2">
                          Collaborator can view, edit and comment.
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                </Card>
              </Menu>
            </div>
          </Box>
          <Divider />
          <SyncFesion></SyncFesion>

          {/* <DocumentEditorContainerComponent
          height="720"
          enableToolbar={true}
          serviceUrl={
            "https://services.syncfusion.com/js/production/api/documenteditor/"
          }
        >
          {" "}
          <Inject services={[Toolbar]}></Inject>
        </DocumentEditorContainerComponent> */}
        </Box>

        <Box
          sx={{
            width: sidebarExpanded ? 320 : 55, // Adjust width based on sidebarExpanded state
            flexShrink: 0,
            display: "flex",
            flexDirection: "column", // Typically, card content is laid out vertically
            height: "87vh",
            overflowY: "auto",
            backgroundColor: "#fff", // Cards usually have a solid background color
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.05)", // Adds a subtle shadow similar to Material-UI cards
            borderRadius: "4px", // Card-like elements often have rounded corners
            transition: "box-shadow 0.3s", // Smooth transition for the shadow, makes interaction more lively
            "&:hover": {
              boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover for a touch of interactivity
            },
          }}
        >
          <Grid container>
            <Grid
              item
              xs={2}
              sx={{
                height: "85vh",
                borderRight: sidebarExpanded ? "1px solid #E0E0E0" : "none", // Adjusted border color for a more subtle look
              }}
            >
              <List>
                {Object.keys(modules).map((key) => (
                  <ListItemButton
                    sx={{ mb: 2.5, width: "100%" }}
                    key={key}
                    selected={selectedModule === key}
                    onClick={() => {
                      if (key === "toggle") {
                        toggleSidebar();
                      } else {
                        handleModuleClick(key);
                        if (!sidebarExpanded) {
                          setSidebarExpanded(true);
                        }
                      }
                    }}
                  >
                    <ListItemIcon>{modules[key].icon}</ListItemIcon>
                  </ListItemButton>
                ))}
              </List>
            </Grid>
            <Grid item xs={10}>
              {sidebarExpanded && selectedModule !== "toggle" && (
                <Box sx={{ position: "relative", padding: 2 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 0,
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {/* Always show the pin icon, change color when pinned */}
                    <PushPin
                      onClick={handlePinClick}
                      sx={{
                        cursor: "pointer",
                        color: isPinned ? "primary.main" : "action.active", // Change color when pinned
                      }}
                    />
                    {/* Close Icon */}
                    <Close
                      onClick={toggleSidebar}
                      sx={{ cursor: "pointer", color: "action.active" }}
                    />
                  </Box>
                  {modules[selectedModule].content}
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <SignatureDialog open={openDialog} onClosePre={handleCloseDialog} />
      <OpenSignatureDialog />
    </>
  );
};

export default MyComponent;
