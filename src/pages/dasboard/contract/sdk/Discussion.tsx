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
import ShareIcon from "@mui/icons-material/Share";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { TextareaAutosize } from "@mui/material";
const Discussion = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [List, setlist] = useState<any[]>([]);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [member, setMamber] = useState<Array<any>>([]);
  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserListNameID(user?._id);
      console.log({ data });

      setUserList(data);
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
        Discussion
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Collaborate with your team to efficiently execute contract
      </Typography>
      <Divider style={{ margin: "20px 0" }} />

      <Box sx={{ display: "flex", mb: 2, mt: 2, alignItems: "center" }}>
        <Controller
          name="content"
          control={control}
          // rules={{ required: "Tag Name is required" }}
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              placeholder="Enter description"
              minRows={1} // Adjust the number of rows as needed
              style={{
                width: "100%",
                fontSize: "16px",
                // color: "#9A9A9A",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                padding: "10px",
              }}
            />
          )}
        />
        <Button
          sx={{ ml: 2, textTransform: "none" }}
          type="submit"
          variant="contained"
          color="primary"
        >
          Send
        </Button>
      </Box>
    </div>
  );
};

export default Discussion;
