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
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
} from "@mui/material";
import {
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
import ClearIcon from "@mui/icons-material/Clear";
interface OptionType {
  email: string;
  name: string;
}
interface FormField {
  fieldName?: string;
  value?: string;
}

interface Checkbox {
  id: string;
  label: string;
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
  const [selectedCustomFeild, setSelectedCustomFeild] = useState<any>([]);
  const [show, setShow] = useState<any>("");
  const [showSidebar, setShowSidebar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);

  const [requiredField, setRequiredField] = useState(false);

  const [checked, setChecked] = React.useState(false);
  const [ClickData, setClickData] = useState("");

  const [placeHolder, setPlaceHolder] = useState("");
  const [placeHolderValue, setPlaceHolderValue] = useState("");
  const [newDragedField, setNewDragedField] = useState("");
  const handleGetValue = (e: any) => {
    setPlaceHolder(e.target.value);
    setPlaceHolderValue(e.target.value);
  };

  const [selectionField, setSelectionField] = useState("");
  const [feildList, setFeildList] = useState<Array<any>>([]); // State for the message input
  // State to track if the comment is internal or external
  const [selectedEmails, setSelectedEmails] = useState<any | null>(null);

  console.log("selected Emails : ", selectedEmails);

  const colors = ["#D3FDE4", "#D3DFFD", "#FFE1CB", "#3F9748"];
  const [backgroundColor, setBackgroundColor] = useState("#d9d9d9");

  const [items, setItems] = useState<any[]>([]);
  const [nextOptionNumber, setNextOptionNumber] = useState<number>(2);

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
      setBackgroundColor("#D9D9D9"); // Reset or handle deselection
    }
  };

  const radioDrag = () => {
    const documentEditor = editorRefContext;

    //Insert Checkbox form field
    if (selectedEmails) {
      documentEditor.editor.insertFormField("RadioButton");
    }

    //Insert Drop down form field
  };
  const checkBoxDrag = () => {
    const documentEditor = editorRefContext;

    //Insert Checkbox form field
    if (selectedEmails) {
      documentEditor.editor.insertFormField("CheckBox");
    }

    //Insert Drop down form field
  };

  console.log("selection Field new", selectionField);

  useEffect(() => {
    // Assuming editorRefContext is correctly initialized and has a method exportFormData()
    const documentEditor = editorRefContext;

    // Assuming exportFormData returns an array of FormField objects
    const formFieldsNames: FormField[] = documentEditor.exportFormData();

    // Find the field by name, handle potential undefined with optional chaining
    const valis = formFieldsNames.find(
      (val) => val.fieldName === selectionField
    );

    // Use optional chaining to handle cases where valis or valis.value might be undefined
    setPlaceHolder(valis?.value ?? "Default Placeholder");
  }, [selectionField]);

  // handle change required
  useEffect(() => {
    const documentEditor = editorRefContext;
    if (selectionField) {
      documentEditor.editor.insertFormField("Text");

      const textfieldInfo: TextFormFieldInfo = documentEditor.getFormFieldInfo(
        "Text1"
      ) as TextFormFieldInfo;

      console.log("add starikkkk :", textfieldInfo);

      // textfieldInfo.defaultValue = 'updated with staric *';
      textfieldInfo.defaultValue = `${
        placeHolder ? placeHolder : selectionField
      }${requiredField ? " *" : ""}`;

      // textfieldInfo.format = "Lowercase";
      textfieldInfo.type = "Text";
      textfieldInfo.name = selectionField;
      documentEditor.setFormFieldInfo("Text1", textfieldInfo);
    }
  }, [requiredField]);

  // handle change value

  const handleSetValue = () => {
    const documentEditor = editorRefContext;
    if (selectionField) {
      documentEditor.editor.insertFormField("Text");

      const textfieldInfo: TextFormFieldInfo = documentEditor.getFormFieldInfo(
        "Text1"
      ) as TextFormFieldInfo;

      console.log("add starikkkk :", textfieldInfo);

      // textfieldInfo.defaultValue = 'updated with staric *';
      textfieldInfo.defaultValue =
        placeHolderValue + (requiredField ? " *" : "");

      // textfieldInfo.format = "Lowercase";
      textfieldInfo.type = "Text";
      textfieldInfo.name = selectionField;
      documentEditor.setFormFieldInfo("Text1", textfieldInfo);
    }
    setCheckboxes([]);
    setTimeout(() => {
      setPlaceHolderValue("");
    }, 500);
  };

  const DraggableField = ({ field }: any) => {
    const handleDragStart = (e: any) => {
      e.dataTransfer.setData("text/plain", field.placeholder);
      console.log("fieldstestTop : ", field.placeholder);
      setShowSidebar(field.placeholder);
      const documentEditor = editorRefContext;

      if (selectedEmails) {
        documentEditor.editor.insertFormField("Text");
      }

      const textfieldInfo: TextFormFieldInfo = documentEditor.getFormFieldInfo(
        "Text1"
      ) as TextFormFieldInfo;

      console.log("text fielf info :", textfieldInfo);

      textfieldInfo.defaultValue = field?.label + (requiredField ? " *" : "");
      // textfieldInfo.format = "Lowercase";
      textfieldInfo.type = "Text";
      textfieldInfo.name = field?.label;
      documentEditor.setFormFieldInfo("Text1", textfieldInfo);
      setDragFields(dragFields + 1);

      setRecipients((prev: any) => {
        const updated = prev.map((user: any) => {
          const matches =
            user.email.trim().toLowerCase() ===
            selectedEmails?.email.trim().toLowerCase();

          if (matches) {
            return { ...user, field: dragFields + 1 };
          }
          return user;
        });
        // console.log("Updated recipients:", updated); // Log the full updated array
        return updated;
      });
    };

    // const handleDragStartCheckbox = (e: any) => {
    //   e.dataTransfer.setData("text/plain", field.placeholder);
    //   const documentEditor = editorRefContext;
    //   if (selectedEmails) {
    //     documentEditor.editor.insertFormField("CheckBox");
    //   }
    // };
    // console.log("recipients :", recipients);

    return (
      <>
        {field?.id !== "RadioButton" && (
          <div
            className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
            draggable={selectedEmails ? true : false}
            onDragEnd={handleDragStart}
            style={{ cursor: "grab", backgroundColor }}
          >
            <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          </div>
        )}
      </>
    );
  };

  const fields = [
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
      id: "Text",
      icon: textIcon,
      label: "Text",
      placeholder: "[ Text ]",
    },

    // {
    //   id: "ShortAnswer",
    //   icon: shortIcon,
    //   label: "Short Answer",
    //   placeholder: "[ Short Answer ]",
    // },
  ];

  console.log(showSidebar, "fieldstest");

  const buttonFields = [
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

  // button dragable fields

  const ButtonDraggableField = ({ field }: any) => {
    console.log("fields : ", field);

    const handleDragStart = (e: any) => {
      e.dataTransfer.setData("text/plain", field.placeholder);

      setShowSidebar(field.placeholder);
      const documentEditor = editorRefContext;
      if (selectedEmails) {
        documentEditor.editor.insertFormField("Text");
      }

      const textfieldInfo: TextFormFieldInfo = documentEditor.getFormFieldInfo(
        "Text1"
      ) as TextFormFieldInfo;

      console.log("text fielf info :", textfieldInfo);

      textfieldInfo.defaultValue = field?.label + (requiredField ? " *" : "");
      // textfieldInfo.format = "Lowercase";
      textfieldInfo.type = "Text";
      textfieldInfo.name = field?.label;
      documentEditor.setFormFieldInfo("Text1", textfieldInfo);
      setDragFields(dragFields + 1);

      setRecipients((prev: any) => {
        const updated = prev.map((user: any) => {
          const matches =
            user.email.trim().toLowerCase() ===
            selectedEmails?.email.trim().toLowerCase();

          if (matches) {
            return { ...user, field: dragFields + 1 };
          }
          return user;
        });
        // console.log("Updated recipients:", updated); // Log the full updated array
        return updated;
      });
    };

    const handleDragStartCheckbox = (e: any) => {
      e.dataTransfer.setData("text/plain", field.placeholder);
      console.log("fieldstestTop : ", field.placeholder);
      setShowSidebar(field.placeholder);
      const documentEditor = editorRefContext;
      if (selectedEmails) {
        documentEditor.editor.insertFormField("CheckBox");
        const checkboxFieldInfo = documentEditor.getFormFieldInfo(
          "Check1"
        ) as CheckBoxFormFieldInfo;
        documentEditor.editor.insertText("Option 1", { x: 50, y: 50 });
        documentEditor.setFormFieldInfo("Check1", checkboxFieldInfo);
      }
    };
    const handleDragStartRadioButton = (e: any) => {
      e.dataTransfer.setData("text/plain", field.placeholder);
      console.log("fieldstestTop : ", field.placeholder);
      // setShowSidebar(field.placeholder);
      const documentEditor = editorRefContext;
      if (selectedEmails) {
        documentEditor.editor.insertFormField("RadioButton");
        const checkboxFieldInfo = documentEditor.getFormFieldInfo(
          "Check1"
        ) as CheckBoxFormFieldInfo;
        documentEditor.editor.insertText("Option 1", { x: 50, y: 50 });
        documentEditor.setFormFieldInfo("Check1", checkboxFieldInfo);
      }
    };
    // console.log("recipients :", recipients);

    return (
      <>
        {field?.id == "Checkbox" && (
          // <div
          //   className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
          //   draggable={selectedEmails ? true : false}
          //   onDragEnd={handleDragStart}
          //   style={{ cursor: "grab", backgroundColor }}
          // >
          //   <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          // </div>
          <div
            onClick={checkBoxDrag}
            className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
            draggable={selectedEmails ? true : false}
            onDragEnd={handleDragStartCheckbox}
            style={{ cursor: "grab", backgroundColor }}
          >
            <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          </div>
        )}
        {field?.id == "RadioButton" && (
          <div
            onClick={radioDrag}
            className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
            draggable={selectedEmails ? true : false}
            onDragEnd={handleDragStartRadioButton}
            style={{ cursor: "grab", backgroundColor }}
          >
            <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          </div>
        )}
      </>
    );
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserListNameID(user?._id);
      // console.log({ data });

      setUserList(data);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const listFeildData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getfeildList();

      setFeildList(data);

      // console.log("data", data);
    } catch (error) {
      // console.log(error);
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

  // const handleCloseDialog = () => {
  //   setOpenSignatureDialog(false);
  // };

  console.log("requiredField : ", requiredField);

  const handleCloseDrawSigDialog = () => {
    setOpenDrawSignatures(false);
  };

  useEffect(() => {
    const documentEditor = editorRefContext;

    if (documentEditor) {
      // Listen to selection changes
      documentEditor.selectionChange = () => {
        // Check if the current selection is within a table
        const isInTable =
          documentEditor?.selection?.contextTypeInternal == "TableText";

        console.log("current selection ", documentEditor?.selection);

        // Get the start text position of the selection
        const startPosition = documentEditor.selection.start;

        // Get the page number of the start position
        const page = startPosition.pageIndex;

        // Get the location (x, y) of the start position in points; assuming 'viewer' is defined
        // You might need to convert these coordinates to suit where you want the text box to appear
        const x = startPosition.location.x;
        const y = startPosition.location.y;

        console.log("x :", x, "and y :", y);

        // Get the start and end positions of the selection
        // const startOffset = documentEditor.selection.startOffset;
        // const endOffset = documentEditor.selection.endOffset;

        // console.log(`Start Offset: ${startOffset}, End Offset: ${endOffset}`);
        console.log(documentEditor?.selection?.bookmarks[0], "shahbaz1");

        setSelectionField(documentEditor?.selection?.bookmarks[0]);
      };
    }

    return () => {
      if (documentEditor) {
        // Cleanup the event listener when the component unmounts
        documentEditor.selectionChange = undefined;
      }
    };
  }, []);

  // const setValueToField = (value: any) => {
  //   const documentEditor = editorRefContext;
  //   if (documentEditor) {
  //     let selection = documentEditor.selection;
  //     if (selection && selection.isFormField()) {
  //       const formField = selection.getCurrentFormField();
  //       const formFieldInfo = documentEditor.getFormFieldInfo(formField.name);
  //       formFieldInfo.defaultValue = value; // Set the new value
  //       documentEditor.setFormFieldInfo(formField.name, formFieldInfo);
  //     }
  //   }
  // };
  // const toggleRequiredField = () => {
  //   const documentEditor = editorRefContext;
  //   if (documentEditor) {
  //     let selection = documentEditor.selection;
  //     if (selection && selection.isFormField()) {
  //       const formField = selection.getCurrentFormField();
  //       const formFieldInfo = documentEditor.getFormFieldInfo(formField.name);
  //       formFieldInfo.isRequired = !formFieldInfo.isRequired; // Toggle required status
  //       documentEditor.setFormFieldInfo(formField.name, formFieldInfo);
  //     }
  //   }
  // };

  // const removeField = () => {
  //   const documentEditor = editorRefContext;

  //   let selection = documentEditor.selection;
  //   if (selection && selection.isFormField()) {
  //     documentEditor.editor.removeFormField(selection.getCurrentFormField());
  //   }

  // };

  console.log(dragFields, "dragFields");

  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([]);

  const addCheckbox = () => {
    const newIndex = checkboxes.length + 1;
    const newCheckbox = {
      id: `Checkbox ${newIndex}`,
      label: `Checkbox${newIndex}`,
    };

    // Debug: Check what's currently in the checkboxes array
    console.log("Current Checkboxes:", checkboxes);
    console.log("Adding new Checkbox:", newCheckbox);

    setCheckboxes([...checkboxes, newCheckbox]);
  };

  const handleSaveCheckboxes = () => {
    const documentEditor = editorRefContext;
    console.log("Document Editor:", documentEditor);
    console.log("Checkboxes:", checkboxes);

    if (documentEditor && checkboxes.length) {
      checkboxes.forEach((checkbox, index) => {
        documentEditor.editor.insertText("\n");
        documentEditor.editor.insertFormField("CheckBox");
        const checkboxFieldInfo = documentEditor.getFormFieldInfo(
          "Check1"
        ) as CheckBoxFormFieldInfo;
        documentEditor.editor.insertText(checkbox.label, { x: 50, y: 50 });
        documentEditor.setFormFieldInfo("Check1", checkboxFieldInfo);

        documentEditor.editor.insertText("\n");
      });
    }
  };

  const handleLabelChange2 = (e: any, index: any) => {
    const newLabel = e.target.value;
    setCheckboxes((checkboxes) =>
      checkboxes.map((checkbox, idx) => {
        if (idx === index) {
          return { ...checkbox, label: newLabel };
        }
        return checkbox;
      })
    );
  };
  const deleteCheckbox = (index: number) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.filter((_, idx) => idx !== index)
    );
  };

  return (
    <>
      <div style={{ textAlign: "left", position: "relative" }}>
        {/* <SignatureMultiSendReq
          open={openMultiDialog}
          onClose={handleClosMultieDialog}
          ClickData={ClickData}
        /> */}
        <Typography variant="body1" color="#155be5" sx={{ fontSize: "14px" }}>
          Fields
        </Typography>
        {/* <button onClick={removeField}>Remove Field</button>
        <button onClick={toggleRequiredField}>Toggle Required</button>
        <button onClick={() => setValueToField("New Value")}>Set Value</button> */}
        <p className="text-[#8A8A8A] text-[10px] pt-1">
          Drag and drop to assign signature fields for the signer to sign or add
          custom fields to get additional information.
        </p>
        {/* <div>
          <button onClick={addCheckbox}>Add Checkbox</button> <br /> <br />
          <button onClick={handleSaveCheckboxes}>
            Save Checkboxes
          </button> <br /> <br />
          {checkboxes.map((checkbox, index) => (
            <div key={checkbox.id}>
              <input
                type="text"
                placeholder="Enter label"
                value={checkbox.label}
                onChange={(e) => handleLabelChange2(e, index)}
              />
            </div>
          ))}
        </div> */}
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
              <TextField
                {...params}
                label="Select Signer"
                variant="outlined"
                style={{
                  backgroundColor:
                    colors[
                      options.findIndex(
                        (opt: any) => opt?.email === selectedEmails?.email
                      ) % colors?.length
                    ],
                }}
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.email === value.email
            }
            renderOption={(props, option, { selected }) => (
              <li {...props}>{option.email}</li>
            )}
          />
        </Box>

        {selectionField || showSidebar ? (
          <>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              {selectionField}
            </Typography>

            <Divider style={{ margin: "10px 0" }} />
            <FormControlLabel
              sx={{
                "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                // Apply any additional styling you need for the FormControlLabel here
              }}
              control={
                <Checkbox
                  checked={requiredField}
                  onChange={(e) => setRequiredField(e.target.checked)}
                  name="requiredField"
                  color="primary"
                  sx={{
                    padding: "5px", // Adjusts padding around the checkbox
                    "& .MuiSvgIcon-root": {
                      // Targets the SVG icon representing the checkbox
                      fontSize: "18px", // Adjust this value to scale the icon size
                    },
                  }}
                />
              }
              label="Required Field"
            />
            <Divider style={{ margin: "10px 0" }} />
            {/* for short abswer */}
            {showSidebar == "[ Text ]" && (
              <TextField
                label="Placeholder" // Label text
                value={placeHolder}
                onChange={(e: any) => handleGetValue(e)} // Handle input changes
                fullWidth
                size="small"
                variant="standard"
                InputProps={{
                  sx: {
                    "::after": {
                      borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                    },
                    "::before": {
                      borderBottom: "none !important", // Hides the underline
                    },
                    ":hover:not(.Mui-disabled)::before": {
                      borderBottom: "none !important", // Ensures underline stays hidden on hover
                    },
                    "input:focus + fieldset": {
                      border: "none", // Optional: for outlined variant if ever used
                    },
                    "::placeholder": {
                      fontSize: "0.55rem",
                    },
                    input: {
                      fontSize: "0.875rem",
                      "&:focus": {
                        // Shows the underline when the input is focused
                        borderBottom: "2px solid", // Adjust color as needed
                      },
                    },
                  },
                }}
              />
            )}

            <>
              <div style={{ display: "flex" }}>
                <IconButton color="secondary" sx={{ ml: -1.3 }}>
                  <img src={checkIcon} alt="Check Icon" />
                </IconButton>{" "}
                <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                  CheckBox
                </Typography>
              </div>
              <div>
                <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                  Value
                </Typography>
                {checkboxes.map((checkbox, index) => (
                  <div
                    key={checkbox.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <TextField
                      value={checkbox.label}
                      onChange={(e) => handleLabelChange2(e, index)}
                      // value={item.label}
                      // onChange={(e) => handleLabelChange(index, e.target.value)}
                      fullWidth
                      size="small"
                      variant="standard"
                    />
                    <IconButton
                      onClick={() => deleteCheckbox(index)}
                      aria-label="delete"
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                ))}
                <Button
                  onClick={addCheckbox}
                  sx={{
                    mt: 0.5,
                    ml: -1,
                    fontSize: "12px",
                    textTransform: "none !important",
                    borderRadius: 0,
                    color:
                      activeSection === "collaborate"
                        ? "primary.main"
                        : "black",
                    fontWeight: "bold",
                    "&:hover": {
                      borderBottom: 2,
                      borderColor: "primary.main",
                      backgroundColor: "transparent",
                    },
                    borderColor:
                      activeSection === "collaborate"
                        ? "primary.main"
                        : "transparent",
                  }}
                >
                  + Add value
                </Button>
              </div>
            </>

            <Divider style={{ margin: "10px 0" }} />
            <div style={{ flex: 1, textAlign: "right", marginTop: "0px" }}>
              <Button
                variant="contained"
                color="inherit"
                sx={{
                  mr: "20px",
                  textTransform: "none",
                  backgroundColor: "#DCDCDC",
                  "&:hover": {
                    backgroundColor: "#757575",
                  },
                  color: "white",
                  padding: "2px 5px !important",
                  height: "25px !important",
                  fontSize: "0.675rem",
                }}
                onClick={() => {
                  setSelectionField("");
                  setCheckboxes([]);
                  setShowSidebar("");
                }}
              >
                Remove
              </Button>

              <Button
                variant="contained"
                color="success"
                // disabled={!selectedCustomFeild && !inputValue.trim()}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#62BD6B",
                  "&:hover": {
                    backgroundColor: "#62BD6d",
                  },
                  color: "white",
                  padding: "2px 5px !important",
                  height: "25px !important",
                  fontSize: "0.675rem",
                }}
                onClick={() => {
                  setSelectionField("");

                  // if (selectedCustomFeild) {
                  //   handleAddSignatory(selectedCustomFeild.email);
                  // } else if (inputValue.trim() !== "") {
                  //   handleAddSignatory(inputValue.trim());
                  // }
                  {
                    (showSidebar == "[ Radio Button ]" ||
                      showSidebar == "[ Checkbox ]") &&
                      handleSaveCheckboxes();
                  }
                  // setShowButtons(false);
                  handleSetValue();
                  setShowSidebar("");
                }}
              >
                Save & Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="font-medium text-[14px] text-[#155be5] mt-10">
              Signature Fields
            </p>
            <div style={{ padding: "1px" }}>
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
                  {/* Add a Divider after the 4th index */}
                  {index === 4 && <Divider sx={{ mt: 0, mb: 3 }} />}
                </React.Fragment>
              ))}
            </div>

            {/* buttonFields */}

            {buttonFields.map((field, index) => (
              <React.Fragment key={field.id}>
                <ButtonDraggableField field={field} />
              </React.Fragment>
            ))}

            <Divider sx={{ mt: 1, mb: 2 }} />
            <p className="font-medium text-[14px] text-[#155be5] my-3">
              Custom Fields
            </p>
            <Autocomplete
              size="small"
              fullWidth
              multiple
              options={feildList}
              value={selectedCustomFeild}
              onChange={(event, newValue) => {
                setSelectedCustomFeild(newValue);
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, option) => (
                <MenuItem {...props} key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              )}
              renderInput={(params) => <TextField {...params} label="Search" />}
              renderTags={() => null} // Optionally, prevent tags from rendering if `multiple` is enabled
            />
            <div style={{ marginTop: "10px" }}>
              {selectedCustomFeild.map((field: any) => (
                <p key={field._id}>{field.name}</p> // Ensure you return the name or the desired field
              ))}
            </div>
          </>
        )}
      </div>

      <OpenDrawSignature
        openDilog={OpenDrawSignatures}
        onClose={handleCloseDrawSigDialog}
        closeFirstOen={handleCloseDrawSigDialog}
        selectedEmails={selectedEmails}
      />
    </>
  );
};

export default Fields;
