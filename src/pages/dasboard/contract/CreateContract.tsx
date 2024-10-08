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

import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { getList } from "@/service/api/template";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import mammoth from "mammoth";
import { ContractContext } from "@/context/ContractContext";
import UplodTrackFileDilog from "@/pages/dasboard/contract/UplodTrackFileDilog";
import { getListTemlate } from "@/service/api/contract";

const CreateContract = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    setDucomentName,
    setShowBlock,
    setUplodTrackFile,
    setDocumentContent,
    setContract,
    setLifecycleData,
    setSidebarExpanded,
    setFormState,
    setEditMode,
    setIsTemplate,
    setPages,
    setBgColorSvg,
    setSelectedFont,
    setSelectedFontValue,
    setSelectedFontSize,
    setSelectedFontSizeValue,
    setPrevBgColor,
    setPrevFontColor
  } = useContext(ContractContext);

  // const workerUrl =
  //   "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";
  const [showPopup, setShowPopup] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectDocoment, setSelectDocoment] = useState("");
  const [selectionField, setSelectionField] = useState("");
  const [TemplateList, setTemplateList] = useState<Array<any>>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>("");
  const [inputFocused, setInputFocused] = useState(false);
  const triggerClick = async () => {
    navigate("/dashboard/editor-dahsbord", {
      state: { openFileChooser: true },
    });
    setShowBlock("uploadTrack");
    setDocumentContent("word");
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.type === "application/pdf") {
      const fileName = file.name;
      console.log("Uploaded file name:", fileName);
      setDucomentName(fileName);
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
      navigate("/dashboard/editor-dahsbord", {
        state: { openFileChooser: true },
      });
      setShowBlock("uploadTrack");
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
      const { data } = await getListTemlate(user?._id);
      setTemplateList(data);

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
  // console.log(selectedTemplate?._id, "selectedTemplate");

  const handleCreateDocument = () => {
    setShowBlock("")
    setPages([{ content: "" }]);
    setBgColorSvg("#fefefe");
    setPrevBgColor("#fefefe");
    setSelectedFontSize("12px")
    setSelectedFontSizeValue("12px")
    setSelectedFontValue("arial")
    setSelectedFont("arial")
    setPrevFontColor("black")
    setDucomentName("")
  }

  return (
    <>
      {/* {isLoading && (
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
      )} */}

      <Box
        sx={{
          opacity: isLoading ? "30%" : "100%",
          pl: 2,
          pb: 1,
          pr: 2,
          pt: 1,
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
        <>
          <Paper
            sx={{
              display: "table",
              width: "100%",

              pl: "-1rem",
              borderTop: "0.5px solid #174B8B", // Add a top border
              borderBottom: "0.5px solid #174B8B",
              marginBottom: "1rem",
            }}
          >
            <Box sx={{ background: "#FFFFFF", p: 2 }}>Select to Start</Box>
          </Paper>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ background: "#F8FAFD" }}
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
                  onClick={handleCreateDocument}
                  sx={{
                    display: "table-cell",
                    padding: "15px",
                    pt: 4,
                    height: "110px",

                    color: "gray",
                    justifyContent: "center",
                    textTransform: "none",
                    width: "490px",
                    borderWidth: 1,
                    borderStyle: "solid",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow to give depth like a card
                    border: "1.5px dashed #174B8B", // Customizing the border to dashed
                    borderRadius: "16px",
                    backgroundColor: "#fff", // Sets the background color to white
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "-7px", marginRight: "2rem" }}>
                      <div style={{ marginTop: "-1rem" }}>
                        <svg
                          width="82"
                          height="68"
                          viewBox="0 0 82 79"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M47.8327 7.10156H20.4993C18.687 7.10156 16.949 7.78228 15.6675 8.99396C14.386 10.2056 13.666 11.849 13.666 13.5626V65.2511C13.666 66.9647 14.386 68.6081 15.6675 69.8198C16.949 71.0315 18.687 71.7122 20.4993 71.7122H61.4994C63.3117 71.7122 65.0497 71.0315 66.3312 69.8198C67.6127 68.6081 68.3327 66.9647 68.3327 65.2511V26.4848L47.8327 7.10156Z"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M47.834 7.10156V26.4848H68.334"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M41 58.7904V39.4072"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M30.75 49.0986H51.25"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div style={{ display: "table" }}>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{
                              color: "black",
                              fontSize: "18px",
                              marginLeft: "-1.8rem",
                            }}
                          >
                            New Document
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "black",
                              whiteSpace: "nowrap",
                              marginLeft: "-1.8rem",
                            }}
                          >
                            Draft, collaborate, negotiate, review and sign
                          </Typography>
                        </div>
                      </div>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        ></div>
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
                  onClick={() => {
                    setSelectDocoment("Upload Document"), setShowPopup(true);
                  }}
                  variant="outlined"
                  sx={{
                    display: "table-cell",
                    padding: "15px",
                    pt: 4,
                    height: "110px",
                    width: "490px",
                    color: "gray",
                    justifyContent: "center",
                    textTransform: "none",
                    borderWidth: 1,
                    borderStyle: "solid",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow to give depth like a card
                    border: "1.5px dashed #174B8B", // Customizing the border to dashed
                    borderRadius: "16px",
                    backgroundColor: "#fff", // Sets the background color to white
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "-7px" }}>
                      <div style={{ marginTop: "-0.8rem" }}>
                        <svg
                          width="82"
                          height="66"
                          viewBox="0 0 82 78"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M71.75 48.458V61.3801C71.75 63.0937 71.0301 64.7371 69.7486 65.9488C68.4671 67.1605 66.729 67.8412 64.9167 67.8412H17.0833C15.271 67.8412 13.5329 67.1605 12.2514 65.9488C10.9699 64.7371 10.25 63.0937 10.25 61.3801V48.458"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M58.0827 25.8441L40.9993 9.69141L23.916 25.8441"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M41 9.69141V48.4578"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div style={{ display: "table", margin: "0 auto" }}>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{ color: "black", fontSize: "18px" }}
                          >
                            Upload, Store & Track
                          </Typography>
                          <Typography sx={{ fontSize: "13px", color: "black" }}>
                            Manage lifecycle for agreements executed outside
                            ContractnSign
                          </Typography>
                        </div>
                      </div>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        ></div>
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
                    width: "490px",
                    color: "gray",
                    justifyContent: "center",
                    textTransform: "none",

                    borderWidth: 1,
                    borderStyle: "solid",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow to give depth like a card
                    border: "1.5px dashed #174B8B", // Customizing the border to dashed
                    borderRadius: "16px",
                    backgroundColor: "#fff", // Sets the background color to white
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "-7px", marginRight: "2rem" }}>
                      <div style={{ marginTop: "-1rem" }}>
                        {" "}
                        <svg
                          width="82"
                          height="68"
                          viewBox="0 0 82 79"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M47.8327 6.9873H20.4993C18.687 6.9873 16.949 7.66802 15.6675 8.87971C14.386 10.0914 13.666 11.7348 13.666 13.4484V65.1369C13.666 66.8505 14.386 68.4939 15.6675 69.7055C16.949 70.9172 18.687 71.5979 20.4993 71.5979H61.4993C63.3117 71.5979 65.0497 70.9172 66.3312 69.7055C67.6127 68.4939 68.3327 66.8505 68.3327 65.1369V26.3705L47.8327 6.9873Z"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M47.834 6.9873V26.3705H68.334"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M54.6673 42.5234H27.334"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M54.6673 55.4453H27.334"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M34.1673 29.6016H30.7507H27.334"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div style={{ display: "table" }}>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{
                              color: "black",
                              fontSize: "18px",
                              marginLeft: "-1.8rem",
                            }}
                          >
                            Use Template
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "black",
                              marginLeft: "-1.8rem",
                            }}
                          >
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
        </>
      ) : (
        <>
          <Box
            sx={{
              background: "white",
              p: 2,
              borderTop: "0.5px solid #174B8B", // Add a top border
              borderBottom: "0.5px solid #174B8B",
            }}
          >
            {selectDocoment}
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
                  {/* <Grid item xs={12} sm={12}>
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
                            // {...getRootProps()}
                            variant="contained"
                            style={{
                              textTransform: "none",
                            }}
                            onClick={() => setShowPopup(true)}
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
                  </Grid> */}
                </Box>
              ) : (
                <Box sx={{ mt: 12, width: "50%" }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={TemplateList}
                    value={selectedTemplate}
                    onChange={(event: any, newValue: any) => {
                      setSelectedTemplate(newValue);
                    }}
                    getOptionLabel={(option: any) =>
                      option ? option.overview?.name : ""
                    }
                    isOptionEqualToValue={(option: any, value: any) =>
                      option._id === value._id
                    }
                    renderOption={(props: any, option: any) => (
                      <MenuItem {...props} key={option._id} value={option._id}>
                        {option.overview?.name}
                      </MenuItem>
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        placeholder="Search Templates"
                        // Adjust label based on selection and focus
                        InputLabelProps={{
                          shrink: false, // Prevent the label from floating when focused or filled
                        }}
                        InputProps={{
                          ...params.InputProps, // Spread existing input properties
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        onFocus={() => setInputFocused(true)} // Set focus to true
                        onBlur={() => setInputFocused(false)} // Set focus to false
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              border: "1px dashed #174B8B ",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1171D1", // Change for hover state
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#174B8B", // Border color when the TextField is focused
                            },
                          },
                        }}
                      />
                    )}
                    renderTags={() => null} // Optionally, prevent tags from rendering if `multiple` is enabled
                  />
                  <div style={{ float: "right", marginTop: "2rem" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setSelectDocoment("")}
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
                        to={`/dashboard/editor-dahsbord/${selectedTemplate._id}`}
                        onClick={() => {
                          setContract(null),
                            setIsTemplate(false),
                            setSidebarExpanded(false),
                            setFormState({
                              name: "",
                              with_name: undefined,
                              currency: undefined,
                              value: undefined,
                              tags: undefined,
                              // branch: "",
                              teams: undefined,
                              category: undefined,
                              subcategory: undefined,
                              additionalFields: [],
                            });
                          setDucomentName(""),
                            setLifecycleData({
                              activeSection: "",
                              showButtons: false,
                              recipients: [],
                              formData: {
                                checkboxStates: {
                                  isEvergreen: false,
                                  isRenewalsActive: false,
                                  isNotificationEmailEnabled: false,
                                  isRemindersEnabled: false,
                                },
                                dateFields: {
                                  signedOn: "",
                                  startDate: "",
                                  endDate: "",
                                  noticePeriodDate: "",
                                },
                                renewalDetails: {
                                  renewalType: "days",
                                  renewalPeriod: 0,
                                },
                                notificationDetails: {
                                  notifyOwner: false,
                                  additionalRecipients: [],
                                },
                                reminderSettings: {
                                  firstReminder: 0,
                                  daysBetweenReminders: 0,
                                  daysBeforeFinalExpiration: 0,
                                },
                              },
                            });
                        }}
                        disabled={!selectedTemplate}
                        size="small"
                        sx={{
                          height: "4.5vh",
                          ml: 2,
                          mr: 2,
                          textTransform: "none",
                          backgroundColor: "#174B8B", // Set the button color to green
                          "&:hover": {
                            backgroundColor: "#2B6EC2", // Darker green on hover
                          },
                        }}
                        variant="contained"
                        type="submit"
                      >
                        Use Template
                      </Button>
                    </Tooltip>
                  </div>
                </Box>
              )}
            </Grid>
          </Grid>
        </>
      )}
      <UplodTrackFileDilog
        open={showPopup}
        onClose={() => setShowPopup(false)}
        setDocumentPath={setUplodTrackFile}
        setSelectDocoment={setSelectDocoment}
        triggerClick={() => triggerClick()}
      />
    </>
  );
};

export default CreateContract;
