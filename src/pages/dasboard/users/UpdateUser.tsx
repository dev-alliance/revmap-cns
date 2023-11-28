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
} from "@mui/material";

import toast from "react-hot-toast";
import {
  getBranchList,
  getTeamsList,
  getUserId,
  updateUser,
} from "@/service/api/apiMethods";
import { useNavigate, useParams } from "react-router-dom";
import logo from "@/assets/send.png";
import users from "@/assets/user.png";
import permission from "@/assets/permission.png";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import RoleTable from "@/pages/dasboard/users/RoleTable";
import { useAuth } from "@/hooks/useAuth";
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
  image: string;
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

const UpdateUser = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState<any>("");
  const [tabValue, setTabValue] = useState(0);
  const [image, setImage] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<any>("");
  const [teamData, setTeamData] = useState<Array<any>>([]);
  const [branchData, setBranchData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<undefined>(undefined);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { user } = await getUserId(id);
      setList(user);
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("email", user.email);
      setValue("job", user.job);
      setValue("mobile", user.mobile);
      setValue("landline", user.team);
      setValue("team", user.team);
      setValue("branch", user.branch);
      setValue("status", user.status);
      setImage(user?.image);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    if (id) listData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const getTeamsData = async () => {
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
    getTeamsData();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      if (image === "") {
        await toast.error("Please select an Image!");
        return;
      }
      setTabValue(1);
      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        job: data.job,
        landline: data.landline,
        mobile: data.mobile,
        team: data.team,
        status: data.status,
        role: 1,
        emailVerified: false,
        disabled: false,
        branch: data.branch,
      };
      if (imageBase64) {
        payload.image = imageBase64;
      }
      const response = await updateUser(id, payload);
      if (response.ok === true) {
        toast.success(response.message);
        // navigate("/resetpassword");
      } else {
        const errorMessage = response.message || response.data;
        toast.error(errorMessage);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      let errorMessage = "failed";
      if (error.response) {
        errorMessage = error.response.data || error.response.message;
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);

      // Handle error
      console.error(errorMessage);
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
                  src={users}
                  alt="send"
                  style={{ marginRight: 8, height: "20px" }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ fontSize: "16px", color: "#9A9A9A" }}
                >
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
              <Typography
                variant="subtitle1"
                sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
              >
                First Name*
              </Typography>

              <Controller
                name="firstName"
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
              <Typography
                variant="subtitle1"
                sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
              >
                Last Name*
              </Typography>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Branch ID is required" }}
                render={({ field }) => (
                  <TextField
                    InputProps={{
                      sx: {
                        fontSize: "16px",
                        color: "#9A9A9A",
                      },
                    }}
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
              <Typography
                variant="subtitle1"
                sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
              >
                email*
              </Typography>
              <Controller
                name="email"
                control={control}
                rules={{ required: "email is required" }}
                render={({ field }) => (
                  <TextField
                    InputProps={{
                      sx: {
                        fontSize: "16px",
                        color: "#9A9A9A",
                      },
                    }}
                    {...field}
                    placeholder="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled
                    size="small"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
              >
                Job Title
              </Typography>
              <Controller
                name="job"
                control={control}
                rules={{ required: "Pin Code is required" }}
                render={({ field }) => (
                  <TextField
                    InputProps={{
                      sx: {
                        fontSize: "16px",
                        color: "#9A9A9A",
                      },
                    }}
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
              <Typography
                variant="subtitle1"
                sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
              >
                Team
              </Typography>

              <FormControl fullWidth size="small">
                <Controller
                  name="team"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      sx={{ fontSize: "16px", color: "#9A9A9A" }}
                      {...field}
                      labelId="team-label"
                      placeholder="Team"
                      displayEmpty
                      renderValue={(value) => {
                        if (value === "") {
                          return <em>Select Team</em>; // Placeholder text
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
              <Typography
                variant="subtitle1"
                sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
              >
                Branch
              </Typography>
              <FormControl fullWidth size="small">
                <Controller
                  name="branch"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      sx={{ fontSize: "16px", color: "#9A9A9A" }}
                      {...field}
                      labelId="branch-label"
                      placeholder="Branch"
                      displayEmpty
                      renderValue={(value) => {
                        if (value === "") {
                          return <em>Select Branch</em>; // Placeholder text
                        }

                        // Find the branch with the matching ID in branchData and return its name
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
              <Typography
                variant="subtitle1"
                sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
              >
                Mobile
              </Typography>
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
              <Typography
                variant="subtitle1"
                sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
              >
                Landline
              </Typography>
              <Controller
                name="landline"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    InputProps={{
                      sx: {
                        fontSize: "16px",
                        color: "#9A9A9A",
                      },
                    }}
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
                <Typography
                  variant="subtitle1"
                  sx={{ fontSize: "16px", color: "#9A9A9A" }}
                >
                  Permission
                </Typography>
                <Divider sx={{ flexGrow: 1, ml: 2 }} />
              </Box>
              <Grid sx={{ mb: 3 }}>
                <RoleTable />
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
                  Update User
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </form>
  );
};

export default UpdateUser;
