/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState, useEffect } from "react";

import DialogActions from "@mui/material/DialogActions";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Select,
  Autocomplete,
  Divider,
  TextField,
  FormControl,
  FormHelperText,
  Checkbox,
  IconButton,
  FormControlLabel,
  Grid,
  useMediaQuery,
  useTheme,
  Card,
  MenuItem,
} from "@mui/material";
import { getBranchByid, getUserId } from "@/service/api/apiMethods";
import CloseIcon from "@mui/icons-material/Close";
import logo from "@/assets/logo.jpg";
import SharedDilog from "@/pages/dasboard/contract/sdk/SharedDilog ";
import { ContractContext } from "@/context/ContractContext";
import { useAuth } from "@/hooks/useAuth";

interface DetailDialogProps {
  ClickData: any;
  moveToNextTab: () => void;
  tabValue: any;
}

const SignatureSendReqComponent: React.FC<DetailDialogProps> = ({
  ClickData,
  moveToNextTab,
  tabValue,
}) => {
  const { user } = useAuth();
  const { recipients, setRecipients, setOpenMultiDialog } =
    useContext(ContractContext);
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  const [openLDialog, setOpenLDialog] = useState(false);
  const [requestOption, setRequestOption] = useState({
    message: "",
    autoReminder: false,
    daysFirstReminder: "",
    daysBtwReminder: "",
    daysBeforeExp: "",
    daysFinalExp: "",
    forwarding: false,
  });

  const handleRequestOptionChange = (event: any) => {
    const { name, value, type, checked } = event.target;
    setRequestOption((prev) => ({
      ...prev, // Spread the previous state
      [name]: type === "checkbox" ? checked : value, // Use checked for checkboxes, value for other inputs
    }));
  };
  useEffect(() => {
    // Reset requestOption when dialog opens or the ClickData changes
    console.log(ClickData, "click");

    const index = recipients.findIndex(
      (recip: any) =>
        recip?.email?.trim().toLowerCase() ===
        ClickData?.email?.trim().toLowerCase()
    );

    if (index !== -1) {
      setRequestOption(recipients[index].permission || ""); // Assume each collaborator has a `permission` field
    }
  }, [ClickData, recipients, open]);

  // New function to update the collaborator's permission, called on button click
  const updateDocment = () => {
    setRecipients((pre: any[]) => {
      return pre.map((user) => {
        if (user.email === ClickData?.email) {
          return { ...user, ReqOption: requestOption };
        }
        // return { ...user, permission: requestOption };
        return user;
      });
    });
  };
  console.log(requestOption, "requestOption");

  console.log(recipients, "recipients");

  const handleCloseDialog = () => {
    setOpenLDialog(false);
    setOpenMultiDialog(false);
  };
  const handleClick = () => {
    setOpenLDialog(true);
  };

  return (
    <>
      <Box>
        <div>
          <div style={{ display: "flex" }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: bubbleColors[1 % bubbleColors.length],
                color: "#FFFFFF",
                marginRight: -1,
                mr: 1,
              }}
            >
              <Typography sx={{ fontSize: "13px" }}>
                {ClickData?.email?.charAt(0).toUpperCase()}
                {ClickData?.lastName?.charAt(0).toUpperCase()}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                textOverflow: "ellipsis",
                fontSize: "16px",
              }}
            >
              {ClickData?.firstName}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              sx={{
                display: "flex",

                textOverflow: "ellipsis",
                fontSize: "16px",
              }}
            >
              <span
                style={{
                  color: "#92929D",
                  marginRight: "10px",
                  fontSize: "14px",
                }}
              >
                {" "}
                From:
              </span>{" "}
              {user?.email}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                // fontWeight: "bold",
                display: "flex",

                textOverflow: "ellipsis",
                fontSize: "16px",
              }}
            >
              <span
                style={{
                  color: "#92929D",
                  marginRight: "10px",
                  fontSize: "14px",
                }}
              >
                {" "}
                To:
              </span>{" "}
              {ClickData?.email}
            </Typography>
          </div>
        </div>

        <Box
          sx={{
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
            // padding: 16px (2 * theme spacing unit)
            mt: 1, // margin-top: 8px (1 * theme spacing unit)
            mb: 2, // margin-bottom: 16px (2 * theme spacing unit)
            alignItems: "center",
          }}
        >
          <textarea
            value={requestOption.message}
            onChange={handleRequestOptionChange}
            name="message"
            placeholder="Add message (optional)"
            maxLength={100}
            rows={3}
            style={{
              width: "100%",
              boxSizing: "border-box",
              fontSize: "13px",
              lineHeight: "20px", // Adjust line-height for better vertical alignment
              padding: "10px 10px", // Adjust vertical padding to help center the text
              // border: "1px solid #ced4da",
              borderRadius: "4px",
              resize: "block",
            }}
          />
        </Box>
        <Divider style={{ margin: "10px 0" }} />
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: "#888888",
          }}
        >
          Reminders
        </Typography>
        <div>
          <FormControlLabel
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "16px",
                whiteSpace: "nowrap",
              },
            }}
            control={
              <Checkbox
                checked={requestOption.forwarding}
                onChange={handleRequestOptionChange}
                name="Forwarding"
                color="primary"
                sx={{
                  padding: "5px", // Adjusts padding around the checkbox
                  "& .MuiSvgIcon-root": {
                    fontSize: "20px",
                    color: "gray",
                  },
                }}
              />
            }
            label="Send automatic reminders."
          />
        </div>
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          {" "}
          <Typography
            variant="body1"
            sx={
              {
                // fontSize: "16px",
              }
            }
          >
            Number of days before sending first reminder :
          </Typography>
          <TextField
            type="number"
            size="small"
            sx={{ width: "60px", ml: 1 }}
            name="daysFirstReminder"
            value={requestOption.daysFirstReminder}
            onChange={handleRequestOptionChange}
            placeholder="0"
          />
        </div>
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          {" "}
          <Typography
            variant="body1"
            sx={
              {
                // fontSize: "16px",
              }
            }
          >
            Number of days between reminders:
          </Typography>
          <TextField
            type="number"
            size="small"
            sx={{ width: "60px", ml: 1 }}
            name="daysBtwReminder"
            value={requestOption.daysBtwReminder}
            onChange={handleRequestOptionChange}
            placeholder="0"
          />
        </div>

        <Divider style={{ margin: "10px 0" }} />
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: "#888888",
          }}
        >
          Expiration
        </Typography>
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          {" "}
          <Typography
            variant="body1"
            sx={
              {
                // fontSize: "16px",
              }
            }
          >
            Number of days before signature request expires:
          </Typography>
          <TextField
            type="number"
            size="small"
            sx={{ width: "60px", ml: 1 }}
            name="daysBeforeExp"
            value={requestOption.daysBeforeExp}
            onChange={handleRequestOptionChange}
            placeholder="0"
          />
        </div>
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          {" "}
          <Typography
            variant="body1"
            sx={
              {
                // fontSize: "16px",
              }
            }
          >
            Days before final expiration reminder:
          </Typography>
          <TextField
            type="number"
            size="small"
            sx={{ width: "60px", ml: 1 }}
            name="daysFinalExp"
            value={requestOption.daysFinalExp}
            onChange={handleRequestOptionChange}
            placeholder="0"
          />
        </div>
        <Divider style={{ margin: "10px 0" }} />
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: "#888888",
          }}
        >
          Forwarding
        </Typography>
        <div>
          <FormControlLabel
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "16px",
                whiteSpace: "nowrap",
              },
            }}
            control={
              <Checkbox
                checked={requestOption.forwarding}
                onChange={handleRequestOptionChange}
                name="forwarding"
                color="primary"
                sx={{
                  padding: "5px", // Adjusts padding around the checkbox
                  "& .MuiSvgIcon-root": {
                    fontSize: "20px",
                    color: "gray",
                  },
                }}
              />
            }
            label="The recipient can delegate signing by forwarding this document to others."
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            float: "right",
            marginTop: "16px",
          }}
        >
          <Button
            variant="outlined"
            sx={{ textTransform: "none", mt: "4", mr: 2 }}
            // onClick={onClose}
            // onClick={() => setOpenLDialog(true)}
          >
            Cancel
          </Button>
          <Button
            disabled={!requestOption}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", mt: "4" }}
            onClick={() => {
              if (tabValue === recipients.length - 1) {
                handleClick();
                updateDocment();
              } else {
                // Not the last tab, proceed as before
                updateDocment();
                moveToNextTab();
              }
            }}
          >
            {tabValue === recipients.length - 1 ? "Share" : "Next"}
          </Button>
        </div>
      </Box>
      <SharedDilog
        open={openLDialog}
        onClose={handleCloseDialog}
        title={
          "Document will be shared for signing in the order you specified."
        }
      />
    </>
  );
};

export default SignatureSendReqComponent;
