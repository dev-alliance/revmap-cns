/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Typography,
  Paper,
  Box,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const LifeCycle = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const [isEvergreen, setIsEvergreen] = useState(false);

  const handleEvergreenChange = (event: any) => {
    setIsEvergreen(event.target.checked);
  };

  return (
    <div style={{ textAlign: "left", position: "relative" }}>
      <Typography variant="body1" color="primary">
        Lifecycle
      </Typography>
      <Divider style={{ margin: "20px 0" }} />

      {/* Start Date Field */}
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Start Date*
        </Typography>
        <Controller
          name="startDate"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              fullWidth
              size="small"
              variant="outlined"
            />
          )}
        />
      </Box>

      {/* End Date Field */}
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          End Date
        </Typography>
        <Controller
          name="endDate"
          control={control}
          //   rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              fullWidth
              size="small"
              variant="outlined"
            />
          )}
        />
      </Box>

      {/* Notice Period Field */}
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Notice Period
        </Typography>
        <Controller
          name="noticePeriod"
          control={control}
          //   rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              fullWidth
              size="small"
              variant="outlined"
            />
          )}
        />
      </Box>

      {/* Evergreen Checkbox */}
      <FormControlLabel
        sx={{ fontSize: "12px" }}
        control={
          <Checkbox checked={isEvergreen} onChange={handleEvergreenChange} />
        }
        label="Evergreen"
      />

      {/* Conditional Evergreen Duration Field */}
      {isEvergreen && (
        <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
          <Typography variant="body2" sx={{ minWidth: "75px", mr: 2 }}>
            Evergreen Duration (months)*
          </Typography>
          <Controller
            name="evergreenDuration"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                size="small"
                variant="outlined"
              />
            )}
          />
        </Box>
      )}
      <Box sx={{ display: "table", mb: 2, mt: 2, alignItems: "center" }}>
        <Typography
          variant="body1"
          sx={{ minWidth: "75px", mb: 2, whiteSpace: "nowrap" }}
        >
          Renewal Owner
        </Typography>
        <Controller
          name="noticePeriod"
          control={control}
          //   rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              //   type="date"
              placeholder="Add name"
              fullWidth
              size="small"
              variant="outlined"
            />
          )}
        />
      </Box>
    </div>
  );
};

export default LifeCycle;
