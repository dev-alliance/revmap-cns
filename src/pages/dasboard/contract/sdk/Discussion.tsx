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
const Discussion = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>();

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [member, setMamber] = useState<Array<any>>([]);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
      </div>
    );
  }

  const bubbleColors = ["#FEC85E", "#BC3D89", "#725FE7,#00A7B1"]; // Yellow, Green, Blue
  return (
    <div style={{ textAlign: "left", position: "relative" }}>
      <Typography variant="body1" color="primary">
        Collaborate & Communicate
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Collaborate and communicate with your team or third party to efficiently
        execute contract.
      </Typography>
      <Divider sx={{ mt: 1, mb: 2 }} />
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="basic tabs example"
        variant="fullWidth" // Make tabs stretch to fill the available space
        sx={{
          fontSize: "11px",
          textDecoration: "none",
          ".MuiTabs-flexContainer": {
            justifyContent: "space-between", // Adjusts tabs to distribute space between them evenly
          },
          ".MuiTabs-indicator": {
            height: "2px",
          },
        }}
      >
        <Tab
          label="+ Add Collaborator"
          sx={{
            fontWeight: "bold",
            fontSize: "11px",
            minWidth: "0",
            textTransform: "none",
            whiteSpace: "nowrap",
          }}
        />
        <Tab
          label="Message"
          sx={{
            fontWeight: "bold",
            fontSize: "11px",
            minWidth: "0",
            textTransform: "none",
          }}
        />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <>
          <div
            style={{
              width: "100%",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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
              label="External"
            />
            <FormControlLabel
              sx={{
                "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                // Apply any additional styling you need for the FormControlLabel here
              }}
              control={
                <Checkbox
                  name="checkedB"
                  sx={{
                    padding: "5px", // Adjusts padding around the checkbox
                    "& .MuiSvgIcon-root": {
                      // Targets the SVG icon representing the checkbox
                      fontSize: "18px", // Adjust this value to scale the icon size
                    },
                  }}
                />
              }
              label="Option B"
            />
          </div>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }: any) => (
              <Autocomplete
                sx
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
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label="Add signatory"
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

          <div />
        </>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
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
      </TabPanel>
    </div>
  );
};

export default Discussion;
