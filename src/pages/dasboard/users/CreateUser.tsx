/* eslint-disable @typescript-eslint/no-explicit-any */
// BranchForm.tsx
import React, { ChangeEvent, useEffect, useState } from "react";
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
  Tabs,
  Tab,
  Divider,
  Avatar,
  Tooltip,
  FormControlLabel,
  Checkbox,
  CardHeader,
} from "@mui/material";
import { countries, getStatesByCountry } from "@/utils/CounteryState";
import { Country } from "country-state-city";
import toast from "react-hot-toast";
import {
  createBranch,
  createUser,
  getBranchList,
  getTeamsList,
} from "@/service/api/apiMethods";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/send.png";
import user from "@/assets/user.png";
import permission from "@/assets/permission.png";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import RoleTable from "@/pages/dasboard/users/RoleTable";
type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  job: string;
  mobile: string;
  landline: string;
  team: string;
  branch: string;
  status: string;
  inviteCheack: boolean;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CreateUser = () => {
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

  const [status, setStatus] = useState<any>("");
  const [tabValue, setTabValue] = useState(0);
  const [image, setImage] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [teamData, setTeamData] = useState<Array<any>>([]);
  const [branchData, setBranchData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const getBrandsData = async () => {
    try {
      const { data } = await getTeamsList();
      setTeamData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getBranchData = async () => {
    try {
      const { data } = await getBranchList();

      setBranchData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBranchData();
    getBrandsData();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      if (!imageBase64 || image === "") {
        await toast.error("Please select an Image!");
        return;
      }
      setTabValue(1);
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        job: data.job,
        landline: data.landline,
        mobile: data.mobile,
        team: data.team,
        status: data.status,
        role: 1,
        emailVerified: false,
        image: imageBase64,
        disabled: false,
        branch: data.branch,
      };
      const response = await createUser(payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/user-list");
      } else {
        const errorMessage = response.message || response.data;
        toast.error(errorMessage);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(imageBase64, "image");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String); // Keep the MIME type prefix
        setImage(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardHeader title=" Create User" sx={{ ml: -2 }} />
      <Paper sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", color: "red" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="User" />
            <Tab label="Role & Permissions" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <img
                  src={user}
                  alt="send"
                  style={{ marginRight: 8, height: "20px" }}
                />
                <Typography variant="subtitle2">
                  Personal Information
                </Typography>
                <Divider sx={{ flexGrow: 1, ml: 2 }} />
              </Box>
              <Box sx={{ alignItems: "center" }}>
                <Tooltip title="Upload Image" arrow>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mb: 0,
                      mr: 1,
                      bgcolor: "#9A9A9A", // Set background color to gray
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    src={image}
                  >
                    <PersonIcon
                      sx={{ width: "100%", height: "100%", color: "#FFFFFF" }}
                    />
                  </Avatar>
                </Tooltip>

                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="contained-button-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="contained-button-file"
                  style={{ marginLeft: "4rem" }}
                >
                  <Tooltip title="Upload Image" arrow>
                    <PhotoCameraIcon sx={{ color: "#9A9A9A" }} />
                  </Tooltip>
                </label>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">First Name*</Typography>

              <Controller
                name="firstName"
                control={control}
                rules={{ required: "Branch Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Branch Name"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    size="small"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Last Name*</Typography>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Branch ID is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Last Name"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    size="small"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">email*</Typography>
              <Controller
                name="email"
                control={control}
                rules={{ required: "email is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    size="small"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Job Title</Typography>
              <Controller
                name="job"
                control={control}
                rules={{ required: "Pin Code is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Job Title"
                    fullWidth
                    error={!!errors.job}
                    helperText={errors.job?.message}
                    size="small"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Team</Typography>

              <FormControl fullWidth size="small">
                <Controller
                  name="team"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="team-label"
                      placeholder="Team"
                      displayEmpty
                      renderValue={(value) => {
                        if (value === "") {
                          return (
                            <em style={{ color: "#9A9A9A" }}>Select Team</em> // Placeholder text with custom color
                          );
                        }

                        // Find the team with the matching ID in teamData and return its name
                        const selectedTeam = teamData.find(
                          (team) => team._id === value
                        );
                        return selectedTeam ? selectedTeam.name : "";
                      }}
                    >
                      {teamData?.map((team: any) => (
                        <MenuItem key={team._id} value={team._id}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Branch</Typography>
              <FormControl fullWidth size="small">
                <Controller
                  name="branch"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="branch-label"
                      placeholder="Branch"
                      displayEmpty
                      renderValue={(value) => {
                        if (value === "") {
                          return (
                            <em style={{ color: "#9A9A9A" }}>Select Branch</em> // Placeholder text with custom color
                          );
                        }
                        const selectedBranch = branchData.find(
                          (branch) => branch._id === value
                        );
                        return selectedBranch ? selectedBranch.branchName : "";
                      }}
                    >
                      {branchData?.map((branch: any) => (
                        <MenuItem key={branch?._id} value={branch?._id}>
                          {branch?.branchName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">Mobile</Typography>
              <Controller
                name="mobile"
                control={control}
                defaultValue=""
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Invalid phone number",
                  },
                }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      placeholder="Mobile"
                      fullWidth
                      variant="outlined"
                      size="small"
                      error={Boolean(errors.mobile)}
                      helperText={errors.mobile?.message}
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Landline</Typography>
              <Controller
                name="landline"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="landline"
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Box sx={{ width: "100%", textAlign: "right" }}>
              {" "}
              {/* Container with full width */}
              <Button
                sx={{ mt: 2, ml: 2, textTransform: "none" }}
                variant="contained"
                color="primary"
                onClick={() => setTabValue(1)}
              >
                Next
              </Button>
            </Box>
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* Permissions & Role */}
          <Grid container>
            <Grid
              item
              xs={12}
              sm={10}
              md={10}
              lg={10}
              xl={10}
              sx={{ width: "100%" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <img
                  src={permission}
                  alt="send"
                  style={{ marginRight: 8, height: "20px" }}
                />
                <Typography variant="subtitle1">Permission</Typography>
                <Divider sx={{ flexGrow: 1, ml: 2 }} />
              </Box>
              <Grid sx={{ mb: 3 }}>
                <RoleTable />
              </Grid>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <img
                  src={logo}
                  alt="send"
                  style={{ marginRight: 8, height: "20px" }}
                />
                <Typography variant="subtitle2">Send Invitation</Typography>
                <Divider sx={{ flexGrow: 1, ml: 2 }} />
              </Box>
              <Controller
                name="email"
                control={control}
                rules={{ required: "email is required" }}
                render={({ field }) => (
                  <TextField
                    sx={{
                      width: "60%", // Setting the width
                    }}
                    {...field}
                    placeholder="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    size="small"
                    variant="outlined"
                  />
                )}
              />
              <Grid sx={{ mt: 1 }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="inviteCheack"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox {...field} color="primary" />
                      )}
                    />
                  }
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Send invitation to the above email to complete login
                      process
                    </Typography>
                  }
                />
              </Grid>
              <Box sx={{ width: "100%", textAlign: "right" }}>
                {" "}
                {/* Container with full width */}
                <Button
                  sx={{ mt: 2, ml: 2, textTransform: "none" }}
                  variant="outlined"
                  onClick={() => console.log("Cancel")}
                >
                  Cancel
                </Button>
                <Button
                  sx={{ mt: 2, ml: 2, textTransform: "none" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Create User
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </form>
  );
};

export default CreateUser;
