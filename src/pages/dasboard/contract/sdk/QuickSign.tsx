/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import { getList } from "@/service/api/approval";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, Controller } from "react-hook-form";
import { ContractContext } from "@/context/ContractContext";
type FormValues = {
  name: string;
  checkboxName: any;
};
const QuickSign = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);
  const { signatories, setSignatories } = useContext(ContractContext);
  const [checked, setChecked] = React.useState(false);

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
    <div style={{ textAlign: "left", position: "relative" }}>
      <Typography variant="body1" color="primary">
        Recipients
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Add recipients who will sign this document.
      </Typography>
      <Divider style={{ margin: "10px 0" }} />

      {/* <div style={{ flex: 1, textAlign: "right" }}> */}
      {/* <Button variant="text" color="primary" sx={{ textTransform: "none" }}>
          + Add Signatory */}
      {/* </Button> */}
      <form onSubmit={(e) => e.preventDefault()}>
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
                  label="Add signatory"
                  margin="normal"
                  variant="outlined"
                  size="small"
                  onKeyPress={handleKeyPress}
                />
              )}
            />
          )}
        />
        <div style={{ flex: 1, textAlign: "right" }}>
          <Button
            variant="text"
            color="primary"
            sx={{ textTransform: "none" }}
            onClick={() => handleAddSignatory(inputValue)}
          >
            + Add Signatory
          </Button>
        </div>
        {signatories.map((signatory: any, index: any) => (
          <>
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
            >
              <Box
                key={signatory._id}
                sx={{
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: bubbleColors[index % bubbleColors.length],
                  color: "#FFFFFF",
                  marginRight: -1,
                  fontSize: "8px",
                  mr: 1,
                }}
              >
                <Typography>{signatory?.charAt(0).toUpperCase()}</Typography>
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
        <Divider style={{ margin: "10px 0" }} />
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              width: "200px",
              textOverflow: "ellipsis",
            }}
          >
            Advance Settings
          </Typography>

          <ExpandMoreIcon />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              width: "200px",
              textOverflow: "ellipsis",
            }}
          >
            Signing order
          </Typography>

          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
            sx={{ marginLeft: "auto" }} // Add this to align the switch to the right
          />
        </Box>
      </form>
    </div>
  );
};

export default QuickSign;
