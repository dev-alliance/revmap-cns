/* eslint-disable @typescript-eslint/no-explicit-any */
// TeamForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import toast from "react-hot-toast";
import { createTeam, getUserListNameID } from "@/service/api/apiMethods";
import { Link, useNavigate } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { createCategory } from "@/service/api/category";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
type FormValues = {
  name: string;
  manager: string;
  status: string;
  members: [];
};

const CreateCategory = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [member, setMamber] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<Array<any>>([]);
  const categoryName = watch("name");
  const handleAddSubCategory = () => {
    setSubCategories([...subCategories, { name: "" }]);
  };

  const handleRemoveSubCategory = (index: any) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories.splice(index, 1);
    setSubCategories(updatedSubCategories);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        id: user?._id,
        name: data.name,
        createdByName: user?.firstName,
        subCategories: subCategories.map((subCategory) => ({
          name: subCategory.name,
        })),
      };
      console.log(payload, "payload");

      const response = await createCategory(payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/category-list");
      } else {
        const errorMessage = response.message || "An error occurred";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);

      let errorMessage = "Failed to create clause.";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data ||
          "An error occurred";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
            position: "absolute",
            margin: "auto",
            width: "70%",
          }}
        >
          <ProgressCircularCustomization />
        </Box>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            opacity: isLoading ? "30%" : "100%",
            pl: 3,
            p: 2,
            pr: 3,
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex" }}>
            <Box
              sx={{
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Create Category
              </Typography>

              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ mt: -2, mb: 2, fontSize: "14px" }}
              >
                <Link
                  style={{ marginRight: "-7px" }}
                  to="/dashboard/category-list"
                  className="link-no-underline"
                >
                  Home
                </Link>
                <Typography
                  sx={{ fontSize: "14px", ml: "-7px" }}
                  color="text.primary"
                >
                  Create Category
                </Typography>
              </Breadcrumbs>
            </Box>
          </div>
        </Box>
        <Paper sx={{ padding: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <Typography variant="subtitle2">Category Name*</Typography>

              <Controller
                name="name"
                control={control}
                rules={{ required: "Mandatory field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Add category name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "16px", color: "#9A9A9A" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Button
                onClick={handleAddSubCategory}
                sx={{ textTransform: "none", mt: 2, float: "right" }}
                variant="contained"
                disabled={!categoryName}
              >
                <AddIcon /> Add Subcategory
              </Button>
            </Grid>
            <Grid />
            {subCategories.map((subCategory, index) => (
              <>
                <Grid item xs={12} sm={7}>
                  <div key={index} style={{ display: "flex" }}>
                    <TextField
                      placeholder={`Add subcategory ${index + 1}`}
                      value={subCategory.name}
                      onChange={(e: any) => {
                        const updatedSubCategories = [...subCategories];
                        updatedSubCategories[index].name = e.target.value;
                        setSubCategories(updatedSubCategories);
                      }}
                      fullWidth
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "16px", color: "#9A9A9A", mt: 2 }}
                    />
                  </div>
                </Grid>
                <Grid item xs={0.5} sm={0.5}>
                  <Button
                    onClick={() => handleRemoveSubCategory(index)}
                    sx={{ mt: 2, ml: -1, color: "red" }}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </Button>
                </Grid>
              </>
            ))}

            <Grid item xs={12} sm={7}>
              <Box sx={{ float: "right" }}>
                <Box sx={{ mt: 2, mr: -2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>

                  <Button
                    sx={{ ml: 4, textTransform: "none" }}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </>
  );
};

export default CreateCategory;
