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
  Input,
  IconButton,
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
import send from "@/assets/Email_Sending.png";
import DeleteIcon from "@mui/icons-material/Delete";

type FormValues = {
  name: string;
};
const ApprovalsComp = () => {
  const {
    control,
    handleSubmit,
    watch,

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
  const [showSignatories, setShowSignatories] = useState<any>("");
  const [reason, setReason] = useState("");
  const [buttonState, setButtonState] = useState("none"); // 'company', 'conditional', or 'none'
  const [switchState, setSwitchState] = useState({
    switch1: false,
    switch2: false,
  });
  const [selectedApproval, setSelectedApproval] = useState("");
  const [approvers, setApprovers] = useState<any[]>([]);
  const [userApproval, setUserApproval] = useState<any[]>([]);
  const [selectedApprovalId, setSelectedApprovalId] = useState("");
  const [userList, setUserList] = useState<Array<any>>([]);
  const [feildList, setFeildList] = useState<Array<any>>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState<any>(null);
  const [comparisonOperator, setComparisonOperator] = useState("");
  const [value, setValue] = useState<any>("");
  const [conditions, setConditions] = useState([
    { selectedApprovalId: "", comparisonOperator: "", value: "" },
  ]);

  const removeCondition = (indexToRemove: any) => {
    setConditions(conditions.filter((_, index) => index !== indexToRemove));
  };

  const handleFieldChange = (index: any, event: any) => {
    const updatedConditions = conditions.map((condition, idx) =>
      idx === index
        ? { ...condition, selectedApprovalId: event.target.value }
        : condition
    );
    setConditions(updatedConditions);
  };

  const handleOperatorChange = (index: any, event: any) => {
    const updatedConditions = conditions.map((condition, idx) =>
      idx === index
        ? { ...condition, comparisonOperator: event.target.value }
        : condition
    );
    setConditions(updatedConditions);
  };

  const handleValueChange = (index: any, event: any) => {
    const updatedConditions = conditions.map((condition, idx) =>
      idx === index ? { ...condition, value: event.target.value } : condition
    );
    setConditions(updatedConditions);
  };

  const addCondition = () => {
    setConditions(
      conditions.concat({
        selectedApprovalId: "",
        comparisonOperator: "",
        value: "",
      })
    );
  };

  const handleOpenDialog = (approver: any) => {
    console.log(approver, "datadata");
    setDialogData(approver);
    setOpenDialog(true);
  };

  const handleDialogSubmit = (
    status: string,
    reason: string,
    approver: any,
    Resolved: string
  ) => {
    if (approver) {
      setDialogData(approver);
    }
    setApprovers((prevApprovers) =>
      prevApprovers.map((currentApprover) =>
        currentApprover?._id === dialogData?._id
          ? {
              ...currentApprover,
              status: status === "" ? "" : status,
              reason: Resolved === "resolved" ? "" : reason.trim(), // Set reason to empty if resolved, otherwise use the trimmed reason
            }
          : currentApprover
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
            {(showSignatories === "topbar" ||
              showSignatories === "view" ||
              showSignatories === "edit") && (
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
                  onClick={() =>
                    setShowSignatories((prev: any) =>
                      prev === "view" ? "edit" : "view"
                    )
                  }
                >
                  View
                </Button>
                <div style={{ textAlign: "right" }}>
                  <Button
                    variant="text"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      // setSignatories([]),
                      // setSelectedApprovalId(""),
                      setShowSignatories("edit");
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
                      setSignatories([]),
                        setSelectedApprovalId(""),
                        setShowSignatories(""),
                        setApprovers([]);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
            {selectedApproval && (
              <Typography sx={{ fontSize: "14px", marginTop: "1rem" }}>
                Selected: {selectedApproval}
              </Typography>
            )}

            <Autocomplete
              style={{ marginTop: "1rem" }}
              value={
                approvalList.find(
                  (approval) => approval._id === selectedApprovalId
                ) || null
              }
              onChange={(event, newValue) => {
                const value = newValue ? newValue._id : "";
                setSelectedApprovalId(value);

                // Update the selectedApproval to display the name
                if (newValue) {
                  setSelectedApproval(newValue.name); // Assuming you have a function to set this state
                  handleAddSignatory(newValue.approver);
                } else {
                  setSelectedApproval(""); // Clear the selected approval name if no selection
                }
              }}
              options={approvalList}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    readOnly: true,
                  }}
                  variant="outlined"
                  label="Select Approval"
                />
              )}
              disabled={
                showSignatories === "topbar" || showSignatories === "view"
              }
              clearOnEscape
              renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
              )}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              clearText="Remove"
              noOptionsText="No Approvals"
            />

            {approvers.length > 0 &&
              (showSignatories === "" || showSignatories === "edit") && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginBottom: "0.5rem",
                  }}
                >
                  {showSignatories !== "edit" && (
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
                        setSignatories([]),
                          setSelectedApprovalId(""),
                          setShowSignatories(""),
                          setApprovers([]);
                        setShowCompanySelect(false);
                        setShowConditionalSelect(false);
                        setButtonState("");
                      }}
                    >
                      Cancel
                    </Button>
                  )}
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
                    onClick={() => setShowSignatories("topbar")} // Toggle visibility
                  >
                    Save
                  </Button>
                </div>
              )}
            {showSignatories === "view" &&
              approvers.map((companyApproval, index) => (
                <>
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      mt: 2,
                    }}
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
                      <Typography sx={{ fontSize: "14px" }}>
                        {companyApproval?.email?.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        // fontWeight: "bold",
                        width: "120px",
                        textOverflow: "ellipsis",
                        fontSize: "16px",
                      }}
                    >
                      {companyApproval?.email}
                    </Typography>
                  </Box>
                  <div style={{ display: "flex" }}>
                    {companyApproval?.status ? (
                      <Typography
                        variant="body1"
                        sx={{
                          ml: 4,
                          display: "flex",
                          // fontWeight: "bold",
                          color:
                            companyApproval?.status === "Rejected"
                              ? "red"
                              : companyApproval?.status === "Approved"
                              ? "green"
                              : "inherit", // Default text color
                        }}
                      >
                        {companyApproval?.status === "Rejected" && (
                          <Tooltip title={companyApproval?.reason}>
                            <img
                              onClick={() =>
                                handleDialogSubmit("", "", companyApproval, "")
                              }
                              src={send}
                              alt="Logo"
                              style={{
                                width: "20px",
                                height: "20px",
                                marginRight: "1rem",
                              }}
                            />
                          </Tooltip>
                        )}{" "}
                        {companyApproval?.status}
                      </Typography>
                    ) : (
                      <>
                        <Button
                          variant="text"
                          sx={{
                            textTransform: "none",
                            fontSize: "16px",
                            color: "#31C65B",
                            fontWeight: "bold",
                            padding: "0 8px", // Reduce padding here
                            minWidth: "auto",
                            ml: 3, // Ensures the button width is only as wide as its content
                          }}
                          onClick={() =>
                            handleDialogSubmit(
                              "Approved",
                              "",
                              companyApproval,
                              ""
                            )
                          }
                        >
                          <CheckCircleOutlineIcon fontSize="medium" />
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
                          <HighlightOffIcon />{" "}
                        </Button>
                        <Tooltip title={companyApproval?.reason}>
                          <img
                            onClick={() =>
                              handleDialogSubmit("", "", companyApproval, "")
                            }
                            src={send}
                            alt="Logo"
                            style={{
                              width: "20px",
                              height: "20px",
                              marginLeft: "0.6rem",
                              marginTop: "0.2rem",
                            }}
                          />
                        </Tooltip>
                      </>
                    )}
                    {companyApproval?.reason && (
                      <Tooltip title={companyApproval?.reason}>
                        <img
                          onClick={() => handleOpenDialog(companyApproval)}
                          src={warnig}
                          alt="Logo"
                          style={{
                            width: "20px",
                            height: "20px",
                            marginTop: "-0.4rem",
                            marginLeft: "1rem",
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
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
                {userApproval.length === 0 && (
                  <Button
                    variant="text"
                    color={buttonState === "company" ? "primary" : "inherit"} // Changed "default" to "inherit"
                    sx={{ textTransform: "none", mt: 1 }}
                    // onClick={handleCompanyApprovalClick}
                  >
                    + Get approval from
                  </Button>
                )}
                {userApproval.length > 0 &&
                  (showSignatories === "topbar" ||
                    showSignatories === "view" ||
                    showSignatories === "edit") && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        marginTop: "1rem",
                        marginBottom: "-1rem",
                      }}
                    >
                      <Button
                        variant="text"
                        sx={{ textTransform: "none" }}
                        onClick={() =>
                          setShowSignatories((prev: any) =>
                            prev === "view" ? "edit" : "view"
                          )
                        }
                      >
                        View
                      </Button>
                      <div style={{ textAlign: "right" }}>
                        <Button
                          variant="text"
                          sx={{ textTransform: "none" }}
                          onClick={() => {
                            // setSignatories([]),
                            // setSelectedApprovalId(""),
                            setShowSignatories("edit");
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
                            setSignatories([]),
                              setSelectedApprovalId(""),
                              setShowSignatories(""),
                              setUserApproval([]);
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
                    <FormControl fullWidth size="small">
                      <Autocomplete
                        {...field}
                        disabled={
                          showSignatories === "topbar" ||
                          showSignatories === "view"
                        }
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

                {userApproval.length > 0 &&
                  (showSignatories === "" || showSignatories === "edit") && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        marginBottom: "0.5rem",
                        marginTop: "1rem",
                      }}
                    >
                      {showSignatories !== "edit" && (
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
                          onClick={() => {
                            setSignatories([]),
                              setSelectedApprovalId(""),
                              setShowSignatories(""),
                              setApprovers([]);
                            setShowCompanySelect(false);
                            setShowConditionalSelect(false);
                            setButtonState("");
                          }}
                        >
                          Cancel
                        </Button>
                      )}
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
                        onClick={() => setShowSignatories("topbar")} // Toggle visibility
                      >
                        Save
                      </Button>
                    </div>
                  )}

                {showSignatories === "view" &&
                  userApproval.map((signatory, index) => (
                    <Box
                      key={index}
                      sx={{
                        // display: "flex",
                        alignItems: "center",
                        mb: 1,
                        mt: 1,
                      }}
                    >
                      <div style={{ display: "flex" }}>
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
                            marginRight: -1,

                            mr: 1,
                          }}
                        >
                          <Typography sx={{ fontSize: "14px" }}>
                            {signatory?.charAt(0).toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            // fontWeight: "bold",
                            width: "130px",
                            textOverflow: "ellipsis",
                            fontSize: "16px",
                          }}
                        >
                          {signatory}
                        </Typography>
                      </div>
                      <div style={{ display: "flex", marginTop: "5px" }}>
                        {" "}
                        <Button
                          variant="text"
                          sx={{
                            textTransform: "none",
                            fontSize: "16px",
                            color: "#31C65B",
                            fontWeight: "bold",
                            padding: "0 8px", // Reduce padding here
                            minWidth: "auto",
                            ml: 3, // Ensures the button width is only as wide as its content
                          }}
                          onClick={() => handleRemoveSignatory(signatory)}
                        >
                          <CheckCircleOutlineIcon />
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
                          <HighlightOffIcon />
                        </Button>
                      </div>
                    </Box>
                  ))}
              </>
            )}

            {selectedApproval === "conditional" && (
              <>
                <>
                  {conditions.map((condition, index) => (
                    <Card
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "20px",
                        padding: "5px",
                      }}
                    >
                      {/* Field Selection */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            border: "1px solid #C2C2C2",
                            padding: "8px",
                            display: "flex",
                            alignItems: "center",
                            marginRight: "8px",
                            color: "#155BE5",
                            marginBottom: "0.5rem",
                            borderRadius: "4px",
                          }}
                        >
                          If
                        </Box>
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ mt: 0, mb: 1 }}
                        >
                          <Select
                            value={condition.selectedApprovalId}
                            onChange={(event) =>
                              handleFieldChange(index, event)
                            }
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
                                  Select field
                                </em>
                              ) : (
                                feildList.find(
                                  (team) => team._id === selectedValue
                                )?.name || ""
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
                        <IconButton
                          sx={{
                            width: "5px",
                            position: "absolute",
                            right: -17,
                            marginTop: "-15px",
                          }}
                          onClick={() => removeCondition(index)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>

                      {/* Comparison Operator Selection and Value Input */}
                      <Box
                        sx={{
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                          <Select
                            value={condition.comparisonOperator}
                            onChange={(event) =>
                              handleOperatorChange(index, event)
                            }
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
                                  Select condition
                                </em>
                              ) : (
                                selectedValue
                              )
                            }
                          >
                            <MenuItem value="greater or equal to">
                              greater or equal to
                            </MenuItem>
                            <MenuItem value="equals">equals</MenuItem>
                            <MenuItem value="does not equal">
                              does not equal
                            </MenuItem>
                            <MenuItem value="less than">less than</MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                          placeholder="Enter value"
                          value={condition.value}
                          size="small"
                          onChange={(event) => handleValueChange(index, event)}
                          style={{ flexGrow: 1 }}
                        />
                      </Box>
                    </Card>
                  ))}

                  <Button
                    variant="text"
                    color="primary"
                    sx={{ textTransform: "none" }}
                    onClick={addCondition}
                  >
                    + Add Condition
                  </Button>
                </>
              </>
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
