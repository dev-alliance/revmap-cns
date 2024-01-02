/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ReactNode, useCallback } from "react";
import {
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  Box,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ApprovalIcon from "@mui/icons-material/CheckCircle";
import { Editor } from "@tinymce/tinymce-react";
import { useForm, Controller } from "react-hook-form";
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
import CustomTextEditor from "@/pages/dasboard/contract/sdk/CustomTextEditor";

interface Module {
  icon: ReactNode;
  content?: ReactNode;
}

const MyComponent: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<string>("overview");
  const { control, handleSubmit } = useForm();

  const modules: Record<string, Module> = {
    toggle: {
      icon: <MenuIcon />,
    },
    overview: {
      icon: <AssessmentIcon />,
      content: <OverView />,
    },
    approval: {
      icon: <HowToRegIcon />,
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
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
      <Box
        sx={{
          flexGrow: 1,
          pr: 1,
          height: "calc(100vh - 64px)",
          overflow: "auto",
        }}
      >
        <CustomTextEditor />
      </Box>

      <Box
        sx={{
          width: sidebarExpanded ? 380 : 60,
          flexShrink: 0,
          display: "flex",
          border: "1px solid #BEBEBE",
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
                  key={key}
                  selected={selectedModule === key}
                  onClick={() =>
                    key === "toggle" ? toggleSidebar() : handleModuleClick(key)
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
  );
};

export default MyComponent;
