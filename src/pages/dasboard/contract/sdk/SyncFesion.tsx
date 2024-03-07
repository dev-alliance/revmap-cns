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
import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "ORg4AjUWIQA/Gnt2UVhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9nSX1Tc0ViWHZcd3dVRWQ="
);
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
import linepng from "../../../../assets/line.png";
import bucket from "../../../../assets/bucket.png";
import undo from "../../../../assets/undo.png";
import redo from "../../../../assets/redo.png";
// icons
import openFolder from "../../../../assets/icons/folder.png";
import saveIcon from "../../../../assets/icons/save.png";
import editIcon from "../../../../assets/icons/edit.png";
// view
import searchIcon from "../../../../assets/icons/search.png";
import commentIcon from "../../../../assets/icons/comment.png";
import trackChangesIcon from "../../../../assets/icons/writing.png";
import crossIcon from "../../../../assets/icons/close.png";
import tickIcon from "../../../../assets/icons/check.png";
import viewIcon from "../../../../assets/icons/website.png";
// insert
import tableIcon from "../../../../assets/icons/table.png";
import imageIcon from "../../../../assets/icons/picture.png";
import linkIcon from "../../../../assets/icons/link.png";
import headerIcon from "../../../../assets/icons/header.png";
import footerIcon from "../../../../assets/icons/footer.png";
import pageNoIcon from "../../../../assets/icons/pageNumber.png";
import pageSetupIcon from "../../../../assets/icons/cogwheels.png";
// export
import pdfIcon from "../../../../assets/icons/pdf.png";
import wordIcon from "../../../../assets/icons/word.png";
import downloadIcon from "../../../../assets/icons/download.png";
// signature
import requestIcon from "../../../../assets/icons/request.png";
import websiteIcon from "../../../../assets/icons/website.png";
import signatureIcon from "../../../../assets/icons/signature.png";
// attach
import attachIcon from "../../../../assets/icons/attach.png";

import {
  DocumentEditorComponent,
  Selection,
  Editor,
  EditorHistory,
  ContextMenu,
  TableDialog,
  BorderSettings,
} from "@syncfusion/ej2-react-documenteditor";
import {
  ToolbarComponent,
  ItemDirective,
  ItemsDirective,
} from "@syncfusion/ej2-react-navigations";
import {
  ComboBoxComponent,
  DropDownListComponent,
} from "@syncfusion/ej2-react-dropdowns";
import {
  ColorPickerComponent,
  NumericTextBoxComponent,
} from "@syncfusion/ej2-react-inputs";
import {
  DropDownButtonComponent,
  ItemModel,
} from "@syncfusion/ej2-react-splitbuttons";

DocumentEditorComponent.Inject(
  Selection,
  Editor,
  EditorHistory,
  ContextMenu,
  TableDialog
);

DocumentEditorContainerComponent.Inject(Toolbar);

function SyncFusionEditor() {
  const editorContainerRef: any = useRef(null);
  const [openDropdowns, setOpenDropdowns] = useState({
    file: false,
    view: false,
    signature: false,
    export: false,
    attach: false,
    insert: false,
  });

  const toggleDropdown = (dropdown: any) => {
    setOpenDropdowns((prevState: any) => ({
      file: false,
      view: false,
      signature: false,
      export: false,
      attach: false,
      insert: false,
      [dropdown]: !prevState[dropdown],
    }));
  };

  // To change the font style of selected content
  function changeFontFamily(args: any) {
    const documentEditor = editorContainerRef.current.documentEditor;
    if (documentEditor && documentEditor.selection) {
      documentEditor.selection.characterFormat.fontFamily = args.value;
      documentEditor.focusIn();
    }
  }

  // To change the font size of selected content
  function changeFontSize(args: any) {
    const documentEditor = editorContainerRef.current.documentEditor;
    if (documentEditor && documentEditor.selection) {
      documentEditor.selection.characterFormat.fontSize = args.value;
      documentEditor.focusIn();
    }
  }

  const onToolbarClick = (args: any) => {
    const documentEditor = editorContainerRef.current.documentEditor;
    console.log("args text:", args.item.id);
    // if (!documentEditor) {
    //   console.error("Document Editor is not initialized yet.");
    //   return;
    // }

    switch (args.item.id) {
      case "bold":
        // Toggles the bold of selected content
        documentEditor.editor.toggleBold();
        break;
      case "italic":
        // Toggles the Italic of selected content
        documentEditor.editor.toggleItalic();
        break;
      case "underline":
        // Toggles the underline of selected content
        documentEditor.editor.toggleUnderline("Single"); // Ensure 'Single' is a valid parameter
        break;

      case "highlight":
        if (documentEditor && documentEditor.selection) {
          // Check if the selected text is already highlighted
          const highlightColor: any =
            documentEditor.selection.characterFormat.highlightColor;
          //Sets highlightColor formatting for selected text.
          documentEditor.selection.characterFormat.highlightColor = "Pink";
          documentEditor.focusIn();
        }
        break;

      case "strikethrough":
        // Toggles the strikethrough of selected content
        documentEditor.editor.toggleStrikethrough();
        break;
      case "subscript":
        // Toggles the subscript of selected content
        documentEditor.editor.toggleSubscript();
        break;
      case "superscript":
        // Toggles the superscript of selected content
        documentEditor.editor.toggleSuperscript();
        break;
      case "AlignLeft":
        //Toggle the Left alignment for selected or current paragraph
        documentEditor.editor.toggleTextAlignment("Left");
        break;
      case "AlignRight":
        //Toggle the Right alignment for selected or current paragraph
        documentEditor.editor.toggleTextAlignment("Right");
        break;
      case "AlignCenter":
        //Toggle the Center alignment for selected or current paragraph
        documentEditor.editor.toggleTextAlignment("Center");
        break;
      case "Justify":
        //Toggle the Justify alignment for selected or current paragraph
        documentEditor.editor.toggleTextAlignment("Justify");
        break;
      case "IncreaseIndent":
        //Increase the left indent of selected or current paragraph
        documentEditor.editor.increaseIndent();
        break;
      case "DecreaseIndent":
        //Decrease the left indent of selected or current paragraph
        documentEditor.editor.decreaseIndent();
        break;
      case "ClearFormat":
        documentEditor.editor.clearFormatting();
        break;
      case "ShowParagraphMark":
        //Show or hide the hidden characters like spaces, tab, paragraph marks, and breaks.
        documentEditor.documentEditorSettings.showHiddenMarks =
          !documentEditor.documentEditorSettings.showHiddenMarks;
        break;

      case "Bullets-Dot":
        documentEditor.editor.applyBullet("\uf0b7", "Symbol"); // Standard dot bullet
        break;
      case "Bullets-Circle":
        documentEditor.editor.applyBullet("\uf06f", "Symbol"); // Open circle bullet
        break;
      case "Bullets-Square":
        documentEditor.editor.applyBullet("\uf0a7", "Wingdings"); // Square bullet
        break;
      case "Numbering-Arabic":
        documentEditor.editor.applyNumbering("%1.", "Arabic"); // Arabic numbering
        break;
      case "Numbering-Roman":
        documentEditor.editor.applyNumbering("%1.", "UpperRoman"); // Uppercase Roman numbering
        break;
      case "Numbering-Alpha":
        documentEditor.editor.applyNumbering("%1.", "UpperLetter"); // Uppercase Alphabet numbering
        break;
      // upper lower case
      case "uppercase":
        // Changes the selected text to uppercase
        if (documentEditor.selection && documentEditor.selection.text) {
          const uppercaseText = documentEditor.selection.text.toUpperCase();
          documentEditor.editor.insertText(uppercaseText);
        }
        break;

      case "lowercase":
        // Changes the selected text to lowercase
        if (documentEditor.selection && documentEditor.selection.text) {
          const lowercaseText = documentEditor.selection.text.toLowerCase();
          documentEditor.editor.insertText(lowercaseText);
        }
        break;

      case "lineHeight1":
        documentEditor.editor.applyParagraphFormat({ lineSpacing: 1 });
        break;
      case "lineHeight1_5":
        documentEditor.editor.applyParagraphFormat({ lineSpacing: 1.5 });
        break;
      case "lineHeight2":
        documentEditor.editor.applyParagraphFormat({ lineSpacing: 2 });
        break;

      // Removed the duplicated 'Custom' case as it seems unnecessary
      default:
        console.warn("Unhandled toolbar item:", args.item.id);
      // Implement any default action or log an unhandled case
    }
  };
  // text color highlight
  const [fontColor, setFontColor] = useState("#000000"); // Default font color

  // Function to change the font color
  const changeFontColor = (args: any) => {
    const color = args.currentValue.hex;
    setFontColor(color);
    const documentEditor = editorContainerRef.current.documentEditor;
    if (documentEditor && documentEditor.selection) {
      documentEditor.selection.characterFormat.fontColor = color;
    }
  };

  const [highlightColor, setHighlightColor] = useState("#FFFF00"); // Default highlight color
  // Function to change the highlight color
  const changeHighlightColor = (args: any) => {
    console.log("args color hightlight: ", args);
    const color = args.currentValue.hex;
    setHighlightColor(color);
    const documentEditor = editorContainerRef.current.documentEditor;
    if (documentEditor && documentEditor.selection) {
      documentEditor.selection.characterFormat.highlightColor = color;
    }
  };

  // Templates for ColorPicker within ItemDirective
  const fontColorPickerTemplate = () => (
    <div className="flex">
      <ColorPickerComponent
        showButtons={true}
        value={fontColor}
        change={changeFontColor}
      />
      <p
        onClick={() => console.log("Open color picker here")}
        style={{
          fontWeight: "bold",
          color: "#000",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          paddingTop: "1px",
        }}
      >
        A
      </p>
    </div>
  );

  const highlightColorPickerTemplate = () => (
    <>
      <div className="w-[60px]">
        <ColorPickerComponent
          showButtons={true}
          value={highlightColor}
          change={changeHighlightColor}
        />
        <button className=" mr-2">
          {/* <img src={colorPencil} className="h-5 w-5 -mt-3 absolute" /> */}
          <svg
            className="absolute -ml-1.5 -mt-[15px]"
            width="24"
            height="24"
            focusable="false"
          >
            <g fill-rule="nonzero">
              <path
                id="tox-icon-highlight-bg-color__color"
                d="M3 18h18v3H3z"
              ></path>
              <path d="M4,17l2.4-2.4C6.1,14.3,6,14,6,13.6c0-0.4,0.2-0.8,0.5-1l9.1-9.1C15.9,3.1,16.2,3,16.6,3s0.8,0.1,1.1,0.4l1.9,1.9C19.8,5.6,20,6,20,6.4s-0.1,0.8-0.4,1.1l-9.1,9.1c-0.3,0.3-0.7,0.4-1.1,0.4s-0.7-0.1-1-0.4L8,17H4z M13.4,11.5l-1.9-1.9l-4,4l1.9,1.9L13.4,11.5z"></path>
            </g>
          </svg>
        </button>
      </div>
    </>
  );

  const itemsss: ItemModel[] = [
    {
      text: "Single",
    },
    {
      text: "1.15",
    },
    {
      text: "1.5",
    },
    {
      text: "Double",
    },
  ];

  function lineHeight1() {
    return (
      <div className="w-[50px]">
        <DropDownButtonComponent
          items={itemsss}
          iconCss="e-de-icon-LineSpacing"
          select={lineSpacingAction}
        ></DropDownButtonComponent>

        <button className="-ml-10 mt-2 ">
          <img src={linepng} className="h-3 w-3" />
        </button>
      </div>
    );
  }

  //Change the line spacing of selected or current paragraph
  function lineSpacingAction(args: any) {
    const documentEditor = editorContainerRef.current.documentEditor;
    const text: string = args.item.text;
    switch (text) {
      case "Single":
        documentEditor.selection.paragraphFormat.lineSpacing = 1;
        break;
      case "1.15":
        documentEditor.selection.paragraphFormat.lineSpacing = 1.15;
        break;
      case "1.5":
        documentEditor.selection.paragraphFormat.lineSpacing = 1.5;
        break;
      case "Double":
        documentEditor.selection.paragraphFormat.lineSpacing = 2;
        break;
    }
    setTimeout((): void => {
      documentEditor.focusIn();
    }, 30);
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // tables formatting

  // let documenteditor: DocumentEditorComponent;
  // React.useEffect(() => {
  //   ComponentDidMount();
  // }, []);
  // function ComponentDidMount() {
  //   documenteditor.editor.insertTable(2, 2);
  // }

  function toolbarButtonClick(arg: any) {
    console.log("arg table", arg);
    const documentEditor = editorContainerRef.current.documentEditor;
    switch (arg.item.id) {
      case "table":
        //Insert table API to add table
        documentEditor.editor.insertTable(3, 2);
        break;
      case "insert_above":
        //Insert the specified number of rows to the table above to the row at cursor position
        documentEditor.editor.insertRow(true, 2);
        break;
      case "insert_below":
        //Insert the specified number of rows to the table below to the row at cursor position
        documentEditor.editor.insertRow();
        break;
      case "insert_left":
        //Insert the specified number of columns to the table left to the column at cursor position
        documentEditor.editor.insertColumn(true, 2);
        break;
      case "insert_right":
        //Insert the specified number of columns to the table right to the column at cursor position
        documentEditor.editor.insertColumn();
        break;
      case "delete_table":
        //Delete the entire table
        documentEditor.editor.deleteTable();
        break;
      case "delete_rows":
        //Delete the selected number of rows
        documentEditor.editor.deleteRow();
        break;
      case "delete_columns":
        //Delete the selected number of columns
        documentEditor.editor.deleteColumn();
        break;
      case "merge_cell":
        //Merge the selected cells into one (both vertically and horizontally)
        documentEditor.editor.mergeCells();
        break;
      case "table_dialog":
        //Opens insert table dialog
        documentEditor.showDialog("Table");
        break;
      case "adjust_margins":
        documentEditor.selection.cellFormat.leftMargin = 5.4;
        //To change the right margin
        documentEditor.selection.cellFormat.rightMargin = 5.4;
        //To change the top margin
        documentEditor.selection.cellFormat.topMargin = 5.4;
        //To change the bottom margin
        documentEditor.selection.cellFormat.bottomMargin = 5.4;
        break;
      case "set_border_width":
        // Open a border width selection dropdown
        documentEditor.showDialog("TableProperties");
        break;
      default:
        console.warn("Unhandled toolbar item:", arg.item.id);
    }
  }

  // State for the cell fill color
  const [cellFillColor, setCellFillColor] = useState(""); // Default color

  const applyCellFillColor = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    documentEditor.selection.cellFormat.background = cellFillColor;
  };

  const handleFillColorChange = (args: any) => {
    console.log(args);
    setCellFillColor(args.currentValue.hex);
    applyCellFillColor();
  };

  const cellFillColorPickerTemplate = () => (
    <>
      <div className="relative w-[60px]">
        <ColorPickerComponent
          id="cellFillColorPicker"
          showButtons={true}
          value={cellFillColor}
          change={handleFillColorChange}
        />
        <button
          className="absolute top-0 -right-1 mt-1.5"
          onClick={() => {
            /* logic to open color picker if needed */
          }}
        >
          <img src={bucket} className="h-5 w-5" alt="Fill Cell" />
        </button>
      </div>
    </>
  );

  const [topMargin, setTopMargin] = useState(0);
  const [bottomMargin, setBottomMargin] = useState(0);
  const [leftMargin, setLeftMargin] = useState(0);
  const [rightMargin, setRightMargin] = useState(0);

  const applyMargins = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor && documentEditor.selection) {
      const selection = documentEditor.selection;
      if (selection.cellFormat) {
        selection.cellFormat.topMargin = topMargin;
        selection.cellFormat.bottomMargin = bottomMargin;
        selection.cellFormat.leftMargin = leftMargin;
        selection.cellFormat.rightMargin = rightMargin;
        documentEditor.layout.reLayoutTable(selection.cellFormat.ownerTable);
      }
    }
  };

  const customItem = {
    prefixIcon: "e-de-ctnr-lock",
    tooltipText: "Disable Image",
    text: "Disable Image",
    id: "Custom",
  };

  // Full list of toolbar items
  const items: any = [
    // customItem,
    // "Open",
    "Undo",
    "Redo",
    // "Separator",
    "Image",
    "Table",
    "Hyperlink",
    "TrackChanges",
    "Comments",
    // "TableOfContents",
    // "Separator",
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Find",
    // "Break",

    // "Separator",
    // "Find",
    // "Separator",
    // "LocalClipboard",
    // "RestrictEditing",
  ];

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
  const fontStyle: string[] = [
    "Algerian",
    "Arial",
    "Calibri",
    "Cambria",
    "Cambria Math",
    "Candara",
    "Courier New",
    "Georgia",
    "Impact",
    "Segoe Print",
    "Segoe Script",
    "Segoe UI",
    "Symbol",
    "Times New Roman",
    "Verdana",
    "Windings",
  ];
  const fontSize: string[] = [
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22",
    "24",
    "26",
    "28",
    "36",
    "48",
    "72",
    "96",
  ];

  function contentTemplate2() {
    return (
      <ComboBoxComponent
        dataSource={fontStyle}
        change={changeFontFamily}
        index={2}
        allowCustom={true}
        showClearButton={false}
      ></ComboBoxComponent>
    );
  }
  function contentTemplate3() {
    return (
      <ComboBoxComponent
        dataSource={fontSize}
        change={changeFontSize}
        index={2}
        allowCustom={true}
        showClearButton={false}
      ></ComboBoxComponent>
    );
  }

  function onWrapTextChange(args: any) {
    if (editorContainerRef.current) {
      const documentEditor = editorContainerRef.current.documentEditor;
      // Assuming we have the border width value in 'args.value'
      const borderWidth = args.value;
      if (borderWidth >= 1 && borderWidth <= 5) {
        const table = documentEditor.selection.tableFormat;
        if (table) {
          table.borders.top.lineStyle = "Single";
          table.borders.top.lineWidth = borderWidth;
          table.borders.bottom.lineStyle = "Single";
          table.borders.bottom.lineWidth = borderWidth;
          table.borders.left.lineStyle = "Single";
          table.borders.left.lineWidth = borderWidth;
          table.borders.right.lineStyle = "Single";
          table.borders.right.lineWidth = borderWidth;
          documentEditor.selection.tableFormat = table;
        }
      }
    }
  }

  const [isTableSelected, setIsTableSelected] = useState(false);

  useEffect(() => {
    const documentEditor = editorContainerRef.current.documentEditor;

    if (documentEditor) {
      // Listen to selection changes
      documentEditor.selectionChange = () => {
        // Check if the current selection is within a table
        const isInTable =
          documentEditor?.selection?.contextTypeInternal == "TableText";
        console.log("asfds", documentEditor?.selection?.contextTypeInternal);
        setIsTableSelected(isInTable);
      };
    }

    return () => {
      if (documentEditor) {
        // Cleanup the event listener when the component unmounts
        documentEditor.selectionChange = undefined;
      }
    };
  }, []);

  return (
    <div>
      <div></div>

      <div className="flex border py-1 px-4 gap-4">
        {/* File Button and Dropdown */}

        <div className="relative ">
          <button
            className="text-black text-[14px] font-semibold p-2 rounded focus:outline-none mr-6 hover:bg-blue-00 hover:text-gray-700"
            onClick={() => toggleDropdown("file")}
          >
            File
          </button>
          {openDropdowns.file && (
            <ul
              className="absolute space-y-3 text-[14px] py-2 left-0 -mt-1 w-40 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li
                className="px-3 hover:bg-gray-200 cursor-pointer flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_toolbar_open");
                }}
              >
                <img src={openFolder} className="h-4 w-4" alt="" />
                Open
              </li>
              <li className="px-3 py-2 hover:bg-gray-200  cursor-pointer border-y border-[#a1a1a1] flex items-center gap-x-2">
                <img src={saveIcon} className="h-4 w-4" alt="" />
                Save
              </li>
              <li
                className="px-3 hover:bg-gray-200 cursor-pointer flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_editor_font_properties_properties");
                }}
              >
                <img src={editIcon} className="h-4 w-4" alt="" />
                Edit
              </li>
              <div
                onClick={() => toggleDropdown("file")}
                className="w-full h-full  fixed inset-0 z-[-9]"
              ></div>
            </ul>
          )}
        </div>

        {/* View Button and Dropdown */}
        <div className="relative">
          <button
            className="text-black text-[14px] font-bold p-2 rounded focus:outline-none   mx-5 hover:bg-blue-00 hover:text-gray-700"
            onClick={() => toggleDropdown("view")}
          >
            View
          </button>
          {openDropdowns.view && (
            <ul
              className="absolute space-y-3 text-[14px] py-2 left-0 -mt-1 w-44 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li
                className="pl-3 hover:bg-gray-200 cursor-pointer   flex items-center gap-x-2 "
                onClick={() => {
                  triggerClick("container_toolbar_find");
                }}
              >
                <img src={searchIcon} className="h-4 w-4" alt="" />
                Find
              </li>
              <li
                className="pl-3 hover:bg-gray-200 cursor-pointer py-2 border-y border-[#a1a1a1] flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_toolbar_comment");
                }}
              >
                <img src={commentIcon} className="h-4 w-4" alt="" />
                Add comment
              </li>
              <li
                className="pl-3 hover:bg-gray-200 cursor-pointer   flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_toolbar_track");
                }}
              >
                <img src={trackChangesIcon} className="h-4 w-4" alt="" />
                Track changes
              </li>

              <li
                className="pl-3 hover:bg-gray-200 cursor-pointer py-2 border-y border-[#a1a1a1] flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_editor_font_properties_bold");
                }}
              >
                <img src={crossIcon} className="h-3 w-3" alt="" />
                Reject all changes
              </li>
              <li
                className="pl-3 hover:bg-gray-200 cursor-pointer   flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_editor_font_properties_bold");
                }}
              >
                <img src={tickIcon} className="h-4 w-4" alt="" />
                Accept all changes
              </li>
              <li
                className="pl-3 hover:bg-gray-200 cursor-pointer border-t pt-2 border-[#a1a1a1] flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_editor_font_properties_bold");
                }}
              >
                <img src={viewIcon} className="h-4 w-4" alt="" />
                View Audit trail
              </li>
              <div
                onClick={() => toggleDropdown("view")}
                className="w-full h-full  fixed inset-0 z-[-9]"
              ></div>
            </ul>
          )}
        </div>

        {/* insert and Dropdown */}
        <div className="relative">
          <button
            className="text-black text-[14px] font-bold p-2 rounded focus:outline-none   mx-5 hover:bg-blue-00 hover:text-gray-700"
            onClick={() => toggleDropdown("insert")}
          >
            Insert
          </button>
          {openDropdowns.insert && (
            <ul
              className="absolute space-y-3 text-[14px] py-2 left-0 -mt-1 w-44 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li
                className="px-3 hover:bg-gray-200 cursor-pointer   flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_toolbar_table");
                }}
              >
                <img src={tableIcon} className="h-4 w-4" alt="" />
                Table
              </li>
              <li
                className="px-3 hover:bg-gray-200 cursor-pointer  pt-2 border-t border-[#a1a1a1] flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_toolbar_image_local");
                }}
              >
                <img src={imageIcon} className="h-4 w-4" alt="" />
                Image
              </li>
              <li
                className="px-3 hover:bg-gray-200 cursor-pointer py-2 border-y border-[#a1a1a1] flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_toolbar_link");
                }}
              >
                <img src={linkIcon} className="h-4 w-4" alt="" />
                Link
              </li>
              <li
                className="px-3 hover:bg-gray-200 cursor-pointer   flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_toolbar_header");
                }}
              >
                <img src={headerIcon} className="h-4 w-4" alt="" />
                Header
              </li>

              <li
                className="px-3 hover:bg-gray-200 cursor-pointer py-2 border-y border-[#a1a1a1] flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_toolbar_footer");
                }}
              >
                <img src={footerIcon} className="h-4 w-4" alt="" />
                Footer
              </li>
              <li
                className="px-3 hover:bg-gray-200 cursor-pointer   flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_toolbar_page_setup");
                }}
              >
                <img src={pageSetupIcon} className="h-5 w-5" alt="" />
                Page Setup
              </li>
              <li
                className="px-3 hover:bg-gray-200 cursor-pointer pt-2 border-t border-[#a1a1a1] flex items-center gap-x-2"
                onClick={() => {
                  triggerClick("container_toolbar_page_number");
                }}
              >
                <img src={pageNoIcon} className="h-5 w-5" alt="" />
                Page Number
              </li>
              <div
                onClick={() => toggleDropdown("insert")}
                className="w-full h-full  fixed inset-0 z-[-9]"
              ></div>
            </ul>
          )}
        </div>

        {/* Signature Button and Dropdown */}
        <div className="relative">
          <button
            className="text-black text-[14px] font-bold p-2 rounded focus:outline-none   mx-5 hover:bg-blue-00 hover:text-gray-700"
            onClick={() => toggleDropdown("signature")}
          >
            Signature
          </button>
          {openDropdowns.signature && (
            <ul
              className="absolute space-y-3 text-[14px] py-2 left-0 -mt-1 w-44 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li className="px-3 hover:bg-gray-200 cursor-pointer   flex items-center gap-x-2">
                <img src={requestIcon} className="h-4 w-4" alt="" /> Request
                signature
              </li>
              <li className="px-3 hover:bg-gray-200 cursor-pointer py-2 border-y border-[#a1a1a1] flex items-center gap-x-2">
                <img src={crossIcon} className="h-4 w-4" alt="" /> Cancel all
                signature
              </li>
              <li className="px-3 hover:bg-gray-200 cursor-pointer   flex items-center gap-x-2">
                <img src={websiteIcon} className="h-4 w-4" alt="" /> Revert to
                review
              </li>
              <li className="px-3 hover:bg-gray-200 cursor-pointer pt-2 border-t border-[#a1a1a1] flex items-center gap-x-2">
                <img src={signatureIcon} className="h-4 w-4" alt="" /> Sign
              </li>
              <div
                onClick={() => toggleDropdown("signature")}
                className="w-full h-full  fixed inset-0 z-[-9]"
              ></div>
            </ul>
          )}
        </div>

        {/* Export Button and Dropdown */}
        <div className="relative">
          <button
            className="text-black text-[14px] font-bold p-2 rounded focus:outline-none   mx-5 hover:bg-blue-00 hover:text-gray-700"
            onClick={() => toggleDropdown("export")}
          >
            Export
          </button>
          {openDropdowns.export && (
            <ul
              className="absolute space-y-3 text-[14px] py-2 left-0 -mt-1 w-48 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li className="px-2 hover:bg-gray-200 cursor-pointer   flex items-center gap-x-2">
                <img src={pdfIcon} className="h-5 w-5" alt="" /> Download PDF
              </li>
              <li className="px-2 hover:bg-gray-200 cursor-pointer py-2 border-y border-[#a1a1a1] flex items-center gap-x-2">
                <img src={wordIcon} className="h-5 w-5" alt="" /> Download Word
              </li>
              <li className="px-2 hover:bg-gray-200 cursor-pointer   flex items-center gap-x-2">
                <img src={downloadIcon} className="h-6 w-5" alt="" /> Download
                signature certificate
              </li>
              <div
                onClick={() => toggleDropdown("export")}
                className="w-full h-full  fixed inset-0 z-[-9]"
              ></div>
            </ul>
          )}
        </div>

        <div className="relative">
          <button
            className="text-black text-[14px] font-bold p-2 rounded focus:outline-none   mx-5 hover:bg-blue-00 hover:text-gray-700"
            onClick={() => toggleDropdown("attach")}
          >
            Attach
          </button>
          {openDropdowns.attach && (
            <ul
              className="absolute space-y-2 text-[14px] py-2 left-0 -mt-1 w-44 bg-red shadow-lg rounded z-10"
              style={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #C1C1C1",
              }}
            >
              <li className="px-3 hover:bg-gray-200 cursor-pointer flex items-center gap-x-2">
                <img src={attachIcon} className="h-4 w-4" alt="" />
                Add attachment
              </li>
              <div
                onClick={() => toggleDropdown("attach")}
                className="w-full h-full  fixed inset-0 z-[-9]"
              ></div>
            </ul>
          )}
        </div>
        <Box sx={{ width: "100%", px: 2.6 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {/* <Button variant="outlined" sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              sx={{ ml: 2, textTransform: "none" }}
              type="submit"
              variant="contained"
              color="success"
            >
              Save
            </Button> */}
            <Button
              sx={{ ml: 2, textTransform: "none" }}
              type="submit"
              variant="outlined"
              color="success"
            >
              Edit
            </Button>
          </div>
        </Box>
      </div>
      {/* <div id="xyz">show </div> */}

      <div className="  ">
        <div className="text styling flex items-center">
          <div className="flex items-center px-1 space-x-2 bg-[#fafafa] h-[40px] opacity-70">
            <p
              onClick={() => {
                triggerClick("container_toolbar_undo ");
              }}
            >
              <img src={undo} className="h-6 w-5 cursor-pointer" />{" "}
            </p>
            <p
              onClick={() => {
                triggerClick("container_toolbar_redo ");
              }}
            >
              <img src={redo} className="h-6 w-5 cursor-pointer" />{" "}
            </p>
          </div>
          <ToolbarComponent id="toolbar" clicked={onToolbarClick}>
            <ItemsDirective>
              <ItemDirective template={contentTemplate2} />
              <ItemDirective template={contentTemplate3} />
              <ItemDirective
                id="bold"
                prefixIcon="e-icons e-bold"
                tooltipText="Bold"
              />
              <ItemDirective
                id="italic"
                prefixIcon="e-icons e-italic"
                tooltipText="Italic"
              />
              <ItemDirective
                id="underline"
                prefixIcon="e-icons e-underline"
                tooltipText="Underline"
              />
              {/* <ItemDirective
                id="highlight"
                prefixIcon="e-icons e-highlight"
                tooltipText="Highlight"
              /> */}
              <ItemDirective
                id="strikethrough"
                prefixIcon="e-icons e-strikethrough"
                tooltipText="Strikethrough"
              />
              <ItemDirective
                id="subscript"
                prefixIcon="e-icons e-subscript"
                tooltipText="Subscript"
              />
              <ItemDirective
                id="superscript"
                prefixIcon="e-icons e-superscript"
                tooltipText="Superscript"
              />

              <ItemDirective type="Separator" />

              {/* Font Color Picker */}
              <ItemDirective
                tooltipText="Font Color"
                template={fontColorPickerTemplate}
              />
              {/* Highlight Color Picker */}
              <ItemDirective type="Separator" />

              <ItemDirective
                tooltipText="Highlight Color"
                template={highlightColorPickerTemplate}
              />

              <ItemDirective type="Separator" />
              {/* uppercase lowercase */}
              <ItemDirective
                id="uppercase"
                prefixIcon=" e-upper-case e-icons"
                tooltipText="Uppercase"
              />
              <ItemDirective
                id="lowercase"
                prefixIcon="e-icons e-lower-case "
                tooltipText="Lowercase"
              />
              <ItemDirective type="Separator" />

              {/* <ItemDirective template={lineHeight1} /> */}

              {/* align text  */}
              <ItemDirective
                id="AlignLeft"
                prefixIcon="e-de-ctnr-alignleft e-icons"
                tooltipText="Align Left"
              />

              <ItemDirective
                id="AlignCenter"
                prefixIcon="e-de-ctnr-aligncenter e-icons"
                tooltipText="Align Center"
              />
              <ItemDirective
                id="AlignRight"
                prefixIcon="e-de-ctnr-alignright e-icons"
                tooltipText="Align Right"
              />
              <ItemDirective
                id="Justify"
                prefixIcon="e-de-ctnr-justify e-icons"
                tooltipText="Justify"
              />
              {/* lineheight  */}
              <ItemDirective
                template={lineHeight1}
                prefixIcon="e-de-ctnr-aligncenter e-icons"
                tooltipText="Line Height 1"
              />

              <ItemDirective
                id="Numbering-Arabic"
                prefixIcon="e-icons e-de-ctnr-numbering"
                tooltipText="Arabic Numbering"
              />
              <ItemDirective
                id="Numbering-Roman"
                prefixIcon="e-de-ctnr-bullets e-icons"
                tooltipText="Roman Numbering"
              />
              <ItemDirective
                id="clearlist"
                text="Clear"
                tooltipText="Clear List"
              />
            </ItemsDirective>
          </ToolbarComponent>
          {/* <ColorPickerComponent
            value={highlightColor}
            change={handleColorChange}
          /> */}
        </div>

        {/* ***************Table************************ */}
        {isTableSelected && (
          <div className="text styling flex items-center">
            <ToolbarComponent clicked={toolbarButtonClick}>
              <ItemsDirective>
                <ItemDirective
                  id="table"
                  prefixIcon="e-de-ctnr-table e-icons"
                />
                <ItemDirective type="Separator" />
                <ItemDirective
                  id="insert_above"
                  prefixIcon="e-de-ctnr-insertabove e-icons"
                />
                <ItemDirective
                  id="insert_below"
                  prefixIcon="e-de-ctnr-insertbelow e-icons"
                />
                <ItemDirective type="Separator" />
                <ItemDirective
                  id="insert_left"
                  prefixIcon="e-de-ctnr-insertleft e-icons"
                />
                <ItemDirective
                  id="insert_right"
                  prefixIcon="e-de-ctnr-insertright e-icons"
                />
                <ItemDirective type="Separator" />
                {/* <ItemDirective
              id="delete_table"
              tooltipText="Delete"
              text="Delete"
              prefixIcon="custom-delete-icon"
            /> */}

                <ItemDirective
                  id="delete_rows"
                  prefixIcon="e-de-ctnr-deleterows e-icons"
                />
                <ItemDirective
                  id="delete_columns"
                  prefixIcon="e-de-ctnr-deletecolumns e-icons"
                />
                <ItemDirective type="Separator" />
                <ItemDirective
                  id="merge_cell"
                  text="Merge Cells"
                  prefixIcon="e-de-ctnr-mergecells e-icons"
                />
                <ItemDirective type="Separator" />

                {/* <ItemDirective id="adjust_margins" text="Adjust Margins" prefixIcon="your-icon-class" /> */}

                <DropDownListComponent
                  id="borderWidthDropdown"
                  dataSource={[1, 2, 3, 4, 5]}
                  placeholder="Select border width"
                  floatLabelType="Auto"
                  change={onWrapTextChange}
                />
                {/* <ItemDirective id="delete_table" text="Delete" prefixIcon="e-de-ctnr-deletetable e-icons" /> */}
                <ItemDirective type="Separator" />

                <ItemDirective
                  id="set_border_width"
                  text="Apply Border"
                  prefixIcon="your-icon-class-for-border-width"
                />

                <ItemDirective type="Separator" />

                <ItemDirective
                  tooltipText="Cell Fill Color"
                  template={cellFillColorPickerTemplate}
                />
              </ItemsDirective>
            </ToolbarComponent>

            {/* <ColorPickerComponent
              id="cellFillColorPicker"
              mode="Palette"
              showButtons={false}
              change={handleFillColorChange}
            /> */}

            {/* <div style={{ display: 'flex', justifyContent: 'space-between', width: '20%', padding: '10px' }}>
            <NumericTextBoxComponent
              value={topMargin}
              placeholder="Top Margin"
              floatLabelType="Auto"
              change={(e) => setTopMargin(e.value)}
              blur={applyMargins}
            />
            <NumericTextBoxComponent
              value={bottomMargin}
              placeholder="Bottom Margin"
              floatLabelType="Auto"
              change={(e) => setBottomMargin(e.value)}
              blur={applyMargins}
            />
            <NumericTextBoxComponent
              value={leftMargin}
              placeholder="Left Margin"
              floatLabelType="Auto"
              change={(e) => setLeftMargin(e.value)}
              blur={applyMargins}
            />
            <NumericTextBoxComponent
              value={rightMargin}
              placeholder="Right Margin"
              floatLabelType="Auto"
              change={(e) => setRightMargin(e.value)}
              blur={applyMargins}
            />
          </div> */}
          </div>
        )}
      </div>

      <DocumentEditorContainerComponent
        ref={editorContainerRef}
        id="container"
        height="600px"
        toolbarItems={items}
        toolbarClick={onToolbarClick}
        enableToolbar={true}
      // showPropertiesPane={false}
      />
    </div>
  );
}

export default SyncFusionEditor;
