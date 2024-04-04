/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContractContext } from "@/context/ContractContext";
import { useAuth } from "@/hooks/useAuth";
import { getUserListNameID } from "@/service/api/apiMethods";
import { getfeildList } from "@/service/api/customFeild";
import {
  Autocomplete,
  Box,
  Divider,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ps from '../../../../assets/icons/ps.svg'
import userIcon from '../../../../assets/icons/user.svg'
import companyIcon from '../../../../assets/icons/company.svg'
import signIcon from '../../../../assets/icons/sign.svg'
import titleIcon from '../../../../assets/icons/user.svg'
import dateIcon from '../../../../assets/icons/date.svg'

import { useForm } from "react-hook-form";

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
    setDragFields,
    dragFields
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

  console.log('selected Emails : ', selectedEmails)

  const colors = ['#D3FDE4', '#D3DFFD', '#FFE1CB'];
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    // Function to select a random color
    const selectRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    // Update the background color when selectedEmails changes
    setBackgroundColor(selectRandomColor());
  }, [selectedEmails]); // Dependency on selectedEmails


  const DraggableField = ({ field, backgroundColor }: any) => {
    const handleDragStart = (e: any) => {
      e.dataTransfer.setData("text/plain", field.placeholder);
    };

    return (
      <div className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
        draggable
        onDragStart={handleDragStart}
        style={{ cursor: 'grab', backgroundColor }}
      >
        <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
      </div>
    );
  };




  const fields = [
    { id: 'Signature', icon: signIcon, label: 'Signature', placeholder: '[Signature]' },
    { id: 'Initial', icon: ps, label: 'Initial', placeholder: '[Initial]' },
    { id: 'DateSigned', icon: dateIcon, label: 'Date Signed', placeholder: '[Date Signed]' },
    { id: 'FullName', icon: userIcon, label: 'Full Name', placeholder: '[Full Name]' },
    { id: 'Title', icon: titleIcon, label: 'Title', placeholder: '[Title]' },
    { id: 'company', icon: companyIcon, label: 'Company', placeholder: '[Company]' },
  ];




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


  const options = validRecipients.map((recipient: any) => {
    const user = userList.find((user) => user.email === recipient.email);
    return {
      email: recipient.email,
      name: `${user.firstName} ${user.lastName}`,
    };
  });
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];

  const [optionBgColor, setOptionBgColor] = useState('#ffffff'); // Initial option background color, you can set it to any color

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
            onChange={(event, newValue) => {
              const index = options.findIndex((option: any) => option.email === newValue.email);
              setSelectedEmails({ ...newValue, index });
            }}

            renderInput={(params) => (
              <TextField {...params} label="Select users" />
            )}
            isOptionEqualToValue={(option: any, value: any) =>
              option.email === value.email
            }
          />
        </Box>




        <div style={{ padding: '10px' }}>
          {fields.map((field) => (
            <DraggableField key={field.id} field={field} backgroundColor={backgroundColor} />
          ))}
        </div>



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
