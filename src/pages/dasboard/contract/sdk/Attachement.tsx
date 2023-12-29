/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import logo from "@/assets/upload_logo.png";

const Attachement = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    // You can specify the file types here
  });

  const onRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div style={{ textAlign: "left", position: "relative" }}>
      <Typography variant="body1" color="primary">
        Attachments
      </Typography>
      <Divider style={{ margin: "20px 0" }} />

      <div
        {...getRootProps()}
        style={{
          border: "2px dashed rgb(185 183 183)",
          padding: "20px",
          textAlign: "center",
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
            height: "110px",
          }}
        >
          <img
            src={logo}
            alt="Upload logo"
            style={{
              maxWidth: "100%",
              maxHeight: "130px",
              marginBottom: "10px",
            }}
          />
          <p>Drag and drop, or click to select</p>
        </div>
      </div>

      {/* Displaying the selected file name outside the dropzone */}
      {selectedFile && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1">{selectedFile.name}</Typography>
          <IconButton onClick={onRemoveFile} aria-label="remove">
            <CloseIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Attachement;
