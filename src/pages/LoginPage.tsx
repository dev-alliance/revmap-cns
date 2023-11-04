/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import logo from "../assets/logo.jpg"; // Adjust the path to your logo image
import loginBanner from "@/assets/login_banner.png"; // Adjust the path to your background image
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login } from "@/service/api/apiMethods";
import toast from "react-hot-toast";
type FormInputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };
      const response = await login(payload);
      console.log(response);
      if (response.ok === true) {
        toast.success("Logged in successfully!");
      }
    } catch (error: any) {
      console.log(error);

      let errorMessage = "Login failed";
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="xl" sx={{ height: "100vh", padding: 1 }}>
      <Grid container sx={{ height: "100%" }}>
        {/* Left side - Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            ...(isMobile && { paddingBottom: 2 }),
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: isMobile ? "150px" : "320px",
              marginTop: "16px",
            }}
          />

          <Box sx={{ width: "100%", maxWidth: 400, m: 3 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography
                variant="h5"
                component="h1"
                color={"#155BE5"}
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Welcome Back !
              </Typography>
              <Typography
                variant="h5"
                component="h1"
                color={"#9A9A9A"}
                sx={{ mb: 2, textAlign: "center", fontSize: "15px" }}
              >
                Sign in to Continue
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Email Label and Input */}
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 0, mb: -1, fontSize: "15px" }}
                >
                  Email
                </Typography>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      type="email"
                      autoComplete="email"
                      placeholder="Enter email"
                      error={Boolean(errors.email)}
                      helperText={errors.email ? errors.email.message : ""}
                      variant="outlined"
                      size="small"
                    />
                  )}
                />

                <Grid container justifyContent="flex-end" sx={{ mb: -3 }}>
                  <Grid item>
                    <Link href="/forgotpassword" variant="body2">
                      Forgot passwordd?
                    </Link>
                  </Grid>
                </Grid>

                {/* Password Label and Input */}
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 0, mb: -1, fontSize: "15px" }}
                >
                  Password
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={
                    {
                      /* your validation rules for password */
                    }
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type={showPassword ? "text" : "password"}
                      margin="normal"
                      fullWidth
                      label="Password"
                      autoComplete="current-password"
                      placeholder="Enter password"
                      error={Boolean(errors.password)}
                      helperText={
                        errors.password ? errors.password.message : ""
                      }
                      variant="outlined"
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                <FormControlLabel
                  control={
                    <Controller
                      name="rememberMe"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox {...field} color="primary" />
                      )}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "15px" }}>
                      Remember me
                    </Typography>
                  }
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  size="small"
                >
                  Sign In
                </Button>

                {/* Sign Up Link */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Don't have an account yet?{" "}
                  <Link
                    href="/signup"
                    sx={{
                      color: "primary.main",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Right side - Image */}
        <Grid
          item
          xs={12}
          md={6}
          style={{
            backgroundImage: `url(${loginBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: isMobile ? "none" : "block",
          }}
        >
          {/* Any content you want on the image side */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
