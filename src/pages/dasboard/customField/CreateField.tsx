/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormGroup,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { ChangeUserPassword } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { create, updatecustomFields } from "@/service/api/customFeild";

interface CreateFieldProps {
  open: boolean;
  onClose: () => void;
  listData: () => void;
  itemName: any;
  setItemName: any;
}

interface IFormInput {
  name: string;
}

const CreateField: React.FC<CreateFieldProps> = ({
  open,
  onClose,
  itemName,
  listData,
  setItemName,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  console.log(itemName, "itemName");

  useEffect(() => {
    setValue("name", itemName?.name);
  }, [itemName]);

  const onSubmit: any = async (data: any) => {
    try {
      setIsLoading(true);
      const payload = {
        id: user?._id,
        name: data.name,
        uploaded_by: user?.firstName,
      };
      let response;
      if (itemName?.id) {
        response = await updatecustomFields(itemName?.id, payload);
      } else {
        response = await create(payload);
      }
      console.log(response.message);
      if (response.ok === true) {
        toast.success(response.message);
        onClose();
        listData();
        setItemName({ id: "", name: "" });
      } else {
        const errorMessage = response.data || response.message;
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);

      let errorMessage = " failed";
      if (error.response) {
        errorMessage = error.response.data || error.response.data.message;
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);

      // Handle error
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="change-password-modal"
      aria-describedby="change-password-form"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          padding: 3,
          borderRadius: 1,
          boxShadow: 24,
          outline: "none",
          maxWidth: 500,
          width: "100%",
          position: "relative",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Field Name
            </Typography>
            <Controller
              name="name"
              control={control}
              rules={{ required: "field Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Add field name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "16px", color: "#9A9A9A" }}
                />
              )}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>

                <Button
                  sx={{ ml: 2, textTransform: "none" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              </Box>
            </Box>
          </FormGroup>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateField;
