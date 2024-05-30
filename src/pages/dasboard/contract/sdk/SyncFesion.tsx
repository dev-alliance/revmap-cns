/* eslint-disable no-duplicate-case */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable */

import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  CustomToolbarItemModel,
} from "@syncfusion/ej2-react-documenteditor";

import {
  PdfDocument,
  PdfPageSettings,
  PdfPageOrientation,
  PdfSection,
  PdfBitmap,
  SizeF,
} from "@syncfusion/ej2-pdf-export";
import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "ORg4AjUWIQA/Gnt2UVhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9nSX1Tc0ViWHZcd3dVRWQ="
);
import * as jQueryLibrary from "jquery"; // Rename the import
const $ = jQueryLibrary;
// other imports...
import { TextField, Button, Grid, Typography, Paper, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import linepng from "../../../../assets/line.png";
import bucket from "../../../../assets/bucket.png";
import deleteIcon from "../../../../assets/icons/delete.png";
import copyIcon from "../../../../assets/icons/copy.png";
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
import { debounce } from "lodash";
import attachIcon from "../../../../assets/icons/attach.png";

import {
  DocumentEditorComponent,
  Selection,
  Editor,
  EditorHistory,
  ContextMenu,
  TableDialog,
  BorderSettings,
  PageSetupDialog,
} from "@syncfusion/ej2-react-documenteditor";

import { ColorPickerComponent } from "@syncfusion/ej2-react-inputs";
import {
  DropDownButtonComponent,
  ItemModel,
} from "@syncfusion/ej2-react-splitbuttons";
import { ContractContext } from "@/context/ContractContext";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import PDFUploaderViewer from "@/pages/dasboard/contract/PDFUploaderViewer";
import SyncFesionFileDilog from "@/pages/dasboard/contract/sdk/SyncFesionFileDilog";
import { create } from "@/service/api/contract";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";

DocumentEditorComponent.Inject(
  Selection,
  Editor,
  EditorHistory,
  ContextMenu,
  TableDialog
);

DocumentEditorContainerComponent.Inject(Toolbar);

function SyncFesion() {
  const location = useLocation();
  const open = location?.state?.open;
  const { user } = useAuth();
  const {
    setEditorRefContext,
    dragFields,
    recipients,
    setRecipients,
    uplodTrackFile,
    documentContent,
    showBlock,
    setShowBlock,
    setSelectedModule,
    setSidebarExpanded,
    setEditMode,
    editMode,
    contract,
    lifecycleData,
    collaborater,
    approvers,
    documentName,
    setDucomentName,
    setLeftSidebarExpanded,
  } = useContext(ContractContext);
  const workerUrl =
    "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";

  useEffect(() => {
    setLeftSidebarExpanded(true);
  }, []);

  const editorContainerRef: any = useRef(null);
  const handleSubmit = async (data: any) => {
    try {
      if (!documentName) {
        toast.error("Please enter the name of the document");
        return;
      }
      const payload = {
        userId: user._id,
        overview: contract,
        lifecycle: lifecycleData,
        collaburater: collaborater,
        approval: approvers,
        signature: recipients,
        status: "Active",
      };
      const response = await create(payload);
      if (response.ok === true) {
        toast.success(response.message);
        // navigate("/dashboard/branchlist");
      } else {
        const errorMessage = response.message || "An error occurred";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);

      let errorMessage = "Failed to create clause.";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data ||
          "An error occurred";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      // setIsLoading(false);
    }
  };
  const [openDropdowns, setOpenDropdowns] = useState({
    file: false,
    view: false,
    signature: false,
    export: false,
    attach: false,
    insert: false,
  });

  const [enabelEditing, setEnabelEditing] = useState(true);

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
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor && documentEditor.selection) {
      documentEditor.selection.characterFormat.fontFamily = args.value;
      documentEditor.focusIn();
    }
  }

  // To change the font size of selected content
  function changeFontSize(args: any) {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor && documentEditor.selection) {
      documentEditor.selection.characterFormat.fontSize = args.value;
      documentEditor.focusIn();
    }
  }

  const onToolbarClick = (args: any) => {
    console.log("item clicked : ", args);

    const documentEditor = editorContainerRef.current?.documentEditor;
    console.log("args text:", args.item.id);
    // if (!documentEditor) {
    //   console.error("Document Editor is not initialized yet.");
    //   return;
    // }

    switch (args.item.id) {
      case "undo":
        documentEditor.editorHistory.undo();
        break;
      case "redo":
        documentEditor.editorHistory.redo();
        break;
      case "delete":
        documentEditor.editor.delete();
        break;

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

      case "setupHeader":
        setupHeader();
        break;
      case "setupFooter":
        setupFooter();
        break;

      case "findText":
        const searchText = "example"; // Example text to search for
        if (documentEditor) {
          documentEditor.search.findAll(searchText, "None");
        }
        break;

      case "container_toolbar_open":
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".docx,.pdf";
        fileInput.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            if (file.name.endsWith(".docx")) {
              const reader = new FileReader();
              reader.onload = () => {
                documentEditor?.open(reader.result as string, "Docx");
              };
              reader.readAsDataURL(file);
            } else if (file.name.endsWith(".pdf")) {
              // PDF opening not supported in DocumentEditor; use PDF Viewer or convert to DOCX
              alert("Please convert PDF to DOCX format to open");
            }
          }
        };
        fileInput.click();
        break;

      case "container_toolbar_save":
        documentEditor?.save("Document.docx", "Docx");

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
        documentEditor.editor.applyNumbering("%1.", "Roman"); // Uppercase Roman numbering
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

  // useEffect(() => {
  //   if (editorContainerRef.current) {
  //     const documentEditor = editorContainerRef.current.documentEditor;
  //     // Set default to A4 size paper
  //     documentEditor.selection.sectionFormat.pageWidth = 200; // Width for A4 paper
  //     documentEditor.selection.sectionFormat.pageHeight = 300; // Height for A4 paper

  //     // Log current page size to console
  //     console.log(
  //       "Default Page Size Set to:",
  //       documentEditor.selection.sectionFormat.pageWidth +
  //         "x" +
  //         documentEditor.selection.sectionFormat.pageHeight
  //     );

  //     // Optionally, open the page setup dialog immediately after initialization
  //     // documentEditor.showDialog("PageSetup");
  //   }
  // }, []);
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // useEffect(() => {
  //   if (editorContainerRef.current) {
  //     const documentEditor = editorContainerRef.current.documentEditor;
  //     // Setting the zoom factor to 25%
  //     documentEditor.zoomFactor = 0.52;
  //   }
  // }, []);

  // useEffect(() => {
  //   if (editorContainerRef.current) {
  //     // Set up an interval to check the visibility of the properties pane
  //     intervalRef.current = setInterval(() => {
  //       const currentVisibility =
  //         editorContainerRef.current.documentEditor.showPropertiesPane;
  //       if (currentVisibility !== sidePine) {
  //         setSidePine(currentVisibility); // Update the state if it differs from the current visibility
  //       }
  //     }, 1000); // Check every second
  //   }

  //   // Clean up the interval when the component unmounts
  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   };
  // }, [sidePine]); // Depend on sidePine to ensure it reflects the latest state

  const setupHeader = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor && documentEditor.selection) {
      // Move to the header region
      documentEditor.selection.goToHeader();
      // Insert text or other content into the header
      documentEditor.editor.insertText("Your header content here");

      // Move out of the header/footer editing mode
      documentEditor.editor.toggleHeaderFooter();
    }
  };

  const setupFooter = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor && documentEditor.selection) {
      // Move to the footer region
      documentEditor.selection.goToFooter();
      // Insert text or other content into the footer
      documentEditor.editor.insertText("Your footer content here");

      // Move out of the header/footer editing mode
      documentEditor.editor.toggleHeaderFooter();
    }
  };

  // const addComment = (commentText: any, author: any) => {
  //   const documentEditor = editorContainerRef.current?.documentEditor;
  //   if (!documentEditor || !documentEditor.editor) {
  //     console.error("Document Editor is not initialized yet.");
  //     return;
  //   }

  //   // Check if any text is selected
  //   if (documentEditor.selection && documentEditor.selection.text !== '') {
  //     // Adds a comment to the selected text
  //     documentEditor.editor.addComment(commentText, author);
  //   } else {
  //     alert('Please select text to comment on.');
  //   }
  // };

  // text color highlight
  const [fontColor, setFontColor] = useState("#000000"); // Default font color

  // Function to change the font color
  const changeFontColor = (args: any) => {
    const color = args.currentValue.hex;
    setFontColor(color);
    const documentEditor = editorContainerRef.current?.documentEditor;
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
    const documentEditor = editorContainerRef.current?.documentEditor;
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

  useEffect(() => {
    const documentEditor = editorContainerRef?.current?.documentEditor;
    setEditorRefContext(documentEditor);
  }, []);

  //Change the line spacing of selected or current paragraph
  function lineSpacingAction(args: any) {
    const documentEditor = editorContainerRef.current?.documentEditor;
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
  const [showTableTools, setShowTableTools] = useState(false);

  // Function to update the table tool visibility based on the editor's selection
  const updateTableToolsVisibility = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    setShowTableTools(isTableSelected);
  };

  // Set up an interval to periodically check for table selection
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTableToolsVisibility();
    }, 500); // Check every 500 milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Functions to perform table operations
  const deleteTable = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (isTableSelected) {
      documentEditor.editor.deleteTable();
    }
  };

  const insertRowAbove = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (isTableSelected) {
      documentEditor.editor.insertRow(true);
    }
  };
  function toolbarButtonClick(arg: any) {
    console.log("arg table", arg);
    const documentEditor = editorContainerRef.current?.documentEditor;
    switch (arg.item.id) {
      case "table":
        //Insert table API to add table
        documentEditor.editor.insertTable(3, 2);
        break;
      case "delete_table":
        // Delete the current table
        documentEditor.editor.deleteTable();
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

  const addTable = () => {
    console.log("adding table");
    const documentEditor = editorContainerRef.current?.documentEditor;
    documentEditor.showDialog("Table");
  };

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

  const items: any = [
    // customItem,
    // "New",

    "Undo",
    "Redo",
    "Separator",
    "Image",
    "Table",
    "Hyperlink",
    "Bookmark",
    "TableOfContents",
    "Separator",
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Break",
    "InsertEndnote",
    "InsertFootnote",
    "Separator",
    "Find",
    "Separator",
    "TrackChanges",
    "Comments",
    "Separator",
    "LocalClipboard",
    "RestrictEditing",
    "Separator",
    "FormFields",
    "UpdateFields",
    "Open",
  ];

  const triggerClick = (id: any) => {
    console.log(id, "id");

    const element = document.getElementById(id);
    if (element) {
      element.click();
      // Optionally modify the parent element's style if needed:
      // element.parentNode.style.display = "block";
    } else {
      console.error("Element not found:", id);
    }
  };

  const [isTableSelected, setIsTableSelected] = useState(false);

  // useEffect(() => {
  //   const documentEditor = editorContainerRef.current?.documentEditor;

  //   if (documentEditor) {
  //     // Listen to selection changes
  //     documentEditor.selectionChange = () => {
  //       // Check if the current selection is within a table
  //       const isInTable =
  //         documentEditor?.selection?.contextTypeInternal == "TableText";

  //       setIsTableSelected(isInTable);
  //     };
  //   }

  //   // return () => {
  //   //   if (documentEditor && documentEditor.selectionChange) {
  //   //     documentEditor.selectionChange = undefined;
  //   //   }
  //   // };
  // }, []);

  const save = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    const userFileName = prompt("Enter a file name for your docs", "My File");
    if (userFileName) {
      documentEditor.save(userFileName, "Docx");
    }
  };

  useEffect(() => {
    const initializeEditor = () => {
      const editorInstance = editorContainerRef.current?.documentEditor;
      if (editorInstance && !editorInstance.isDocumentLoaded) {
        editorInstance.documentLoaded = () => {
          console.log(
            "Document is now loaded, ready to open default document."
          );
          loadDefaultDocument(editorInstance);
        };
      } else if (editorInstance) {
        loadDefaultDocument(editorInstance);
      } else {
        console.log("Editor instance is not available.");
      }
    };

    const loadDefaultDocument = (editorInstance: any) => {
      const defaultDocument = `{"sections":[{"blocks":[{"paragraphFormat":{},"characterFormat":{},"inlines":[{"text":""}]}]}]}`;
      try {
        editorInstance.open(defaultDocument, "Sfdt");
      } catch (error) {
        console.error("Failed to load default document:", error);
      }
    };

    initializeEditor();
  }, []);

  const onClick = () => {
    const container = editorContainerRef.current;
    if (container) {
      const pdfdocument: PdfDocument = new PdfDocument();
      const count: any = container?.documentEditor?.pageCount;
      container.documentEditor.documentEditorSettings.printDevicePixelRatio = 2;
      let loadedPage = 0;

      for (let i = 1; i <= count; i++) {
        setTimeout(() => {
          const format: any = "image/jpeg";
          // Getting pages as image
          const image = container?.documentEditor?.exportAsImage(i, format);
          image.onload = function () {
            const imageHeight = parseInt(image.style.height.replace("px", ""));
            const imageWidth = parseInt(image.style.width.replace("px", ""));
            const section: any = pdfdocument.sections.add();
            const settings: PdfPageSettings = new PdfPageSettings(0);
            if (imageWidth > imageHeight) {
              settings.orientation = PdfPageOrientation.Landscape;
            }
            settings.size = new SizeF(imageWidth, imageHeight);
            section.setPageSettings(settings);
            const page = section.pages.add();
            const graphics = page.graphics;
            const imageStr = image.src.replace("data:image/jpeg;base64,", "");
            const pdfImage = new PdfBitmap(imageStr);
            graphics.drawImage(pdfImage, 0, 0, imageWidth, imageHeight);
            loadedPage++;
            if (loadedPage === count) {
              const userFileName = prompt(
                "Enter a file name for your PDF",
                "My pdf"
              );
              if (userFileName) {
                pdfdocument.save(
                  (container?.documentEditor?.documentName === ""
                    ? userFileName
                    : container?.documentEditor?.documentName) + ".pdf"
                );
                pdfdocument.destroy();
              }
            }
          };
          if (image.complete) {
            image.onload(null as any); // Trigger onload immediately if image is cached
          }
        }, 500 * i);
      }
    }
  };
  const [documentData, setDocumentData] = useState<string | null>(null);

  const saveDocumentToState = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor) {
      // Export the document as SFDT (Syncfusion Document Text) format
      const sfdtData = documentEditor.saveAsBlob("Sfdt");
      sfdtData.then((blob: any) => {
        // Convert blob to text and save in state
        const reader = new FileReader();
        reader.onload = () => {
          setDocumentData(reader.result as string);
        };
        reader.readAsText(blob);
      });
    }
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files ? event.target.files[0] : null;
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const result = reader.result;
  //       if (result) {
  //         const documentEditor = editorContainerRef.current?.documentEditor;
  //         if (documentEditor) {
  //           const base64String = result.split(',')[1]; // Ensure this split operation is safe
  //           documentEditor.open(base64String, 'Base64');
  //         }
  //       } else {
  //         console.error('Failed to read the file.');
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const convertToBase64 = (file: any, callback: any) => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const insertImage = (imageSrc: any) => {
    console.log("image");
    const documentEditor = editorContainerRef.current?.documentEditor;

    documentEditor.editor.insertImage(imageSrc);
  };

  const showHyperlinkDialog = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    documentEditor.showDialog("Hyperlink");
  };

  const addpagenumber = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    documentEditor.editor.insertPageNumber();
  };

  const ShowHideOptionsPane = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    documentEditor.showOptionsPane();
  };

  const addComment = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;

    // Ensure there's a selection
    if (documentEditor.selection && !documentEditor.selection.isEmpty) {
      // Add comment to the selected text
      //Add new commnt in the document.
      documentEditor.editor.insertComment("");
    } else {
      alert("Please select a text to add comment.");
    }
  };

  const toggleTrackChanges = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    // Toggle the track changes state
    if (documentEditor) {
      const trackChangesEnabled = documentEditor.enableTrackChanges;
      documentEditor.enableTrackChanges = !trackChangesEnabled;
    }
  };

  // Function to reject the second change
  // Function to reject all changes
  const rejectAllChanges = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    const revisions = documentEditor.revisions;

    // While there are revisions, keep rejecting the first one
    while (revisions.length > 0) {
      revisions.get(0).reject();
    }
  };

  // Function to accept the first change
  const acceptFirstChange = () => {
    const revisions = editorContainerRef.current.documentEditor?.revisions;
    console.log(revisions);
    if (revisions.length > 0) {
      revisions.get(0).accept();
    }
  };

  useEffect(() => {
    const editorContainer = document.getElementById("container");
    if (!editorContainer) return; // Exit if the element is not found

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const fieldPlaceholder = e.dataTransfer?.getData("text/plain");

      // Assuming documentEditor is correctly initialized elsewhere
      // and you're sure about its non-nullness
      const documentEditor = editorContainerRef.current?.documentEditor;
      if (documentEditor && fieldPlaceholder) {
        documentEditor.editor.insertText(fieldPlaceholder);
      }
    };
    if (editorContainer) {
      editorContainer.addEventListener("dragover", handleDragOver);
      editorContainer.addEventListener("drop", handleDrop);
    }

    // Cleanup function to remove the event listeners
    return () => {
      if (editorContainer) {
        editorContainer.removeEventListener("dragover", handleDragOver);
        editorContainer.removeEventListener("drop", handleDrop);
      }
    };
  }, []); // Assuming no dependencies, adjust if necessary

  useEffect(() => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    const formFieldsNames: string[] = documentEditor?.exportFormData();
    console.log("formFieldsNames : ", formFieldsNames);
  }, [dragFields]);

  const cancelAllSignatures = () => {
    setRecipients((prev: any) => {
      const updated = prev.map((user: any) => {
        // Check if the user has a non-empty signature
        if (user.signature) {
          return { ...user, signature: "", date: "" }; // Set signature to empty
        }
        return user;
      });
      console.log("Updated recipients after cancelling signatures:", updated); // Log the updated array
      return updated;
    });
  };

  const [readyForUserTrigger, setReadyForUserTrigger] = useState(false);

  useEffect(() => {
    if (location.state?.openFileChooser) {
      setReadyForUserTrigger(true);
    }
  }, [location.state]);

  if (readyForUserTrigger) {
    triggerClick("container_toolbar_open"); // Your existing function to open the file chooser
    setReadyForUserTrigger(false); // Reset the state
  }

  const reverToReview = () => {
    setRecipients((prev: any) => {
      const updated = prev.map((user: any) => {
        // Check if the user has a non-empty signature
        if (user.ReqOption) {
          return { ...user, ReqOption: "" }; // Set signature to empty
        }
        return user;
      });
      console.log("Updated recipients after cancelling signatures:", updated); // Log the updated array
      return updated;
    });
  };

  const Breadcrumb = ({ recipients }: any) => {
    const hasReqOption = recipients.some(
      (recipient: any) => recipient.ReqOption
    );

    const hasSignature = recipients.some(
      (recipient: any) => recipient.signature
    );

    // Determine which step to highlight
    let highlightStep = "";
    if (recipients.hasReqOption) {
      highlightStep = "Review";
    }
    if (recipients.signature) {
      highlightStep = "Signing";
    }
    if (hasSignature) {
      highlightStep = "Signed";
    }

    return (
      <ul className="flex mt-2">
        <li style={{ color: highlightStep === "" ? "#155BE5" : "black" }}>
          Draft
        </li>
        <li
          style={{ color: highlightStep === "Review" ? "#155BE5" : "black" }}
        ></li>
        <li style={{ color: highlightStep === "Review" ? "#155BE5" : "black" }}>
          <span
            style={{
              marginRight: "0.5rem",
              marginLeft: "0.5rem",
              color: "#174B8B",
            }}
          >
            »»
          </span>{" "}
          Review
        </li>
        <li
          style={{ color: highlightStep === "Signing" ? "#155BE5" : "black" }}
        >
          <span
            style={{
              marginRight: "0.5rem",
              marginLeft: "0.5rem",
              color: "#174B8B",
            }}
          >
            »»
          </span>{" "}
          Signing
        </li>

        <li style={{ color: highlightStep === "Signed" ? "#155BE5" : "black" }}>
          <span
            style={{
              marginRight: "0.5rem",
              marginLeft: "0.5rem",
              color: "#174B8B",
            }}
          >
            »»
          </span>{" "}
          Signed
        </li>
        <li>
          <span
            style={{
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              color: "#174B8B",
            }}
          >
            »»
          </span>{" "}
          Active
        </li>
      </ul>
    );
  };

  let container: DocumentEditorContainerComponent;
  const onCreated = useCallback(() => {
    // To insert text in cursor position
    container?.documentEditor?.editor.insertText("Document editor");
    // Move selection to previous character
    container?.documentEditor?.selection.moveToPreviousCharacter();
    // To select the current word in document
    container?.documentEditor?.selection.selectCurrentWord();

    // documentEditor?.restrictEditing = true;
    // To get the selected content as text
    const selectedContent: string = container?.documentEditor?.selection.text;
  }, []);

  const [showPopup, setShowPopup] = useState<any>(false);
  const [documentPath, setDocumentPath] = useState("");

  // const documentEditor = editorContainerRef.current?.documentEditor;

  useEffect(() => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor) {
      documentEditor.isReadOnly = enabelEditing;
    }
  }, [enabelEditing]);

  const handleClick = () => {
    setEditMode(true);
    setEnabelEditing(false);
    const documentEditor = editorContainerRef.current?.documentEditor;
    documentEditor.focusIn(); // Focusing the editor
  };

  const inputWidth =
    documentName.length > 0
      ? `${Math.max(110, documentName.length * 11.5)}px`
      : "200px";

  const handleInputChange = useCallback(
    debounce((value: any) => {
      setDucomentName(value);
    }, 100),
    []
  );

  console.log("current : ", editorContainerRef.current);

  useEffect(() => {
    // Check if the editorContainerRef is available
    if (editorContainerRef.current) {
      // Get the DOM element using current property
      // const toolbarItem = editorContainerRef.current.querySelector('.e-toolbar-item[aria-label="Open a document."]');
      // Check if the toolbarItem is available
      // if (toolbarItem) {
      //   // Hide the element by setting its display property to 'none'
      //   toolbarItem.style.display = 'none';
      // }
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          background: "white",
          minHeight: "50.5px",
          height: "50.5px",
          maxHeight: "50.5px",
          paddingLeft: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            mr: "1rem",
          }}
        >
          <TextField
            placeholder="Untitled Document"
            variant="standard"
            sx={{ width: inputWidth }}
            InputProps={{
              disableUnderline: true,
              sx: {
                width: inputWidth, // Apply dynamic width
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
                input: {
                  fontSize: "1.3rem",
                  color: "#155BE5", // Set the text color
                  borderBottom: "1px solid #174B8B",
                  "&:focus": {
                    borderBottom: "1px solid #174B8B",
                    "::placeholder": {
                      opacity: 0, // Hide placeholder text on focus
                      visibility: "hidden", // Optionally make the placeholder completely invisible
                    }, // Adjust color as needed
                  },
                  "::placeholder": {
                    fontSize: "1.3rem", // Placeholder font size
                    color: "#155BE5", // Adjust placeholder text color here
                    opacity: 1, // Set opacity to 1 for full color intensity
                  },
                },
              },
            }}
            value={documentName}
            onChange={(e) => handleInputChange(e.target.value)}
            inputProps={{
              maxLength: 50, // HTML5 attribute to limit characters directly in the input field
            }}
          />

          <div
            className="px-1 border- flex justify-center items-end space-x-1.5 cursor-pointer mx-2 mt-1"
            style={{
              border: "1px solid #174B8B",
              borderRadius: "4px",
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.69884 3.625H15.2222C16.2041 3.625 17 4.4085 17 5.375V13.25C17 14.2165 16.2041 15 15.2222 15H2.77778C1.79594 15 1 14.2165 1 13.25V3.625M8.69884 3.625C8.26621 3.625 7.84843 3.46971 7.52378 3.18822L5.50376 1.43678C5.17911 1.15529 4.76132 1 4.3287 1H2.77778C1.79594 1 1 1.7835 1 2.75V3.625M8.69884 3.625H1"
                stroke="#174B8B"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <p className="text-[#155be5] text-[15px] leading-[28px] ">
              Manage Folder
            </p>
          </div>
        </Box>
        {(showBlock === "" || showBlock === "pdf") && (
          <>
            <div style={{ marginTop: "12px" }}>
              <Breadcrumb recipients={recipients} />
            </div>
          </>
        )}
      </div>
      {showBlock == "uploadTrack" && (
        <Typography
          variant="body2"
          component="span"
          style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            marginBottom: "1rem",
            paddingLeft: "1rem",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", marginRight: "7px" }}
          >
            <g clipPath="url(#clip0_4225_12326)">
              <path
                d="M8.00065 14.6181C11.6825 14.6181 14.6673 11.6432 14.6673 7.9736C14.6673 4.30394 11.6825 1.3291 8.00065 1.3291C4.31875 1.3291 1.33398 4.30394 1.33398 7.9736C1.33398 11.6432 4.31875 14.6181 8.00065 14.6181Z"
                stroke="#EF3E36"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 5.31543V7.97323"
                stroke="#EF3E36"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10.6309H8.00667"
                stroke="#EF3E36"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_4225_12326">
                <rect width="16" height="15.9468" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Externally Executed Document
        </Typography>
      )}
      {(showBlock === "" || showBlock === "pdf") && (
        <>
          <div className="w-full flex justify-between">
            <div className="flex items-center gap-x-8 min-w-[500px] pb-0 my-2 pl-4">
              <div className="relative  ">
                <button
                  className={`text-black text-[14px]   rounded focus:outline-none flex whitespace-nowrap  ${
                    showBlock == "uploadTrack"
                      ? "text-gray-300"
                      : "text-black hover:text-gray-700"
                  }`}
                  disabled={showBlock == "uploadTrack"}
                  onClick={() => toggleDropdown("signature")}
                  // onMouseEnter={() => {
                  //   toggleDropdown("signature");
                  // }}
                >
                  Manage Document
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      marginTop: ".4rem",
                      color: "#174B8B",
                      fontSize: "16px",
                      transform: !openDropdowns.signature
                        ? "rotate(-90deg)"
                        : "none", // Rotate the chevron when the dropdown is open
                      display: "inline-block", // Ensure the span can be transformed
                      transition: "transform 0.3s ease", // Smooth transition for rotation
                    }}
                  >
                    <svg
                      width="16"
                      height="12"
                      viewBox="0 0 16 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.88 7.41504L8 10.2513L14.12 7.41504L16 8.29248L8 12L0 8.29248L1.88 7.41504ZM1.88 3.70752L8 6.54377L14.12 3.70752L16 4.58496L8 8.29248L0 4.58496L1.88 3.70752ZM1.88 0L8 2.83625L14.12 0L16 0.877446L8 4.58496L0 0.877446L1.88 0Z"
                        fill="#174B8B"
                      />
                    </svg>
                  </span>{" "}
                </button>
                {openDropdowns.signature && (
                  <ul
                    className="absolute space-y-0 text-[14px] py-2 left-0 -mt-1 w-60 bg-red shadow-lg rounded z-10"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1.5px dashed #174B8B",
                    }}
                  >
                    <li
                      className="px-2 py-2 pb-2 cursor-pointer flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                      onClick={() => {
                        triggerClick(
                          "container_editor_font_properties_properties"
                        );
                        toggleDropdown("signature");
                      }}
                    >
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.65374 13.7143H1.55125V1.52381H6.98061V5.33333H10.8587V7.69524L12.41 6.17143V4.57143L7.75623 0H1.55125C0.698061 0 0 0.685714 0 1.52381V13.7143C0 14.5524 0.698061 15.2381 1.55125 15.2381H4.65374V13.7143ZM12.5651 8.38095C12.6427 8.38095 12.7978 8.45714 12.8753 8.53333L13.8837 9.52381C14.0388 9.67619 14.0388 9.98095 13.8837 10.1333L13.108 10.8952L11.4792 9.29524L12.2548 8.53333C12.3324 8.45714 12.41 8.38095 12.5651 8.38095ZM12.5651 11.3524L7.8338 16H6.20499V14.4L10.9363 9.75238L12.5651 11.3524Z"
                          fill="#174B8B"
                        />
                      </svg>
                      Edit
                    </li>
                    <li
                      onClick={() => {
                        saveDocumentToState();
                        toggleDropdown("signature");
                      }}
                      className="px-2 py-2 cursor-pointer flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.8889 0H1.55556C0.692222 0 0 0.8 0 1.77778V14.2222C0 15.2 0.692222 16 1.55556 16H12.4444C13.3 16 14 15.2 14 14.2222V3.55556L10.8889 0ZM12.4444 14.2222H1.55556V1.77778H10.2433L12.4444 4.29333V14.2222ZM7 8C5.70889 8 4.66667 9.19111 4.66667 10.6667C4.66667 12.1422 5.70889 13.3333 7 13.3333C8.29111 13.3333 9.33333 12.1422 9.33333 10.6667C9.33333 9.19111 8.29111 8 7 8ZM2.33333 2.66667H9.33333V6.22222H2.33333V2.66667Z"
                          fill="#174B8B"
                        />
                      </svg>
                      Save
                    </li>

                    <li
                      onClick={() => {
                        saveDocumentToState();
                        toggleDropdown("signature");
                      }}
                      className="px-2  py-2 cursor-pointer   flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.0363 0.499866L13.5811 4.72096C14.1396 5.39599 14.1396 6.47263 13.5811 7.14766L7 15.0003C5.88286 16.3332 4.0711 16.3332 2.9468 15.0003L0.418926 11.984C-0.139642 11.3089 -0.139642 10.2323 0.418926 9.55728L8.00972 0.499866C8.57545 -0.166622 9.47775 -0.166622 10.0363 0.499866ZM1.42864 10.7706L3.96368 13.7869C4.52225 14.4619 5.42455 14.4619 5.99028 13.7869L8.51816 10.7706L4.9734 6.54099L1.42864 10.7706Z"
                          fill="#174B8B"
                        />
                      </svg>
                      Cancel
                    </li>

                    <li
                      className="px-2 py-2 cursor-pointer border-y border-[#174B8B] flex items-center gap-x-2"
                      onClick={() => {
                        setShowPopup((current: any) => !current);
                        toggleDropdown("signature");
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.33333 8L6.22222 4V7H0V9H6.22222V12L9.33333 8ZM14 14V2C14 0.89 13.3 0 12.4444 0H3.11111C2.69855 0 2.30289 0.210714 2.01117 0.585786C1.71944 0.960859 1.55556 1.46957 1.55556 2V5H3.11111V2H12.4444V14H3.11111V11H1.55556V14C1.55556 14.5304 1.71944 15.0391 2.01117 15.4142C2.30289 15.7893 2.69855 16 3.11111 16H12.4444C12.857 16 13.2527 15.7893 13.5444 15.4142C13.8361 15.0391 14 14.5304 14 14Z"
                          fill="#174B8B"
                        />
                      </svg>
                      Import Document
                    </li>
                    <li
                      onClick={() => {
                        saveDocumentToState();
                        toggleDropdown("signature");
                      }}
                      className="px-2 py-2   cursor-pointer  flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.5263 14.5455H4.42105V4.36364H12.5263V14.5455ZM12.5263 2.90909H4.42105C4.03021 2.90909 3.65537 3.06234 3.379 3.33512C3.10263 3.6079 2.94737 3.97787 2.94737 4.36364V14.5455C2.94737 14.9312 3.10263 15.3012 3.379 15.574C3.65537 15.8468 4.03021 16 4.42105 16H12.5263C12.9172 16 13.292 15.8468 13.5684 15.574C13.8447 15.3012 14 14.9312 14 14.5455V4.36364C14 3.97787 13.8447 3.6079 13.5684 3.33512C13.292 3.06234 12.9172 2.90909 12.5263 2.90909ZM10.3158 0H1.47368C1.08284 0 0.708001 0.153246 0.431632 0.426027C0.155263 0.698807 0 1.06878 0 1.45455V11.6364H1.47368V1.45455H10.3158V0Z"
                          fill="#174B8B"
                        />
                      </svg>
                      Copy as a Template
                    </li>
                    <li
                      className="px-2 py-2 hover:bg-gray-200 cursor-pointer border-t pt-2 border-b border-[#174B8B]  flex items-center gap-x-2"
                      onClick={() => {
                        triggerClick("container_toolbar_open");
                        toggleDropdown("signature");
                      }}
                    >
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.43478 8C2.43478 8.888 1.89304 9.6 1.21739 9.6C0.547826 9.6 0 8.888 0 8C0 7.12 0.547826 6.4 1.21739 6.4C1.89304 6.4 2.43478 7.12 2.43478 8ZM1.82609 0V4.8H0.608696V0H1.82609ZM0.608696 16V11.2H1.82609V16H0.608696ZM14 3.2V12.8C14 13.688 13.4583 14.4 12.7826 14.4H5.47826C4.8087 14.4 4.26087 13.688 4.26087 12.8V9.6L3.04348 8L4.26087 6.4V3.2C4.26087 2.312 4.8087 1.6 5.47826 1.6H12.7826C13.4583 1.6 14 2.312 14 3.2ZM12.7826 3.2H5.47826V7.064L4.76609 8L5.47826 8.936V12.8H12.7826V3.2ZM6.69565 5.6H11.5652V7.2H6.69565V5.6ZM6.69565 8.8H10.3478V10.4H6.69565V8.8Z"
                          fill="#174B8B"
                        />
                      </svg>
                      View Audit Trail
                    </li>

                    <li
                      onClick={() => {
                        toggleDropdown("signature");
                      }}
                      className="px-2 py-2  cursor-pointer   flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.8356 8.72L8.22799 13.28H6.77227V11.44L10.3799 6.88L11.8356 8.72ZM13.9876 8.08C13.9876 8.32 13.7977 8.56 13.6078 8.8L12.0255 10.8L11.4559 10.08L13.1015 8L12.7217 7.52L12.2787 8.08L10.823 6.24L12.2154 4.56C12.342 4.4 12.5952 4.4 12.785 4.56L13.6711 5.68C13.7977 5.84 13.7977 6.16 13.6711 6.4C13.5445 6.56 13.418 6.72 13.418 6.88C13.418 7.04 13.5445 7.2 13.6711 7.36C13.861 7.6 14.0509 7.84 13.9876 8.08ZM1.26584 14.4V1.6H5.6963V5.6H8.86091V6.8L10.1268 5.2V4.8L6.32922 0H1.26584C0.56963 0 0 0.72 0 1.6V14.4C0 15.28 0.56963 16 1.26584 16H8.86091C9.55713 16 10.1268 15.28 10.1268 14.4H1.26584ZM6.32922 12.08C6.20264 12.08 6.07606 12.16 6.01276 12.16L5.6963 10.4H4.74692L3.41778 11.76L3.79753 9.6H2.84815L2.21523 13.6H3.16461L5.00009 11.52L5.37984 13.36H6.01276L6.32922 13.28V12.08Z"
                          fill="#174B8B"
                        />
                      </svg>
                      Request Signature
                    </li>
                    <li
                      onClick={() => {
                        cancelAllSignatures(), toggleDropdown("signature");
                      }}
                      className="px-2 py-2   flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          !recipients.some(
                            (recipient: any) => recipient.signature
                          )
                            ? "inherit"
                            : "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                      style={{
                        color: !recipients.some(
                          (recipient: any) => recipient.signature
                        )
                          ? "gray"
                          : "inherit", // Light blue if condition is true, else no color
                        borderColor: !recipients.some(
                          (recipient: any) => recipient.signature
                        )
                          ? "gray"
                          : "#a1a1a1", // Dark blue if true, else grey
                        cursor: !recipients.some(
                          (recipient: any) => recipient.signature
                        )
                          ? "auto"
                          : "pointer",
                      }}
                    >
                      <svg
                        width="14"
                        height="17"
                        viewBox="0 0 14 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.8356 9.66089L8.22799 14.19H6.77227V12.3624L10.3799 7.83336L11.8356 9.66089ZM13.9876 9.02523C13.9876 9.2636 13.7977 9.50197 13.6078 9.74034L12.0255 11.7268L11.4559 11.0117L13.1015 8.94577L12.7217 8.46902L12.2787 9.02523L10.823 7.1977L12.2154 5.52909C12.342 5.37017 12.5952 5.37017 12.785 5.52909L13.6711 6.6415C13.7977 6.80041 13.7977 7.11824 13.6711 7.35661C13.5445 7.51553 13.418 7.67445 13.418 7.83336C13.418 7.99228 13.5445 8.15119 13.6711 8.31011C13.861 8.54848 14.0509 8.78685 13.9876 9.02523ZM1.26584 15.3024V2.58915H5.6963V6.56204H8.86091V7.7539L10.1268 6.16475V5.76746L6.32922 1H1.26584C0.56963 1 0 1.71512 0 2.58915V15.3024C0 16.1764 0.56963 16.8915 1.26584 16.8915H8.86091C9.55713 16.8915 10.1268 16.1764 10.1268 15.3024H1.26584ZM6.32922 12.9981C6.20264 12.9981 6.07606 13.0776 6.01276 13.0776L5.6963 11.3295H4.74692L3.41778 12.6803L3.79753 10.5349H2.84815L2.21523 14.5078H3.16461L5.00009 12.4419L5.37984 14.2694H6.01276L6.32922 14.19V12.9981Z"
                          fill="#174B8B"
                        />
                        <line
                          y1="-0.5"
                          x2="19.6648"
                          y2="-0.5"
                          transform="matrix(0.581374 0.813637 -0.735688 0.677321 0 1)"
                          stroke="#174B8B"
                        />
                      </svg>
                      Cancel All Signatures
                    </li>
                    <li
                      onClick={() => {
                        reverToReview(), toggleDropdown("signature");
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          !recipients.some(
                            (recipient: any) => recipient.signature
                          )
                            ? "inherit"
                            : "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                      className="px-2  py-2 cursor-pointer flex items-center gap-x-2"
                      style={{
                        color: !recipients.some(
                          (recipient: any) => recipient.ReqOption
                        )
                          ? "gray"
                          : "inherit",
                        cursor: !recipients.some(
                          (recipient: any) => recipient.ReqOption
                        )
                          ? "auto"
                          : "pointer",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 0C6.4087 0 4.88258 0.842855 3.75736 2.34315C2.63214 3.84344 2 5.87827 2 8H0L2.59333 11.4578L2.64 11.5822L5.33333 8H3.33333C3.33333 6.34976 3.825 4.76712 4.70017 3.60022C5.57534 2.43333 6.76232 1.77778 8 1.77778C9.23768 1.77778 10.4247 2.43333 11.2998 3.60022C12.175 4.76712 12.6667 6.34976 12.6667 8C12.6667 9.65024 12.175 11.2329 11.2998 12.3998C10.4247 13.5667 9.23768 14.2222 8 14.2222C6.71333 14.2222 5.54667 13.52 4.70667 12.3911L3.76 13.6533C4.84667 15.1111 6.33333 16 8 16C9.5913 16 11.1174 15.1571 12.2426 13.6569C13.3679 12.1566 14 10.1217 14 8C14 5.87827 13.3679 3.84344 12.2426 2.34315C11.1174 0.842855 9.5913 0 8 0Z"
                          fill="#174B8B"
                        />
                      </svg>
                      Revert To Review
                    </li>
                    <li
                      onClick={() => {
                        toggleDropdown("signature");
                      }}
                      className="px-2 py-2 cursor-pointer pt-2 border-b border-[#174B8B] flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="16"
                        height="18"
                        viewBox="0 0 16 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.16016 17H15.0009"
                          stroke="#174B8B"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M2.24925 7.08754C1.46178 6.22567 1.11613 5.69893 1.01358 4.43391C0.916387 3.23499 1.35071 1.9988 2.0037 1.36731C2.91177 0.489144 3.99008 1.31537 4.59306 2.48019C5.2465 3.74247 5.81153 7.39155 5.85476 8.95648C5.90384 10.7333 5.67812 12.3476 5.09734 13.8921C4.69899 14.9513 4.1104 16.2 3.32699 16.623C2.61703 17.0063 1.84553 16.8634 1.70265 15.5666C1.52751 13.9772 2.01007 12.4287 2.53763 11.1151C3.2371 9.37351 4.12041 7.93155 5.34372 7.08754C10.0609 3.83281 7.27543 14.3129 8.83991 14.3129C10.4044 14.3129 10.5054 9.1645 11.6022 9.98748C12.6989 10.8105 10.6021 15.9217 14.5269 12.6917"
                          stroke="#174B8B"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Sign
                    </li>
                    <li
                      onClick={() => {
                        onClick(), toggleDropdown("signature");
                      }}
                      className="px-2 py-2  cursor-pointer   flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="16"
                        height="18"
                        viewBox="0 0 60 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M59.9996 12.236V77.2044C59.9996 78.744 58.7808 80 57.2867 80H7.27353C5.77943 80 4.56055 78.744 4.56055 77.2044V2.79564C4.56055 1.25601 5.77943 0 7.27353 0H48.1058L59.9996 12.236Z"
                          fill="white"
                        />
                        <path
                          d="M60.001 12.236V77.2044C60.001 78.744 58.7821 80 57.288 80H53.4151C54.9092 80 56.1281 78.744 56.1281 77.2044V12.236L44.2539 0H48.1268L60.001 12.236Z"
                          fill="#E5E5E5"
                        />
                        <path
                          d="M59.9993 12.236H50.8185C49.3244 12.236 48.1055 10.98 48.1055 9.44036V0L59.9993 12.236Z"
                          fill="#92929D"
                        />
                        <path
                          d="M48.5389 37.8827H16.337C15.2558 37.8827 14.3711 36.9711 14.3711 35.8569C14.3711 34.7427 15.2558 33.8311 16.337 33.8311H48.5389C49.6201 33.8311 50.5048 34.7427 50.5048 35.8569C50.5048 36.9913 49.6398 37.8827 48.5389 37.8827Z"
                          fill="#92929D"
                        />
                        <path
                          d="M48.5389 48.2753H16.337C15.2558 48.2753 14.3711 47.3637 14.3711 46.2495C14.3711 45.1353 15.2558 44.2236 16.337 44.2236H48.5389C49.6201 44.2236 50.5048 45.1353 50.5048 46.2495C50.5048 47.3839 49.6398 48.2753 48.5389 48.2753Z"
                          fill="#92929D"
                        />
                        <path
                          d="M48.5389 58.6679H16.337C15.2558 58.6679 14.3711 57.7562 14.3711 56.642C14.3711 55.5278 15.2558 54.6162 16.337 54.6162H48.5389C49.6201 54.6162 50.5048 55.5278 50.5048 56.642C50.5048 57.7765 49.6398 58.6679 48.5389 58.6679Z"
                          fill="#92929D"
                        />
                        <path
                          d="M27.2281 27.3486H0V15.9837C0 15.1329 0.668405 14.4238 1.51375 14.4238H27.2281C28.0537 14.4238 28.7418 15.1126 28.7418 15.9837V25.7887C28.7418 26.6396 28.0734 27.3486 27.2281 27.3486Z"
                          fill="#F55B4B"
                        />
                        <path
                          d="M28.7418 25.5861V25.7887C28.7418 26.6396 28.0734 27.3486 27.2281 27.3486H0V15.9837C0 15.1329 0.668405 14.4238 1.51375 14.4238H2.28047V18.4755C2.28047 22.4056 5.36697 25.6064 9.20053 25.6064H28.7418V25.5861Z"
                          fill="#DD4E43"
                        />
                        <path
                          d="M0 27.3486L4.56094 32.6968V27.3486H0Z"
                          fill="#DB1B1B"
                        />
                        <path
                          d="M7.37246 23.3386V24.6959H3.26367V23.3386H4.26629V18.0106H3.26367V16.6533H7.37246C8.33576 16.6533 9.06315 16.8762 9.59395 17.3421C10.1248 17.808 10.3803 18.4361 10.3803 19.2059C10.3803 19.6515 10.282 20.0567 10.1051 20.4214C9.92816 20.786 9.69225 21.0696 9.39736 21.252C9.10247 21.4545 8.78792 21.5761 8.4144 21.6571C8.04087 21.7382 7.58871 21.7584 7.03825 21.7584H6.2912V23.3183H7.37246V23.3386ZM6.2912 20.4214H6.58609C7.27416 20.4214 7.72632 20.2998 7.92292 20.077C8.11951 19.8541 8.21781 19.5503 8.21781 19.2059C8.21781 18.9223 8.13916 18.6589 8.00155 18.4563C7.86393 18.2537 7.70667 18.1322 7.52973 18.0714C7.3528 18.0309 7.05791 17.9904 6.64507 17.9904H6.27154V20.4214H6.2912Z"
                          fill="white"
                        />
                        <path
                          d="M10.8516 24.6959V23.3386H12.0311V18.0106H10.8516V16.6533H14.5475C15.3339 16.6533 15.9433 16.6938 16.4348 16.7951C16.9066 16.8964 17.3588 17.1193 17.7913 17.4434C18.2238 17.7878 18.5777 18.2335 18.8332 18.8007C19.0888 19.3679 19.2264 19.9959 19.2264 20.6847C19.2264 21.252 19.1281 21.7787 18.9512 22.2851C18.7742 22.7916 18.5383 23.1967 18.2631 23.5209C17.9879 23.8248 17.6733 24.0881 17.2801 24.2704C16.9066 24.4528 16.5527 24.5743 16.2382 24.6351C15.9237 24.6959 15.4322 24.7161 14.7638 24.7161H10.8516V24.6959ZM14.0757 23.3386H14.5672C15.1569 23.3386 15.6288 23.2575 15.9826 23.0955C16.3365 22.9334 16.6117 22.6498 16.8083 22.2649C17.0246 21.8597 17.1229 21.3532 17.1229 20.705C17.1229 20.0972 17.0246 19.5705 16.8083 19.1451C16.5921 18.7197 16.3168 18.4158 15.9433 18.2537C15.5894 18.0917 15.1176 18.0106 14.5672 18.0106H14.0757V23.3386Z"
                          fill="white"
                        />
                        <path
                          d="M20.1309 24.6959V23.3386H21.2514V18.0106H20.1309V16.6533H27.1296V19.1451H25.6354V18.0309H23.296V19.8946H24.9867V21.252H23.296V23.3386H24.4952V24.6959H20.1309Z"
                          fill="white"
                        />
                        <path
                          d="M24.2393 31.1167H4.58008V27.3486H27.3258V27.9564C27.3062 29.6986 25.93 31.1167 24.2393 31.1167Z"
                          fill="#E5E5E5"
                        />
                      </svg>
                      Download PDF
                    </li>
                    <li
                      onClick={() => {
                        save(), toggleDropdown("signature");
                      }}
                      className="px-2 py-2 cursor-pointer  flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="16"
                        height="14"
                        viewBox="0 0 16 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.336 0C15.512 0 15.6693 0.0666667 15.808 0.2C15.936 0.328 16 0.482667 16 0.664V13.336C16 13.5173 15.936 13.672 15.808 13.8C15.6693 13.9333 15.512 14 15.336 14H4.664C4.488 14 4.33067 13.9333 4.192 13.8C4.064 13.672 4 13.5173 4 13.336V11H0.664C0.488 11 0.330667 10.936 0.192 10.808C0.064 10.6693 0 10.512 0 10.336V3.664C0 3.488 0.064 3.33067 0.192 3.192C0.330667 3.064 0.488 3 0.664 3H4V0.664C4 0.482667 4.064 0.328 4.192 0.2C4.33067 0.0666667 4.488 0 4.664 0H15.336ZM4.024 6.472L4.984 9.624H6.08L7.128 4.376H6.024L5.4 7.48L4.512 4.48H3.6L2.648 7.496L2.024 4.376H0.872L1.92 9.624H3.016L4.024 6.472ZM15 13V11H5V13H15ZM15 10V7.504H8V10H15ZM15 6.504V4H8V6.504H15ZM15 3V1H5V3H15Z"
                          fill="#174B8B"
                        />
                      </svg>
                      Download Word
                    </li>
                    <li
                      onClick={() => {
                        toggleDropdown("signature");
                      }}
                      style={{ whiteSpace: "nowrap" }}
                      className="px-2 py-2 cursor-pointer  border-b border-[#174B8B] flex items-center gap-x-1 no-wrap"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="18"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.7 16L9.1 15.1111L10.5 16V9.77778H7.7V16ZM10.5 5.33333V3.55556L9.1 4.44444L7.7 3.55556V5.33333L6.3 6.22222L7.7 7.11111V8.88889L9.1 8L10.5 8.88889V7.11111L11.9 6.22222L10.5 5.33333ZM12.6 0H1.4C1.0287 0 0.672601 0.187301 0.41005 0.520699C0.1475 0.854097 0 1.30628 0 1.77778V10.6667C0 11.1382 0.1475 11.5903 0.41005 11.9237C0.672601 12.2571 1.0287 12.4444 1.4 12.4444H6.3V10.6667H1.4V1.77778H12.6V10.6667H11.9V12.4444H12.6C12.9713 12.4444 13.3274 12.2571 13.5899 11.9237C13.8525 11.5903 14 11.1382 14 10.6667V1.77778C14 1.30628 13.8525 0.854097 13.5899 0.520699C13.3274 0.187301 12.9713 0 12.6 0ZM6.3 4.44444H2.1V2.66667H6.3V4.44444ZM4.9 7.11111H2.1V5.33333H4.9V7.11111ZM6.3 9.77778H2.1V8H6.3V9.77778Z"
                          fill="#174B8B"
                        />
                      </svg>
                      <span style={{ marginTop: "-2px", marginLeft: "2px" }}>
                        {" "}
                        Download Signature Certificate
                      </span>
                    </li>
                    <li
                      onClick={() => {
                        toggleDropdown("signature");
                      }}
                      className="px-2 py-2 cursor-pointer flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="16"
                        height="18"
                        viewBox="0 0 16 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.4617 14.3223V10.4926C11.4617 10.2251 11.5549 9.96862 11.7208 9.77949C11.8867 9.59036 12.1117 9.48411 12.3464 9.48411C12.581 9.48411 12.806 9.59036 12.9719 9.77949C13.1378 9.96862 13.231 10.2251 13.231 10.4926V14.945C13.2354 15.2131 13.1929 15.4795 13.106 15.7286C13.019 15.9778 12.8894 16.2047 12.7246 16.3961C12.5598 16.5874 12.3633 16.7395 12.1464 16.8432C11.9295 16.947 11.6966 17.0005 11.4614 17.0005C11.2261 17.0005 10.9933 16.947 10.7764 16.8432C10.5595 16.7395 10.3629 16.5874 10.1981 16.3961C10.0334 16.2047 9.90373 15.9778 9.81677 15.7286C9.72982 15.4795 9.68731 15.2131 9.69172 14.945V10.0564C9.69172 9.25385 9.9714 8.48413 10.4692 7.91662C10.9671 7.3491 11.6423 7.03027 12.3464 7.03027C13.0504 7.03027 13.7256 7.3491 14.2235 7.91662C14.7213 8.48413 15.001 9.25385 15.001 10.0564V14.3223"
                          stroke="#174B8B"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M7.68791 14.8294H1.9332C1.6857 14.8294 1.44834 14.7173 1.27333 14.5178C1.09832 14.3183 1 14.0478 1 13.7656V2.0638C1 1.78166 1.09832 1.51108 1.27333 1.31158C1.44834 1.11208 1.6857 1 1.9332 1H8.54583C8.79315 1.00006 9.03034 1.11204 9.20529 1.31134L10.992 3.34817C11.1669 3.54759 11.2651 3.81798 11.2652 4.09992V4.95096"
                          stroke="#174B8B"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Add Attachments
                    </li>
                    <li
                      onClick={() => {
                        toggleDropdown("signature");
                      }}
                      style={{ whiteSpace: "nowrap" }}
                      className="px-2 py-2 border-b border-[#174B8B] cursor-pointer flex items-center gap-x-2 no-wrap"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.75 0H1.75C0.77875 0 0 0.72 0 1.6V14.4C0 15.288 0.77875 16 1.75 16H12.25C13.2212 16 14 15.288 14 14.4V4.8L8.75 0ZM12.25 14.4H1.75V1.6H7.875V5.6H12.25V14.4ZM6.125 13.6H5.90625C4.76875 13.6 2.625 12.976 2.625 10.6C2.625 8.224 4.76875 7.6 5.90625 7.6H6.125V8.8H5.90625C5.5825 8.8 3.9375 8.904 3.9375 10.6C3.9375 12.352 5.6875 12.4 5.90625 12.4H6.125V13.6ZM8.75 11.2H5.25V10H8.75V11.2ZM7.875 7.6H8.09375C9.23125 7.6 11.375 8.224 11.375 10.6C11.375 12.976 9.23125 13.6 8.09375 13.6H7.875V12.4H8.09375C8.4175 12.4 10.0625 12.296 10.0625 10.6C10.0625 8.848 8.3125 8.8 8.09375 8.8H7.875V7.6Z"
                          fill="#174B8B"
                        />
                      </svg>
                      View Linked Documents
                    </li>
                    <li
                      onClick={() => {
                        saveDocumentToState();
                        toggleDropdown("signature");
                      }}
                      className="px-2 py-2  cursor-pointer  flex items-center gap-x-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E4EDF8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 14.2222C1 14.6937 1.21071 15.1459 1.58579 15.4793C1.96086 15.8127 2.46957 16 3 16H11C11.5304 16 12.0391 15.8127 12.4142 15.4793C12.7893 15.1459 13 14.6937 13 14.2222V3.55556H1V14.2222ZM3 5.33333H11V14.2222H3V5.33333ZM10.5 0.888889L9.5 0H4.5L3.5 0.888889H0V2.66667H14V0.888889H10.5Z"
                          fill="#174B8B"
                        />
                      </svg>
                      Move to Bin
                    </li>
                    <div
                      onClick={() => toggleDropdown("signature")}
                      className="w-full h-full  fixed inset-0 z-[-9]"
                    ></div>
                  </ul>
                )}
              </div>
              <p className="text-[14px] font-regular flex whitespace-nowrap ">
                Approvals: 0/0{" "}
                <span className="ml-1 text-[#92929D] text-[12px] font-regular mt-0.5 ">
                  Manage{" "}
                </span>{" "}
              </p>

              <p className="text-[14px] font-regular flex whitespace-nowrap">
                Signers: 0/0{" "}
                <span className="ml-1 text-[#92929D] text-[12px] font-regular mt-0.5  ">
                  Manage{" "}
                </span>{" "}
              </p>

              <p className="text-[14px] font-regular flex whitespace-nowrap">
                Collaborators: 0
                <span className="ml-1 text-[#92929D] text-[12px] font-regular mt-0.5  ">
                  Manage{" "}
                </span>{" "}
              </p>

              <p className="text-[14px] font-regular flex whitespace-nowrap">
                Fields: 0/0{" "}
                <span className="ml-1 text-[#92929D] text-[12px] font-regular  mt-0.5 ">
                  Manage{" "}
                </span>{" "}
              </p>
            </div>

            {/* buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "1rem",
                marginTop: ".5rem",
                marginBottom: ".5rem",
                marginLeft: "13rem",
              }}
            >
              {(showBlock == "uploadTrack" || editMode) && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      textTransform: "none",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                    onClick={() => {
                      setEditMode(false);
                      setEnabelEditing(true);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{ ml: 2, textTransform: "none" }}
                    onClick={handleSubmit}
                    variant="outlined"
                    color="success"
                  >
                    Save
                  </Button>
                </>
              )}

              {showBlock == "pdf" && (
                <Button
                  sx={{ ml: 2, textTransform: "none" }}
                  type="submit"
                  variant="outlined"
                  color="success"
                  onClick={() => {
                    setSidebarExpanded(true), setSelectedModule("fields");
                  }}
                >
                  Add Field
                </Button>
              )}

              {showBlock == "" && !editMode && (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    ml: 2,
                    textTransform: "none",

                    color: "#174B8B",
                    borderColor: "#174B8B", // Change this to your preferred color
                    "&:hover": {
                      borderColor: "#1171D1", // Optional: Change for hover state
                    },
                  }}
                  onClick={() => {
                    handleClick();
                  }}
                >
                  <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* <div id="xyz">show </div> */}
      {showBlock == "uploadTrack" && uplodTrackFile && (
        <div>
          {
            uplodTrackFile && uplodTrackFile.type === "application/pdf" && (
              <div className="  w-full h-[75vh] bg-white overflow-auto  px-4 py-3">
                <div className="max-w-[930px] w-full mx-auto">
                  <Worker workerUrl={workerUrl}>
                    <Viewer fileUrl={URL.createObjectURL(uplodTrackFile)} />
                  </Worker>
                </div>
              </div>
            )
            // : (
            //   <div className="w-full h-[70vh] bg-white overflow-auto ">
            //     <div className="max-w-[835px] w-full mx-auto px-4 py-4 ">
            //       <div
            //         className="w-full border-2 min-h-[600px]  px-28 py-28"
            //         dangerouslySetInnerHTML={{ __html: documentContent }}
            //       />
            //     </div>
            //   </div>
            // )
          }
        </div>
      )}

      {documentContent == "pdf" && (
        <PDFUploaderViewer documentPath={documentPath} />
      )}

      {(showBlock === "" || documentContent == "word") && (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100vh",
            borderTop: "1px solid #174b8b",
          }}
        >
          <DocumentEditorContainerComponent
            ref={editorContainerRef}
            id="container"
            height="88vh"
            toolbarItems={items}
            toolbarClick={onToolbarClick}
            serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
            showPropertiesPane={false}
            documentEditorSettings={{
              searchHighlightColor: "red",
            }}
            created={onCreated}
          />
        </div>
      )}

      <SyncFesionFileDilog
        open={showPopup}
        onClose={() => setShowPopup(false)}
        setDocumentPath={setDocumentPath}
        documentPath={documentPath}
        triggerClick={() => triggerClick("container_toolbar_open")}
      />
    </div>
  );
}

export default SyncFesion;
