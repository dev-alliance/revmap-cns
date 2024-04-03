/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Autocomplete,
  Box,
  FormControl,
  Select,
  MenuItem,
  Card,
  Tab,
  Divider,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { getList } from "@/service/api/clauses";
import ShareIcon from "@mui/icons-material/Share";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { TextareaAutosize } from "@mui/material";
import { ContractContext } from "@/context/ContractContext";
import CollaburaterDilog from "@/pages/dasboard/contract/sdk/CollaburaterDilog";
import { getfeildList } from "@/service/api/customFeild";

const Fields = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>();

  const { user } = useAuth();
  const {
    activeSection,
    setActiveSection,
    showButtons,
    setShowButtons,
    recipients,
    setRecipients,
    setOpenMultiDialog,
    openMultiDialog,
  } = useContext(ContractContext);

  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [isInternal, setIsInternal] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);

  const [checked, setChecked] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [ClickData, setClickData] = useState("");
  const [message, setMessage] = useState("");
  const [feildList, setFeildList] = useState<Array<any>>([]); // State for the message input
  // State to track if the comment is internal or external
  const [selectedEmails, setSelectedEmails] = useState([]);

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
  const listFeildData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getfeildList();

      setFeildList(data);

      console.log("data", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      listFeildData();
      listData();
    }
  }, [user?._id]);

  const validRecipients = recipients.filter((recipient: any) =>
    userList.some((user) => user.email === recipient.email)
  );

  console.log(selectedEmails, "selectedEmails");

  const options = validRecipients.map((recipient: any) => {
    const user = userList.find((user) => user.email === recipient.email);
    return {
      email: recipient.email,
      name: `${user.firstName} ${user.lastName}`,
    };
  });
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  return (
    <>
      <div style={{ textAlign: "left", position: "relative" }}>
        <Typography variant="body1" color="primary" sx={{ fontSize: "15px" }}>
          Fields
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Drag and drop to assign signature fields for the signer to sign or add
          custom fields to get additional information.
        </Typography>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Typography
          variant="body1"
          color="primary"
          sx={{
            mb: 1,
            // fontWeight: "bold",
          }}
        >
          Signature Fields
        </Typography>
        <Box
          sx={{
            display: "flex",
            mb: 2,
            // borderBottom: 1,
            // borderColor: "divider",
          }}
        >
          <Autocomplete
            size="small"
            fullWidth
            // multiple
            options={options}
            getOptionLabel={(option: any) => option.name} // Display the user's full name
            value={selectedEmails}
            onChange={(event, newValue: any) => {
              setSelectedEmails(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select users" />
            )}
            isOptionEqualToValue={(option: any, value: any) =>
              option.email === value.email
            }
          />
        </Box>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Typography
          variant="body1"
          color="primary"
          sx={{
            mb: 1,
            // fontWeight: "bold",
          }}
        >
          Custom Fields
        </Typography>
        <Autocomplete
          size="small"
          fullWidth
          options={feildList}
          value={selectedValue}
          onChange={(event, newValue) => {
            setSelectedValue(newValue);
          }}
          getOptionLabel={(option) => option.name} // Display the option's name
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderOption={(props, option) => (
            <MenuItem {...props} key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          )}
          renderInput={(params) => <TextField {...params} label="Search " />}
          renderTags={() => null} // Optionally, prevent tags from rendering if `multiple` is enabled
        />
      </div>
    </>
  );
};

export default Fields;
