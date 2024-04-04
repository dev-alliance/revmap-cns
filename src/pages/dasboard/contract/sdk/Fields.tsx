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
  Typography,
} from "@mui/material";
import {
  DocumentEditorComponent,
  Selection,
  Editor,
  EditorHistory,
  ContextMenu,
  TableDialog,
  BorderSettings,
  PageSetupDialog,
  CheckBoxFormFieldInfo,
} from "@syncfusion/ej2-react-documenteditor";
import React, { useContext, useEffect, useState } from "react";
import ps from "../../../../assets/icons/ps.svg";
import userIcon from "../../../../assets/icons/user.svg";
import companyIcon from "../../../../assets/icons/company.svg";
import signIcon from "../../../../assets/icons/sign.svg";
import titleIcon from "../../../../assets/icons/title.svg";
import dateIcon from "../../../../assets/icons/date.svg";


import textIcon from "../../../../assets/icons/textIcon.svg";
import checkIcon from "../../../../assets/icons/checkIcon.svg";
import radioIcon from "../../../../assets/icons/radioIcon.svg";
import shortIcon from "../../../../assets/icons/short.svg";

import { useForm } from "react-hook-form";


interface OptionType {
  email: string;
  name: string;
}


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
    dragFields,
    editorRefContext
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
  const [selectedEmails, setSelectedEmails] = useState<OptionType | null>(null);

  console.log("selected Emails : ", selectedEmails);

  const colors = ["#D3FDE4", "#D3DFFD", "#FFE1CB"];
  const [backgroundColor, setBackgroundColor] = useState("");

  const handleOnChange = (event: React.SyntheticEvent<Element, Event>, newValue: OptionType | null) => {
    setSelectedEmails(newValue);
    if (newValue) {
      const index = options.findIndex((option: any) => option.email === newValue.email) % colors.length;
      const selectedColor = colors[index];
      setBackgroundColor(selectedColor); // Set the color state to the selected option's color
    } else {
      setBackgroundColor(""); // Reset or handle deselection
    }
  };


  const radioDrag = () => {
    const documentEditor = editorRefContext;

    //Insert Checkbox form field
    documentEditor.editor.insertFormField('CheckBox');
    //Insert Drop down form field 
  }

  const DraggableField = ({ field }: any) => {

    console.log('fields : ', field)
    const handleDragStart = (e: any) => {
      e.dataTransfer.setData("text/plain", field.placeholder);
    };

    return (
      <>
        {field?.id !== "RadioButton" &&

          <div
            className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
            draggable
            onDragStart={handleDragStart}
            style={{ cursor: "grab", backgroundColor }}
          >
            <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          </div>
        }
        {field?.id == "RadioButton" &&

          <div onClick={radioDrag}
            className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
            draggable
            onDragStart={handleDragStart}
            style={{ cursor: "grab", backgroundColor }}
          >
            <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          </div>
        }
      </>
    );
  };

  const fields = [
    {
      id: "Signature",
      icon: signIcon,
      label: "Signature",
      placeholder: "[ Signature ]",
    },

    { id: "Initial", icon: ps, label: "Initial", placeholder: "[Initial]" },

    {
      id: "DateSigned",
      icon: dateIcon,
      label: "Date Signed",
      placeholder: "[ Date Signed ]",
    },

    {
      id: "FullName",
      icon: userIcon,
      label: "Full Name",
      placeholder: "[ Full Name ]",
    },

    { id: "Title", icon: titleIcon, label: "Title", placeholder: "[ Title ]" },

    {
      id: "company",
      icon: companyIcon,
      label: "Company",
      placeholder: "[ Company ]",
    },

    {
      id: "ShortAnswer",
      icon: shortIcon,
      label: "Short Answer",
      placeholder: "[ Short Answer ]",
    },

    {
      id: "Text",
      icon: textIcon,
      label: "Text",
      placeholder: "[ Text ]",
    },

    {
      id: "Checkbox",
      icon: checkIcon,
      label: "Checkbox",
      placeholder: "[ Checkbox ]", // This will be a command to insert a checkbox form field
    },

    {
      id: "RadioButton",
      icon: radioIcon,
      label: "RadioButton",
      placeholder: "[ Radio Button ]", // Command to insert a radio button form field
    },

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
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1 , #f46464"];


  return (
    <>
      <div style={{ textAlign: "left", position: "relative" }}>
        <div className="flex justify-between pr-3">

          <Typography variant="body1" color="#155be5" sx={{ fontSize: "14px" }}>
            Fields
          </Typography>

          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_3745_36541)">
              <path d="M4.00666 8.09868C3.97958 8.19035 3.97389 8.287 3.99002 8.3812C4.00615 8.47541 4.04367 8.56466 4.09969 8.64209C4.15572 8.71953 4.22876 8.78308 4.31319 8.82787C4.39763 8.87265 4.49121 8.89748 4.58674 8.90043L9.42376 9.05723C9.51928 9.06047 9.61427 9.04176 9.70143 9.00254C9.78859 8.96332 9.86559 8.90463 9.92651 8.83098C9.98743 8.75734 10.0307 8.67071 10.0529 8.57774C10.075 8.48478 10.0756 8.38796 10.0545 8.29474C9.87344 7.50874 9.39627 6.82282 8.72231 6.37968L9.52338 3.25619C9.54665 3.16555 9.54927 3.07083 9.53104 2.97903C9.51281 2.88724 9.4742 2.80071 9.41806 2.72583C9.36191 2.65095 9.28967 2.58964 9.20666 2.54642C9.12366 2.5032 9.032 2.47917 8.93846 2.4761L5.49725 2.36455C5.40372 2.36151 5.3107 2.37952 5.22506 2.41724C5.13941 2.45496 5.06333 2.51143 5.00243 2.58248C4.94153 2.65354 4.89736 2.73736 4.87319 2.82776C4.84901 2.91817 4.84545 3.01285 4.86276 3.10481L5.46013 6.27393C4.75889 6.67249 4.23829 7.32606 4.00666 8.09868Z" stroke="#575757" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M7.00533 8.98145L6.85254 13.6948" stroke="#575757" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_3745_36541">
                <rect width="10" height="10" fill="white" transform="translate(0 6.83984) rotate(-43.1433)" />
              </clipPath>
            </defs>
          </svg>

        </div>
        <p className="text-[#8A8A8A] text-[10px] pt-1">
          Drag and drop to assign signature fields for the signer to sign or add
          custom fields to get additional information.
        </p>
        <Divider sx={{ mt: 1, mb: 0.5 }} />
        <Box
          sx={{
            display: "flex",
            mb: 2,
            mt: 2,
            fontSize: "14px"
            // borderBottom: 1,
            // borderColor: "divider",
          }}
        >
          <Autocomplete
            size="small"
            fullWidth
            options={options}
            getOptionLabel={(option) => option.name}
            value={selectedEmails}
            onChange={handleOnChange}
            renderInput={(params) => (
              <TextField {...params} label="Select users" variant="outlined" />
            )}
            isOptionEqualToValue={(option, value) => option.email === value.email}
            renderOption={(props, option, { selected }) => (
              <li
                {...props}
                style={{
                  backgroundColor: colors[options.findIndex((opt: any) => opt?.email === option.email) % colors?.length],
                  color: selected ? 'white' : 'black',
                }}
              >
                {option.name}
              </li>
            )}
          />

        </Box>

        <p className="font-medium text-[14px] text-[#155be5] mt-10">Signature Fields</p>
        <div style={{ padding: "10px" }}>
          {fields.map((field) => (
            <DraggableField
              key={field.id}
              field={field}
            // backgroundColor={backgroundColor}
            />
          ))}
        </div>

        <Divider sx={{ mt: 1, mb: 2 }} />
        <p className="font-medium text-[14px] text-[#155be5] my-3">Custom Fields</p>
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
