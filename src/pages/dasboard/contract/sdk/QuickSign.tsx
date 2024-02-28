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
} from "@mui/material";
import { getList } from "@/service/api/approval";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";

import { useForm, Controller } from "react-hook-form";
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

  const [signatories, setSignatories] = useState([]);
  const [inputValue, setInputValue] = useState(""); // Track the input value

  // Function to handle adding new signatory
  const handleAddSignatory = (newSignatory: any) => {
    if (newSignatory && !signatories.includes(newSignatory.trim())) {
      setSignatories((prev: any) => [...prev, newSignatory.trim()]);
      reset(); // Reset the form field after adding
      setInputValue(""); // Clear the controlled input value
    }
  };

  // Function to remove a signatory from the list
  const handleRemoveSignatory = (signatoryToRemove: any) => {
    setSignatories(
      signatories.filter((signatory) => signatory !== signatoryToRemove)
    );
  };

  // Handle input change to track current value
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  // Handle "Enter" key press in the input
  const handleKeyPress = (event) => {
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
        QuickSign
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Add the signatory who will sign this document
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
          render={({ field }) => (
            <Autocomplete
              {...field}
              freeSolo
              options={userList.map(
                (user) => `${user.firstName} ${user.lastName}`
              )}
              onInputChange={handleInputChange}
              inputValue={inputValue}
              onChange={(_, value) => handleAddSignatory(value ?? inputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add signatory"
                  margin="normal"
                  variant="outlined"
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
        {signatories.map((signatory, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mt: 1 }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                width: "120px",
                textOverflow: "ellipsis",
              }}
            >
              {signatory}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveSignatory(signatory)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </form>

      {/* {userList?.map((approval) => (
        <Grid
          container
          key={approval.id}
          spacing={1}
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item xs>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {approval.name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {approval.type}
            </Typography>
          </Grid>

          <Grid item>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {approval && approval.length > 0 ? (
                approval?.map((appr: any, index: any) => (
                  <Box
                    key={appr._id}
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
                      fontSize: "10px",
                    }}
                  >
                    <Typography>
                      {appr.firstName?.charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "text.secondary" }}>-</Typography>
              )}
            </Box>
          </Grid>

          <Grid item></Grid>
        </Grid>
      ))} */}
    </div>
  );
};

export default QuickSign;
