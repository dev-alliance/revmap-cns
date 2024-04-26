/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useRef, useEffect } from "react";

import DialogActions from "@mui/material/DialogActions";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import logo from "@/assets/collaburater_icon.png";

import { ContractContext } from "@/context/ContractContext";

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  documentPath: any;
  setDocumentPath: (path: string) => void;
  triggerClick: () => void;
}

const SyncFesionFileDilog: React.FC<DetailDialogProps> = ({
  open,
  onClose,
  documentPath,
  setDocumentPath,
  triggerClick,
}) => {
  const fileInputRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  const { setSelectedModule, setShowBlock } = useContext(ContractContext);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader: any = new FileReader();
      reader.onloadend = function () {
        const base64String: any = reader.result.replace(
          "data:application/pdf;base64,",
          ""
        );
        setDocumentPath(base64String);
      };
      reader.readAsDataURL(file);
      setShowBlock("pdf");
      onClose();
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  useEffect(() => {
    // This can be used to trigger actions that depend on states updated by file upload
    if (documentPath) {
      // Assuming documentPath should trigger something
      triggerClick();
    }
  }, [documentPath]);
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid black",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            Select the type of document you are importing:
          </Typography>
          <IconButton
            onClick={() => {
              onClose();
            }}
            aria-label="close"
            sx={{ position: "absolute", top: -4, right: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom align="center" sx={{ mt: 2 }}>
            Please select whether you are importing a Word file or a PDF file.
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Center-align items horizontally in the box
              justifyContent: "center", // Center-align items vertically in the box
              width: "100%", // Take full width of the container
              my: 4, // Margin top and bottom for spacing
            }}
          >
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf"
            />
            <Button
              onClick={() => {
                fileInputRef.current && fileInputRef.current.click();
              }}
              variant="outlined"
              sx={{
                display: "table-cell",
                padding: "15px",
                pt: 2,
                height: "90px",
                width: "200px", // Uncomment if fixed width is required
                color: "gray",
                justifyContent: "center",
                textTransform: "none",
                borderColor: "#D9D9D9 !important", // Using !important to ensure the border color is applied
                borderWidth: 1,
                borderStyle: "solid",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow to give depth like a card
                borderRadius: "4px", // Adds rounded corners
                backgroundColor: "#fff",
                marginRight: 2, // Sets the background color to white
              }}
            >
              <div style={{ display: "flex" }}>
                <div style={{ marginLeft: "-7px" }}>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 48 55"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.7319 5.12988H12.2901C11.2663 5.12988 10.2844 5.601 9.56038 6.43958C8.83641 7.27817 8.42969 8.41554 8.42969 9.60148V45.3742C8.42969 46.5602 8.83641 47.6975 9.56038 48.5361C10.2844 49.3747 11.2663 49.8458 12.2901 49.8458H35.4528C36.4766 49.8458 37.4585 49.3747 38.1825 48.5361C38.9065 47.6975 39.3132 46.5602 39.3132 45.3742V18.5447L27.7319 5.12988Z"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M27.7324 5.12988V18.5447H39.3137"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M31.5921 29.7236H16.1504"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M31.5921 38.667H16.1504"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M20.0108 20.7803H18.0806H16.1504"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <div style={{ display: "table", margin: "0 auto" }}>
                  <div style={{ display: "table-row" }}>
                    <div
                      style={{
                        display: "table-cell",
                        textAlign: "start",
                      }}
                    >
                      <Typography variant="body1">Pdf</Typography>
                    </div>
                  </div>
                  <div style={{ display: "table-row" }}>
                    <div
                      style={{
                        display: "table-cell",
                        textAlign: "start",
                      }}
                    >
                      <Typography sx={{ fontSize: "10px" }}>
                        Use PDf for signature ,life sycle and much more
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => {
                triggerClick();
                onClose();
                setDocumentPath("");
              }}
              variant="outlined"
              sx={{
                display: "table-cell",
                padding: "15px",
                pt: 2,
                height: "90px",
                width: "200px", // Uncomment if fixed width is required
                color: "gray",
                justifyContent: "center",
                textTransform: "none",
                borderColor: "#D9D9D9 !important", // Using !important to ensure the border color is applied
                borderWidth: 1,
                borderStyle: "solid",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow to give depth like a card
                borderRadius: "4px", // Adds rounded corners
                backgroundColor: "#fff", // Sets the background color to white
              }}
            >
              <div style={{ display: "flex" }}>
                <div style={{ marginLeft: "-7px" }}>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 48 55"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.7319 5.12988H12.2901C11.2663 5.12988 10.2844 5.601 9.56038 6.43958C8.83641 7.27817 8.42969 8.41554 8.42969 9.60148V45.3742C8.42969 46.5602 8.83641 47.6975 9.56038 48.5361C10.2844 49.3747 11.2663 49.8458 12.2901 49.8458H35.4528C36.4766 49.8458 37.4585 49.3747 38.1825 48.5361C38.9065 47.6975 39.3132 46.5602 39.3132 45.3742V18.5447L27.7319 5.12988Z"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M27.7324 5.12988V18.5447H39.3137"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M31.5921 29.7236H16.1504"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M31.5921 38.667H16.1504"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M20.0108 20.7803H18.0806H16.1504"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <div style={{ display: "table", margin: "0 auto" }}>
                  <div style={{ display: "table-row" }}>
                    <div
                      style={{
                        display: "table-cell",
                        textAlign: "start",
                      }}
                    >
                      <Typography variant="body1">Word</Typography>
                    </div>
                  </div>
                  <div style={{ display: "table-row" }}>
                    <div
                      style={{
                        display: "table-cell",
                        textAlign: "start",
                      }}
                    >
                      <Typography sx={{ fontSize: "10px" }}>
                        Import word ,txt, rtf, doc, docx file to create document
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default SyncFesionFileDilog;
