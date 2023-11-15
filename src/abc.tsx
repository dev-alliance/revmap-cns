/* eslint-disable @typescript-eslint/no-explicit-any */
// BranchForm.tsx
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
import { useNavigate } from "react-router-dom";
import { createBranch } from "@/service/api/apiMethods";
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
  status: boolean;
  countryCode: string;
};

const BranchForm = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const selectedCountry = watch("country");
  const navigate = useNavigate();
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [state, setState] = useState<any>(null);
  const [countery, setCountery] = useState<any>(null);

  React.useEffect(() => {
    setValue("state", "");
  }, [selectedCountry, setValue]);

  const countries = Country.getAllCountries().map((country) => ({
    code: country.isoCode,
    name: country.name,
    phoneCode: country.phonecode,
  }));

  const countryCode = watch("countryCode");
  const contact = watch("contact");

  React.useEffect(() => {
    // If there is a selected country code and a contact number, concatenate them
    if (countryCode && contact) {
      // Update the contact field to include the country code
      setValue(
        "contact",
        `${countryCode} ${contact.replace(countryCode, "")}`.trim()
      );
    }
  }, [countryCode, contact, setValue]);

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
        country: countery,
        status: status,
      };
      const response = await createBranch(payload);
      console.log(response.message);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("");
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
              Create Branch
            </Typography>
          </Box>
        </div>

        <div>
          <Button variant="outlined" onClick={() => console.log("Cancel")}>
            Cancel
          </Button>
          <Button
            sx={{ ml: 2 }}
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
              Legal Name*
            </Typography>

            <Controller
              name="branchName"
              control={control}
              rules={{ required: "Branch Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Branch Name"
                  fullWidth
                  error={!!errors.branchName}
                  helperText={errors.branchName?.message}
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
              Branch ID*
            </Typography>
            <Controller
              name="branchId"
              control={control}
              rules={{ required: "Branch ID is required" }}
              render={({ field }) => (
                <TextField
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
                  <InputLabel
                    id="country-code-label"
                    sx={{ fontSize: "16px", color: "#9A9A9A" }}
                  >
                    +64
                  </InputLabel>
                  <Controller
                    name="countryCode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="country-code-label"
                        placeholder="Country Code"
                        onChange={(e) => {
                          // When country code changes, update its state and reset contact field
                          setSelectedCountryCode(e.target.value);
                          setValue("contact", e.target.value);
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
              <InputLabel
                id="country-label"
                sx={{ fontSize: "16px", color: "#9A9A9A" }}
              >
                {" "}
                Select Country
              </InputLabel>
              <Controller
                name="country"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    onChange={(e) => setCountery(e.target.value)}
                    value={countery}
                    labelId="country-label"
                    placeholder="Country"
                    required
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
              <InputLabel
                id="country-label"
                sx={{ fontSize: "16px", color: "#9A9A9A" }}
              >
                Select State
              </InputLabel>
              <Controller
                name="state"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                    labelId="state-label"
                    placeholder="State"
                    required
                  >
                    {selectedCountry &&
                      getStatesByCountry(selectedCountry).map((state) => (
                        <MenuItem key={state.stateCode} value={state.stateCode}>
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
              defaultValue={false}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <InputLabel
                    id="country-code-label"
                    sx={{ fontSize: "16px", color: "#9A9A9A" }}
                  >
                    status
                  </InputLabel>
                  <Select
                    onChange={(e) => setStatus(e.target.value)}
                    value={status}
                    labelId="status-label"
                    placeholder="select"
                    required
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                    <MenuItem value={false}>Archived</MenuItem>
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

export default BranchForm;
