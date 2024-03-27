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
import logo from "@/assets/logo.jpg";
import CollaburaterSharedDilog from "@/pages/dasboard/contract/sdk/CollaburaterSharedDilog ";

interface DetailDialogProps {
  open: boolean;

  onClose: () => void;
}

const CollaburaterDilog: React.FC<DetailDialogProps> = ({
  open,
  // id,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleClick = () => {
    setOpenDialog(true);
    onClose();
  };
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
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
              whiteSpace: "nowrap",
            }}
          >
            <PersonAddIcon color="primary" sx={{ mt: -0.5, mr: 2 }} />
            Residential Rental Agreement
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              // alignItems: "center",
              // textAlign: "center",
              mt: 3,
              p: 1,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex" }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
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
                  <Typography sx={{ fontSize: "14px" }}>
                    {"name"?.charAt(0).toUpperCase()}
                  </Typography>
                </Box>
                <div>
                  <Typography
                    variant="body2"
                    sx={{
                      // fontWeight: "bold",
                      width: "130px",
                      textOverflow: "ellipsis",
                      fontSize: "16px",
                    }}
                  >
                    {"name"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      // fontWeight: "bold",
                      width: "130px",
                      textOverflow: "ellipsis",
                      fontSize: "16px",
                    }}
                  >
                    {"name"}
                  </Typography>
                </div>
              </div>
              <div style={{ float: "right" }}>
                <Select
                  size="small"
                  labelId="status-label"
                  displayEmpty
                  renderValue={(value: any) => {
                    if (value === "") {
                      return (
                        <em
                          style={{
                            color: "#C2C2C2",
                            fontStyle: "normal",
                            fontSize: "15.5px",
                          }}
                        >
                          {" "}
                          Choose a status
                        </em> // Placeholder text with custom color
                      );
                    }
                    return value;
                  }}
                >
                  {/* Placeholder */}
                  <MenuItem value="Can view, edit, and comment">
                    Can view, edit, and comment
                  </MenuItem>
                  <MenuItem value="Can view and comment">
                    Can view and comment
                  </MenuItem>
                </Select>
              </div>
            </div>
          </Card>

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
              sx={{ textTransform: "none", mt: "4" }}
              onClick={handleClick}
            >
              Share document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <CollaburaterSharedDilog open={openDialog} onClose={handleCloseDialog} />
    </>
  );
};

export default CollaburaterDilog;
