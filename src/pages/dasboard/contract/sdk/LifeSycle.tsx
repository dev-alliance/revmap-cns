/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Typography,
  Button,
  Box,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const LifeCycle = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const [checkboxStates, setCheckboxStates] = useState({
    isEvergreen: false,
    isRenewalsActive: false,
    isNotificationEmailEnabled: false,
    isRemindersEnabled: false,
  });

  // Handler function that takes the event from the checkbox
  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    setCheckboxStates((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <div style={{ textAlign: "left", position: "relative" }}>
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
              fullWidth
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
              fullWidth
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

      {/* Notice Period Field */}
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
              fullWidth
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

      {/* Evergreen Checkbox */}
      <FormControlLabel
        sx={{
          mt: 0.5,
          ml: "-.4rem",
          "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
          // Apply any additional styling you need for the FormControlLabel here
        }}
        control={
          <Checkbox
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
          Rolling days notice
        </Typography>
        <Controller
          name="evergreenDuration"
          control={control}
          // rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Rolling days notice"
              fullWidth
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
      </Box>
      {/* Conditional Evergreen Duration Field */}
      {checkboxStates.isEvergreen && (
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
            Evergreen Duration (months)*
          </Typography>
          <Controller
            name="evergreenDuration"
            control={control}
            // rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                // placeholder="Signed on"
                fullWidth
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
        </Box>
      )}
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
        label="Notify document owner"
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
          <Controller
            name="evergreenDuration"
            control={control}
            // rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Renewal Date"
                fullWidth
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
        label="Not set"
      />
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
          // onClick={() => setShowSignatories("topbar")}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default LifeCycle;
