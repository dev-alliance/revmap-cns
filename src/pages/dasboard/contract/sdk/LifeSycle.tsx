/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Typography,
  Button,
  Box,
  Divider,
  Checkbox,
  FormControlLabel,
  FormControl,
  Autocomplete,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { ContractContext } from "@/context/ContractContext";
import { useAuth } from "@/hooks/useAuth";
import { getUserListNameID } from "@/service/api/apiMethods";

const LifeCycle = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();
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

  const [checkboxStates, setCheckboxStates] = useState({
    isEvergreen: false,
    isRenewalsActive: false,
    isNotificationEmailEnabled: false,
    isRemindersEnabled: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [userList, setUserList] = useState<Array<any>>([]);

  const [checkedStatesEamil, setCheckedStatesEmail] = useState(
    recipients.reduce(
      (acc: any, colb: any) => ({ ...acc, [colb.id]: true }),
      {}
    )
  );
  // Handle checkbox change
  const handleCheckboxChangeEmail = (colb: any) => (event: any) => {
    const isChecked = event.target.checked;
    setCheckedStatesEmail((prev: any) => ({ ...prev, [colb.id]: isChecked }));

    // Call function when unchecked
    if (!isChecked) {
      handleRemoveSignatory(colb)();
    }
  };

  const endDate = watch("endDate");
  console.log(endDate, "endDate");

  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    setCheckboxStates((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleInputChange = (event: any, newInputValue: any) => {
    setInputValue(newInputValue);
  };
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleAddSignatory(inputValue);
    }
  };

  const listData = async () => {
    try {
      const { data } = await getUserListNameID(user?._id);
      console.log({ data });

      setUserList(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

  const handleAddSignatory = (newSignatoryEmail: string) => {
    // Add new signatory logic remains the same
    const emailExists = recipients.some(
      (collaborator: any) => collaborator.email === newSignatoryEmail
    );
    if (newSignatoryEmail && !emailExists) {
      setRecipients((prev: any) => [...prev, { email: newSignatoryEmail }]);
    }

    setInputValue(""); // Clearing the input value
    setSelectedValue(null); // Resetting selected value
  };

  // Function to remove a signatory from the list
  const handleRemoveSignatory = (colb: any) => () => {
    setRecipients(
      recipients.filter((signatory: any) => signatory.email !== colb.email)
    );
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("https://api.example.com/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log("Form submitted successfully:", responseData);
      } else {
        console.error("Failed to submit form:", responseData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ textAlign: "left", position: "relative" }}
    >
      <Typography variant="body1" color="primary">
        Lifecycle
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Collaborate and communicate with your team or third party to efficiently
        execute contract.
      </Typography>
      <Divider style={{ margin: "20px 0" }} />

      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mr: 2,
            mb: 0.8,
            mt: 0.8,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
        >
          Signed on
        </Typography>
        <Controller
          name="signedOn"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Signed on"
              fullWidth
              size="small"
              variant="standard"
              InputProps={{
                disableUnderline: true, // Disables the underline by default
                sx: {
                  "::after": {
                    borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                  },
                  "::before": {
                    borderBottom: "none !important", // Hides the underline
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important", // Ensures underline stays hidden on hover
                  },
                  "input:focus + fieldset": {
                    border: "none", // Optional: for outlined variant if ever used
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      // Shows the underline when the input is focused
                      borderBottom: "2px solid", // Adjust color as needed
                    },
                  },
                },
              }}
            />
          )}
        />
      </Box>
      {/* Start Date Field */}
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mr: 2,
            mb: 0.8,
            mt: 0.8,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
        >
          Start date*
        </Typography>
        <Controller
          name="startDate"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              // placeholder="Signed on"

              type="date"
              size="small"
              variant="standard"
              InputProps={{
                disableUnderline: true, // Disables the underline by default
                sx: {
                  "::after": {
                    borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                  },
                  "::before": {
                    borderBottom: "none !important", // Hides the underline
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important", // Ensures underline stays hidden on hover
                  },
                  "input:focus + fieldset": {
                    border: "none", // Optional: for outlined variant if ever used
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      // Shows the underline when the input is focused
                      borderBottom: "2px solid", // Adjust color as needed
                    },
                  },
                },
              }}
            />
          )}
        />
      </Box>

      {/* End Date Field */}
      {!checkboxStates.isEvergreen && (
        <Box sx={{ mb: 0 }}>
          <Typography
            variant="body2"
            sx={{
              minWidth: "75px",
              mr: 2,
              mb: 0.8,
              mt: 0.8,
              whiteSpace: "nowrap",
              color: "#155BE5",
            }}
          >
            End date
          </Typography>
          <Controller
            name="endDate"
            control={control}
            // rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                // placeholder="Signed on"
                disabled={checkboxStates.isEvergreen}
                type="date"
                size="small"
                variant="standard"
                InputProps={{
                  disableUnderline: true, // Disables the underline by default
                  sx: {
                    "::after": {
                      borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                    },
                    "::before": {
                      borderBottom: "none !important", // Hides the underline
                    },
                    ":hover:not(.Mui-disabled)::before": {
                      borderBottom: "none !important", // Ensures underline stays hidden on hover
                    },
                    "input:focus + fieldset": {
                      border: "none", // Optional: for outlined variant if ever used
                    },
                    "::placeholder": {
                      fontSize: "0.55rem",
                    },
                    input: {
                      fontSize: "0.875rem",
                      "&:focus": {
                        // Shows the underline when the input is focused
                        borderBottom: "2px solid", // Adjust color as needed
                      },
                    },
                  },
                }}
              />
            )}
          />
        </Box>
      )}

      {/* Notice Period Field */}

      {/* Evergreen Checkbox */}
      <div style={{ display: "flex" }}>
        <FormControlLabel
          sx={{
            mt: 0.5,
            ml: "-.4rem",
            "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
            // Apply any additional styling you need for the FormControlLabel here
          }}
          control={
            <Checkbox
              disabled={!!endDate} // Disabled if endDate is set
              checked={checkboxStates.isEvergreen}
              onChange={handleCheckboxChange}
              name="isEvergreen"
              sx={{
                padding: "5px", // Adjusts padding around the checkbox
                "& .MuiSvgIcon-root": {
                  // Targets the SVG icon representing the checkbox
                  fontSize: "18px", // Adjust this value to scale the icon size
                },
              }}
            />
          }
          label="Evergreen"
        />
        <Tooltip
          title={
            "This agreement automatically renews indefinitely until terminated."
          }
        >
          <div style={{ marginTop: "14px" }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.4 9.6H6.6V8.4H5.4V9.6ZM6 0C5.21207 0 4.43185 0.155195 3.7039 0.456723C2.97595 0.758251 2.31451 1.20021 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.31451 10.7998 2.97595 11.2417 3.7039 11.5433C4.43185 11.8448 5.21207 12 6 12C7.5913 12 9.11742 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM6 2.4C5.36348 2.4 4.75303 2.65286 4.30294 3.10294C3.85286 3.55303 3.6 4.16348 3.6 4.8H4.8C4.8 4.48174 4.92643 4.17652 5.15147 3.95147C5.37652 3.72643 5.68174 3.6 6 3.6C6.31826 3.6 6.62348 3.72643 6.84853 3.95147C7.07357 4.17652 7.2 4.48174 7.2 4.8C7.2 6 5.4 5.85 5.4 7.8H6.6C6.6 6.45 8.4 6.3 8.4 4.8C8.4 4.16348 8.14714 3.55303 7.69706 3.10294C7.24697 2.65286 6.63652 2.4 6 2.4Z"
                fill="#949494"
              />
            </svg>
          </div>
        </Tooltip>
      </div>

      {/* Conditional Evergreen Duration Field */}
      {!checkboxStates.isEvergreen && (
        <>
          <Box sx={{ mb: 0 }}>
            <Typography
              variant="body2"
              sx={{
                minWidth: "75px",
                mr: 2,
                mb: 0.8,
                mt: 0.8,
                whiteSpace: "nowrap",
                color: "#155BE5",
              }}
            >
              Notice period date
            </Typography>
            <Controller
              name="noticePeriod"
              control={control}
              // rules={{ required: "This field is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  // placeholder="Signed on"
                  disabled={checkboxStates.isEvergreen}
                  type="date"
                  size="small"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true, // Disables the underline by default
                    sx: {
                      "::after": {
                        borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                      },
                      "::before": {
                        borderBottom: "none !important", // Hides the underline
                      },
                      ":hover:not(.Mui-disabled)::before": {
                        borderBottom: "none !important", // Ensures underline stays hidden on hover
                      },
                      "input:focus + fieldset": {
                        border: "none", // Optional: for outlined variant if ever used
                      },
                      "::placeholder": {
                        fontSize: "0.55rem",
                      },
                      input: {
                        fontSize: "0.875rem",
                        "&:focus": {
                          // Shows the underline when the input is focused
                          borderBottom: "2px solid", // Adjust color as needed
                        },
                      },
                    },
                  }}
                />
              )}
            />
          </Box>
        </>
      )}
      <Box sx={{ mb: 0 }}>
        <div style={{ display: "flex" }}>
          <Typography
            variant="body2"
            sx={{
              minWidth: "75px",
              mr: 2,
              mb: 0.8,
              mt: 0.8,
              whiteSpace: "nowrap",
              color: endDate ? "#949494" : "#155BE5",
            }}
          >
            Rolling days notice
          </Typography>
          <Tooltip
            title={"Notice required to terminate this evergreen agreement."}
          >
            <div style={{ marginTop: "7px" }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.4 9.6H6.6V8.4H5.4V9.6ZM6 0C5.21207 0 4.43185 0.155195 3.7039 0.456723C2.97595 0.758251 2.31451 1.20021 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.31451 10.7998 2.97595 11.2417 3.7039 11.5433C4.43185 11.8448 5.21207 12 6 12C7.5913 12 9.11742 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM6 2.4C5.36348 2.4 4.75303 2.65286 4.30294 3.10294C3.85286 3.55303 3.6 4.16348 3.6 4.8H4.8C4.8 4.48174 4.92643 4.17652 5.15147 3.95147C5.37652 3.72643 5.68174 3.6 6 3.6C6.31826 3.6 6.62348 3.72643 6.84853 3.95147C7.07357 4.17652 7.2 4.48174 7.2 4.8C7.2 6 5.4 5.85 5.4 7.8H6.6C6.6 6.45 8.4 6.3 8.4 4.8C8.4 4.16348 8.14714 3.55303 7.69706 3.10294C7.24697 2.65286 6.63652 2.4 6 2.4Z"
                  fill="#949494"
                />
              </svg>
            </div>
          </Tooltip>
        </div>
        <Controller
          name="rollingDaysNotice"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Rolling days notice"
              fullWidth
              type="number"
              size="small"
              variant="standard"
              disabled={!!endDate} // Disabled if endDate is set
              InputProps={{
                disableUnderline: true,
                sx: {
                  "::after": {
                    borderBottom: "2px solid",
                  },
                  "::before": {
                    borderBottom: "none !important",
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important",
                  },
                  "input:focus + fieldset": {
                    border: "none",
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      borderBottom: "2px solid",
                    },
                  },
                },
              }}
            />
          )}
        />
      </Box>
      <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
        Renewals
      </Typography>
      <Divider style={{ margin: "2px 0" }} />
      <FormControlLabel
        sx={{
          mt: 0.5,
          ml: "-.4rem",
          "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
          // Apply any additional styling you need for the FormControlLabel here
        }}
        control={
          <Checkbox
            checked={checkboxStates.isRenewalsActive}
            onChange={handleCheckboxChange}
            name="isRenewalsActive"
            sx={{
              padding: "5px", // Adjusts padding around the checkbox
              "& .MuiSvgIcon-root": {
                // Targets the SVG icon representing the checkbox
                fontSize: "18px", // Adjust this value to scale the icon size
              },
            }}
          />
        }
        label="Not set"
      />
      {!checkboxStates.isRenewalsActive && (
        <Box sx={{ mb: 0 }}>
          <Typography
            variant="body2"
            sx={{
              minWidth: "75px",
              mr: 2,
              mb: 0.8,
              mt: 0.8,
              whiteSpace: "nowrap",
              color: "#155BE5",
            }}
          >
            Renewal Date
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Controller
              name="evergreenDuration"
              control={control}
              // rules={{ required: "This field is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Renewal Date"
                  type="number"
                  size="small"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true, // Disables the underline by default
                    sx: {
                      "::after": {
                        borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                      },
                      "::before": {
                        borderBottom: "none !important", // Hides the underline
                      },
                      ":hover:not(.Mui-disabled)::before": {
                        borderBottom: "none !important", // Ensures underline stays hidden on hover
                      },
                      "input:focus + fieldset": {
                        border: "none", // Optional: for outlined variant if ever used
                      },
                      "::placeholder": {
                        fontSize: "0.55rem",
                      },
                      input: {
                        fontSize: "0.875rem",
                        "&:focus": {
                          // Shows the underline when the input is focused
                          borderBottom: "2px solid", // Adjust color as needed
                        },
                      },
                    },
                  }}
                />
              )}
            />
            <Controller
              name="renewalType"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue="days" // Setting default value directly
              render={({ field }) => (
                <FormControl
                  size="small"
                  variant="standard"
                  sx={{ ml: 2, width: "60%" }}
                >
                  <Select
                    {...field}
                    // sx={{ width: "80%" }}
                    labelId="renewal-type-label"
                    label="Type"
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="days">Day(s)</MenuItem>
                    <MenuItem value="months">Month(s)</MenuItem>
                    <MenuItem value="years">Year(s)</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </div>
          <Typography
            variant="body2"
            sx={{
              minWidth: "75px",
              mr: 2,

              whiteSpace: "nowrap",
            }}
          >
            from document completion date
          </Typography>
        </Box>
      )}

      <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
        Notification email
      </Typography>
      <Divider style={{ margin: "2px 0" }} />
      <FormControlLabel
        sx={{
          mt: 0.5,
          ml: "-.4rem",
          "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
          // Apply any additional styling you need for the FormControlLabel here
        }}
        control={
          <Checkbox
            checked={checkboxStates.isNotificationEmailEnabled}
            onChange={handleCheckboxChange}
            name="isNotificationEmailEnabled"
            sx={{
              padding: "5px", // Adjusts padding around the checkbox
              "& .MuiSvgIcon-root": {
                // Targets the SVG icon representing the checkbox
                fontSize: "18px", // Adjust this value to scale the icon size
              },
            }}
          />
        }
        label="Notify document owner"
      />
      {recipients.map((colb: any) => (
        <FormControlLabel
          key={colb.id}
          sx={{
            mt: 0.5,
            ml: "-.4rem",
            "& .MuiFormControlLabel-label": { fontSize: "12px" },
          }}
          control={
            <Checkbox
              checked={true}
              onChange={handleCheckboxChangeEmail(colb)}
              name="user"
              sx={{
                padding: "5px",
                "& .MuiSvgIcon-root": {
                  fontSize: "18px",
                },
              }}
            />
          }
          label={colb.email}
        />
      ))}

      {!checkboxStates.isNotificationEmailEnabled && (
        <>
          <Box sx={{ mb: 0 }}>
            <Button
              sx={{
                fontSize: "12px",
                textTransform: "none !important",
                borderRadius: 0,
                color:
                  activeSection === "collaborate" ? "primary.main" : "black",
                // fontWeight: "bold",

                borderColor:
                  activeSection === "collaborate"
                    ? "primary.main"
                    : "transparent",
              }}
              onClick={() => {
                // setActiveSection("");
                setShowButtons((prevShowButtons: any) => !prevShowButtons);
                setSelectedValue(null);
                setInputValue("");
              }}
            >
              <span
                style={{
                  color: "blue",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginRight: "5px",
                  marginLeft: "-5px",
                }}
              >
                +
              </span>{" "}
              Add another recipient
            </Button>
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
                    setSelectedValue(value); // Only update selectedValue here
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
                      setSelectedValue(null);
                      setInputValue("");
                      setShowButtons(false);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    color="inherit"
                    disabled={!selectedValue && !inputValue.trim()}
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
                      if (selectedValue) {
                        handleAddSignatory(selectedValue.email);
                      } else if (inputValue.trim() !== "") {
                        handleAddSignatory(inputValue.trim());
                      }
                      setShowButtons(false);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </>
            )}
          </Box>
        </>
      )}
      <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
        Reminders
      </Typography>
      <Divider style={{ margin: "2px 0" }} />
      <FormControlLabel
        sx={{
          mt: 0.5,
          ml: "-.4rem",
          "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
          // Apply any additional styling you need for the FormControlLabel here
        }}
        control={
          <Checkbox
            checked={checkboxStates.isRemindersEnabled}
            onChange={handleCheckboxChange}
            name="isRemindersEnabled"
            sx={{
              padding: "5px", // Adjusts padding around the checkbox
              "& .MuiSvgIcon-root": {
                // Targets the SVG icon representing the checkbox
                fontSize: "18px", // Adjust this value to scale the icon size
              },
            }}
          />
        }
        label="Send automatic reminders"
      />
      {!checkboxStates.isRemindersEnabled && (
        <>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
            }}
          >
            {" "}
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
              }}
            >
              First reminder
            </Typography>
            <Controller
              name="firstReminder"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  size="small"
                  InputProps={{
                    disableUnderline: true, // Disables the underline by default
                    sx: {
                      height: "30px",
                      width: "60px",
                      background: "#FFFFFF",
                      marginRight: "3px",
                      marginLeft: "3px",
                    },
                  }}
                  placeholder="0"
                />
              )}
            />
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
              }}
            >
              days before
            </Typography>
          </div>
          <Typography
            variant="body1"
            sx={{
              fontSize: "14px",
            }}
          >
            date of the document.
          </Typography>

          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              marginTop: "15px",
              marginBottom: "15px",
            }}
          >
            {" "}
            <Controller
              name="dayBtweenReminder"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  size="small"
                  InputProps={{
                    disableUnderline: true, // Disables the underline by default
                    sx: {
                      height: "30px",
                      width: "60px",
                      background: "#FFFFFF",
                      marginRight: "5px",
                    },
                  }}
                  placeholder="0"
                />
              )}
            />
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
              }}
            >
              days between reminders.
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            {" "}
            <Controller
              name="daysBefore"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  size="small"
                  InputProps={{
                    disableUnderline: true, // Disables the underline by default
                    sx: {
                      height: "30px",
                      width: "60px",
                      background: "#FFFFFF",
                      marginRight: "5px",
                    },
                  }}
                  name="daysBeforeExp"
                  placeholder="0"
                />
              )}
            />
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
              }}
            >
              days before final expiration
            </Typography>
          </div>
          <Typography
            variant="body1"
            sx={{
              fontSize: "14px",
            }}
          >
            date of the document.
          </Typography>
        </>
      )}
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
            padding: "2px 5px !important",
            height: "25px !important",
            fontSize: "0.675rem",
          }}
          // onClick={() => {
          //   setSignatories([]),
          //     setSelectedApprovalId(""),
          //     setShowSignatories(""),
          //     setApprovers([]);
          //   setShowCompanySelect(false);
          //   setShowConditionalSelect(false);
          // }}
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
          type="submit"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default LifeCycle;
