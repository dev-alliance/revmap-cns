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
import { AnyAction } from "@reduxjs/toolkit";
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
    inputValue.length > 0 ? `${Math.max(100, inputValue.length * 6)}px` : "70%";

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
          <img src={about_icon} alt="Logo" style={{ width: "30%" }} />
        </Tooltip>
      ),
      content: <OverView />,
    },
    quickSign: {
      icon: (
        <Tooltip title="eSign">
          <img src={sign_smal} alt="Logo" style={{ width: "30%" }} />
        </Tooltip>
      ),
      content: <QuickSign />,
    },
    approval: {
      icon: (
        <Tooltip title="Approvals">
          <img src={approval} alt="Logo" style={{ width: "30%" }} />
        </Tooltip>
      ),
      content: <ApprovalsComp />,
    },
    clause: {
      icon: (
        <Tooltip title="Clause">
          <img src={clauses} alt="Logo" style={{ width: "30%" }} />
        </Tooltip>
      ),
      content: <ClauseComp />,
    },
    attachement: {
      icon: (
        <Tooltip title="Attachement">
          <img src={attachments} alt="Logo" style={{ width: "30%" }} />
        </Tooltip>
      ),
      content: <Attachement />,
    },
    timeLine: {
      icon: (
        <Tooltip title="TimeLine">
          <img src={timeline} alt="Logo" style={{ width: "30%" }} />
        </Tooltip>
      ),
      content: <TimelineComp />,
    },
    lifeSycle: {
      icon: (
        <Tooltip title="Lifecycle">
          <img src={life_sycle} alt="Logo" style={{ width: "30%" }} />
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
          <img src={comments} alt="Logo" style={{ width: "30%" }} />
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
                  placeholder="Add contract name"
                  variant="standard"
                  InputProps={{
                    sx: {
                      width: inputWidth, // Apply dynamic width
                      "::placeholder": {
                        fontSize: "0.55rem",
                        // textAlign: "center",
                      },
                      input: {
                        fontSize: "0.875rem",
                        // textAlign: "center",
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
                  Drafttttttttttttt
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
            width: sidebarExpanded ? 320 : 55,
            flexShrink: 0,
            display: "flex",
            border: "1px solid #BEBEBE",
            height: "87vh",
            overflowY: "scroll",
          }}
        >
          <Grid container>
            <Grid
              item
              xs={2}
              sx={{
                borderRight: sidebarExpanded ? "1px solid #BEBEBE" : "none",
              }}
            >
              <List>
                {Object.keys(modules).map((key) => (
                  <ListItemButton
                    sx={{ mb: 2.5, width: "100%" }}
                    key={key}
                    selected={selectedModule === key}
                    onClick={() =>
                      key === "toggle"
                        ? toggleSidebar()
                        : handleModuleClick(key)
                    }
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
