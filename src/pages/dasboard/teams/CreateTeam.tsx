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
type FormValues = {
  name: string;
  manager: string;
  status: string;
  members: [];
};

const CreateTeam = () => {
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const navigate = useNavigate();
  const [member, setMamber] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserListNameID();
      console.log({ data });

      setUserList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listData();
  }, []);
  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        name: data.name,
        manager: data.manager, // Convert the string to an object
        status: data.status,
        members: member,
      };

      const response = await createTeam(payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/teamlist");
      } else {
        const errorMessage = response.data || response.message;
        toast.error(errorMessage);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);

      let errorMessage = "failed";
      if (error.response) {
        errorMessage = error.response.data || error.response.data.message;
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);

      // Handle error
      console.error(errorMessage);
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
                Create Teams
              </Typography>

              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ mt: -2, mb: 2, fontSize: "13px" }}
              >
                <Link to="/dashboard/teamlist" className="link-no-underline">
                  Home
                </Link>
                {/* <Typography color="text.primary">Categories</Typography> */}
              </Breadcrumbs>
            </Box>
          </div>

          <div>
            <Button
              variant="outlined"
              onClick={handleBack}
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
          </div>
        </Box>
        <Paper sx={{ padding: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <Typography variant="subtitle2">Team Name*</Typography>

              <Controller
                name="name"
                control={control}
                rules={{ required: "Branch Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="addName"
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

            <Grid item xs={7}>
              <Typography variant="subtitle2">Team Manger</Typography>
              <Controller
                name="manager"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    {/* Optional: add this line if you want a label */}
                    <Select
                      {...field}
                      labelId="manager-label"
                      displayEmpty
                      renderValue={(value) => {
                        if (value === "") {
                          return (
                            <em style={{ color: "#9A9A9A" }}>Select User</em> // Placeholder text with custom color
                          );
                        }
                        // Find the selected manager by ID
                        const selectedManager = userList.find(
                          (user) => user._id === value
                        );
                        return selectedManager
                          ? `${selectedManager.firstName} ${selectedManager.lastName}`
                          : "";
                      }}
                    >
                      {userList?.map((user: any) => (
                        <MenuItem key={user?._id} value={user?._id}>
                          {user?.firstName} {user?.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={7}>
              <Typography variant="subtitle2">Status</Typography>
              <Controller
                name="status"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    {/* Optional: add this line if you want a label */}
                    <Select
                      {...field}
                      labelId="status-label"
                      displayEmpty
                      renderValue={(value) => {
                        if (value === "") {
                          return (
                            <em style={{ color: "#9A9A9A" }}>
                              {" "}
                              Choose a status
                            </em> // Placeholder text with custom color
                          );
                        }
                        return field.value;
                      }}
                    >
                      {/* Placeholder */}
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="archived">Archived</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={7}>
              <Typography variant="subtitle2">Team Members</Typography>
              <Controller
                name="members"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormControl fullWidth size="small">
                    <Select
                      multiple
                      {...field}
                      labelId="status-label"
                      displayEmpty
                      value={member || []} // Ensure the value is an array
                      onChange={(e: any) => {
                        setMamber(e.target.value); // Update your local state
                        onChange(e.target.value); // Inform React Hook Form of the change
                      }}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return (
                            <em style={{ color: "#9A9A9A" }}>Select members</em>
                          );
                        }
                        // Map selected IDs to names
                        const selectedNames = selected.map((selectedId) => {
                          const user = userList.find(
                            (user) => user._id === selectedId
                          );
                          return user
                            ? `${user.firstName} ${user.lastName}`
                            : "";
                        });
                        return selectedNames.join(", "); // This will show the selected members' names separated by commas
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 224, // You can adjust this for controlling the menu height
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choose Members
                      </MenuItem>{" "}
                      {userList?.map((user: any) => (
                        <MenuItem key={user?._id} value={user?._id}>
                          {user?.firstName} {user?.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      </form>
    </>
  );
};

export default CreateTeam;
