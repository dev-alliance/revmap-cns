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
import linepng from '../../../../assets/line.png'
import bucket from '../../../../assets/bucket.png'
import colorPencil from '../../../../assets/colorPencil.png'
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
  const [fontColor, setFontColor] = useState('#000000'); // Default font color

  // Function to change the font color
  const changeFontColor = (args: any) => {
    const color = args.currentValue.hex;
    setFontColor(color);
    const documentEditor = editorContainerRef.current.documentEditor;
    if (documentEditor && documentEditor.selection) {
      documentEditor.selection.characterFormat.fontColor = color;
    }
  };

  const [highlightColor, setHighlightColor] = useState('#FFFF00'); // Default highlight color
  // Function to change the highlight color
  const changeHighlightColor = (args: any) => {
    console.log('args color hightlight: ', args)
    const color = args.currentValue.hex;
    setHighlightColor(color);
    const documentEditor = editorContainerRef.current.documentEditor;
    if (documentEditor && documentEditor.selection) {
      documentEditor.selection.characterFormat.highlightColor = color;
    }
  };

  // Templates for ColorPicker within ItemDirective
  const fontColorPickerTemplate = () => (
    <>
      <ColorPickerComponent showButtons={true} value={fontColor} change={changeFontColor} />
      <button
        onClick={() => console.log("Open color picker here")}
        style={{
          fontWeight: "bold",
          color: "#000000",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          paddingTop: '3px'
        }}
      >
        A
      </button>
    </>
  );

  const highlightColorPickerTemplate = () => (
    <>
      <div className="w-[60px]">
        <ColorPickerComponent showButtons={true} value={highlightColor} change={changeHighlightColor} />
        <button className="  ">
          <img src={colorPencil} className="h-5 w-5 -mt-3 absolute" />
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
    console.log(args)
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
        <button className="absolute top-0 -right-1 mt-1.5" onClick={() => {/* logic to open color picker if needed */ }}>
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
    // "Image",
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

      <div className="  ">
        <div className="text styling flex items-center">
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
              <ItemDirective tooltipText="Font Color" template={fontColorPickerTemplate} />
              {/* Highlight Color Picker */}
              <ItemDirective tooltipText="Highlight Color" template={highlightColorPickerTemplate} />

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


                <ItemDirective tooltipText="Cell Fill Color" template={cellFillColorPickerTemplate} />
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
