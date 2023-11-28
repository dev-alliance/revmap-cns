import React, { useEffect, useState } from "react";
import { Typography, Divider, Button, Box } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import ChangePasswordVerification from "@/pages/dasboard/profile/ChangePasswordVerification";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { changepasReq, getUserId } from "@/service/api/apiMethods";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";

const Account: React.FC = () => {
  const { user, setVerification, twoFA, setTwoFA } = useAuth();

  const [isModalOpenVerifi, setIsModalOpenVerifi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getUserId(user?._id);
      console.log(data?.user.twoFactorAuth);
      setTwoFA(data?.user?.twoFactorAuth);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (user?._id) listData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const handleOpenModalchangePass = async () => {
    try {
      setIsLoading(true);
      const payload = {
        email: user?.email,
      };
      const response = await changepasReq(payload);
      console.log(response);
      if (response.ok === true) {
        setVerification(false);
        toast.success(response.message);
        setIsModalOpenVerifi(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseModalVerifiPass = () => setIsModalOpenVerifi(false);

  const handleEnable2FA = async () => {
    try {
      setIsLoading(true);
      const payload = {
        email: user?.email,
        is2FA: true,
      };
      const response = await changepasReq(payload);
      console.log(response);
      if (response.ok === true) {
        toast.success(response.message);
        setVerification(true);
        setIsModalOpenVerifi(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {" "}
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
      <Box sx={{ padding: 1.3, opacity: isLoading ? "30%" : "100%" }}>
        <Typography variant="h5" gutterBottom>
          Organisation
        </Typography>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ color: "text.secondary" }}
        >
          Your Name
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" component="div">
              Password
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Change the password for your account
            </Typography>
          </Box>
          <Button
            sx={{ color: "primary.main", textTransform: "none" }}
            endIcon={<ArrowForward />}
            //   onClick={handleOpenModalResetPass}
            onClick={handleOpenModalchangePass}
          >
            Change password
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" component="div">
              Two-Factor Authentication
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Requires an authentication code when you log in with an email and
              passwords
            </Typography>
          </Box>
          <Box>
            {" "}
            <Button
              sx={{ color: "primary.main", textTransform: "none", mr: 2 }}
              endIcon={<ArrowForward />}
            >
              {twoFA === true ? " Enabled" : "Disabled"}
            </Button>
            <Button
              sx={{ textTransform: "none" }}
              onClick={handleEnable2FA}
              variant="contained"
              color="primary"
            >
              {twoFA === true ? "Disable" : "Enable"}
            </Button>
          </Box>
        </Box>

        <ChangePasswordVerification
          listData={listData}
          open={isModalOpenVerifi}
          onClose={handleCloseModalVerifiPass}
        />
      </Box>
    </>
  );
};

export default Account;