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
  TextFormFieldInfo,
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
import { Link } from "react-router-dom";
import SignatureMultiSendReq from "./SignatureMultiSendReq";
import OpenDrawSignature from "./OpenDrawSignature";

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
    editorRefContext,
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
  const [backgroundColor, setBackgroundColor] = useState("#d9d9d9");

  const handleOnChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: OptionType | null
  ) => {
    console.log("new", newValue);
    setSelectedEmails(newValue);
    if (newValue) {
      const index =
        options.findIndex((option: any) => option.email === newValue.email) %
        colors.length;
      const selectedColor = colors[index];
      setBackgroundColor(selectedColor); // Set the color state to the selected option's color
    } else {
      setBackgroundColor(""); // Reset or handle deselection
    }
  };

  const radioDrag = () => {
    const documentEditor = editorRefContext;

    //Insert Checkbox form field
    documentEditor.editor.insertFormField("CheckBox");

    //Insert Drop down form field
  };

  const DraggableField = ({ field }: any) => {
    console.log("fields : ", field);
    const handleDragStart = (e: any) => {
      e.dataTransfer.setData("text/plain", field.placeholder);
      const documentEditor = editorRefContext;
      documentEditor.editor.insertFormField("Text");

      console.log("lable : ", field?.label);

      const textfieldInfo: TextFormFieldInfo = documentEditor.getFormFieldInfo(
        "Text1"
      ) as TextFormFieldInfo;
      textfieldInfo.defaultValue = field?.label + " * ";
      // textfieldInfo.format = "Lowercase";
      textfieldInfo.type = "Text";
      textfieldInfo.name = field?.label;
      documentEditor.setFormFieldInfo("Text1", textfieldInfo);
      setDragFields(dragFields + 1);
    };

    const handleDragStartCheckbox = (e: any) => {
      e.dataTransfer.setData("text/plain", field.placeholder);
      const documentEditor = editorRefContext;
      documentEditor.editor.insertFormField("CheckBox");
    };

    return (
      <>
        {field?.id !== "RadioButton" && (
          <div
            className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
            draggable
            onDragEnd={handleDragStart}
            style={{ cursor: "grab", backgroundColor }}
          >
            <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          </div>
        )}
        {field?.id == "RadioButton" && (
          <div
            onClick={radioDrag}
            className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
            draggable
            onDragEnd={handleDragStartCheckbox}
            style={{ cursor: "grab", backgroundColor }}
          >
            <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          </div>
        )}
      </>
    );
  };

  const fields = [
    // {
    //   id: "Signature",
    //   icon: signIcon,
    //   label: "Signature",
    //   placeholder: "[ Signature ]",
    // },

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
      label: "Radio Button",
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

  const [OpenDrawSignatures, setOpenDrawSignatures] = useState(false);

  const [siningOrder, setSiningOrder] = useState(false);
  // const handleCloseDialog = () => {
  //   setOpenSignatureDialog(false);
  // };

  const handleCloseDrawSigDialog = () => {
    setOpenDrawSignatures(false);
  };
  return (
    <>
      <div style={{ textAlign: "left", position: "relative" }}>
        {/* <SignatureMultiSendReq
          open={openMultiDialog}
          onClose={handleClosMultieDialog}
          ClickData={ClickData}
        /> */}

        <OpenDrawSignature
          openDilog={OpenDrawSignatures}
          onClose={handleCloseDrawSigDialog}
          closeFirstOen={handleCloseDrawSigDialog}
          selectedEmails={selectedEmails}
        />
        <Typography variant="body1" color="#155be5" sx={{ fontSize: "14px" }}>
          Fields
        </Typography>

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
            fontSize: "14px",
            // borderBottom: 1,
            // borderColor: "divider",
          }}
        >
          <Autocomplete
            size="small"
            fullWidth
            options={validRecipients}
            getOptionLabel={(option) => option.email}
            value={selectedEmails}
            onChange={handleOnChange}
            renderInput={(params) => (
              <TextField {...params} label="Select Signer" variant="outlined" />
            )}
            isOptionEqualToValue={(option, value) =>
              option.email === value.email
            }
            renderOption={(props, option, { selected }) => (
              <li
                {...props}
                style={{
                  backgroundColor:
                    colors[
                      options.findIndex(
                        (opt: any) => opt?.email === option.email
                      ) % colors?.length
                    ],
                  color: selected ? "white" : "black",
                }}
              >
                {option.email}
              </li>
            )}
          />
        </Box>

        <p className="font-medium text-[14px] text-[#155be5] mt-10">
          Signature Fields
        </p>
        <div style={{ padding: "10px" }}>
          <div onClick={() => setOpenDrawSignatures(true)}>
            <div
              className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
              style={{ cursor: "grab", backgroundColor }}
            >
              <img src={signIcon} alt="" className="h-4 w-4" /> Signature
            </div>
          </div>

          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <DraggableField field={field} />
              {(index + 1) % 6 === 0 && <Divider sx={{ mt: 3, mb: 3 }} />}
            </React.Fragment>
          ))}
        </div>

        <Divider sx={{ mt: 1, mb: 2 }} />
        <p className="font-medium text-[14px] text-[#155be5] my-3">
          Custom Fields
        </p>
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
