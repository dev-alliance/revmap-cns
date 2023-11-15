/* eslint-disable @typescript-eslint/no-explicit-any */
// TeamForm.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { countries, getStatesByCountry } from "@/utils/CounteryState";
import { Country } from "country-state-city";
import toast from "react-hot-toast";
import { createBranch, createTeam } from "@/service/api/apiMethods";
import { useNavigate } from "react-router-dom";
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const navigate = useNavigate();
  const [member, setMamber] = useState<Array<any>>([]);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        name: data.name,
        manager: { firstName: data.manager }, // Convert the string to an object
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
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
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{ textAlign: "left", marginBottom: 2 }}
            >
              Create Teams
            </Typography>
          </Box>
        </div>

        <div>
          <Button
            variant="outlined"
            onClick={() => console.log("Cancel")}
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
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
            >
              Team Name*
            </Typography>

            <Controller
              name="name"
              control={control}
              rules={{ required: "Branch Name is required" }}
              render={({ field }) => (
                <TextField
                  InputProps={{
                    sx: {
                      fontSize: "16px",
                      color: "#9A9A9A",
                    },
                  }}
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

          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
            >
              Team Manger
            </Typography>
            <Controller
              name="manager"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  {/* Optional: add this line if you want a label */}
                  <Select
                    sx={{ fontSize: "16px", color: "#9A9A9A" }}
                    {...field}
                    labelId="manager-label"
                    displayEmpty
                    renderValue={(value) => {
                      if (value === "") {
                        return <em>Select User</em>; // Placeholder text
                      }
                      return field.value;
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select User
                    </MenuItem>{" "}
                    {/* Placeholder */}
                    <MenuItem value="shah">shahbaz</MenuItem>
                    <MenuItem value="ali">ali</MenuItem>
                    <MenuItem value="shahid">shahid</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
            >
              Status
            </Typography>
            <Controller
              name="status"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  {/* Optional: add this line if you want a label */}
                  <Select
                    sx={{ fontSize: "16px", color: "#9A9A9A" }}
                    {...field} // Spread the field props
                    labelId="status-label"
                    displayEmpty // Add this to display the empty MenuItem as a placeholder
                  >
                    <MenuItem value="" disabled>
                      Choose a status
                    </MenuItem>{" "}
                    {/* Placeholder */}
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
            >
              Team Members
            </Typography>
            <Controller
              name="members"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <FormControl fullWidth size="small">
                  <Select
                    sx={{ fontSize: "16px", color: "#9A9A9A" }}
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
                        return <em>Select members</em>;
                      }
                      return member.join(", "); // This will show the selected members separated by commas
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
                      Choose a status
                    </MenuItem>{" "}
                    <MenuItem value="Pankij">Pankij</MenuItem>
                    <MenuItem value="Nakhil">Nakhil</MenuItem>
                    <MenuItem value="manger">Manager</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default CreateTeam;
