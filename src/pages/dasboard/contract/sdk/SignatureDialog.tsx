/* eslint-disable @typescript-eslint/no-explicit-any */
// DetailDialog.tsx
import React, { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";

import {
  getBranchByid,
  getUserId,
  getUserListNameID,
} from "@/service/api/apiMethods";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
type FormValues = {
  name: string;
  checkboxName: any;
};
interface DetailDialogProps {
  open: boolean;
  // Replace 'any' with the type of your data
  onClose: () => void;
}
const SignatureDialog: React.FC<DetailDialogProps> = ({ open, onClose }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);

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

  return (
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
        <strong>Residential Rental Agreement</strong>
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ maxHeight: "300px" }}>
        <Grid item xs={12} sm={7}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Mandatory field is required" }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth size="small" error={!!error}>
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={userList.map(
                      (user) => `${user.firstName} ${user.lastName}`
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Add signatory"
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                    onInputChange={(event, value) => {
                      // Update the form state
                      field.onChange(value);
                    }}
                    onChange={(event, value) => {
                      // Handle selection from the dropdown
                      if (typeof value === "string") {
                        field.onChange(value);
                      } else {
                        const selectedUser = userList.find(
                          (user) =>
                            `${user.firstName} ${user.lastName}` === value
                        );
                        if (selectedUser) {
                          field.onChange(
                            `${selectedUser.firstName} ${selectedUser.lastName}`
                          );
                        }
                      }
                    }}
                  />
                </FormControl>
              )}
            />

            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <Button
                sx={{ textTransform: "none" }}
                onClick={onClose}
                variant="outlined"
                color="secondary"
                style={{ marginRight: "10px" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ textTransform: "none" }}
              >
                save
              </Button>
            </div>
          </form>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignatureDialog;
