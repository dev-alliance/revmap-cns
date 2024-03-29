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
  Card,
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
  const {
    activeSection,
    setActiveSection,
    showButtons,
    setShowButtons,
    collaborater,
    setCollaborater,
    comments,
    setComments,
  } = useContext(ContractContext);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const [userList, setUserList] = useState<Array<any>>([]);

  const [checked, setChecked] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [ClickData, setClickData] = useState("");
  const [message, setMessage] = useState(""); // State for the message input
  const [isInternal, setIsInternal] = useState<any>(""); // State to track if the comment is internal or external

  const handleSendMessage = () => {
    // Create a new comment object
    console.log(user.firstName);

    const newComment = {
      message,
      isInternal,
      name: user?.firstName,
      userId: user?._id,
      date: new Date().toLocaleString(),
    };

    // Update the comments state to include the new comment
    setComments([...comments, newComment]);

    // Clear the input field
    setMessage("");
  };
  function formatTimeAgo(date: Date | string) {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    let interval = seconds / 31536000; // 365 * 24 * 60 * 60

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000; // 30 * 24 * 60 * 60
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400; // 24 * 60 * 60
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600; // 60 * 60
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return "Just now";
  }
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleChange = (event: any) => {
    setChecked(event.target.checked);
  };

  // Adjust handleAddSignatory to also update the selectedValue
  const handleAddSignatory = (newSignatoryEmail: string) => {
    console.log(newSignatoryEmail, "caca");

    if (newSignatoryEmail && !collaborater.includes(newSignatoryEmail)) {
      setCollaborater((prev: any) => [...prev, { email: newSignatoryEmail }]);
      reset(); // Resetting form
      setInputValue(""); // Clearing the input value for Autocomplete
      setSelectedValue(null); // Resetting selected value
    }
  };

  // Function to remove a signatory from the list
  const handleRemoveSignatory = (signatoryToRemove: any) => {
    setCollaborater(
      collaborater.filter(
        (signatory: any) => signatory.email !== signatoryToRemove
      )
    );
  };

  const handleShareDilog = (signatory: any) => {
    setOpenDialog(true);
    const user = userList.find((user) => user.email === signatory);
    setClickData(user);
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
  const handleRemove = (emailToRemove: any) => {
    // Update collaboraters by removing the 'permission' property from the specified collaborator
    const updatedCollaboraters = collaborater.map((colb: any) => {
      if (colb.email === emailToRemove) {
        // Destructure to separate 'permission' and the rest of the properties
        const { permission, ...rest } = colb;
        // Return the rest, effectively omitting 'permission'
        return rest;
      }
      // Return unchanged if not the one being removed
      return colb;
    });

    // Update your state here with updatedCollaboraters
    // Assuming you're managing the collaborater array in a state
    setCollaborater(updatedCollaboraters);
  };

  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  return (
    <>
      <div style={{ textAlign: "left", position: "relative" }}>
        <Typography variant="body1" color="primary" sx={{ fontSize: "15px" }}>
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
              fontSize: "12px",
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
              setActiveSection("collaborate"),
                setShowButtons((prevShowButtons: any) => !prevShowButtons);
              setSelectedValue(null), setInputValue("");
            }}
          >
            + Add Collaborator
          </Button>
          <Button
            fullWidth
            sx={{
              fontSize: "12px",
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
              setActiveSection("message"),
                setShowButtons((prevShowButtons: any) => !prevShowButtons);
            }}
          >
            + Add Message
          </Button>
        </Box>

        {activeSection === "collaborate" && (
          <>
            {showButtons && (
              <>
                <Autocomplete
                  freeSolo
                  options={userList.map((user) => ({
                    label: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                  }))}
                  getOptionLabel={(option: any) => option.label || ""}
                  onInputChange={handleInputChange}
                  inputValue={inputValue}
                  value={selectedValue}
                  onChange={(_, value: any) => {
                    if (value) {
                      handleAddSignatory(value.email);
                      setSelectedValue(value); // Update selectedValue when a new value is selected
                    } else {
                      setSelectedValue(null); // Reset if no value is selected
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search by name or add email"
                      margin="normal"
                      variant="outlined"
                      size="small"
                      onKeyPress={handleKeyPress}
                      sx={{
                        ".MuiInputLabel-root": { fontSize: "14px" },
                        ".MuiOutlinedInput-root": { fontSize: "14px" },
                      }}
                    />
                  )}
                />
                <div style={{ flex: 1, textAlign: "right", marginTop: "0px" }}>
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
                      setShowButtons(false);
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
                    onClick={() => {
                      if (!selectedValue && inputValue.trim() !== "") {
                        handleAddSignatory(inputValue);
                      }
                      setShowButtons(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}

            {/* <div style={{ flex: 1, textAlign: "right" }}>
              {collaborater.length > 0 && showButtons && (
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
                      setCollaborater([]), setShowButtons(false);
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
            </div> */}
            {!showButtons &&
              collaborater?.map((colb: any, index: any) => {
                // Check if the colb's email is in the userList

                const isInternal = userList.some(
                  (user) => user.email === colb?.email
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
                          {colb?.email?.charAt(0).toUpperCase()}
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
                        {colb?.email}
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
                          color: "black",
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
                        onClick={() => handleRemoveSignatory(colb?.email)}
                        sx={{
                          mt: -1,
                          ml: 1,
                        }}
                      >
                        <DeleteIcon /> {/* Adjust the icon size if needed */}
                      </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", mt: -0.5 }}>
                      <Button
                        variant="text"
                        color="primary"
                        sx={{ textTransform: "none", whiteSpace: "nowrap" }}
                        onClick={() => handleShareDilog(colb?.email)}
                      >
                        {colb.permission ? "Document Shared" : "Share Document"}
                      </Button>
                      {colb.permission && (
                        <Button
                          variant="text"
                          color="error"
                          sx={{ textTransform: "none", whiteSpace: "nowrap" }}
                          onClick={() => handleRemove(colb?.email)}
                        >
                          Remove Access
                          {/* {colb.permission ? "Document Shared" : "Share Document"} */}
                        </Button>
                      )}
                    </Box>
                  </Box>
                );
              })}

            <div />
          </>
        )}

        {activeSection === "message" && (
          <Box>
            {showButtons && (
              <>
                <div
                  style={{
                    width: "100%",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <FormControlLabel
                      sx={{
                        whiteSpace: "nowrap",
                        "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                        // Apply any additional styling you need for the FormControlLabel here
                      }}
                      control={
                        <Checkbox
                          checked={isInternal === false}
                          onChange={() => setIsInternal(false)}
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
                        whiteSpace: "nowrap",
                        "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                        // Apply any additional styling you need for the FormControlLabel here
                      }}
                      control={
                        <Checkbox
                          checked={isInternal === true}
                          onChange={() => setIsInternal(true)}
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
                </div>
                <Box sx={{ mb: 2, mt: 2, alignItems: "center" }}>
                  <textarea
                    disabled={isInternal === ""}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add your message..."
                    maxLength={100}
                    rows={1}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      fontSize: "13px",
                      lineHeight: "20px", // Adjust line-height for better vertical alignment
                      padding: "10px 10px", // Adjust vertical padding to help center the text
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      resize: "block",
                    }}
                  />
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
                        setMessage("");
                        setIsInternal("");
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      color="inherit"
                      disabled={!message}
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
                      onClick={() => {
                        handleSendMessage(), setShowButtons(false);
                      }}
                    >
                      Post
                    </Button>
                  </div>
                </Box>
              </>
            )}
            {!showButtons && (
              <div>
                {comments.map((comment: any, index: any) => {
                  // Render all comments if user.email exists, otherwise render only external comments
                  if (user.email || (!user.email && !comment.isInternal)) {
                    return (
                      <Box key={index} sx={{ mt: 2 }}>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        >
                          {comment.name}
                        </Typography>

                        <Box sx={{ display: "flex", mt: 0.5, mb: 1 }}>
                          <Button
                            variant="contained"
                            color="inherit"
                            sx={{
                              textTransform: "none",
                              backgroundColor: "#DCDCDC",
                              "&:hover": {
                                backgroundColor: "#757575",
                              },
                              color: "black",
                              padding: "2px 5px !important",
                              height: "20px !important",
                              fontSize: "0.675rem",
                            }}
                          >
                            {comment.isInternal ? "Internal" : "External"}
                          </Button>

                          <div
                            style={{
                              color: "#BDBDBD",
                              fontSize: "11px",
                              marginLeft: "1rem",
                              marginTop: "0.2rem",
                            }}
                          >
                            {formatTimeAgo(comment.date)}
                          </div>
                        </Box>

                        <Card
                          sx={{
                            color: "#BDBDBD",
                            padding: 1,
                            fontSize: "12px",
                          }}
                        >
                          {comment.message}
                        </Card>
                      </Box>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </Box>
        )}
      </div>
      <CollaburaterDilog
        open={openDialog}
        onClose={handleCloseDialog}
        ClickData={ClickData}
      />
      {/* <CollaburaterDilog
        // onButtonClick={handleNextStep}
        onClose={handleCloseDialog}
        handleCloseDialog={handleCloseDialog}
      /> */}
    </>
  );
};

export default Discussion;
