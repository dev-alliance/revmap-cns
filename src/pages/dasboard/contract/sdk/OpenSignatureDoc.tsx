/* eslint-disable @typescript-eslint/no-explicit-any */
// DetailDialog.tsx
import React, { useEffect, useState, useContext } from "react";
import DialogActions from "@mui/material/DialogActions";
import { useLocation } from "react-router-dom";
import { TextareaAutosize } from "@mui/material";
import {
  getBranchByid,
  getUserId,
  getUserListNameID,
} from "@/service/api/apiMethods";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Divider,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import logo from "@/assets/logo.jpg";
import { ContractContext } from "@/context/ContractContext";
import { log } from "console";
type FormValues = {
  name: string;
  checkboxName: any;
};
interface DetailDialogProps {
  email: any;
  onButtonClick: () => void;
  handleCloseDialog: () => void;
}
const OpenSignatureDoc: React.FC<DetailDialogProps> = ({
  onButtonClick,
  handleCloseDialog,
}) => {
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
  const theme = useTheme();
  const { recipients, setRecipients, setOpenMultiDialog } =
    useContext(ContractContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState("");
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);
  const onSubmit = async (data: FormValues) => {
    // try {
    //   const payload = {
    //     user: data.name,
    //   };
    //   console.log(payload);
    //   return;
    //   const response = await createTeam(payload);
    //   if (response.ok === true) {
    //     toast.success(response.message);
    //   } else {
    //     const errorMessage = response.data || response.message;
    //     toast.error(errorMessage);
    //   }
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // } catch (error: any) {
    //   console.log(error);
    //   let errorMessage = "failed";
    //   if (error.response) {
    //     errorMessage = error.response.data || error.response.data.message;
    //   } else {
    //     errorMessage = error.message;
    //   }
    //   toast.error(errorMessage);
    //   // Handle error
    //   console.error(errorMessage);
    // }
  };
  console.log(recipients, "recipients");

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: -2,
        }}
      >
        <IconButton
          onClick={handleCloseDialog}
          aria-label="close"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="body1" sx={{ mt: 2 }}>
          PK ({" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            {email}
          </Box>
          ) has shared Residential Rental Agreement to sign.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2">To: {email}</Typography>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            p: 1,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              // maxWidth: isMobile ? "20px" : "50px",
              width: "30%",
              // height: "auto",
              // Adjust as needed
            }}
          />
          <Typography variant="body1" sx={{ mt: 1, mb: 2, ml: -14 }}>
            PK (
            <Box component="span" sx={{ color: "primary.main" }}>
              {email}
            </Box>
            ) has shared Residential Rental Agreement to sign.
          </Typography>
          <Controller
            name="name"
            control={control}
            // rules={{ required: "Tag Name is required", maxLength: 50 }}
            render={({ field }) => (
              <>
                <TextareaAutosize
                  {...field}
                  placeholder="text"
                  minRows={4}
                  maxLength={50}
                  onChange={(event) => {
                    field.onChange(event); // react-hook-form Controller handle onChange
                  }}
                  style={{
                    width: "100%",
                    fontSize: "16px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    padding: "10px",
                  }}
                />
              </>
            )}
          />
        </Card>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "none" }}
            onClick={() => onButtonClick()}
          >
            {recipients.map((recipient: any) => {
              console.log(recipient, "recipient");

              return recipient.email === email
                ? recipient.forwarding
                  ? "Review and forward the document"
                  : "Review and sign"
                : undefined;
              recipient; // Or some other fallback value as needed
            })}
          </Button>
        </div>
      </DialogContent>
    </>
  );
};

export default OpenSignatureDoc;
