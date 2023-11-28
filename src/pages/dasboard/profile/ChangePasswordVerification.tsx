/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Grid,
  Paper,
  Link,
} from "@mui/material";
import logo from "@/assets/logo.jpg";
import logoVerification from "@/assets/email_verification.png";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyForgotPass, verifyOtp } from "@/service/api/apiMethods";
import OTPInput from "react-otp-input";
import { useAuth } from "@/hooks/useAuth";
import ChangePasswordModal from "@/pages/dasboard/profile/ChangePasswordModal";

interface ChangePasswordVerification {
  open: boolean;
  onClose: () => void;
  listData: () => void;
}

const ChangePasswordVerification: React.FC<ChangePasswordVerification> = ({
  open,
  onClose,
  listData,
}) => {
  const { user, verification, twoFA } = useAuth();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [otp, setOtp] = useState("");

  const [ispassModalOpen, setIsPassModalOpen] = useState(false);

  const handleCloseModalResetPass = () => setIsPassModalOpen(false);

  const onSubmit = async () => {
    // Assuming OTP is of length 5
    if (otp.length === 5) {
      try {
        let response;
        if (verification === true) {
          const payload = {
            email: user?.email,
            otp: otp,
            is2FA: "true",
          };
          if (twoFA === true) {
            payload.is2FA = "false";
          } else {
            payload.is2FA = "true";
          }

          response = await verifyOtp(payload);
          if (response.ok === true) {
            toast.success(response.message);
            onClose();
            listData();
            setOtp("");
          } else {
            toast.error(response.message);
          }
        } else {
          const payload = {
            email: user?.email,
            otp: otp,
          };
          response = await verifyForgotPass(payload);
          if (response.ok === true) {
            toast.success(response.message);
            onClose();
            setIsPassModalOpen(true);
            setOtp("");
          } else {
            toast.error(response.message);
          }
        }
      } catch (error: any) {
        // If the error is from an HTTP response, it should have a `response` property
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred during verification.";
        toast.error(errorMessage);
        console.error("Verification error:", errorMessage);
      }
    } else {
      toast.error("Please enter a valid 5-digit OTP.");
    }
  };
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="change-password-modal"
        aria-describedby="change-password-form"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "background.paper",
            padding: 3,
            borderRadius: 1,
            boxShadow: 24,
            outline: "none",
            maxWidth: 500,
            width: "100%",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
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
                    we've sent a code to {user?.email}
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
                    <OTPInput
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
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{ mb: 1, mt: 2, fontSize: "16px", color: "#9A9A9A" }}
                    >
                      Didn’t get the code?{" "}
                      <Link
                        href="/signup"
                        sx={{
                          mt: 2,
                          mb: 2,
                          color: "##9A9A9A",
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
          </Grid>
        </Box>
      </Modal>
      <ChangePasswordModal
        open={ispassModalOpen}
        onClose={handleCloseModalResetPass}
      />
    </>
  );
};

export default ChangePasswordVerification;
