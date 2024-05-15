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
import Collaburater from "@/pages/dasboard/contract/sdk/Collaburater";
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
import Signature from "@/pages/dasboard/contract/sdk/Signature";
import { ContractContext } from "@/context/ContractContext";
import OpenSignatureDialog from "@/pages/dasboard/contract/sdk/OpenSignatureDialog";
import { debounce } from "lodash";
import { Close, PushPin } from "@mui/icons-material";
import Fields from "@/pages/dasboard/contract/sdk/Fields";

interface Module {
  getIcon: (isSelected: boolean) => JSX.Element;
  icon: ReactNode;
  content?: ReactNode;
}

const MyComponent: React.FC = () => {
  const location = useLocation();
  const { setOpenDocoment, sidebarExpanded, setSidebarExpanded, showBlock } =
    useContext(ContractContext);
  // const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const {
    signatories,
    setSignatories,
    selectedModule,
    setSelectedModule,
    editMode,
    documentName,
    setDucomentName,
  } = useContext(ContractContext);
  const { control, handleSubmit } = useForm();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);

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
    documentName.length > 0
      ? `${Math.max(100, documentName.length * 8)}px`
      : "70%";

  const handleInputChange = useCallback(
    debounce((value: any) => {
      setDucomentName(value);
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
  const modules: Record<string, any> = {
    overview: {
      getIcon: (isSelected: any) => (
        <Tooltip title="Overview">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.2 9.4H14.2V8.4V6V5H13.2H10.8H9.8V6V8.4V9.4H10.8H13.2ZM13.2 19H14.2V18V10.8V9.8H13.2H10.8H9.8V10.8V18V19H10.8H13.2ZM7.79048 1.83733C9.12506 1.28452 10.5555 1 12 1C13.4445 1 14.8749 1.28452 16.2095 1.83733C17.5441 2.39013 18.7567 3.20038 19.7782 4.22183C20.7996 5.24327 21.6099 6.4559 22.1627 7.79048C22.7155 9.12506 23 10.5555 23 12C23 14.9174 21.8411 17.7153 19.7782 19.7782C17.7153 21.8411 14.9174 23 12 23C10.5555 23 9.12506 22.7155 7.79048 22.1627C6.4559 21.6099 5.24327 20.7996 4.22183 19.7782C2.15893 17.7153 1 14.9174 1 12C1 9.08262 2.15893 6.28473 4.22183 4.22183C5.24327 3.20038 6.4559 2.39013 7.79048 1.83733Z"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        </Tooltip>
      ),
      content: <OverView />,
      // isDisabled: showBlock === "uploadTrack",
    },
    signature: {
      getIcon: (isSelected: any) => (
        <Tooltip title="Signature">
          {/* <img src={writingIcon} alt="Logo" style={{ width: '5%' }} /> */}

          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill={isSelected ? "blue" : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.8457 25H25.0001"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.14141 10.1313C1.79156 8.8385 1.19907 8.0484 1.02328 6.15087C0.856674 4.35249 1.60117 2.49819 2.72049 1.55096C4.27707 0.233716 6.12545 1.47305 7.15905 3.22029C8.27915 5.11371 9.2477 10.5873 9.3218 12.9347C9.40593 15.6 9.01902 18.0214 8.02346 20.3381C7.34063 21.9269 6.3317 23.8001 4.98882 24.4345C3.77184 25.0095 2.44938 24.7952 2.20444 22.8499C1.90424 20.4658 2.73142 18.143 3.63573 16.1726C4.83472 13.5603 6.34886 11.3973 8.4458 10.1313C16.5319 5.24922 11.7571 20.9694 14.4388 20.9694C17.1205 20.9694 17.2937 13.2467 19.1737 14.4812C21.0538 15.7157 17.4595 23.3826 24.1872 18.5375"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Tooltip>
      ),
      content: <Signature />,
      isDisabled: showBlock === "uploadTrack",
    },
    share: {
      getIcon: (isSelected: any) => (
        <Tooltip title="Collaborate ">
          {/* <img src={commentIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.5623 1H4.19314C3.34627 1 2.53408 1.33714 1.93525 1.93726C1.33642 2.53737 1 3.35131 1 4.2V23.4C1 23.8243 1.16821 24.2313 1.46763 24.5314C1.76704 24.8314 2.17313 25 2.59657 25H4.11864"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.19336 6.06641H11.9101"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.19336 10.332H9.36625"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.168 10.6V3.4C16.168 2.76348 16.4203 2.15303 16.8694 1.70294C17.3185 1.25286 17.9277 1 18.5628 1C19.198 1 19.8071 1.25286 20.2562 1.70294C20.7054 2.15303 20.9577 2.76348 20.9577 3.4V6.06667H16.168"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M23.3523 21.1182L18.2539 22.1423"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18.7623 16.3494L16.3568 17.3628C16.1687 17.4444 15.9658 17.4865 15.7608 17.4865C15.5558 17.4865 15.3529 17.4444 15.1647 17.3628C14.887 17.2366 14.6506 17.0344 14.4826 16.7794C14.3146 16.5244 14.2219 16.227 14.2152 15.9216C14.2086 15.6161 14.2882 15.3149 14.4448 15.0528C14.6015 14.7907 14.829 14.5783 15.1009 14.4401L17.5064 13.2348C17.803 13.0825 18.1311 13.0021 18.4643 13.0001C18.7158 12.9976 18.9654 13.0447 19.1987 13.1388L24.1162 15.1334"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.92383 22.1848H10.6162L13.8626 24.6595C13.9386 24.7459 14.0309 24.8163 14.1342 24.8668C14.2375 24.9173 14.3497 24.9469 14.4644 24.9539C14.5791 24.9608 14.6941 24.945 14.8027 24.9073C14.9113 24.8696 15.0114 24.8107 15.0972 24.7342L19.6315 20.9795C19.8125 20.833 19.9285 20.621 19.9544 20.3893C19.9803 20.1577 19.914 19.9251 19.7699 19.7422L17.226 16.9795"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14.8233 14.6123L14.5572 14.3883C14.2229 14.168 13.8289 14.0563 13.429 14.0683C13.1856 14.0682 12.9441 14.1116 12.7159 14.1963L8.91602 15.7749"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.38477 22.9842H7.70408C7.86348 22.9929 8.023 22.9699 8.17352 22.9166C8.32405 22.8634 8.4626 22.7809 8.58125 22.6738C8.6999 22.5668 8.79632 22.4374 8.86497 22.293C8.93362 22.1486 8.97317 21.992 8.98134 21.8322V16.1256C8.96212 15.8048 8.81699 15.5047 8.57766 15.2908C8.33833 15.077 8.02426 14.9667 7.70408 14.9842H7.38477"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M24.9477 22.9842H24.6816C24.5222 22.9929 24.3626 22.9699 24.2121 22.9166C24.0616 22.8634 23.923 22.7809 23.8044 22.6738C23.6857 22.5668 23.5893 22.4374 23.5207 22.293C23.452 22.1486 23.4125 21.992 23.4043 21.8322V16.1256C23.4235 15.8048 23.5686 15.5047 23.808 15.2908C24.0473 15.077 24.3614 14.9667 24.6816 14.9842H25.0009"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Tooltip>
      ),
      content: <Collaburater />,
      isDisabled: showBlock === "uploadTrack",
    },
    approval: {
      getIcon: (isSelected: any) => (
        <Tooltip title="Approvals">
          {/* <img src={userIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.998 18.9096L13.4163 18.4117L15.1982 20.5278L15.9642 21.4375L16.7289 20.5267L22.2772 13.9185L22.6945 14.4152L15.9629 22.4438L12.998 18.9096ZM7.852 18.2631L7.30543 18.9091L7.852 19.555L10.1516 22.2727H1V20.3636C1 19.253 1.76735 18.0699 3.39181 17.11C4.98708 16.1674 7.25346 15.5509 9.81233 15.5455L10.1329 15.5675L7.852 18.2631ZM9.84615 1C10.8276 1 11.8103 1.45943 12.5639 2.35005C13.3218 3.24571 13.7692 4.49134 13.7692 5.81818C13.7692 7.14503 13.3218 8.39066 12.5639 9.28632C11.8103 10.1769 10.8276 10.6364 9.84615 10.6364C8.86473 10.6364 7.882 10.1769 7.1284 9.28632C6.37053 8.39066 5.92308 7.14503 5.92308 5.81818C5.92308 4.49134 6.37053 3.24571 7.1284 2.35005C7.882 1.45943 8.86474 1 9.84615 1Z"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        </Tooltip>
      ),
      content: <ApprovalsComp />,
      isDisabled: showBlock === "uploadTrack",
    },
    clause: {
      getIcon: (isSelected: any) => (
        <Tooltip title="Clauses">
          {/* <img src={clipboardIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.2547 1.19687L14.0629 1H14.3474L21.1538 7.98557V8.27758L21.0239 8.14424L14.2547 1.19687ZM12.5385 1V1.89474V8.8421V9.8421H13.5385H20.3077H21.1538V11.7682C20.6813 11.68 20.1934 11.6316 19.6923 11.6316C15.0419 11.6316 11.3077 15.5018 11.3077 20.2105C11.3077 20.7339 11.357 21.2435 11.4468 21.7368H2.46154C1.68109 21.7368 1 21.0817 1 20.2105V2.52632C1 1.65185 1.672 1 2.46154 1H12.5385ZM16.1969 20.1782L17.4376 21.4515L18.1538 22.1866L18.8701 21.4515L22.4994 17.7268L22.6667 17.9355L18.1856 22.5344L16.1365 20.2402L16.1969 20.1782Z"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        </Tooltip>
      ),
      content: <ClauseComp />,
      isDisabled: showBlock === "uploadTrack",
    },
    attachement: {
      getIcon: (isSelected: any) => (
        <Tooltip title="Attachement">
          {/* <img src={attachIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.9333 20.983V15.2384C18.9333 14.8372 19.0931 14.4525 19.3775 14.1688C19.6619 13.8851 20.0477 13.7257 20.4499 13.7257C20.8522 13.7257 21.2379 13.8851 21.5224 14.1688C21.8068 14.4525 21.9666 14.8372 21.9666 15.2384V21.9171C21.9741 22.3192 21.9013 22.7188 21.7522 23.0926C21.6031 23.4663 21.3809 23.8067 21.0984 24.0937C20.8159 24.3808 20.4789 24.6088 20.1071 24.7645C19.7353 24.9202 19.336 25.0003 18.9328 25.0003C18.5295 25.0003 18.1303 24.9202 17.7585 24.7645C17.3866 24.6088 17.0496 24.3808 16.7672 24.0937C16.4847 23.8067 16.2624 23.4663 16.1134 23.0926C15.9643 22.7188 15.8914 22.3192 15.899 21.9171V14.5842C15.899 13.3803 16.3784 12.2257 17.2319 11.3744C18.0854 10.5232 19.243 10.0449 20.4499 10.0449C21.6569 10.0449 22.8145 10.5232 23.668 11.3744C24.5214 12.2257 25.0009 13.3803 25.0009 14.5842V20.983"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.4654 21.7443H2.59983C2.17553 21.7443 1.7686 21.5762 1.46858 21.2769C1.16855 20.9777 1 20.5718 1 20.1486V2.59572C1 2.17251 1.16855 1.76663 1.46858 1.46737C1.7686 1.16812 2.17553 1 2.59983 1H13.9362C14.3602 1.00009 14.7668 1.16806 15.0667 1.46701L18.1299 4.52228C18.4296 4.82142 18.598 5.227 18.5981 5.64992V6.92649"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Tooltip>
      ),
      content: <Attachement />,
      // isDisabled: showBlock === "",
    },
    timeLine: {
      getIcon: (isSelected: any) => (
        <Tooltip title="Audit Trail">
          {/* <img src={timelineIcon} alt="Logo" style={{ width: "5%" }} /> */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.30435 14.4V14.026L8.05895 13.7438L6.54259 12L8.05895 10.2562L8.30435 9.97398V9.6V4.8C8.30435 3.88792 8.91943 3.4 9.3913 3.4H21.913C22.3924 3.4 23 3.88448 23 4.8V19.2C23 20.1155 22.3924 20.6 21.913 20.6H9.3913C8.91943 20.6 8.30435 20.1121 8.30435 19.2V14.4ZM19.7826 13.2V12.2H18.7826H10.4348H9.43478V13.2V15.6V16.6H10.4348H18.7826H19.7826V15.6V13.2ZM21.8696 8.4V7.4H20.8696H10.4348H9.43478V8.4V10.8V11.8H10.4348H20.8696H21.8696V10.8V8.4ZM2.13043 1V6.2H2.04348V1H2.13043ZM2.13043 17.8V23H2.04348V17.8H2.13043ZM2.08696 10.6C2.56328 10.6 3.17391 11.093 3.17391 12C3.17391 12.9155 2.56627 13.4 2.08696 13.4C1.61508 13.4 1 12.9121 1 12C1 11.0965 1.61808 10.6 2.08696 10.6Z"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        </Tooltip>
      ),
      content: <TimelineComp />,
      // isDisabled: showBlock === "",
    },
    lifeSycle: {
      getIcon: (isSelected: any) => (
        <Tooltip title="Lifecycle">
          {/* <img src={lifecycleIcon} alt="Logo" style={{ width: "4%" }} /> */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 12C9.5 12.663 9.76339 13.2989 10.2322 13.7678C10.7011 14.2366 11.337 14.5 12 14.5C12.663 14.5 13.2989 14.2366 13.7678 13.7678C14.2366 13.2989 14.5 12.663 14.5 12C14.5 11.337 14.2366 10.7011 13.7678 10.2322C13.2989 9.76339 12.663 9.5 12 9.5C11.337 9.5 10.7011 9.76339 10.2322 10.2322C9.76339 10.7011 9.5 11.337 9.5 12Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18.707 5.99866C17.4917 4.64046 15.8927 3.68323 14.1215 3.25362C12.3503 2.824 10.4904 2.94225 8.78792 3.59271C7.0854 4.24317 5.62049 5.3952 4.58698 6.89637C3.55347 8.39754 3.00007 10.1771 3 11.9997V12.7527"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.29297 18.001C6.50821 19.3592 8.10714 20.3164 9.87823 20.746C11.6493 21.1757 13.5091 21.0575 15.2116 20.4072C16.9141 19.7568 18.379 18.605 19.4126 17.1039C20.4462 15.6029 20.9997 13.8235 21 12.001V11.252"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18.75 13.499L21 11.249L23.25 13.499"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.25 10.499L3 12.749L0.75 10.499"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Tooltip>
      ),
      content: <LifeSycle />,
      // isDisabled: showBlock === "",
    },
    // shere: {
    //   icon: <ShareIcon />,
    //   content: <ShareComp />,
    // },
    fields: {
      getIcon: (isSelected: any) => (
        <Tooltip title="Fields">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 6V7H18H23V17H18H17V18V20.4C17 20.9835 17.2318 21.5431 17.6444 21.9556C18.0569 22.3682 18.6165 22.6 19.2 22.6H20.6V23H18.6C18.5596 23 18.4655 22.9895 18.3322 22.9489C18.2039 22.9097 18.0731 22.8528 17.9618 22.7869C17.846 22.7184 17.7847 22.6601 17.7628 22.6333C17.7595 22.6291 17.7581 22.6271 17.7581 22.6272C17.7583 22.6273 17.8 22.687 17.8 22.8H16.8H15.8C15.8 22.6868 15.8418 22.6271 15.8419 22.6272C15.8419 22.6272 15.8405 22.6292 15.8372 22.6333C15.8153 22.6601 15.754 22.7184 15.6382 22.7869C15.5269 22.8528 15.3961 22.9097 15.2678 22.9489C15.1345 22.9895 15.0404 23 15 23H13V22.6H14.4C14.9835 22.6 15.5431 22.3682 15.9556 21.9556C16.3682 21.5431 16.6 20.9835 16.6 20.4V3.6C16.6 3.01652 16.3682 2.45694 15.9556 2.04437C15.5431 1.63179 14.9835 1.4 14.4 1.4H13V1H15C15.0404 1 15.1345 1.01047 15.2678 1.05114C15.3961 1.0903 15.5269 1.14722 15.6382 1.21308C15.754 1.28164 15.8153 1.33994 15.8372 1.36675C15.8405 1.37082 15.8419 1.37284 15.8419 1.37284C15.8418 1.37285 15.8 1.31321 15.8 1.2H16.8H17.8C17.8 1.3132 17.7582 1.37284 17.7581 1.37284C17.7581 1.37284 17.7595 1.37082 17.7628 1.36675C17.7847 1.33994 17.846 1.28164 17.9618 1.21308C18.0731 1.14722 18.2039 1.0903 18.3322 1.05114C18.4655 1.01047 18.5596 1 18.6 1H20.6V1.4H19.2C18.6165 1.4 18.0569 1.63179 17.6444 2.04436L18.3515 2.75147L17.6444 2.04437C17.2318 2.45695 17 3.01652 17 3.6V6ZM1 7H12.2V7.4H2.4H1.4V8.4V15.6V16.6H2.4H12.2V17H1V7ZM21.6 16.6H22.6V15.6V8.4V7.4H21.6H18H17V8.4V15.6V16.6H18H21.6Z"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        </Tooltip>
      ),
      content: <Fields />,
      isDisabled: showBlock === "uploadTrack" || editMode === false,
    },

    // Add more modules as needed
  };

  const handleModuleClick = (moduleName: string) => {
    setSelectedModule(moduleName);
  };

  return (
    <>
      <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
        <Box
          sx={{
            flexGrow: 1,
            height: "calc(100vh - 64px)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              py: 1,
              pr: 3,
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* <div className="flex p-2 bg-gray-200">
                <div className="flex items-center">
                  <div className="px-4 py-1 bg-white border border-r-0 border-gray-400">Draft</div>
                  <div className="w-4 h-4 bg-white transform rotate-45 -translate-x-2 border border-gray-400 border-t-0 border-l-0"></div>
                </div>

                <div className="flex items-center">
                  <div className="px-4 py-1 bg-white border border-r-0 border-gray-400">Review</div>
                  <div className="w-4 h-4 bg-white transform rotate-[315deg] -translate-x-2 border border-gray-400 border-t-0 border-l-0"></div>
                </div>

                <div className="flex items-center">
                  <div className="px-4 py-1 bg-white border border-r-0 border-gray-400">Signing</div>
                  <div className="w-4 h-4 bg-white transform rotate-45 -translate-x-2 border border-gray-400 border-t-0 border-l-0"></div>
                </div>

                <div className="flex items-center">
                  <div className="px-4 py-1 bg-white border border-r-0 border-gray-400">Signed</div>
                  <div className="w-4 h-4 bg-white transform rotate-45 -translate-x-2 border border-gray-400 border-t-0 border-l-0"></div>
                </div>

                <div className="flex items-center">
                  <div className="px-4 py-1 bg-white border border-gray-400">Active</div>
                </div>
              </div> */}

            {/* <div> */}
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
            {/* <Button
                sx={{ ml: 2, textTransform: "none" }}
                variant="outlined"
                color="success"
                onClick={handleClick}
              >
                <AddIcon /> Share
              </Button> */}
            {/* <Menu
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
            {/* <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1">
                          Add signatory
                        </Typography>
                        <Typography variant="body2">
                          Can sign and receive a copy of the document
                        </Typography>
                      </Box> */}
            {/* </Box>
                  </MenuItem> */}

            {/* <MenuItem onClick={handleClose}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonAddAltIcon sx={{ color: "blue" }} />
                      {/* Replace with your logo path */}
            {/* <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1">
                          Add collaborator
                        </Typography>
                        <Typography variant="body2">
                          Collaborator can view, edit and comment.
                        </Typography>
                      </Box> */}
            {/* </Box> */}
            {/* </MenuItem>  */}
            {/* </Card> */}
            {/* </Menu> */}
            {/* </div> */}
          </Box>

          <SyncFesion></SyncFesion>
        </Box>

        <Box
          sx={{
            width: sidebarExpanded ? 320 : 50, // Adjust width based on sidebarExpanded state
            flexShrink: 0,
            display: "flex",
            flexDirection: "column", // Typically, card content is laid out vertically
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#fff", // Cards usually have a solid background color
            // boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.05)", // Adds a subtle shadow similar to Material-UI cards
            transition: "box-shadow 0.3s", // Smooth transition for the shadow, makes interaction more lively
            "&:hover": {
              boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover for a touch of interactivity
            },
          }}
        >
          <Grid container>
            <Grid
              md={sidebarExpanded ? 2 : 0}
              sx={{
                height: sidebarExpanded ? "100vh" : "100vh",
                borderRight: sidebarExpanded ? "1px solid #E0E0E0" : "none",
                background: "#174B8B",
                overflow: "hidden",
              }}
            >
              <List>
                {Object.keys(modules).map((key) => (
                  <ListItemButton
                    key={key}
                    sx={{
                      mb: 2.5,
                      mt: 1,
                      width: "100%",
                      background: selectedModule === key ? "#ffffff" : "none",
                    }}
                    onClick={() => {
                      // Ignore click if the module is disabled
                      if (modules[key].isDisabled) return;

                      if (key === "toggle") {
                        toggleSidebar();
                      } else {
                        handleModuleClick(key);
                        if (!sidebarExpanded) {
                          setSidebarExpanded(true);
                        }
                      }
                    }}
                    style={{
                      cursor: modules[key].isDisabled
                        ? "not-allowed"
                        : "pointer",
                      color: modules[key]?.isDisabled ? "#D3D3D3" : "inherit",
                      marginBottom: "20px",
                    }}
                  >
                    <ListItemIcon>
                      {modules[key]?.getIcon ? (
                        modules[key].getIcon(selectedModule === key)
                      ) : (
                        <span>No icon defined</span>
                      )}
                    </ListItemIcon>
                  </ListItemButton>
                ))}
              </List>
            </Grid>
            <Grid item md={10}>
              {sidebarExpanded && selectedModule !== "toggle" && (
                <Box sx={{ position: "relative", padding: 2 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      overflow: "auto",
                    }}
                  >
                    {/* Always show the pin icon, change color when pinned */}
                    <Tooltip
                      title={isPinned ? "Unpin" : "Pin"}
                      placement="left"
                    >
                      <PushPin
                        onClick={handlePinClick}
                        sx={{
                          cursor: "pointer",
                          color: isPinned ? "primary.main" : "action.active", // Change color when pinned
                        }}
                      />
                    </Tooltip>
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
