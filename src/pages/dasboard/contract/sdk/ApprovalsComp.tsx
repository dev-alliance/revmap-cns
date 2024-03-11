/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Divider,
  Button,
  Grid,
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
import { getList } from "@/service/api/approval";
import { FormControl } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
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
  const [showCompanySelect, setShowCompanySelect] = useState(false);
  const [showConditionalSelect, setShowConditionalSelect] = useState(false);
  const [buttonState, setButtonState] = useState("none"); // 'company', 'conditional', or 'none'
  const [switchState, setSwitchState] = useState({
    switch1: false,
    switch2: false,
  });
  const [selectedApproval, setSelectedApproval] = useState("");
  const [signatories, setSignatories] = useState<string[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [userList, setUserList] = useState<Array<any>>([]);
  const handleChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedApproval(newValue); // Update the selected approval state
    // Call the custom function with the new value
  };
  const handleAddSignatory = (name: string) => {
    if (name && !signatories.includes(name)) {
      setSignatories((prev: any) => [...prev, name]);
    }
  };

  // Function to remove a signatory from the list
  const handleRemoveSignatory = (signatoryToRemove: any) => {
    setSignatories(
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
    <div style={{ textAlign: "left", position: "relative" }}>
      <Typography variant="body1" color="primary">
        Approvals
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ fontSize: "11px" }}
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
            <FormControl fullWidth size="small" sx={{ mt: 2, mb: 2 }}>
              <Select
                value={selectedTeamId}
                onChange={(event) => {
                  const { value } = event.target; // Directly access the selected value
                  setSelectedTeamId(value); // Update the local state with the new value

                  // Find the team by the selected value (ID)
                  const selectedTeam = approvalList.find(
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
                      Select Approval
                    </em>
                  ) : (
                    approvalList.find((team) => team._id === selectedValue)
                      ?.name || ""
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
            {signatories.map((signatory: any, index: any) => (
              <>
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", mt: 1 }}
                >
                  <Box
                    key={signatory._id}
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
                      fontSize: "8px",
                      mr: 1,
                    }}
                  >
                    <Typography>
                      {signatory?.charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      width: "130px",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {signatory}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    sx={{ textTransform: "none", fontSize: "10px" }}
                    onClick={() => handleRemoveSignatory(signatory)}
                  >
                    Remove
                  </Button>
                </Box>
              </>
            ))}
          </>
        )}

        <Button
          variant="text"
          color={buttonState === "conditional" ? "primary" : "inherit"} // Changed "default" to "inherit"
          sx={{ textTransform: "none" }}
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

            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }: any) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={!!error}
                  sx={{ mt: 2 }}
                >
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={userList.map(
                      (user) => `${user.firstName} ${user.lastName}`
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Search user" />
                    )}
                    onInputChange={(event, value) => {
                      // Update the form state
                      field.onChange(value);
                    }}
                    onChange={(event, value) => {
                      // Handle selection from the dropdown
                      if (typeof value === "string") {
                        field.onChange(value);
                      } else {
                        const selectedUser = userList.find(
                          (user) =>
                            `${user.firstName} ${user.lastName}` === value
                        );
                        if (selectedUser) {
                          field.onChange(
                            `${selectedUser.firstName} ${selectedUser.lastName}`
                          );
                        }
                      }
                    }}
                  />
                </FormControl>
              )}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default ApprovalsComp;
