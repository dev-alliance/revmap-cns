/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  Button,
  Link,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import logo from "../assets/logo.jpg";
import logoVerification from "../assets/email_verification.png";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOtp } from "@/service/api/apiMethods";
type FormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupPage: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const onSubmit = async () => {
    if (otp.length === 5) {
      // Assuming OTP is of length 5
      try {
        const payload = {
          email: email,
          otp: otp,
        };
        const response = await verifyOtp(payload); // Pass the OTP for verification
        if (response.ok === true) {
          toast.success(response.message);
          navigate("/"); // Navigate to success page or route
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error("An error occurred during verification.");
        console.error("Verification error:", error.response || error.message);
      }
    } else {
      toast.error("Please enter a valid 5-digit OTP.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: "100vh", padding: 1 }}>
      <Grid container sx={{ height: "100%" }}>
        {/* Left side - Form */}
        <Grid
          item
          xs={12}
          md={12}
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

          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              m: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography
                variant="h5"
                component="h1"
                color={"#155BE5"}
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Email Verification
              </Typography>
              <Typography
                variant="h5"
                component="h1"
                color={"#9A9A9A"}
                sx={{ mb: 4, textAlign: "center", fontSize: "15px" }}
              >
                we've sent a code to {email}
              </Typography>
              <img
                src={logoVerification}
                alt="logoVerification"
                style={{
                  maxWidth: isMobile ? "100px" : "150px",
                  marginTop: "16px",
                  display: "block", // Add this line
                  margin: "auto", // Add this line
                }}
              />
              <Box
                sx={{ mt: 2 }}
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(); // Call the onSubmit function when the form is submitted
                }}
                noValidate
              >
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={5}
                  inputStyle={{
                    width: "3rem", // Adjust width as needed
                    height: "3rem", // Adjust height as needed
                    margin: "0.5rem",
                    fontSize: "2rem", // Adjust font size as needed
                    borderRadius: 4,
                    border: "1px solid rgba(0,0,0,0.3)",
                  }}
                  renderInput={(props, i) => (
                    <div key={i} style={{ display: "inline-block" }}>
                      <input {...props} />
                    </div>
                  )}
                />
                <Typography
                  sx={{
                    mt: 2,
                    mb: 1,
                  }}
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Didn’t get the code?{" "}
                  <Link
                    href="/signup"
                    sx={{
                      mt: 2,
                      mb: 2,
                      color: "primary.main",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Request again
                  </Link>
                </Typography>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  size="small"
                >
                  Submit
                </Button>

                {/* Terms and Privacy Policy Links */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 2, ml: 0, mr: 0 }}
                >
                  By signing up, you agree to ContractnSign’s{" "}
                  <Link
                    // href="/signup"
                    sx={{
                      m: 1,
                      color: "primary.main",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Terms of Service
                  </Link>
                  and
                  <Link
                    // href="/signup"
                    sx={{
                      m: 1,
                      color: "primary.main",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Privacy Policy.
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignupPage;
