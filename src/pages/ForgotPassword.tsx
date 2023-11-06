import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import logo from "../assets/logo.jpg"; // Adjust the path to your logo image
import loginBanner from "@/assets/login_banner.png"; // Adjust the path to your background image
import toast from "react-hot-toast";
import { forgotPass } from "@/service/api/apiMethods";
import { useNavigate } from "react-router-dom";
type FormInputs = {
  email: string;
};

const ForgotPassword: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const payload = {
        email: data.email,
      };
      const response = await forgotPass(payload);
      console.log(response);
      if (response.ok === true) {
        navigate("/emailverification");
        navigate("/emailvarfication", {
          state: { email: data.email, condition: "true" },
        });
        toast.success("Logged in successfully!");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                Forgot password !
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 0, mb: -1, fontSize: "16px", color: "#9A9A9A" }}
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
                      placeholder="Enter Your email"
                      error={Boolean(errors.email)}
                      helperText={errors.email ? errors.email.message : ""}
                      variant="outlined"
                      size="small"
                    />
                  )}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    textTransform: "none",
                    fontSize: "16px",
                    backgroundColor: "#155BE5",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#134DAB", // Slightly darker shade for hover effect, change as needed
                    },
                  }}
                  size="small"
                >
                  Submit
                </Button>
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

export default ForgotPassword;
