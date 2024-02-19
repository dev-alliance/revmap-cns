/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable */

import React, { useEffect, useRef, useState } from "react";
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
    // "Separator",
    // "Image",
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
    // "Break",
    // "Separator",
    // "Find",
    // "Separator",
    // "LocalClipboard",
    // "RestrictEditing",
  ];

  // const toolbarItems =
  //   document.querySelectorAll<HTMLElement>(".e-toolbar-item");
  // toolbarItems.forEach((item) => {
  //   item.style.display = "none";
  // });

  // // Select elements with class "e-btn-icon" and hide them
  // const btnIcons = document.querySelectorAll<HTMLElement>(".e-btn-icon");
  // btnIcons.forEach((icon) => {
  //   icon.style.display = "none";
  // });

  // const triggerClick = (id: any) => {
  //   const element = document.getElementById(id);
  //   if (element) {
  //     element.click();
  //   }
  // };

  // $(".e-toolbar-item").css("display", "none");
  // $(".e-btn-icon").css("display", "none");

  const triggerClick = (id: string) => {
    $(`#${id}`).trigger("click");
    // $("#container_toolbar_open").parent().css("display", "block");
  };

  // useEffect(() => {
  //   cloneElement();
  // }, []);

  // function cloneElement() {
  //   // Check if the original element exists before cloning it
  //   const original = document.getElementById(
  //     "container_editor_font_properties_properties"
  //   );
  //   if (original) {
  //     // Clone the original element
  //     const clone = original.cloneNode(true); // Cloning with all descendants

  //     // Check if the element with id "xyz" exists before appending the cloned element to it
  //     const xyzElement = document.getElementById("xyz");
  //     if (xyzElement) {
  //       xyzElement.appendChild(clone); // Appending the cloned element to the div with id 'xyz'
  //     } else {
  //       console.error("Element with id 'xyz' not found");
  //     }
  //   } else {
  //     console.error(
  //       "Element with id 'container_editor_font_properties_properties' not found"
  //     );
  //   }
  // }

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
            <ul
              className="absolute left-0 mt-2 w-40 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  triggerClick("container_toolbar_open");
                }}
              >
                Open
              </li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">Save</li>
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  triggerClick("container_editor_font_properties_properties");
                }}
              >
                Edit
              </li>
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
            <ul
              className="absolute left-0 mt-2 w-40 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  triggerClick("container_toolbar_comment");
                }}
              >
                Add comment
              </li>
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  triggerClick("container_toolbar_track");
                }}
              >
                Track changes
              </li>

              <li
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  triggerClick("container_editor_font_properties_bold");
                }}
              >
                Reject all changes
              </li>
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  triggerClick("container_editor_font_properties_bold");
                }}
              >
                Accept all changes
              </li>
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer"
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
            <ul
              className="absolute left-0 mt-2 w-40 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li className="p-2 hover:bg-gray-200 cursor-pointer">
                Request signature
              </li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">
                Cancel all signature
              </li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">
                Revert to review
              </li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">Sign</li>
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
            <ul
              className="absolute left-0 mt-2 w-40 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li className="p-2 hover:bg-gray-200 cursor-pointer">
                Download PDF
              </li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">
                Download Word
              </li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">
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
            <ul
              className="absolute left-0 mt-2 w-40 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li className="p-2 hover:bg-gray-200 cursor-pointer">
                Add attachment
              </li>
            </ul>
          )}
        </div>
        <Box sx={{ width: "100%", px: 2.6, py: 0.5 }}>
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
      </div>
      {/* <div id="xyz">show </div> */}
      <DocumentEditorContainerComponent
        ref={editorContainerRef}
        id="container"
        height="620px"
        toolbarItems={items}
        toolbarClick={onToolbarClick}
        enableToolbar={true}
        // showPropertiesPane={false}
      />
    </div>
  );
}

export default SyncFusionEditor;

// import * as React from "react";
// import {
//   DocumentEditorComponent,
//   Selection,
//   Editor,
//   EditorHistory,
//   ContextMenu,
// } from "@syncfusion/ej2-react-documenteditor";
// import {
//   ToolbarComponent,
//   ItemDirective,
// } from "@syncfusion/ej2-react-navigations";
// import {
//   DropDownButtonComponent,
//   ItemModel,
// } from "@syncfusion/ej2-react-splitbuttons";

// //Inject required modules.
// DocumentEditorComponent.Inject(Selection, Editor, EditorHistory, ContextMenu);

// function SyncFeson() {
//   const documenteditor = React.useRef<DocumentEditorComponent | null>(null);

//   React.useEffect(() => {
//     componentDidMount();
//   }, []);

//   const items: ItemModel[] = [
//     {
//       text: "Single",
//     },
//     {
//       text: "1.15",
//     },
//     {
//       text: "1.5",
//     },
//     {
//       text: "Double",
//     },
//   ];

//   function contentTemplate1() {
//     return (
//       <DropDownButtonComponent
//         items={items}
//         iconCss="e-de-icon-LineSpacing"
//         select={lineSpacingAction}
//       ></DropDownButtonComponent>
//     );
//   }

//   function componentDidMount(): void {
//     if (documenteditor.current) {
//       documenteditor.current.selectionChange = () => {
//         setTimeout(() => {
//           onSelectionChange();
//         }, 20);
//       };
//     }
//   }

//   function toolbarButtonClick(arg: { item: { id: string } }): void {
//     if (documenteditor.current) {
//       switch (arg.item.id) {
//         case "AlignLeft":
//           documenteditor.current.editor.toggleTextAlignment("Left");
//           break;
//         case "AlignRight":
//           documenteditor.current.editor.toggleTextAlignment("Right");
//           break;
//         case "AlignCenter":
//           documenteditor.current.editor.toggleTextAlignment("Center");
//           break;
//         case "Justify":
//           documenteditor.current.editor.toggleTextAlignment("Justify");
//           break;
//         case "IncreaseIndent":
//           documenteditor.current.editor.increaseIndent();
//           break;
//         case "DecreaseIndent":
//           documenteditor.current.editor.decreaseIndent();
//           break;
//         case "ClearFormat":
//           if (documenteditor.current) {
//             documenteditor.current.editor.clearFormatting();
//           }
//           break;
//         case "ShowParagraphMark":
//           if (documenteditor.current) {
//             documenteditor.current.documentEditorSettings.showHiddenMarks =
//               !documenteditor.current.documentEditorSettings.showHiddenMarks;
//           }
//           break;
//       }
//     }
//   }

//   function lineSpacingAction(args: any) {
//     const text: string = args.item.text;
//     if (documenteditor.current) {
//       switch (text) {
//         case "Single":
//           documenteditor.current.selection.paragraphFormat.lineSpacing = 1;
//           break;
//         case "1.15":
//           documenteditor.current.selection.paragraphFormat.lineSpacing = 1.15;
//           break;
//         case "1.5":
//           documenteditor.current.selection.paragraphFormat.lineSpacing = 1.5;
//           break;
//         case "Double":
//           documenteditor.current.selection.paragraphFormat.lineSpacing = 2;
//           break;
//       }
//       setTimeout((): void => {
//         if (documenteditor.current) {
//           documenteditor.current.focusIn();
//         }
//       }, 30);
//     }
//   }

//   function onSelectionChange() {
//     if (documenteditor.current && documenteditor.current.selection) {
//       const paragraphFormat = documenteditor.current.selection.paragraphFormat;
//       const toggleBtnId = [
//         "AlignLeft",
//         "AlignCenter",
//         "AlignRight",
//         "Justify",
//         "ShowParagraphMark",
//       ];

//       toggleBtnId.forEach((id) => {
//         const toggleBtn = document.getElementById(id);
//         if (toggleBtn) {
//           toggleBtn.classList.remove("e-btn-toggle");
//         }
//       });

//       if (paragraphFormat.textAlignment === "Left") {
//         const alignLeftBtn = document.getElementById("AlignLeft");
//         if (alignLeftBtn) {
//           alignLeftBtn.classList.add("e-btn-toggle");
//         }
//       } else if (paragraphFormat.textAlignment === "Right") {
//         const alignRightBtn = document.getElementById("AlignRight");
//         if (alignRightBtn) {
//           alignRightBtn.classList.add("e-btn-toggle");
//         }
//       } else if (paragraphFormat.textAlignment === "Center") {
//         const alignCenterBtn = document.getElementById("AlignCenter");
//         if (alignCenterBtn) {
//           alignCenterBtn.classList.add("e-btn-toggle");
//         }
//       } else {
//         const justifyBtn = document.getElementById("Justify");
//         if (justifyBtn) {
//           justifyBtn.classList.add("e-btn-toggle");
//         }
//       }

//       if (documenteditor.current.documentEditorSettings.showHiddenMarks) {
//         const showParagraphMarkBtn =
//           document.getElementById("ShowParagraphMark");
//         if (showParagraphMarkBtn) {
//           showParagraphMarkBtn.classList.add("e-btn-toggle");
//         }
//       }
//     }
//   }

//   return (
//     <div>
//       <ToolbarComponent id="toolbar" clicked={toolbarButtonClick}>
//         <ItemDirective
//           id="AlignLeft"
//           prefixIcon="e-de-ctnr-alignleft e-icons"
//           tooltipText="Align Left"
//         />
//         <ItemDirective
//           id="AlignCenter"
//           prefixIcon="e-de-ctnr-aligncenter e-icons"
//           tooltipText="Align Center"
//         />
//         <ItemDirective
//           id="AlignRight"
//           prefixIcon="e-de-ctnr-alignright e-icons"
//           tooltipText="Align Right"
//         />
//         <ItemDirective
//           id="Justify"
//           prefixIcon="e-de-ctnr-justify e-icons"
//           tooltipText="Justify"
//         />
//         <ItemDirective type="Separator" />
//         <ItemDirective
//           id="IncreaseIndent"
//           prefixIcon="e-de-ctnr-increaseindent e-icons"
//           tooltipText="Increase Indent"
//         />
//         <ItemDirective
//           id="DecreaseIndent"
//           prefixIcon="e-de-ctnr-decreaseindent e-icons"
//           tooltipText="Decrease Indent"
//         />
//         <ItemDirective type="Separator" />
//         <ItemDirective template={contentTemplate1} />
//         <ItemDirective
//           id="ClearFormat"
//           prefixIcon="e-de-ctnr-clearall e-icons"
//           tooltipText="Clear Formatting"
//         />
//         <ItemDirective type="Separator" />
//         <ItemDirective
//           id="ShowParagraphMark"
//           prefixIcon="e-de-e-paragraph-mark e-icons"
//           tooltipText="Show the hidden characters like spaces, tab, paragraph marks, and breaks.(Ctrl + *)"
//         />
//       </ToolbarComponent>

//       <DocumentEditorComponent
//         id="container"
//         ref={documenteditor}
//         isReadOnly={false}
//         enableSelection={true}
//         enableEditor={true}
//         enableEditorHistory={true}
//         enableContextMenu={true}
//         enableTableDialog={true}
//         height={"330px"}
//       />
//     </div>
//   );
// }

// export default SyncFeson;
