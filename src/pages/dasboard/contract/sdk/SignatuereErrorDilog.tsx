/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

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
import logo from "@/assets/collaburater_icon.png";
import signAll from "@/assets/signAll.png";

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: any;
  onConfirm: () => void;
}

const SignatuereErrorDilog: React.FC<DetailDialogProps> = ({
  open,
  onClose,
  title,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            // Targeting the Paper component inside the Dialog
            border: "1.5px dashed #174B8B", // Customizing the border to dashed
            borderRadius: "16px",
          },
          alignItems: "center",
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            lineHeight: "auto",
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: "1rem",
            }}
          >
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ fontSize: "15px" }}
            >
              {title}
            </Typography>
          </DialogTitle>

          {/* Using another flexbox for laying out button to the right */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "8px",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              sx={{
                textTransform: "none",
                mt: "4",
              }}
              onClick={onClose}
            >
              {title ==
              "Please confirm that all custom fields have been removed from the document before removing the recipient."
                ? "Cancel"
                : "Close"}
            </Button>
            {title ==
              "Please confirm that all custom fields have been removed from the document before removing the recipient." && (
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: "4",
                  ml: 1,
                  textTransform: "none",
                  backgroundColor: "#174B8B", // Set the button color to green
                  "&:hover": {
                    backgroundColor: "#2B6EC2", // Darker green on hover
                  },
                }}
                onClick={onConfirm}
              >
                Conform
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default SignatuereErrorDilog;
