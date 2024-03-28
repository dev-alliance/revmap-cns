/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Autocomplete,
  Box,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { getList } from "@/service/api/clauses";
import ShareIcon from "@mui/icons-material/Share";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { TextareaAutosize } from "@mui/material";
import { ContractContext } from "@/context/ContractContext";
import CollaburaterDilog from "@/pages/dasboard/contract/sdk/CollaburaterDilog";

const Discussion = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>();

  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("collaborate");
  const [isLoading, setIsLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [member, setMamber] = useState<Array<any>>([]);

  const { signatories, setSignatories } = useContext(ContractContext);
  const [checked, setChecked] = React.useState(false);

  const [selectedData, setSelectedData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleChange = (event: any) => {
    setChecked(event.target.checked);
  };

  const [inputValue, setInputValue] = useState(""); // Track the input value

  // Function to handle adding new signatory
  const handleAddSignatory = (newSignatoryEmail: string) => {
    if (newSignatoryEmail && !signatories.includes(newSignatoryEmail)) {
      setSignatories((prev: any) => [...prev, newSignatoryEmail]);
      reset(); // Assuming reset is a function to clear the form
      setInputValue(""); // Assuming you manage the input value for Autocomplete
    }
  };

  // Function to remove a signatory from the list
  const handleRemoveSignatory = (signatoryToRemove: any) => {
    setSignatories(
      signatories.filter((signatory: any) => signatory !== signatoryToRemove)
    );
  };

  // Handle input change to track current value
  const handleInputChange = (event: any, newInputValue: any) => {
    setInputValue(newInputValue);
  };

  // Handle "Enter" key press in the input
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleAddSignatory(inputValue);
    }
  };
  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserListNameID(user?._id);
      console.log({ data });

      setUserList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

  const bubbleColors = ["#FEC85E", "#BC3D89", "#725FE7,#00A7B1"]; // Yellow, Green, Blue
  return (
    <>
      <div style={{ textAlign: "left", position: "relative" }}>
        <Typography variant="body1" color="primary">
          Collaborate & Communicate
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Collaborate and communicate with your team or third party to
          efficiently execute contract.
        </Typography>
        <Divider sx={{ mt: 1, mb: 2 }} />
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
              width: "100%",
              fontSize: "11px",
              whiteSpace: "nowrap",

              textTransform: "none !important",
              // borderBottom: activeSection === "collaborate" ? 2 : 0,
              borderColor:
                activeSection === "collaborate"
                  ? "primary.main"
                  : "transparent",
              borderRadius: 0, // Remove border radius to mimic tab appearance
              color: activeSection === "collaborate" ? "primary.main" : "black",
              fontWeight: activeSection === "collaborate" ? "bold" : "bold",
              "&:hover": {
                borderBottom: 2,
                borderColor: "primary.main",
                backgroundColor: "transparent",
              },
            }}
            onClick={() => {
              setActiveSection("collaborate"), setShowButtons(true);
            }}
          >
            + Add Collaborator
          </Button>
          <Button
            fullWidth
            sx={{
              fontSize: "11px",
              textTransform: "none",
              // borderBottom: activeSection === "message" ? 2 : 0,
              borderColor:
                activeSection === "message" ? "primary.main" : "transparent",
              borderRadius: 0,
              color: activeSection === "message" ? "primary.main" : "black",
              fontWeight: activeSection === "message" ? "bold" : "normal",
              "&:hover": {
                borderBottom: 2,
                borderColor: "primary.main",
                backgroundColor: "transparent",
              },
            }}
            onClick={() => {
              setActiveSection("message"), setShowButtons(false);
            }}
          >
            Message
          </Button>
        </Box>

        {activeSection === "collaborate" && (
          <>
            {showButtons && (
              <>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }: any) => (
                    <Autocomplete
                      {...field}
                      freeSolo
                      options={userList.map((user) => ({
                        label: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                      }))}
                      getOptionLabel={(option: any) => option.label || ""}
                      onInputChange={handleInputChange}
                      inputValue={inputValue}
                      onChange={(_, value: any) =>
                        handleAddSignatory(value ? value.email : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search by name or add email"
                          margin="normal"
                          variant="outlined"
                          size="small"
                          onKeyPress={handleKeyPress}
                          sx={{
                            ".MuiInputLabel-root": { fontSize: "14px" }, // Adjusts the label font size
                            ".MuiOutlinedInput-root": { fontSize: "14px" },
                          }}
                        />
                      )}
                    />
                  )}
                />
                <div style={{ flex: 1, textAlign: "right", marginTop: "-8px" }}>
                  <Button
                    variant="text"
                    color="primary"
                    disabled={!inputValue}
                    sx={{ textTransform: "none", fontSize: "11px" }}
                    onClick={() => handleAddSignatory(inputValue)}
                  >
                    Add Collaborater
                  </Button>
                </div>
              </>
            )}

            <div style={{ flex: 1, textAlign: "right" }}>
              {signatories.length > 0 && showButtons && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Button
                    variant="contained"
                    color="inherit"
                    sx={{
                      mr: "20px",
                      textTransform: "none",
                      backgroundColor: "#DCDCDC",
                      "&:hover": {
                        backgroundColor: "#757575",
                      },
                      color: "white",
                      padding: "2px 5px !important",
                      height: "25px !important",
                      fontSize: "0.675rem",
                    }}
                    onClick={() => {
                      setSignatories([]), setShowButtons(false);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    color="inherit"
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#62BD6B",
                      "&:hover": {
                        backgroundColor: "#62BD6d",
                      },
                      color: "white",
                      padding: "2px 5px !important",
                      height: "25px !important",
                      fontSize: "0.675rem",
                    }}
                    onClick={() => setShowButtons(false)}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
            {/* {showButtons && */}
            {signatories?.map((signatory: any, index: any) => {
              // Check if the signatory's email is in the userList
              const isInternal = userList.some(
                (user) => user.email === signatory
              );

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    mb: 1,
                    mt: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 25,
                        height: 25,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        backgroundColor:
                          bubbleColors[index % bubbleColors.length],
                        color: "#FFFFFF",
                        marginRight: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: "14px" }}>
                        {signatory?.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        width: "160px",
                        // overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "15px",
                      }}
                    >
                      {signatory}
                    </Typography>
                  </div>
                  <Box sx={{ display: "flex", mt: 1 }}>
                    <Button
                      variant="contained"
                      color="inherit"
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#DCDCDC",
                        "&:hover": {
                          backgroundColor: "#757575",
                        },
                        "&:first-of-type": {
                          ml: 4.5, // Only applies margin-left to the first button
                        },
                        color: "white",
                        padding: "2px 5px !important",
                        height: "25px !important",
                        fontSize: "0.675rem",
                      }}
                    >
                      {isInternal ? "Internal" : "External"}
                    </Button>
                    <IconButton
                      aria-label="delete" // Providing an accessible label is important for assistive technologies
                      color="error"
                      // size="small" // Makes the button smaller; options are "small", "medium" (default), and "large"
                      onClick={() => handleRemoveSignatory(signatory)}
                      sx={{
                        mt: -1,
                        ml: 1,
                      }}
                    >
                      <DeleteIcon /> {/* Adjust the icon size if needed */}
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
            {!showButtons && (
              <Button
                variant="text"
                color="primary"
                sx={{ textTransform: "none" }}
                onClick={() => setOpenDialog(true)}
              >
                Share Document
              </Button>
            )}
            <div />
          </>
        )}

        {activeSection === "message" && (
          <Box>
            <div
              style={{
                width: "100%",
                padding: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {" "}
              <FormControlLabel
                sx={{
                  "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                  // Apply any additional styling you need for the FormControlLabel here
                }}
                control={
                  <Checkbox
                    name="Internal"
                    sx={{
                      padding: "5px", // Adjusts padding around the checkbox
                      "& .MuiSvgIcon-root": {
                        // Targets the SVG icon representing the checkbox
                        fontSize: "18px", // Adjust this value to scale the icon size
                      },
                    }}
                  />
                }
                label="Visible to everyone on the document"
              />
              <FormControlLabel
                sx={{
                  "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                  // Apply any additional styling you need for the FormControlLabel here
                }}
                control={
                  <Checkbox
                    name="Internal"
                    sx={{
                      padding: "5px", // Adjusts padding around the checkbox
                      "& .MuiSvgIcon-root": {
                        // Targets the SVG icon representing the checkbox
                        fontSize: "18px", // Adjust this value to scale the icon size
                      },
                    }}
                  />
                }
                label="Internal"
              />
            </div>
            <Box sx={{ mb: 2, mt: 2, alignItems: "center" }}>
              <Controller
                name="content"
                control={control}
                // rules={{ required: "Tag Name is required" }}
                render={({ field }) => (
                  <TextareaAutosize
                    {...field}
                    placeholder="Enter description"
                    minRows={1} // Adjust the number of rows as needed
                    style={{
                      width: "100%",
                      fontSize: "16px",
                      // color: "#9A9A9A",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      padding: "10px",
                    }}
                  />
                )}
              />
              <Button
                sx={{ ml: 2, textTransform: "none" }}
                type="submit"
                variant="contained"
                color="primary"
              >
                Send
              </Button>
            </Box>
          </Box>
        )}
      </div>
      <CollaburaterDilog open={openDialog} onClose={handleCloseDialog} />
      {/* <CollaburaterDilog
        // onButtonClick={handleNextStep}
        onClose={handleCloseDialog}
        handleCloseDialog={handleCloseDialog}
      /> */}
    </>
  );
};

export default Discussion;
