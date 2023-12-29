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

interface Module {
  icon: ReactNode;
  content?: ReactNode;
}

const MyComponent: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<string>("overview");
  const { control, handleSubmit } = useForm();
  const [editorContent, setEditorContent] = useState<string>(
    "<p>This is the initial content of the editor.</p>"
  );

  const processFile = (file: File) => {
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setEditorContent(e.target.result as string);
        }
      };
      reader.readAsText(file);
    } else {
      // For other file types like PDF, Word, etc., send the file to a server or third-party service
      // for conversion to HTML, then set the HTML content in the editor.
    }
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    []
  );

  const handleFileDrop = useCallback((editor: any, event: DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

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
  const contentStyle = `
  body#tinymce {
    max-width: 210mm;
    margin: 0 auto;
    padding: 20mm;
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
    min-height: 297mm;
    background: #fff;
  }
`;
  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div style={{ height: "100px", width: "100px" }}>
        <Button
          variant="contained"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          Browse Files
        </Button>
      </div>
      <Box
        sx={{
          flexGrow: 1,
          pr: 1,
          height: "calc(100vh - 64px)",
          overflow: "auto",
        }}
      >
        <Editor
          apiKey="y2m63gfes71d04w6hzgawtrpuaxtoo9vsgqr2h4xmnwn4dc3"
          value={editorContent}
          onEditorChange={(content) => setEditorContent(content)}
          init={{
            content_style: contentStyle, // Apply the A4 style
            setup: (editor) => {
              editor.on("drop", function (e) {
                handleFileDrop(editor, e);
              });
            },
            height: 500,
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
              "image",
              "table",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help | image | table",
          }}
        />
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
