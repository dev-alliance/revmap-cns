/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
import React, { useState, ReactNode, useCallback } from "react";
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
import { Link } from "react-router-dom";
import SignatureDialog from "@/pages/dasboard/contract/sdk/SignatureDialog";
import QuickSign from "@/pages/dasboard/contract/sdk/QuickSign";

interface Module {
  icon: ReactNode;
  content?: ReactNode;
}

const MyComponent: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<string>("overview");
  const { control, handleSubmit } = useForm();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);

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
          <AdjustIcon />
        </Tooltip>
      ),
      content: <OverView />,
    },
    quickSign: {
      icon: (
        <Tooltip title="quickSign">
          <DrawIcon />
        </Tooltip>
      ),
      content: <QuickSign />,
    },
    approval: {
      icon: (
        <Tooltip title="approvals">
          <HowToRegIcon />
        </Tooltip>
      ),
      content: <ApprovalsComp />,
    },
    clause: {
      icon: <TaskIcon />,
      content: <ClauseComp />,
    },
    attachement: {
      icon: <AttachFileIcon />,
      content: <Attachement />,
    },
    timeLine: {
      icon: <TimelineIcon />,
      content: <TimelineComp />,
    },
    lifeSycle: {
      icon: <HistoryIcon />,
      content: <LifeSycle />,
    },
    shere: {
      icon: <ShareIcon />,
      content: <ShareComp />,
    },
    discussion: {
      icon: <ChatIcon />,
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
            overflow: "auto",
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
                  size="small"
                  // value={search}
                  placeholder="Add contract name"
                  variant="standard"
                  InputProps={{
                    sx: {
                      "::placeholder": {
                        fontSize: "0.55rem", // Adjusted font size for placeholder
                        textAlign: "center", // Center placeholder text horizontally
                      },
                      input: {
                        fontSize: "0.875rem", // Adjusted font size for input text
                        textAlign: "center", // Center input text horizontally
                      },
                    },
                  }}
                  // onChange={(e: any) => setSearch(e.target.value)}
                />
                <Button
                  sx={{ ml: 2, textTransform: "none" }}
                  variant="contained"
                  // component={Link}
                  // to={hasAddUsersPermission ? "/dashboard/create-user" : ""}
                  // disabled={!user?.role?.permissions?.create_clauses}
                  // to="/dashboard/create-clauses"
                >
                  Draft
                </Button>
              </Box>
            </div>
            <div>
              <Box
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
              </Tooltip>
              <Button
                sx={{ ml: 2, textTransform: "none" }}
                variant="contained"
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
            width: sidebarExpanded ? 320 : 60,
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
                    sx={{ mb: 2.5 }}
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
      <SignatureDialog open={openDialog} onClose={handleCloseDialog} />
    </>
  );
};

export default MyComponent;
