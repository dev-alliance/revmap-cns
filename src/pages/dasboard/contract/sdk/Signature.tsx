/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Divider,
  Button,
  Grid,
  Typography,
  Card,
  TextField,
  Box,
  Autocomplete,
  FormControl,
  IconButton,
  Switch,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { getList } from "@/service/api/approval";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, Controller } from "react-hook-form";
import { ContractContext } from "@/context/ContractContext";
import SignatureSendReq from "@/pages/dasboard/contract/sdk/SignatureSendReq";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SignatureMultiSendReq from "@/pages/dasboard/contract/sdk/SignatureMultiSendReq";
type FormValues = {
  name: string;
  checkboxName: any;
};
const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Signature = () => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const { user } = useAuth();
  const {
    activeSection,
    setActiveSection,
    showButtons,
    setShowButtons,
    recipients,
    setRecipients,
    setOpenMultiDialog,
    openMultiDialog,
  } = useContext(ContractContext);

  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [isInternal, setIsInternal] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);
  const { signatories, setSignatories } = useContext(ContractContext);
  const [checked, setChecked] = React.useState(false);
  const [siningOrder, setSiningOrder] = useState(false);
  const [signatureopenDialog, setOpenSignatureDialog] = useState(false);

  const [ClickData, setClickData] = useState("");

  const handleCloseDialog = () => {
    setOpenSignatureDialog(false);
  };
  const handleClosMultieDialog = () => {
    setOpenMultiDialog(false);
  };
  const handleShareDilog = (signatory: any) => {
    if (siningOrder) {
      setOpenMultiDialog(true);
    } else {
      setOpenSignatureDialog(true);
    }

    const user = userList.find((user) => user.email === signatory?.email);
    if (user) {
      setClickData(user);
    } else {
      setClickData(signatory);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const reorderedRecipients = reorder(
      recipients,
      result.source.index,
      result.destination.index
    );
    setRecipients(reorderedRecipients);
  };

  const handleCheckboxChange = (event: any) => {
    setSiningOrder(event.target.checked);
  };
  const handleAddSignatory = (newSignatoryEmail: string) => {
    const emailExists = recipients.some(
      (collaborator: any) => collaborator.email === newSignatoryEmail
    );

    if (newSignatoryEmail && !emailExists) {
      setRecipients((prev: any) => [...prev, { email: newSignatoryEmail }]);
      reset(); // Resetting form
      setInputValue(""); // Clearing the input value for Autocomplete
      setSelectedValue(null); // Resetting selected value
    }
  };

  // Function to remove a signatory from the list
  const handleRemoveSignatory = (signatoryToRemove: any) => {
    setRecipients(
      recipients.filter(
        (signatory: any) => signatory.email !== signatoryToRemove
      )
    );
  };

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

  // const handleRemove = (emailToRemove: any) => {
  //   // Update collaboraters by removing the 'permission' property from the specified collaborator
  //   const updatedCollaboraters = collaborater.map((colb: any) => {
  //     if (colb.email === emailToRemove) {
  //       // Destructure to separate 'permission' and the rest of the properties
  //       const { permission, ...rest } = colb;
  //       // Return the rest, effectively omitting 'permission'
  //       return rest;
  //     }
  //     // Return unchanged if not the one being removed
  //     return colb;
  //   });

  //   // Update your state here with updatedCollaboraters
  //   // Assuming you're managing the collaborater array in a state
  //   setRecipients(updatedCollaboraters);
  // };

  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  return (
    <>
      <div style={{ textAlign: "left", position: "relative" }}>
        <Typography variant="body1" color="primary">
          Recipients
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Add recipients who will sign this document.
        </Typography>
        <Divider style={{ margin: "10px 0" }} />

        {(recipients.length === 0 || showButtons) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start", // Align items to the left
              alignItems: "center", // Center items vertically if needed
              width: "100%", // Ensure the Box takes full width if necessary for your layout
            }}
          >
            <Button
              sx={{
                fontSize: "12px",
                textTransform: "none !important",
                borderRadius: 0,
                color:
                  activeSection === "collaborate" ? "primary.main" : "black",
                fontWeight: "bold",
                "&:hover": {
                  borderBottom: 2,
                  borderColor: "primary.main",
                  backgroundColor: "transparent",
                },
                borderColor:
                  activeSection === "collaborate"
                    ? "primary.main"
                    : "transparent",
              }}
              onClick={() => {
                setActiveSection("collaborate");
                setShowButtons((prevShowButtons: any) => !prevShowButtons);
                setSelectedValue(null);
                setInputValue("");
              }}
            >
              + Add Recipients
            </Button>
          </Box>
        )}
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
                  setSelectedValue(null), setInputValue("");
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="inherit"
                disabled={!selectedValue && !inputValue}
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

        {!showButtons && (
          <>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable" isDropDisabled={!siningOrder}>
                {(provided: any, snapshot: any) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    {recipients.map((colb: any, index: any) => {
                      const isInternal = userList.some(
                        (user) => user.email === colb?.email
                      );
                      console.log("Rendering recipient", colb.email);
                      return (
                        <Draggable
                          key={colb.email}
                          draggableId={colb.email}
                          index={index}
                          isDragDisabled={!siningOrder}
                        >
                          {(provided: any, snapshot: any) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              key={index}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                overflow: "auto",
                                backgroundColor: snapshot.isDragging
                                  ? "lightblue"
                                  : "white",
                                // Add other styling as needed
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {siningOrder && `${index + 1} \u00A0`}
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

                              <Box sx={{ display: "contents", ml: 4.5 }}>
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
                                      // Only applies margin-left to the first button
                                    },
                                    color: "black",
                                    padding: "2px 5px !important",
                                    height: "25px !important",
                                    fontSize: "0.675rem",
                                    ml: 4.7,
                                  }}
                                >
                                  {isInternal ? "Internal" : "External"}
                                </Button>
                                <Button
                                  variant="text"
                                  color="success"
                                  sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    mt: -0.3,
                                    ml: 4,
                                  }}
                                  onClick={() => handleShareDilog(colb)}
                                >
                                  {colb.ReqOption ? (
                                    <>
                                      <CheckCircleOutlineIcon fontSize="medium" />{" "}
                                      Request Sent
                                    </>
                                  ) : (
                                    "Send request to sign "
                                  )}
                                </Button>

                                <Button
                                  variant="text"
                                  color="warning"
                                  sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    mt: -0.8,
                                    ml: 4,
                                  }}
                                  onClick={() =>
                                    handleRemoveSignatory(colb?.email)
                                  }
                                >
                                  Replace signer
                                </Button>
                                <Button
                                  variant="text"
                                  color="error"
                                  sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    mt: -0.8,
                                    ml: 4,
                                  }}
                                  onClick={() =>
                                    handleRemoveSignatory(colb?.email)
                                  }
                                >
                                  Remove recipient
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </>
        )}

        {!showButtons && recipients.length > 0 && (
          <>
            <Button
              variant="text"
              color="primary"
              sx={{
                fontSize: "11px",
                textTransform: "none",
                whiteSpace: "nowrap",

                fontWeight: "bold",
              }}
              onClick={() => {
                setActiveSection("collaborate");
                setShowButtons((prevShowButtons: any) => !prevShowButtons);
                setSelectedValue(null);
                setInputValue("");
              }}
            >
              + Add Recipients
            </Button>
            <Divider style={{ margin: "10px 0" }} />
            <FormControlLabel
              sx={{
                "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                // Apply any additional styling you need for the FormControlLabel here
              }}
              control={
                <Checkbox
                  checked={siningOrder}
                  onChange={(e) => setSiningOrder(e.target.checked)}
                  name="siningOrder"
                  color="primary"
                  sx={{
                    padding: "5px", // Adjusts padding around the checkbox
                    "& .MuiSvgIcon-root": {
                      // Targets the SVG icon representing the checkbox
                      fontSize: "18px", // Adjust this value to scale the icon size
                    },
                  }}
                />
              }
              label="Signing order"
            />
          </>
        )}
      </div>
      <SignatureSendReq
        open={signatureopenDialog}
        onClose={handleCloseDialog}
        ClickData={ClickData}
      />
      <SignatureMultiSendReq
        open={openMultiDialog}
        onClose={handleClosMultieDialog}
        ClickData={ClickData}
      />
    </>
  );
};

export default Signature;
