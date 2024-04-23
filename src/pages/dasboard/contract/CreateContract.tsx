/* eslint-disable @typescript-eslint/no-explicit-any */
// TeamForm.tsx
import React, { useState, useCallback, useEffect, useContext } from "react";

import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  MenuItem,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import { TextareaAutosize } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { create } from "@/service/api/clauses";

import logo from "@/assets/upload_logo.png";
import { getList } from "@/service/api/template";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import mammoth from "mammoth";
import { ContractContext } from "@/context/ContractContext";

const CreateContract = () => {
  const navigate = useNavigate();
  const { setShowBlock, setUplodTrackFile, setDocumentContent } =
    useContext(ContractContext);

  // const workerUrl =
  //   "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";

  const [isLoading, setIsLoading] = useState(false);
  const [selectDocoment, setSelectDocoment] = useState("");
  const [selectionField, setSelectionField] = useState("");
  const [feildList, setFeildList] = useState<Array<any>>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>("");
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.type === "application/pdf") {
      setUplodTrackFile(file);
      setShowBlock("uploadTrack");
      navigate("/dashboard/editor-dahsbord");
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Handle DOCX files with Mammoth
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const arrayBuffer = event.target.result;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setDocumentContent(result.value);
      };
      reader.readAsArrayBuffer(file);
      setShowBlock("uploadTrack");
      navigate("/dashboard/editor-dahsbord");
    } else if (file.type === "application/msword") {
      // Handle DOC files here (you may need a server-side conversion)
      toast.error("DOC file support is limited. Please convert to DOCX.");
    } else {
      toast.error("Only PDF, DOCX, and DOC files are allowed");
      setUplodTrackFile(null);
      setDocumentContent(null);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    // accept: ["image/*", ".pdf", ".doc", ".docx", ".txt"] as Accept,
  }) as any;

  const listFeildData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getList();

      setFeildList(data);

      console.log("data", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listFeildData();
    setDocumentContent(null);
    setUplodTrackFile(null);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
            position: "absolute",
            margin: "auto",
            width: "70%",
          }}
        >
          <ProgressCircularCustomization />
        </Box>
      )}

      <Box
        sx={{
          opacity: isLoading ? "30%" : "100%",
          pl: 3,
          p: 2,
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
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              New Document
            </Typography>

            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ mt: -2, mb: 2, fontSize: "14px" }}
            >
              <Link
                style={{ marginRight: "-7px" }}
                to="/dashboard/contract-list"
                className="link-no-underline"
              >
                Home
              </Link>
              {selectDocoment == "" ? (
                <Typography
                  sx={{ fontSize: "14px", ml: "-7px" }}
                  color="text.primary"
                >
                  Select
                </Typography>
              ) : (
                <Typography
                  sx={{ fontSize: "14px", ml: "-7px" }}
                  color="text.primary"
                >
                  {selectDocoment}
                </Typography>
              )}
            </Breadcrumbs>
          </Box>
        </div>
      </Box>

      {selectDocoment == "" ? (
        <Paper sx={{ display: "table", width: "100%", minHeight: "550px" }}>
          <Box sx={{ background: "#F0F0F0", p: 2 }}>Select to Start</Box>

          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 12 }}
              >
                <Button
                  variant="outlined"
                  component={Link}
                  to="/dashboard/editor-dahsbord"
                  onClick={() => setShowBlock("")}
                  sx={{
                    display: "table-cell",
                    padding: "15px",
                    pt: 4,
                    height: "110px",
                    width: "280px",
                    color: "gray",
                    justifyContent: "center",
                    textTransform: "none",
                    borderColor: "#D9D9D9 !important", // Using !important to ensure the border color is applied
                    borderWidth: 1,
                    borderStyle: "solid",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow to give depth like a card
                    borderRadius: "4px", // Adds rounded corners
                    backgroundColor: "#fff", // Sets the background color to white
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "-7px" }}>
                      <svg
                        width="41"
                        height="40"
                        viewBox="0 0 51 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M29.1827 5.27539H12.5069C11.4012 5.27539 10.3408 5.75828 9.55895 6.61783C8.77712 7.47738 8.33789 8.64319 8.33789 9.85878V46.5259C8.33789 47.7414 8.77712 48.9072 9.55895 49.7668C10.3408 50.6263 11.4012 51.1092 12.5069 51.1092H37.5206C38.6263 51.1092 39.6867 50.6263 40.4685 49.7668C41.2503 48.9072 41.6896 47.7414 41.6896 46.5259V19.0255L29.1827 5.27539Z"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M29.1836 5.27539V19.0255H41.6905"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M25.0137 41.9425V28.1924"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M18.7598 35.0674H31.2666"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>

                    <div style={{ display: "table" }}>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography variant="body1" component="span">
                            New Document
                          </Typography>
                        </div>
                      </div>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "10px", whiteSpace: "nowrap" }}
                          >
                            Draft, collaborate, negotiate, review and sign
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box>
                <Button
                  onClick={() => setSelectDocoment("Upload Document")}
                  variant="outlined"
                  sx={{
                    display: "table-cell",
                    padding: "15px",
                    pt: 4,
                    height: "110px",
                    width: "280px",
                    color: "gray",
                    justifyContent: "center",
                    textTransform: "none",
                    borderColor: "#D9D9D9 !important", // Using !important to ensure the border color is applied
                    borderWidth: 1,
                    borderStyle: "solid",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow to give depth like a card
                    borderRadius: "4px", // Adds rounded corners
                    backgroundColor: "#fff", // Sets the background color to white
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "-7px" }}>
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 45 55"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M39.237 34.1758V43.119C39.237 44.3049 38.8433 45.4423 38.1425 46.2809C37.4417 47.1195 36.4912 47.5906 35.5002 47.5906H9.34231C8.35124 47.5906 7.40076 47.1195 6.69996 46.2809C5.99917 45.4423 5.60547 44.3049 5.60547 43.119V34.1758"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M31.7623 18.5247L22.4202 7.3457L13.0781 18.5247"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M22.4219 7.3457V34.1753"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>

                    <div style={{ display: "table", margin: "0 auto" }}>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography variant="body1" component="span">
                            Upload, Store & Track
                          </Typography>
                        </div>
                      </div>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography sx={{ fontSize: "10px" }}>
                            Manage lifecycle for agreements executed outside
                            ContractnSign
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box>
                <Button
                  onClick={() => setSelectDocoment("Use Template")}
                  variant="outlined"
                  sx={{
                    display: "table-cell",
                    padding: "15px",
                    pt: 4,
                    height: "110px",
                    width: "280px", // Uncomment if fixed width is required
                    color: "gray",
                    justifyContent: "center",
                    textTransform: "none",
                    borderColor: "#D9D9D9 !important", // Using !important to ensure the border color is applied
                    borderWidth: 1,
                    borderStyle: "solid",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow to give depth like a card
                    borderRadius: "4px", // Adds rounded corners
                    backgroundColor: "#fff", // Sets the background color to white
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "-7px" }}>
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 48 55"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.7319 5.12988H12.2901C11.2663 5.12988 10.2844 5.601 9.56038 6.43958C8.83641 7.27817 8.42969 8.41554 8.42969 9.60148V45.3742C8.42969 46.5602 8.83641 47.6975 9.56038 48.5361C10.2844 49.3747 11.2663 49.8458 12.2901 49.8458H35.4528C36.4766 49.8458 37.4585 49.3747 38.1825 48.5361C38.9065 47.6975 39.3132 46.5602 39.3132 45.3742V18.5447L27.7319 5.12988Z"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M27.7324 5.12988V18.5447H39.3137"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M31.5921 29.7236H16.1504"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M31.5921 38.667H16.1504"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M20.0108 20.7803H18.0806H16.1504"
                          stroke="#7B7B7B"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>

                    <div style={{ display: "table", margin: "0 auto" }}>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography variant="body1" component="span">
                            Use Template
                          </Typography>
                        </div>
                      </div>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography sx={{ fontSize: "10px" }}>
                            Use template to create a document and save time
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Paper sx={{ display: "table", width: "100%", minHeight: "550px" }}>
          <Box sx={{ background: "#F0F0F0", p: 2 }}>
            Select {selectDocoment}
          </Box>

          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {selectDocoment == "Upload Document" ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 12, width: "50%" }}
                >
                  <Grid item xs={12} sm={12}>
                    <div
                      style={{
                        border: "2px dashed #eeeeee",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      <input
                        {...getInputProps()}
                        style={{ display: "none" }}
                        type="file"
                        accept=".pdf, .docx, .doc"
                      />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "220px",
                          width: "100%",
                        }}
                      >
                        <img
                          src={logo}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "130px",
                            marginBottom: "10px", // Adds some space between the image and text
                          }}
                        />
                        <Typography variant="body1">
                          Drag and drop file
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: 2 }}>
                          Word or PDF files only
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Button
                            size="small"
                            {...getRootProps()}
                            variant="contained"
                            style={{
                              textTransform: "none",
                            }}
                          >
                            Browse Files
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleBack}
                            style={{
                              marginTop: "7rem",
                              textTransform: "none",
                              position: "absolute",
                              right: 0, // Positions the button at the right edge
                              marginRight: "2rem",
                              marginBottom: "2rem",
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ mt: 12, width: "50%" }}>
                  <Autocomplete
                    fullWidth
                    options={feildList}
                    value={selectedTemplate}
                    onChange={(event, newValue) => {
                      setSelectedTemplate(newValue);
                    }}
                    getOptionLabel={(option) => (option ? option.name : "")}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Templates" />
                    )}
                    renderTags={() => null} // Optionally, prevent tags from rendering if `multiple` is enabled
                  />
                  <div style={{ float: "right", marginTop: "2rem" }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      sx={{ textTransform: "none" }}
                    >
                      Cancel
                    </Button>

                    <Tooltip
                      title="Use template to create a new document"
                      // placement="left"
                    >
                      <Button
                        component={Link}
                        to="/dashboard/editor-dahsbord"
                        disabled={!selectedTemplate}
                        sx={{ ml: 2, textTransform: "none" }}
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Use Template
                      </Button>
                    </Tooltip>
                  </div>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default CreateContract;
