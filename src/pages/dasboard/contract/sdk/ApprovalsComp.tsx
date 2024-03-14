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
  const [showSignatories, setShowSignatories] = useState("");
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
        currentApprover._id === dialogData._id
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
                  onClick={() => setShowSignatories("view")}
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
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <Select
                value={selectedApprovalId}
                onChange={(event) => {
                  const { value } = event.target;
                  setSelectedApprovalId(value);

                  // Your existing logic to find and transform the selected approval
                  const selectedApproval = approvalList.find(
                    (approval) => approval._id === value
                  );
                  handleAddSignatory(selectedApproval.approver);
                }}
                displayEmpty
                disabled={
                  selectedApprovalId !== "" && showSignatories !== "edit"
                }
                // Disable the Select if an item is selected
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
                  <MenuItem
                    key={approval._id}
                    value={approval._id}
                    style={{
                      // Conditionally style the MenuItem to appear disabled if it's the selected item
                      color:
                        selectedApprovalId === approval._id
                          ? "#C2C2C2"
                          : undefined,
                    }}
                  >
                    {approval.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                          ml: 1,
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
                            ml: -1, // Ensures the button width is only as wide as its content
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
                          <CheckCircleOutlineIcon />
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
                            marginLeft: "0.4rem",
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
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      mt: 1,
                    }}
                  >
                    Get Approval from +
                  </Typography>
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
                        onClick={() => setShowSignatories("view")}
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
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        mt: 1,
                      }}
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
              <>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {" "}
                  {/* Adjust alignment and spacing */}
                  <Box
                    sx={{
                      border: "1px solid #C2C2C2", // Gray border
                      padding: "8px", // Adjust padding as needed
                      display: "flex", // Ensure Box content is flex-aligned
                      alignItems: "center", // Vertically center the content in the Box
                      marginRight: "8px", // Optional: add some spacing between the Box and the FormControl
                    }}
                  >
                    If
                  </Box>
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
                        handleAddSignatory(
                          selectedTeam ? selectedTeam.name : ""
                        );
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={comparisonOperator}
                      onChange={(e) => setComparisonOperator(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="greater or equal to">
                        {"greater or equal to"}
                      </MenuItem>
                      <MenuItem value="equals">{"equals"}</MenuItem>
                      <MenuItem value="does not equal">
                        {"does not equal"}
                      </MenuItem>
                      <MenuItem value="less than">{"less than"}</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField // Changed from Input to TextField
                    placeholder="Value"
                    value={value}
                    size="small" // Match the size with the Select component
                    onChange={(e) => setValue(e.target.value)}
                  />
                </Box>
                <Button
                  variant="text"
                  color="primary"
                  sx={{ textTransform: "none", marginLeft: "-0.5rem" }}
                  // onClick={() => handleAddSignatory(inputValue)}
                >
                  + Add Condition
                </Button>
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
