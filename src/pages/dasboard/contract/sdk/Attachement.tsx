/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import logo from "@/assets/upload_logo.png";
import { ContractContext } from "@/context/ContractContext";
import AddIcon from "@mui/icons-material/Add";
const Attachement = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const { activeSection, setActiveSection, showButtons, setShowButtons } =
    useContext(ContractContext);

  const [attachments, setAttachments] = useState<any>([]);
  const [reason, setReason] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAddAttachment = () => {
    // This function will append a new attachment to the existing list
    if (reason && selectedFile) {
      const newAttachment = { reason, file: selectedFile };
      setAttachments((prevAttachments: any) => [
        ...prevAttachments,
        newAttachment,
      ]);
      // Clear the input for reason and the selected file to allow for new entries
      setReason("");
      setSelectedFile(null);
    }
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRemoveAttachment = (index: any) => {
    setAttachments((prevAttachments: any) =>
      prevAttachments.filter((_: any, i: any) => i !== index)
    );
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false, // This is set to false as per your setup to handle one file at a time
  });

  const onRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div style={{ textAlign: "left", position: "relative" }}>
      <Typography variant="subtitle1" color="black">
        Attachments
      </Typography>
      <Divider sx={{ mt: 0.1, mb: 1, pl: -1, background: "#174B8B" }} />
      <Box
        sx={{
          display: "flex",
          mb: 2,
          // borderBottom: 1,
          // borderColor: "divider",
        }}
      >
        <Button
          style={{}}
          sx={{
            width: "60%",
            fontSize: "14px",
            whiteSpace: "nowrap",
            textTransform: "none !important",

            pl: 0,
            // borderBottom: activeSection === "collaborate" ? 2 : 0,
            borderColor:
              activeSection === "Attachments" ? "#174B8B" : "transparent",
            borderRadius: 0, // Remove border radius to mimic tab appearance
            color: activeSection === "Attachments" ? "#155BE5" : "black",
            fontWeight: activeSection === "Attachments" ? "bold" : "normal",
            "&:hover": {
              borderBottom: 2,
              borderColor: "#174B8B",
              backgroundColor: "transparent",
            },
          }}
          onClick={() => {
            setActiveSection("Attachments");
          }}
        >
          + Attachments
        </Button>

        <Button
          sx={{
            width: "80%",
            fontSize: "14px",
            textTransform: "none",
            whiteSpace: "nowrap",
            // borderBottom: activeSection === "message" ? 2 : 0,
            borderColor:
              activeSection === "linkDocuments" ? "#174B8B" : "transparent",
            borderRadius: 0,
            color: activeSection === "linkDocuments" ? "#155BE5" : "black",
            fontWeight: activeSection === "linkDocuments" ? "bold" : "normal",
            "&:hover": {
              borderBottom: 2,
              borderColor: "#174B8B",
              backgroundColor: "transparent",
            },
          }}
          onClick={() => {
            setActiveSection("linkDocuments");
          }}
        >
          + Link Documents
        </Button>
      </Box>
      {activeSection === "Attachments" && <></>}
      {activeSection === "linkDocuments" && (
        <div>
          <TextField
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter Attachment Reason"
            size="small"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                "::after": { borderBottom: "2px solid transparent" },
                "::before": { borderBottom: "none !important" },
                ":hover:not(.Mui-disabled)::before": {
                  borderBottom: "none !important",
                },
                "::placeholder": { fontSize: "0.55rem", color: "gray" },
                input: {
                  fontSize: "0.875rem",
                  "&:focus": { borderBottom: "2px solid transparent" },
                  "&:not(:placeholder-shown)": {
                    "&::placeholder": { color: "#0F151B !important" },
                    "&:focus": { borderBottom: "1px solid #174B8B" },
                  },
                },
              },
            }}
          />
          <div
            {...getRootProps()}
            style={{
              marginTop: "1rem",
              borderRadius: "10px",
              border: "1.5px dashed #174B8B",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "45px",
              }}
            >
              <p>
                Drag n drop files or &nbsp;
                <span style={{ color: "#155BE5" }}>Browse</span>
              </p>
            </div>
          </div>
          {attachments?.map((attachment: any, index: any) => (
            <div
              key={index}
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body1" sx={{ width: "110px" }}>
                {attachment?.reason}:
              </Typography>
              <Typography variant="body1" sx={{ width: "110px" }}>
                {attachment?.file.name}
              </Typography>
              <IconButton
                onClick={() => handleRemoveAttachment(index)}
                aria-label="remove"
              >
                <CloseIcon />
              </IconButton>
            </div>
          ))}
          <Box sx={{ mt: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <Button
              size="small"
              disabled={!reason || !selectedFile}
              onClick={handleAddAttachment}
              sx={{
                fontSize: "12px",
                mb: "5px",
                textTransform: "none",
                backgroundColor: "#174B8B",
                "&:hover": { backgroundColor: "#2B6EC2" },
              }}
              variant="contained"
            >
              <AddIcon sx={{ fontSize: "14px" }} /> Add Attachment
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Attachement;
