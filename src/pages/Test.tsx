// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { increment, decrement } from "@/service/counterSlice";
// import { RootState } from "@/store";

// function Test() {
//   const count = useSelector((state: RootState) => state.counter.value);
//   const dispatch = useDispatch();

//   return (
//     <div>
//       <h1>Counter: {count}</h1>
//       <button onClick={() => dispatch(increment())}>Increment</button>
//       <button onClick={() => dispatch(decrement())}>Decrement</button>
//     </div>
//   );
// }

// export default Test;

import React, { useState, ChangeEvent } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
  Paper,
} from "@mui/material";

interface OTPInputProps {
  length: number;
  onChange: (otp: string) => void;
}

// OTP Input Component
const OTPInput: React.FC<OTPInputProps> = ({ length, onChange }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < length - 1) {
      element.nextSibling?.focus();
    }

    onChange(newOtp.join(""));
  };

  return (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
      {Array.from({ length }, (_, index) => (
        <TextField
          key={index}
          variant="outlined"
          inputProps={{ maxLength: 1 }}
          onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </Box>
  );
};

// Main Component
const OTPVerification: React.FC = () => {
  const handleOtpChange = (otp: string) => {
    console.log("Entered OTP:", otp);
  };

  const handleSubmit = () => {
    console.log("Submit OTP");
    // Submit OTP logic here
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          sx={{ height: 60, mb: 2 }}
          src="path_to_your_logo.png" // Replace with your logo path
          alt="Logo"
        />

        {/* Email Verification Text */}
        <Typography component="h1" variant="h5">
          Email Verification
        </Typography>

        {/* OTP Input */}
        <Box sx={{ mt: 3, width: "100%" }}>
          <OTPInput length={6} onChange={handleOtpChange} />
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Paper>
    </Container>
  );
};

export default OTPVerification;
