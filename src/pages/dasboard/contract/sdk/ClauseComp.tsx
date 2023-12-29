/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import { getList } from "@/service/api/clauses";
const ClauseComp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const [isLoading, setIsLoading] = useState(false);
  const [List, setlist] = useState<any[]>([]);
  const [selectedClause, setSelectedClause] = useState<any>("");

  const handleSelectChange = (value: any) => {
    const clause = List.find((clause) => clause._id === value);
    setSelectedClause(clause);
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getList();
      setlist(data);
      console.log("approvals", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listData();
  }, []);
  const bubbleColors = ["#FEC85E", "#BC3D89", "#725FE7,#00A7B1"]; // Yellow, Green, Blue
  return (
    <div style={{ textAlign: "left", position: "relative" }}>
      <Typography variant="body1" color="primary">
        Clauses
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Drag and drop approved clauses into your contract
      </Typography>
      <Divider style={{ margin: "20px 0" }} />

      <FormControl fullWidth size="small">
        <Controller
          name="branch"
          control={control}
          defaultValue=""
          rules={{ required: "Branch is required" }}
          render={({ field: { onChange, value, ...field } }) => (
            <Select
              {...field}
              value={value}
              onChange={(e) => {
                onChange(e);
                handleSelectChange(e.target.value);
              }}
              labelId="branch-label"
              displayEmpty
              // other properties
            >
              {List?.map((clause) => (
                <MenuItem key={clause?._id} value={clause?._id}>
                  {clause?.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      {/* Description box */}
      {selectedClause && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="subtitle1">Description:</Typography>
          <Typography variant="body2">{selectedClause?.content}</Typography>
        </div>
      )}
    </div>
  );
};

export default ClauseComp;
