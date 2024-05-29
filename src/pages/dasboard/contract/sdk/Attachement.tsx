/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import logo from "@/assets/upload_logo.png";
import { ContractContext } from "@/context/ContractContext";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "@/hooks/useAuth";
import { getList } from "@/service/api/contract";
import ContractList from "@/pages/dasboard/contract/ContractList";
const Attachement = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const { activeSection, setActiveSection, attachments, setAttachments } =
    useContext(ContractContext);
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showselectField, setShowselectField] = useState(false);

  const [reason, setReason] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedDocument, setSelectedDocuments] = useState("");
  const [cntractlist, setContractlist] = useState<Array<any>>([]);

  const [fileUrl, setFileUrl] = useState<string | null>(null); // State to store the file URL

  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    const url = URL.createObjectURL(file); // Create a URL for the file
    setFileUrl(url); // Store the URL in state
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true, // Disable automatic click handling
    noKeyboard: true, // Optional, to disable keyboard interaction if not needed
  });

  const inputProps = getInputProps({
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        setSelectedFile(file);
        const url = URL.createObjectURL(file); // Create a URL for the file
        setFileUrl(url); // Update the state with the new URL
      }
    },
  });

  const onBrowseClick = () => {
    open(); // Only open the file dialog when the Browse text is explicitly clicked
  };

  const handleAddAttachment = () => {
    if (reason && (selectedFile || selectedDocument)) {
      // Use selectedDocument if it exists, otherwise use selectedFile
      const newAttachment = {
        reason,
        file: selectedDocument ? selectedDocument : selectedFile.name,
        fileUrl: selectedFile ? fileUrl : undefined, // Use fileUrl only if selectedFile is defined
      };
      setAttachments((prevAttachments: any) => [
        ...prevAttachments,
        newAttachment,
      ]);
      // Reset the inputs after adding
      setReason("");
      setSelectedFile(null);
      setSelectedDocuments("");
      setShowselectField(false);
      setFileUrl(null);
    }
  };

  const handleRemoveAttachment = (index: any) => {
    setAttachments((prevAttachments: any) =>
      prevAttachments.filter((_: any, i: any) => i !== index)
    );
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getList(user?._id);
      setContractlist(data);
      console.log("contract", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

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
          Attachments
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
      {activeSection === "Attachments" && (
        <>
          {" "}
          <Typography
            variant="body1"
            sx={{
              color: "#92929D",
              textAlign: "center",
              justifyItems: "center",
            }}
          >
            No attachments added
          </Typography>
        </>
      )}
      {activeSection === "linkDocuments" && (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="text"
              sx={{
                whiteSpace: "nowrap",
                backgroundColor: "#174B8B", // Ensures there is no background color
                "&:hover": {
                  backgroundColor: "#2B6EC2", // Darker green on hover
                },
                color: "white", // Text color
                width: "55%", // Full width of the FormControl
                textTransform: "none",
                height: "25px",
                fontSize: "14px",
                px: "2",
                mr: 0.9,
                mt: -0.5, // Prevents uppercase transformation
              }}
            >
              This document
            </Button>
            <TextField
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="add relationship"
              size="small"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  "::after": { borderBottom: "2px solid transparent" },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important",
                  },
                  "::placeholder": { fontSize: "14px", color: "#92929D" },
                  input: {
                    fontSize: "14px",
                    borderBottom: "1px solid #174B8B", // Default border applied here
                    "&:focus": { borderBottom: "1px solid #174B8B" },
                    "&:not(:placeholder-shown)": {
                      "&::placeholder": { color: "#0F151B !important" },
                    },
                  },
                },
              }}
            />
          </div>
          <div
            {...getRootProps({
              style: {
                marginTop: "1rem",
                borderRadius: "10px",
                border: "1.5px dashed #174B8B",

                pointerEvents: "auto",
                opacity: 1,
              },
            })}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "45px",
                opacity: reason ? 1 : 0.5,
              }}
            >
              <p>
                {selectedFile ? (
                  selectedFile.name
                ) : (
                  <>
                    <span
                      style={{
                        color: "#155BE5",
                        cursor: reason ? "pointer" : "",
                      }}
                      onClick={
                        reason && !showselectField ? onBrowseClick : undefined
                      }
                    >
                      <input
                        {...getInputProps()}
                        disabled={!reason}
                        style={{ display: "none" }}
                      />
                      Browse
                    </span>
                    &nbsp; or &nbsp;
                    <span
                      style={{
                        color: "#155BE5",
                        cursor: reason ? "pointer" : "",
                      }}
                      onClick={() => {
                        reason && !selectedDocument
                          ? setShowselectField(true)
                          : undefined;
                      }}
                    >
                      select files
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          {showselectField && (
            <Select
              fullWidth
              onChange={(e) => setSelectedDocuments(e.target.value)}
              value={selectedDocument}
              labelId="team-label"
              placeholder="Team"
              displayEmpty
              renderValue={(value) => {
                if (value === "") {
                  return (
                    <em
                      style={{
                        color: "#92929D",
                        fontStyle: "normal",
                        fontSize: "13px",
                      }}
                    >
                      Select Document
                    </em> // Placeholder text with custom color
                  );
                }

                // Find the team with the matching ID in teamData and return its name
                const selectdocument = cntractlist.find(
                  (doc) => doc._id === value
                );
                return selectdocument ? selectdocument.overview?.with_name : "";
              }}
              sx={{
                ".MuiSelect-select": {
                  border: "none", // Remove border
                  fontSize: "13px", // Ensure consistent font size
                  marginLeft: "-0.8rem",
                  "&:focus": {
                    backgroundColor: "transparent", // Remove the background color on focus
                  },
                },
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none", // Ensure no border
                },
              }}
            >
              <MenuItem value="">
                <em style={{ fontSize: "13px" }}>None</em>{" "}
                {/* This is the 'deselect' option */}
              </MenuItem>
              {cntractlist?.map((doc: any) => (
                <MenuItem key={doc._id} value={doc._id}>
                  {doc.overview?.with_name}
                </MenuItem>
              ))}
            </Select>
          )}

          <Box sx={{ my: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              disabled={
                !reason ||
                (!selectedFile && !selectedDocument && !showselectField)
              }
              color="error"
              sx={{
                height: "25px !important",
                fontSize: "0.675rem",
                textTransform: "none",
                display: "flex",
                justifyContent: "flex-end",
              }}
              onClick={() => {
                setReason("");
                setSelectedFile(null);
                setSelectedDocuments("");
                setShowselectField(false);
              }}
            >
              Cancel
            </Button>
            <Button
              sx={{
                ml: 2,
                textTransform: "none",
                height: "25px !important",
                fontSize: "0.675rem",
              }}
              disabled={!reason || (!selectedFile && !selectedDocument)}
              onClick={handleAddAttachment}
              variant="outlined"
              color="success"
            >
              Save
            </Button>
          </Box>

          {attachments?.map((attachment: any, index: any) => {
            const name = cntractlist.filter(
              (list) => list._id == attachment.file
            );
            console.log(name[0]?.overview?.with_name, "name");

            return (
              <div
                key={index}
                style={{
                  marginBottom: "-8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ width: "120px", whiteSpace: "nowrap" }}
                >
                  {attachment?.reason}:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    width: "130px",
                    whiteSpace: "nowrap",
                    color: "#155BE5",
                  }}
                >
                  {
                    name[0]?.overview?.with_name ? (
                      name[0]?.overview?.with_name
                    ) : // Ensure fileUrl is not null before rendering the link
                    attachment.fileUrl ? (
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#155BE5", textDecoration: "none" }}
                      >
                        {attachment?.file}
                      </a>
                    ) : null // Or handle the case when fileUrl is null (perhaps render something else or nothing)
                  }
                </Typography>
                <IconButton
                  onClick={() => handleRemoveAttachment(index)}
                  aria-label="remove"
                >
                  <CloseIcon
                    sx={{
                      cursor: "pointer",
                      color: "action.active",
                      fontSize: "18px",
                    }}
                  />
                </IconButton>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Attachement;
