/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */

import React, { useRef, useState } from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  CustomToolbarItemModel,
} from "@syncfusion/ej2-react-documenteditor";
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
import * as jQueryLibrary from "jquery"; // Rename the import
const $ = jQueryLibrary;
// other imports...
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

DocumentEditorContainerComponent.Inject(Toolbar);

function SyncFusionEditor() {
  const editorContainerRef: any = useRef(null);
  const [openDropdowns, setOpenDropdowns] = useState({
    file: false,
    view: false,
    signature: false,
    export: false,
    attach: false,
  });

  const toggleDropdown = (dropdown: any) => {
    setOpenDropdowns((prevState: any) => ({
      file: false,
      view: false,
      signature: false,
      export: false,
      attach: false,
      [dropdown]: !prevState[dropdown],
    }));
  };

  const onToolbarClick = (args: any) => {
    if (args.item.id === "Custom") {
      // Logic for the custom toolbar item
      editorContainerRef.current.toolbarModule.enableItems(4, false);
    }
    // Add additional logic for other toolbar items if needed
  };

  // Define custom toolbar item
  const customItem = {
    prefixIcon: "e-de-ctnr-lock",
    tooltipText: "Disable Image",
    text: "Disable Image",
    id: "Custom",
  };

  // Full list of toolbar items
  const items: any = [
    // customItem,
    "Open",
    "Undo",
    "Redo",
    "Separator",
    "Image",
    "Table",
    "Hyperlink",
    "TrackChanges",
    "Comments",
    "TableOfContents",
    "Separator",
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Break",
    "Separator",
    "Find",
    "Separator",
    "LocalClipboard",
    "RestrictEditing",
  ];

  $(".e-toolbar-item").css("display", "none");
  $(".e-btn-icon").css("display", "none");

  const triggerClick = (id: string) => {
    $(`#${id}`).trigger("click");
    // $("#container_toolbar_open").parent().css("display", "block");
  };

  return (
    <div>
      <div className="flex border p-4 gap-4">
        {/* File Button and Dropdown */}
        <div className="relative">
          <button
            className="text-black p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 mx-10 hover:bg-blue-700 hover:text-white"
            onClick={() => toggleDropdown("file")}
          >
            File
          </button>
          {openDropdowns.file && (
            <ul className="absolute left-0 mt-2 w-40 bg-red shadow-lg rounded z-10">
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  triggerClick("container_toolbar_open");
                }}
              >
                Open
              </li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">Save</li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">Edit</li>
            </ul>
          )}
        </div>

        {/* View Button and Dropdown */}
        <div className="relative">
          <button
            className="text-black p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 mx-10 hover:bg-blue-700 hover:text-white"
            onClick={() => toggleDropdown("view")}
          >
            View
          </button>
          {openDropdowns.view && (
            <ul className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded z-10">
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  triggerClick("container_toolbar_comment");
                }}
              >
                Comment
              </li>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  triggerClick("container_toolbar_track");
                }}
              >
                Track Changes
              </li>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  triggerClick("container_editor_font_properties_bold");
                }}
              >
                View Audit trail
              </li>
            </ul>
          )}
        </div>

        {/* Signature Button and Dropdown */}
        <div className="relative">
          <button
            className="text-black p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 mx-10 hover:bg-blue-700 hover:text-white"
            onClick={() => toggleDropdown("signature")}
          >
            Signature
          </button>
          {openDropdowns.signature && (
            <ul className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded z-10">
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                Request signature
              </li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                Cancel all signature
              </li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                Revert to review
              </li>
            </ul>
          )}
        </div>

        {/* Export Button and Dropdown */}
        <div className="relative">
          <button
            className="text-black p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 mx-10 hover:bg-blue-700 hover:text-white"
            onClick={() => toggleDropdown("export")}
          >
            Export
          </button>
          {openDropdowns.export && (
            <ul className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded z-10">
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                Download PDF
              </li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                Download Word
              </li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                Download signature certificate
              </li>
            </ul>
          )}
        </div>
        <div className="relative">
          <button
            className="text-black p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 mx-10 hover:bg-blue-700 hover:text-white"
            onClick={() => toggleDropdown("attach")}
          >
            Attach
          </button>
          {openDropdowns.attach && (
            <ul className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded z-10">
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                Download PDF
              </li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                Download Word
              </li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                Download signature certificate
              </li>
            </ul>
          )}
        </div>
      </div>

      <Box sx={{ width: "100%", px: 2.6, py: 1 }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            sx={{ ml: 2, textTransform: "none" }}
            type="submit"
            variant="contained"
            color="success"
          >
            Save
          </Button>
          <Button
            sx={{ ml: 2, textTransform: "none" }}
            type="submit"
            variant="contained"
            color="success"
          >
            Edit
          </Button>
        </div>
      </Box>
      <DocumentEditorContainerComponent
        ref={editorContainerRef}
        id="container"
        height="620px"
        toolbarItems={items}
        toolbarClick={onToolbarClick}
        enableToolbar={true}
        showPropertiesPane={false}
      />
    </div>
  );
}

export default SyncFusionEditor;
