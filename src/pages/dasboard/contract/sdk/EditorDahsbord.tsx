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
import logo from "@/assets/logo.jpg";
import about_icon from "@/assets/about_icon.png";
import attachments from "@/assets/attachments.png";
import clauses from "@/assets/clauses.png";
import { CloudDownload as DownloadIcon } from "@mui/icons-material";
import comments from "@/assets/comments.png";
import life_sycle from "@/assets/life_sycle.png";
import sign_smal from "@/assets/sign_smal.png";
import timeline from "@/assets/timeline.png";
import approval from "@/assets/approval_icon.png";
import { debounce } from "lodash";

// icon for sidebar

import dangerIcon from "../../../../assets/leftsideicon/danger.png";
import writingIcon from "../../../../assets/leftsideicon/writing.png";
import userIcon from "../../../../assets/leftsideicon/user.png";
import clipboardIcon from "../../../../assets/leftsideicon/clipboard3.png";
import attachIcon from "../../../../assets/leftsideicon/attached.png";
import timelineIcon from "../../../../assets/leftsideicon/timing.png";
import lifecycleIcon from "../../../../assets/leftsideicon/lifecyle2.png";
import commentIcon from "../../../../assets/leftsideicon/comment.png";

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

  // Calculate width based on input length. Adjust the multiplier as needed for your specific font and design.
  // You might also want to set a minimum and maximum width.
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
    toggle: {
      icon: <MenuIcon />,
    },
    overview: {
      icon: (
        <Tooltip title="Overview">
          {/* <img src={dangerIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 27.5C21.9036 27.5 27.5 21.9036 27.5 15C27.5 8.09644 21.9036 2.5 15 2.5C8.09644 2.5 2.5 8.09644 2.5 15C2.5 21.9036 8.09644 27.5 15 27.5Z"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 10V15"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 20H15.0125"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
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
            width="31"
            height="31"
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.1572 11.7793L21.3136 11.3335L25.9846 13.0266L25.8281 13.4725L21.1572 11.7793Z"
              fill="currentColor"
            />
            <path
              d="M17.9966 20.7783C17.5307 22.1139 18.2555 24.8062 18.4626 25.5318L18.1623 26.3837C18.0795 26.6256 18.2037 26.899 18.4419 26.9936C18.4937 27.0147 18.5454 27.0252 18.5972 27.0252C18.7836 27.0252 18.9699 26.9095 19.0321 26.7097L19.3324 25.8579C19.9536 25.4372 22.1902 23.8176 22.6561 22.4821L25.5035 14.3738L20.8337 12.6807L17.9966 20.7783Z"
              fill="currentColor"
            />
            <path
              d="M30.6904 3.18335C30.4523 3.09921 30.183 3.22541 30.0898 3.46729L29.9967 3.73021L29.3236 3.48833C29.7689 2.07913 29.1372 0.585704 27.8741 0.133503C26.5902 -0.329227 25.1302 0.448996 24.6332 1.87923L21.6201 10.4397L26.2899 12.1328L28.2676 6.50643L28.9406 6.74831L26.8698 12.6587C26.7869 12.9005 26.9112 13.174 27.1493 13.2686C27.2011 13.2897 27.2529 13.3002 27.3046 13.3002C27.491 13.3002 27.6774 13.1845 27.7395 12.9847L29.9761 6.62213L30.2556 5.82287L30.9701 3.79321C31.0633 3.54081 30.9287 3.27789 30.6905 3.18324L30.6904 3.18335ZM28.5885 5.61271L28.9302 4.64523L29.0234 4.38232L29.6964 4.6242L29.4479 5.32881L29.2615 5.85464L28.5885 5.61271Z"
              fill="currentColor"
            />
            <path
              d="M15.4387 28.8017C15.3352 28.8017 15.242 28.7807 15.1799 28.7491C14.8589 28.6124 14.7347 28.2654 14.6104 27.9394C14.424 27.4556 14.3205 27.2768 14.1134 27.2768C13.6889 27.2768 13.1712 27.6239 12.6638 27.9604C12.1772 28.2864 11.6801 28.6229 11.1314 28.7491C10.8414 28.8228 10.5515 28.7491 10.3237 28.5598C9.88884 28.1918 9.72317 27.3715 9.66105 26.6774C8.35643 27.6975 5.58143 29.4222 2.47518 28.5072C1.08773 28.0971 0.290439 26.7194 0.217923 24.6161C0.114376 21.2823 2.00923 16.0661 4.09041 15.3089C7.03098 14.2362 8.81197 18.2115 8.88449 18.3798C8.98803 18.6217 8.88449 18.8951 8.64634 19.0003C8.40819 19.1054 8.13897 19.0003 8.03544 18.7584C8.01473 18.7058 6.5341 15.4246 4.41146 16.1923C3.01359 16.7076 1.05661 21.2087 1.16018 24.5845C1.19124 25.7519 1.50187 27.2242 2.74435 27.5922C6.43053 28.6859 9.75423 25.3627 9.78528 25.3311C9.91989 25.1944 10.127 25.1523 10.303 25.2365C10.479 25.3101 10.5929 25.4889 10.5826 25.6887C10.5515 26.6352 10.7172 27.6868 10.9243 27.834H10.9346C11.3074 27.7499 11.7215 27.4659 12.1564 27.182C12.7673 26.7718 13.4092 26.3407 14.1134 26.3407C15.0038 26.3407 15.2938 27.1294 15.4802 27.6131C15.5009 27.6762 15.532 27.7499 15.563 27.8129C15.8736 27.7288 16.1946 27.7288 16.4846 27.7393C16.6813 27.7393 17.0333 27.7499 17.1058 27.6867C17.2922 27.4974 17.5821 27.4974 17.7685 27.6867C17.9549 27.8761 17.9549 28.1705 17.7685 28.3598C17.4268 28.7069 16.9194 28.6963 16.4846 28.6963C16.2154 28.6963 15.9358 28.6858 15.7494 28.77C15.6252 28.7805 15.5217 28.8015 15.4388 28.8015L15.4387 28.8017Z"
              fill="currentColor"
            />
            <path
              d="M24.7369 31.0002H0.465945C0.207085 31.0002 0 30.7899 0 30.527C0 30.264 0.207085 30.0537 0.465945 30.0537H24.7369C24.9958 30.0537 25.2029 30.264 25.2029 30.527C25.2029 30.7899 24.9958 31.0002 24.7369 31.0002Z"
              fill="currentColor"
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
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 26.25V23.75C20 22.4239 19.4732 21.1521 18.5355 20.2145C17.5979 19.2768 16.3261 18.75 15 18.75H6.25C4.92392 18.75 3.65215 19.2768 2.71447 20.2145C1.77678 21.1521 1.25 22.4239 1.25 23.75V26.25"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.625 13.75C13.3864 13.75 15.625 11.5114 15.625 8.75C15.625 5.98858 13.3864 3.75 10.625 3.75C7.86358 3.75 5.625 5.98858 5.625 8.75C5.625 11.5114 7.86358 13.75 10.625 13.75Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21.25 13.75L23.75 16.25L28.75 11.25"
              stroke="currentColor"
              stroke-width="2"
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
            width="27"
            height="21"
            viewBox="0 0 27 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.3 21H2.7C1.98392 21 1.29716 20.7234 0.790812 20.2312C0.284463 19.7389 0 19.0712 0 18.375V2.625C0 1.92881 0.284463 1.26113 0.790812 0.768845C1.29716 0.276562 1.98392 0 2.7 0H24.3C25.0161 0 25.7028 0.276562 26.2092 0.768845C26.7155 1.26113 27 1.92881 27 2.625V18.375C27 19.0712 26.7155 19.7389 26.2092 20.2312C25.7028 20.7234 25.0161 21 24.3 21ZM2.7 2.625V18.375H24.3V2.625H2.7ZM5.4 6.5625H21.6V9.1875H5.4V6.5625ZM5.4 11.8125H18.9V14.4375H5.4V11.8125Z"
              fill="currentColor"
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
            width="21"
            height="29"
            viewBox="0 0 21 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.4375 15.9368C13.7419 16.0555 13.0856 16.2664 12.4688 16.5432V6.59091H14.4375V15.9368ZM7.21875 27.0227C4.31812 27.0227 1.96875 24.6632 1.96875 21.75V5.27273C1.96875 3.45364 3.43875 1.97727 5.25 1.97727C7.06125 1.97727 8.53125 3.45364 8.53125 5.27273V19.1136C8.53125 19.8386 7.94063 20.4318 7.21875 20.4318C6.49687 20.4318 5.90625 19.8386 5.90625 19.1136V6.59091H3.9375V19.1136C3.9375 20.9327 5.4075 22.4091 7.21875 22.4091C7.49438 22.4091 7.75688 22.3695 8.00625 22.3036C8.33438 20.5373 9.22688 18.995 10.5 17.8482V5.27273C10.5 2.35955 8.15063 0 5.25 0C2.34938 0 0 2.35955 0 5.27273V21.75C0 25.7573 3.22875 29 7.21875 29C8.04562 29 8.83313 28.855 9.56812 28.6045C9.14812 28.0641 8.79375 27.4709 8.53125 26.8382C8.09813 26.9436 7.665 27.0227 7.21875 27.0227ZM17.0625 22.4091V18.4545H14.4375V22.4091H10.5V25.0455H14.4375V29H17.0625V25.0455H21V22.4091H17.0625Z"
              fill="currentColor"
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
            width="30"
            height="25"
            viewBox="0 0 30 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.8571 6.94444H15.7143V13.8889L21.8286 17.4167L22.8571 15.7361L17.8571 12.8472V6.94444ZM17.1429 0C13.7329 0 10.4627 1.31696 8.05148 3.66116C5.6403 6.00537 4.28571 9.18479 4.28571 12.5H0L5.65714 18.0972L11.4286 12.5H7.14286C7.14286 9.92151 8.19643 7.44862 10.0718 5.62535C11.9472 3.80208 14.4907 2.77778 17.1429 2.77778C19.795 2.77778 22.3386 3.80208 24.2139 5.62535C26.0893 7.44862 27.1429 9.92151 27.1429 12.5C27.1429 15.0785 26.0893 17.5514 24.2139 19.3746C22.3386 21.1979 19.795 22.2222 17.1429 22.2222C14.3857 22.2222 11.8857 21.125 10.0857 19.3611L8.05714 21.3333C10.3857 23.6111 13.5714 25 17.1429 25C20.5528 25 23.823 23.683 26.2342 21.3388C28.6454 18.9946 30 15.8152 30 12.5C30 9.18479 28.6454 6.00537 26.2342 3.66116C23.823 1.31696 20.5528 0 17.1429 0Z"
              fill="currentColor"
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

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
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
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", // Adds a subtle shadow similar to Material-UI cards
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
                <Box sx={{ padding: 2 }}>{modules[selectedModule].content}</Box>
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
