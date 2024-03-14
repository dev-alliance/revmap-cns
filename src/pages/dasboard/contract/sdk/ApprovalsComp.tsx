/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Divider,
  Button,
  Tooltip,
  Typography,
  Card,
  CardContent,
  Box,
  Switch,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  TextField,
} from "@mui/material";
import { getList as getApprovalList } from "@/service/api/approval";
import { FormControl } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { getfeildList } from "@/service/api/customFeild";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ApprovalReasionDialog from "@/pages/dasboard/contract/sdk/ApprovalReasionDialog";
import { json } from "stream/consumers";
import warnig from "@/assets/Messages_Bubble_Warning.png";
type FormValues = {
  name: string;
};
const ApprovalsComp = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [approvalList, setApprovallist] = useState<any[]>([]);
  const [signatories, setSignatories] = useState<any[]>([]);
  const [showCompanySelect, setShowCompanySelect] = useState(false);
  const [showConditionalSelect, setShowConditionalSelect] = useState(false);
  const [showSignatories, setShowSignatories] = useState(false);
  const [reason, setReason] = useState("");
  const [buttonState, setButtonState] = useState("none"); // 'company', 'conditional', or 'none'
  const [switchState, setSwitchState] = useState({
    switch1: false,
    switch2: false,
  });
  const [selectedApproval, setSelectedApproval] = useState("mandatory");
  const [approvers, setApprovers] = useState<any[]>([]);
  const [userApproval, setUserApproval] = useState<any[]>([]);
  const [selectedApprovalId, setSelectedApprovalId] = useState("");
  const [userList, setUserList] = useState<Array<any>>([]);
  const [feildList, setFeildList] = useState<Array<any>>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState<any>(null);

  const handleOpenDialog = (approver: any) => {
    console.log(approver, "datadata");
    setDialogData(approver);
    setOpenDialog(true);
  };

  const handleDialogSubmit = (reason: any) => {
    setApprovers((prevApprovers) =>
      prevApprovers.map((approver) =>
        approver._id === dialogData._id ? { ...approver, reason } : approver
      )
    );
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedApproval(newValue); // Update the selected approval state
    // Call the custom function with the new value
  };

  const handleAddSignatory = (data: string[]) => {
    console.log(data, "names");
    setApprovers(data);
    // setApprovers(() => {
    //   // Instead of creating a set from prev, create an empty set for a fresh list
    //   const newSignatories = new Set(names); // Directly add new names, ensuring they're unique within this selection
    //   return Array.from(newSignatories);
    // });
  };
  console.log(approvers, "approvers");
  // Function to remove a signatory from the list
  const handleRemoveSignatory = (signatoryToRemove: any) => {
    setApprovers(
      approvers.filter((signatory: any) => signatory !== signatoryToRemove)
    );
  };

  const handleUserApproval = (newSignatoryEmail: string) => {
    console.log(newSignatoryEmail, "newSignatoryEmail");

    if (newSignatoryEmail && !signatories.includes(newSignatoryEmail)) {
      setUserApproval((prev: any) => [...prev, newSignatoryEmail]);
      // Assuming you manage the input value for Autocomplete
    }
  };
  const handleremoveUserApproval = (signatoryToRemove: any) => {
    setUserApproval(
      signatories.filter((signatory: any) => signatory !== signatoryToRemove)
    );
  };
  const handleCompanyApprovalClick = () => {
    setShowCompanySelect(true);
    setShowConditionalSelect(false);
    setButtonState("company");
  };

  const handleConditionalApprovalClick = () => {
    setShowCompanySelect(false);
    setShowConditionalSelect(true);
    setButtonState("conditional");
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserListNameID(user?._id);

      setUserList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const listApprovalData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getApprovalList();
      console.log({ data });

      setApprovallist(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const listFeildData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getfeildList();

      setFeildList(data);

      console.log("data", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      listData();
      listFeildData();
      listApprovalData();
    }
  }, [user?._id]);

  const handleRejectApproverByEmail = (app: any) => {
    const reason = prompt("Please enter the reason for rejection:");
    // This confirms the passed email argument is as expected.

    if (reason) {
      setApprovers((prevApprovers) =>
        prevApprovers.map((approver) => {
          console.log(approver, "shah");
          return approver._id === app._id
            ? { ...approver, reason: reason }
            : approver;
        })
      );
    }
  };
  console.log(approvers, "ok");

  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"]; // Yellow, Green, Blue
  return (
    <div style={{ textAlign: "left", position: "relative" }}>
      <Typography variant="body1" color="primary">
        Approvals
      </Typography>
      <Typography
        variant="body2"
        color="#8A8A8A"
        sx={{ fontSize: "11px", mt: 1 }}
      >
        Add a pre-approved approval workflow or create a custom or conditional
        workflow to get the contract approved before signing
      </Typography>
      <Divider style={{ margin: "20px 0" }} />

      <div style={{ textAlign: "left" }}>
        <Button
          variant="text"
          color={buttonState === "company" ? "primary" : "inherit"} // Changed "default" to "inherit"
          sx={{ textTransform: "none" }}
          onClick={handleCompanyApprovalClick}
        >
          + Set company approvals
        </Button>

        {showCompanySelect && (
          <>
            {signatories.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  variant="text"
                  sx={{ textTransform: "none" }}
                  onClick={() => setShowSignatories(true)}
                >
                  View
                </Button>
                <div style={{ textAlign: "right" }}>
                  <Button
                    variant="text"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      setSignatories([]);
                    }}
                  >
                    Edit
                  </Button>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Button
                    variant="text"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      setSignatories([]), setSelectedApprovalId("");
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <Select
                value={selectedApprovalId}
                onChange={(event) => {
                  const { value } = event.target; // Directly access the selected value
                  setSelectedApprovalId(value); // Update the local state with the new value

                  // Find the team by the selected value (ID)

                  // Transform the approver list into a suitable format for display
                  const selectedApproval = approvalList.find(
                    (approval) => approval._id === value
                  );

                  // Invoke the custom function with the approver names list
                  handleAddSignatory(selectedApproval.approver);
                }}
                displayEmpty
                renderValue={(selectedValue) =>
                  selectedValue === "" ? (
                    <em
                      style={{
                        color: "#C2C2C2",
                        fontStyle: "normal",
                        fontSize: "15.5px",
                      }}
                    >
                      Select Approval
                    </em>
                  ) : (
                    approvalList.find(
                      (approval) => approval._id === selectedValue
                    )?.name || ""
                  )
                }
              >
                {approvalList.map((approval) => (
                  <MenuItem key={approval._id} value={approval._id}>
                    {approval.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                  padding: "2px 5px !important", // Force padding
                  height: "25px !important", // Reduce minimum height
                  fontSize: "0.675rem", // Adjust font size if necessary
                }}
                onClick={() => setShowSignatories(false)}
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
                onClick={() => setShowSignatories(!showSignatories)} // Toggle visibility
              >
                Save
              </Button>
            </div>

            {showSignatories &&
              approvers.map((companyApproval, index) => (
                <>
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1, mt: 2 }}
                  >
                    <Box
                      sx={{
                        width: "25px !important",
                        height: "25px !important",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        backgroundColor:
                          bubbleColors[index % bubbleColors.length],
                        color: "#FFFFFF",
                        marginRight: -1,

                        mr: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: "12px" }}>
                        {companyApproval?.email?.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        width: "120px",
                        textOverflow: "ellipsis",
                        fontSize: "10px",
                      }}
                    >
                      {companyApproval?.email}
                    </Typography>
                    <div style={{ display: "flex" }}>
                      {" "}
                      <Button
                        variant="text"
                        sx={{
                          textTransform: "none",
                          fontSize: "16px",
                          color: "#31C65B",
                          fontWeight: "bold",
                          padding: "0 8px", // Reduce padding here
                          minWidth: "auto", // Ensures the button width is only as wide as its content
                        }}
                        onClick={() => handleOpenDialog(companyApproval)}
                      >
                        <CheckCircleOutlineIcon fontSize="small" />
                      </Button>
                      <Button
                        variant="text"
                        sx={{
                          textTransform: "none",
                          fontSize: "16px",
                          color: "#BEBEBE",
                          fontWeight: "bold",
                          padding: "0 8px", // Style adjustments as needed
                          minWidth: "auto", // Ensures button width is only as wide as its content
                        }}
                        onClick={() => handleOpenDialog(companyApproval)}
                      >
                        <HighlightOffIcon fontSize="small" />{" "}
                        {companyApproval?.reason && (
                          <Tooltip title={companyApproval?.reason}>
                            <img
                              src={warnig}
                              alt="Logo"
                              style={{ width: "70%", marginTop: "-1rem" }}
                            />
                          </Tooltip>
                        )}
                      </Button>
                    </div>
                  </Box>
                  {/* <ApprovalReasionDialog
                    open={openDialog}
                    onClose={handleCloseDialog}

                  /> */}
                </>
              ))}
          </>
        )}

        <Button
          variant="text"
          color={buttonState === "conditional" ? "primary" : "inherit"} // Changed "default" to "inherit"
          sx={{ textTransform: "none", mt: 1 }}
          onClick={handleConditionalApprovalClick}
        >
          + Create conditional approvals
        </Button>

        {showConditionalSelect && (
          <React.Fragment>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="approval-type"
                name="approvalType"
                sx={{ fontSize: "5px" }}
                value={selectedApproval}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="mandatory"
                  control={<Radio />}
                  label="User approval (Mandatory)"
                  componentsProps={{ typography: { sx: { fontSize: "12px" } } }}
                />
                <FormControlLabel
                  sx={{ fontSize: "5px" }}
                  value="conditional"
                  control={<Radio />}
                  label="Conditional approval (depending on custom fields)"
                  componentsProps={{ typography: { sx: { fontSize: "12px" } } }}
                />
              </RadioGroup>
            </FormControl>

            {selectedApproval === "mandatory" && (
              <>
                {userApproval.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "100%",
                      marginTop: "5px",
                      marginBottom: "-15px",
                    }}
                  >
                    <Button
                      variant="text"
                      sx={{ textTransform: "none" }}
                      onClick={() => setShowSignatories(true)}
                    >
                      View
                    </Button>
                    <div style={{ textAlign: "right" }}>
                      <Button
                        variant="text"
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                          setSignatories([]);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Button
                        variant="text"
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                          setUserApproval([]), setSelectedApprovalId("");
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!error}
                      sx={{ mt: 2 }}
                    >
                      <Autocomplete
                        {...field}
                        freeSolo
                        options={userList} // Use the userList directly
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : `${option.firstName} ${option.lastName}`
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search user"
                            variant="outlined"
                          />
                        )}
                        onInputChange={(event, value) => {
                          // Handle free solo input change if necessary
                        }}
                        onChange={(event, value) => {
                          if (typeof value === "string") {
                            field.onChange(value);
                            handleUserApproval(""); // Handle the case where a free solo value is inputted
                          } else if (value && "email" in value) {
                            handleUserApproval(value.email);
                            field.onChange(
                              `${value.firstName} ${value.lastName}`
                            ); // Or however you wish to handle the field change
                          }
                        }}
                      />
                    </FormControl>
                  )}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginTop: "10px",
                    marginBottom: "10px",
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
                      padding: "2px 5px !important", // Force padding
                      height: "25px !important", // Reduce minimum height
                      fontSize: "0.675rem", // Adjust font size if necessary
                    }}
                    onClick={() => setShowSignatories(false)}
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
                    onClick={() => setShowSignatories(!showSignatories)} // Toggle visibility
                  >
                    Save
                  </Button>
                </div>

                {showSignatories &&
                  userApproval.map((signatory, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          backgroundColor:
                            bubbleColors[index % bubbleColors.length],
                          color: "#FFFFFF",
                          marginRight: -1,

                          mr: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: "8px" }}>
                          {signatory?.charAt(0).toUpperCase()}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          width: "130px",
                          textOverflow: "ellipsis",
                          fontSize: "10px",
                        }}
                      >
                        {signatory}
                      </Typography>
                      <div style={{ display: "flex" }}>
                        {" "}
                        <Button
                          variant="text"
                          sx={{
                            textTransform: "none",
                            fontSize: "16px",
                            color: "#31C65B",
                            fontWeight: "bold",
                            padding: "0 8px", // Reduce padding here
                            minWidth: "auto", // Ensures the button width is only as wide as its content
                          }}
                          onClick={() => handleRemoveSignatory(signatory)}
                        >
                          <CheckCircleOutlineIcon fontSize="small" />
                        </Button>
                        <Button
                          variant="text"
                          sx={{
                            textTransform: "none",
                            fontSize: "16px",
                            color: "#BEBEBE",
                            fontWeight: "bold",
                            padding: "0 8px", // Reduce padding here
                            minWidth: "auto", // Ensures the button width is only as wide as its content
                          }}
                          onClick={() => handleRemoveSignatory(signatory)}
                        >
                          <HighlightOffIcon fontSize="small" />
                        </Button>
                      </div>
                    </Box>
                  ))}
              </>
            )}

            {selectedApproval === "conditional" && (
              // Render other components when 'conditional' is selected
              <div>
                <FormControl fullWidth size="small" sx={{ mt: 2, mb: 2 }}>
                  <Select
                    value={selectedApprovalId}
                    onChange={(event) => {
                      const { value } = event.target; // Directly access the selected value
                      setSelectedApprovalId(value); // Update the local state with the new value

                      // Find the team by the selected value (ID)
                      const selectedTeam = feildList.find(
                        (team) => team._id === value
                      );

                      // Invoke the custom function with the selected team's name or an empty string
                      handleAddSignatory(selectedTeam ? selectedTeam.name : "");
                    }}
                    displayEmpty
                    renderValue={(selectedValue) =>
                      selectedValue === "" ? (
                        <em
                          style={{
                            color: "#C2C2C2",
                            fontStyle: "normal",
                            fontSize: "15.5px",
                          }}
                        >
                          Select feild
                        </em>
                      ) : (
                        feildList.find((team) => team._id === selectedValue)
                          ?.name || ""
                      )
                    }
                  >
                    {feildList.map((approval) => (
                      <MenuItem key={approval._id} value={approval._id}>
                        {approval.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
      <ApprovalReasionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleDialogSubmit}
        dialogData={dialogData}
      />
    </div>
  );
};

export default ApprovalsComp;
