/* eslint-disable @typescript-eslint/no-explicit-any */
// UpdateBranch.tsx
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
import {
  createBranch,
  getBranchByid,
  updateBranch,
} from "@/service/api/apiMethods";
import { Update } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

type FormValues = {
  branchName: string;
  branchId: string;
  address: string;
  pinCode: string;
  contact: string;
  manager: string;
  state: string;
  website: string;
  country: string;
  status: string;
  countryCode: string;
};

const UpdateBranch = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const selectedCountry = watch("country");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [status, setStatus] = useState<any>("");
  const [state, setState] = useState<any>("");
  const [countery, setCountery] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<undefined>(undefined);

  const countries = Country.getAllCountries().map((country) => ({
    code: country.isoCode,
    name: country.name,
    phoneCode: country.phonecode,
  }));

  React.useEffect(() => {
    setValue("state", "");
  }, [selectedCountry, setValue]);
  const countryCode = watch("countryCode");
  const contact = watch("contact");

  React.useEffect(() => {
    if (countryCode && contact) {
      setValue(
        "contact",
        `${countryCode} ${contact.replace(countryCode, "")}`.trim()
      );
    }
  }, [countryCode, contact, setValue]);

  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getBranchByid(id);
      console.log(data);

      setList(data);
      setValue("branchName", data.branchName);
      setValue("address", data.address);
      setValue("branchId", data.branchId);
      setValue("contact", data.contact);
      setValue("contact", data.contact);
      setValue("country", data.country);
      setValue("manager", data.manager);
      setValue("pinCode", data.pinCode);
      setValue("status", data.status);
      setValue("website", data.website);
      setState(data.state);
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
  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        branchName: data.branchName,
        branchId: data.branchId,
        address: data.address,
        pinCode: data.pinCode,
        contact: data.contact,
        manager: data.manager,
        state: state,
        website: data.website,
        country: data.country,
        status: data.status,
      };
      const response = await updateBranch(id, payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/branchlist");
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
              Update Branch
            </Typography>
          </Box>
        </div>

        <div>
          <Button
            sx={{ ml: 2, textTransform: "none" }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Update
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
              Legal Name*
            </Typography>

            <Controller
              name="branchName"
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
                  error={!!errors.branchName}
                  helperText={errors.branchName?.message}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "16px", color: "#9A9A9A" }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
            >
              Branch ID*
            </Typography>
            <Controller
              name="branchId"
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
                  placeholder="Registration No"
                  fullWidth
                  error={!!errors.branchId}
                  helperText={errors.branchId?.message}
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
              Address*
            </Typography>
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <TextField
                  InputProps={{
                    sx: {
                      fontSize: "16px",
                      color: "#9A9A9A",
                    },
                  }}
                  {...field}
                  placeholder="Address"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  size="small"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          {/* Pin Code field */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
            >
              Pin Code*
            </Typography>
            <Controller
              name="pinCode"
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
                  placeholder="Pin Code"
                  fullWidth
                  error={!!errors.pinCode}
                  helperText={errors.pinCode?.message}
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
              Contact Number
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <Controller
                    name="countryCode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        sx={{ fontSize: "16px", color: "#9A9A9A" }}
                        {...field}
                        labelId="country-code-label"
                        placeholder="Country Code"
                        value={selectedCountryCode}
                        onChange={(e) => {
                          setSelectedCountryCode(e.target.value);
                          setValue("contact", e.target.value);
                        }}
                        displayEmpty
                        renderValue={(value) => {
                          if (value === "") {
                            return <em>Select Country Code</em>; // Placeholder text
                          }
                          return selectedCountryCode;
                        }}
                      >
                        {countries.map((country) => (
                          <MenuItem
                            key={country.code}
                            value={`+${country.phoneCode}`}
                          >
                            {`${country.name} (+${country.phoneCode})`}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={8}>
                <Controller
                  name="contact"
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
                      placeholder="Contact Number"
                      fullWidth
                      required
                      size="small"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
            >
              Manager*
            </Typography>
            <Controller
              name="manager"
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
                  placeholder="Manager"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 0.5, fontSize: "16px", color: "#9A9A9A" }}
            >
              Country*
            </Typography>
            <FormControl fullWidth size="small">
              <Controller
                name="country"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    sx={{ fontSize: "16px", color: "#9A9A9A" }}
                    {...field}
                    labelId="country-label"
                    placeholder="Country"
                    displayEmpty
                    renderValue={(value) => {
                      if (value === "") {
                        return <em>Select Country</em>; // Placeholder text
                      }
                      return field.value;
                    }}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.name}
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
              State
            </Typography>
            <FormControl fullWidth variant="outlined" size="small">
              <Controller
                name="state"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    sx={{ fontSize: "16px", color: "#9A9A9A" }}
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                    labelId="state-label"
                    placeholder="State"
                    displayEmpty
                    renderValue={(value) => {
                      if (value === "") {
                        return <em>Select State</em>; // Placeholder text
                      }
                      return state;
                    }}
                  >
                    {selectedCountry &&
                      getStatesByCountry(selectedCountry).map((state) => (
                        <MenuItem key={state.stateCode} value={state.name}>
                          {state.name}
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
              Website
            </Typography>
            <Controller
              name="website"
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
                  placeholder="Website"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
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
                  <Select
                    sx={{ fontSize: "16px", color: "#9A9A9A" }}
                    {...field} // Spread the field props to bind the form control to the Controller
                    labelId="status-label"
                    displayEmpty
                    renderValue={(value) => {
                      if (value === "") {
                        return <em>Select Status</em>; // Placeholder text
                      }
                      return field.value;
                    }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
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

export default UpdateBranch;
