/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import { SignatureComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { useDropzone } from "react-dropzone";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-react-documenteditor/styles/material.css";
import logo from "@/assets/upload_logo.png";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Divider,
  Autocomplete,
  TextField,
  CardContent,
  Card,
  Tabs,
  Tab,
  FormControlLabel,
  InputAdornment,
  Select,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
const fonts = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
  { label: "Georgia", value: "Georgia, serif" },
  // Add more fonts as needed
];

const OpenDrawSignature = () => {
  const [disable, setDisable] = useState(true);
  const signatureObj = useRef<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [typedSignature, setTypedSignature] = useState("");
  const [selectedFont, setSelectedFont] = useState(fonts[0].value); // Default to the first font
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const folderName = new URLSearchParams(location.search).get("name");
  const decodedFolderName = folderName ? decodeURIComponent(folderName) : "";
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    // accept: ["image/*", ".pdf", ".doc", ".docx", ".txt"] as Accept,
  }) as any;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (font?: string) => {
    if (font) setSelectedFont(font);
    setAnchorEl(null);
  };
  const saveBtnClick = () => {
    if (disable) return;
    signatureObj.current.save();
    setDisable(true);
  };

  const clrBtnClick = () => {
    signatureObj.current.clear();
    if (signatureObj.current.isEmpty()) {
      setDisable(true);
    }
  };

  const change = () => {
    if (!signatureObj.current.isEmpty()) {
      setDisable(false);
    }
  };

  // Inline styles for centering
  const controlPaneStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Adjust the height as needed
  };

  const signatureControlStyle = {
    textAlign: "center",
  };

  const btnOptionsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px", // Adjust the space between buttons as needed
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          mb: -2,
          mt: -5,
        }}
      >
        <strong style={{ display: "flex" }}>Signature</strong>
      </DialogTitle>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          color: "gray",
          ml: 2,
          mr: 2,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="Draw" sx={{ fontWeight: "bold" }} />
          <Tab label="Type" sx={{ fontWeight: "bold" }} />
          <Tab label="Upload" sx={{ fontWeight: "bold" }} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <div
          className="control-pane"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "30vh",
            width: "100%", // Adjust the height as needed
          }}
        >
          <div
            className="col-lg-12 control-section"
            style={{ maxWidth: "600px", margin: "auto" }} // Adjust maxWidth as needed for your design
          >
            <div
              id="signature-control"
              style={{
                textAlign: "center",
              }}
            >
              <div className="e-sign-heading">
                {/* <span
                  className="e-btn-options"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                > */}
                {/* <ButtonComponent
                    id="signclear"
                    cssClass="e-primary e-sign-clear"
                    onClick={clrBtnClick}
                    disabled={disable}
                    style={{
                      margin: "auto",
                      background: "white",
                      color: "gray",
                      textTransform: "none",
                      position: "absolute",
                      top: "0px",
                    }}
                  >
                    Clear
                  </ButtonComponent> */}
                {/* <ButtonComponent
                    id="signsave"
                    cssClass="e-primary e-sign-save"
                    onClick={saveBtnClick}
                    disabled={disable}
                    style={{
                      margin: "auto",
                      background: "white",
                      color: "gray",
                      textTransform: "none",
                      marginLeft: "-1rem",
                      marginBottom: "3px",
                    }} // This centers the buttons if they have a fixed width
                  >
                    Download
                  </ButtonComponent> */}
                {/* </span> */}
              </div>
              <div
                className="signature-container"
                style={{ position: "relative", height: "250px", width: "100%" }}
              >
                {/* Other content */}
                <div id="signature-control" style={{ height: "100%" }}>
                  <SignatureComponent
                    id="signature"
                    ref={signatureObj}
                    change={change}
                    style={{ width: "100%", height: "100%" }}
                  ></SignatureComponent>
                  <ButtonComponent
                    id="signclear"
                    cssClass="e-primary e-sign-clear"
                    onClick={clrBtnClick}
                    disabled={disable}
                    style={{
                      margin: "auto",
                      background: "white",
                      color: "gray",
                      textTransform: "none",
                      position: "absolute",
                      left: "6px",
                      top: "10px", // Adjust as needed
                      // Add left or right property if you want to align it differently
                    }}
                  >
                    Clear
                  </ButtonComponent>
                </div>
                {/* Other content */}
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // Changed from "inline" to "flex"
                // Aligns children horizontally
                alignItems: "center", // Vertically centers the items in the container
                justifyContent: "center", // Horizontally centers the items
              }}
            >
              <Button
                sx={{
                  alignSelf: "flex-start",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={handleClick}
                endIcon={<ArrowDropDownIcon />}
              >
                Select Font
              </Button>

              <Menu
                id="font-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
              >
                {fonts.map((font) => (
                  <MenuItem
                    key={font.label}
                    onClick={() => handleClose(font.value)}
                  >
                    {font.label}
                  </MenuItem>
                ))}
              </Menu>
              <TextField
                variant="outlined"
                placeholder="Type your signature here"
                value={typedSignature}
                autoFocus={false}
                fullWidth
                onChange={(e) => setTypedSignature(e.target.value)}
                sx={{
                  mt: 1, // Margin top for spacing from the button
                  background: "transparent", // Make the TextField background transparent
                  "& .MuiOutlinedInput-root": {
                    background: "transparent", // Ensure the input field itself is also transparent
                  },
                  "& .MuiInputBase-input": {
                    color: "transparent", // Make the input text transparent
                    caretColor: "black", // Ensure the caret is visible
                    height: "60px", // Adjust height to match the Typography for consistent cursor height
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent", // Hide the border
                  },
                }}
                InputProps={{
                  disableUnderline: true, // Remove the underline from the input field
                }}
              />

              <Typography
                variant="h5"
                sx={{
                  mt: -7.5, // Adjust this value to align the Typography text with the TextField
                  mb: 2, // Margin bottom for spacing
                  fontFamily: selectedFont,
                  userSelect: "none",
                  position: "relative", // Ensure Typography is positioned correctly
                  zIndex: 1,
                  alignItems: "center", // Bring the Typography in front of the TextField
                }}
              >
                {typedSignature || "Type your signature here"}{" "}
                {/* Display placeholder text when there's no signature */}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #eeeeee",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <div>
              <p>{selectedFile.name}</p>
            </div>
          ) : (
            <div
              style={{
                display: "flex", // Changed from "inline" to "flex"
                flexDirection: "row", // Aligns children horizontally
                alignItems: "center", // Vertically centers the items in the container
                justifyContent: "center", // Horizontally centers the items
                height: "110px", // Adjust the height as needed
              }}
            >
              <img
                src={logo}
                alt="Preview"
                style={{
                  maxWidth: "100px", // Adjusted for demonstration, ensure it fits your design
                  maxHeight: "100px", // Adjusted to match the height of the container or less
                  marginRight: "10px", // Adds some space between the image and the text
                }}
              />
              <h1 style={{ margin: 0, fontWeight: "bold" }}>
                Upload signature
              </h1>{" "}
              {/* Removed bottom margin to align with the image */}
            </div>
          )}
        </div>
      </TabPanel>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: -4,
          // alignItems: "center",
          // textAlign: "center",
        }}
      >
        <Typography variant="body1" sx={{ mt: 1, mb: 2, textAlign: "justify" }}>
          I acknowledge that ContractnSign will utilize my name and email
          address, along with limited information necessary to complete the
          signature process and enhance user experience. To understand more
          about ContractnSign's information usage, please refer to our{" "}
          <span style={{ color: "primary" }}>Privacy Policy</span>. By
          electronically signing this document, I affirm that such a signature
          holds the same validity as a handwritten signature and is considered
          original to the extent permitted by applicable law.
        </Typography>
        <Box>
          <Button
            variant="outlined"
            sx={{ textTransform: "none", float: "left", mt: 2 }}
            // onClick={() => onButtonClick()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "none", float: "right", mt: 2 }}
            // onClick={() => onButtonClick()}
          >
            Accept and sign
          </Button>
        </Box>
      </DialogContent>
    </>
  );
};
export default OpenDrawSignature;
