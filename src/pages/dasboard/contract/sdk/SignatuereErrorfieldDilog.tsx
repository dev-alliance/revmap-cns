/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext } from "react";

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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { ContractContext } from "@/context/ContractContext";

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  ClickData: any;
}

const SignatuereErrorfieldDilog: React.FC<DetailDialogProps> = ({
  open,
  onClose,
  ClickData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  const { recipients, setSelectedModule } = useContext(ContractContext);
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
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid black",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            To send the request,please add signature fields for the signers
            listed below.
          </Typography>
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ position: "absolute", top: -4, right: 0 }}
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
          <Typography
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: "1rem",
            }}
          >
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {recipients
                ?.filter((dt: any) => dt.field === undefined)
                .map((dt: any, index: any) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon
                      sx={{ minWidth: "auto", mr: 1, color: "gray" }}
                    >
                      <FiberManualRecordIcon sx={{ fontSize: "small" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${dt.email} `}
                      sx={{ color: "black" }}
                    />
                  </ListItem>
                ))}
            </List>
          </Typography>

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
              sx={{
                textTransform: "none",
                mt: "4",
              }}
              onClick={() => setSelectedModule("fields")}
            >
              Add fields
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default SignatuereErrorfieldDilog;
