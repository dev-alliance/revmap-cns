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

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
}

const CollaburaterSharedDilog: React.FC<DetailDialogProps> = ({
  open,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{ alignItems: "center" }}
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
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <strong style={{ display: "flex" }}> Document sent to sign!</strong>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              // maxWidth: isMobile ? "20px" : "50px",
              width: "18%",
              // height: "auto",
              marginTop: "1rem", // Adjust as needed
              marginBottom: "2rem", // Adjust as needed
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              float: "right",
              marginTop: "8px",
            }}
          >
            <Button
              variant="outlined"
              sx={{ textTransform: "none", mt: "4" }}
              onClick={onClose}
              // onClick={() => setOpenDialog(true)}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CollaburaterSharedDilog;
