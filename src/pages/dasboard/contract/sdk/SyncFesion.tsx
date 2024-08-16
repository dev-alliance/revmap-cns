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
import { registerLicense, select } from "@syncfusion/ej2-base";
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
  ListItemText,
  ListItemButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import linepng from "../../../../assets/line.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
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
import {
  create,
  getcontractById,
  updateDocument,
} from "@/service/api/contract";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ReactQuill from "react-quill";
import QuillToolbar, { formats, modules } from "./QuillToolbar";
import TrackChanges from "./TrackChanges";
import DiffMatchPatch, {
  DIFF_INSERT,
  DIFF_DELETE,
  DIFF_EQUAL,
  // @ts-ignore
} from "diff-match-patch";
import { Console } from "console";
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
  const navigate = useNavigate();
  const templateOpen = location?.state?.templateOpen;
  const { user } = useAuth();
  const { id } = useParams();
  const [documentData, setDocumentData] = useState<string | null>(null);
  const [documentReady, setDocumentReady] = useState<boolean>(false);
  const [list, setList] = useState<undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const [newId, setNewId] = useState("");
  const {
    setEditorRefContext,
    temlatePoupup,
    setTemlatePoupup,
    dragFields,
    recipients,
    setRecipients,
    uplodTrackFile,
    setUplodTrackFile,
    documentContent,
    setDocumentContent,
    showBlock,
    IsTemplate,
    setShowBlock,
    setApprovers,
    formState,
    setSelectedModule,
    setSidebarExpanded,
    setEditMode,
    editMode,
    contract,
    lifecycleData,
    setLifecycleData,
    collaborater,
    setCollaborater,
    approvers,
    documentName,
    setDucomentName,
    setLeftSidebarExpanded,
    setFormState,
    inputRef,
    auditTrails,
    setAuditTrails,
    trackChanges,
    setTrackChanges,
    documentPageSize,
    documentPageMargins,
    bgColor,
    fontColor,
    setBgColor,
    setFontColor,
    setBgColorSvg,
    setFontColorSvg,
    selectionRef
  } = useContext(ContractContext);

  const workerUrl =
    "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";

  useEffect(() => {
    setIsLoading(false);
    setLeftSidebarExpanded(true);
  }, []);


  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getcontractById(id);

      console.log(data, "singal data");
      if (data?.pdfData) {
        // const pdfBlob = convertBase64ToBlob(data?.pdfData, "application/pdf");
        setUplodTrackFile(data?.pdfData);
        setShowBlock("uploadTrack");
      }
      if (data?.uploadedWordData) {
        setDocumentData(data?.uploadedWordData);
        setShowBlock("uploadTrack");
        setDocumentContent("word");
      }
      if (data?.wordDocumentData) {
        setDocumentData(data?.wordDocumentData);
      }
      setFormState(data?.overview);
      setDucomentName(data?.overview?.name);
      setLifecycleData(data?.lifecycle);
      setApprovers(data?.approval), setCollaborater(data?.collaburater);
      setRecipients(data?.signature);

      setList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) listData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const editorContainerRef: any = useRef(null);

  useEffect(() => {
    editorContainerRef.current.focus();
    if (editorContainerRef) {
      const document = editorContainerRef?.current;
      setEditorRefContext(document);
    }
  }, []);

  const saveDocumentToState = (): void => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor) {
      const sfdtData = documentEditor.saveAsBlob("Sfdt");
      sfdtData
        .then((blob: any) => {
          const reader = new FileReader();
          reader.onload = () => {
            setDocumentData(reader.result as string);
            setDocumentReady(true); // Set the state indicating document data is ready
          };
          reader.onerror = () => {
            console.error("Failed to read document data");
          };
          reader.readAsText(blob);
        })
        .catch(() => {
          console.error("Failed to save document as blob");
        });
    } else {
      console.error("Document editor not found");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!documentName) {
        toast.error("Please enter the name of the document");
        return;
      }
      console.log(user);
      setAuditTrails([
        ...(auditTrails || []),
        {
          user: user?.firstName,
          date: new Date(),
          message: "has added the new version",
        },
      ]);
      console.log(auditTrails);
      setDocumentReady(false); // Reset the document ready state
      // saveDocumentToState(); // Start saving the document to state
      if (uplodTrackFile) {
        setDocumentReady(true);
      }
    } catch (error: any) {
      console.log(error);

      let errorMessage = "Failed to create .";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data ||
          "An error occurred";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (!documentReady) return;

    const createPayload = async () => {
      try {
        let status = "Draft"; // Default status

        const hasReqOption = recipients.some(
          (recipient: any) => recipient.ReqOption
        );

        const hasSignature = recipients.some(
          (recipient: any) => recipient.signature
        );

        // Determine which step to highlight
        if (recipients.length > 0) {
          status = "Review";
        }
        if (hasReqOption) {
          status = "Signing";
          // Update status to 'pending' when there's a ReqOption
        }
        if (hasSignature) {
          status = "Signed";
          // Update status to 'completed' when all required signatures are present
        }
        console.log(status, "status");

        const payload = {
          userId: user._id,
          overview: { ...formState, name: documentName },
          lifecycle: lifecycleData,
          collaburater: collaborater,
          approval: approvers,
          signature: recipients,
          status: status,

          createdBy: user.firstName,
          contractType: IsTemplate ? "template" : "",
          wordDocumentData: showBlock == "" ? documentData : null,
          pdfData: uplodTrackFile,
          uploadedWordData: showBlock === "uploadTrack" ? documentData : null,
        };
        console.log(payload, "payload");

        let response;

        if (newId) {
          response = await updateDocument(newId, payload);
        } else if (id) {
          response = await updateDocument(id, payload);
        } else {
          response = await create(payload);
          console.log(response.contract._id, "res");
          if (response.contract._id) {
            setNewId(response.contract._id);
          }
        }

        if (response.ok === true) {
          toast.success(response.message);
          if (showBlock == "uploadTrack") {
            navigate("/dashboard/contract-list");
          }
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
      }
    };

    createPayload();
  }, [documentReady]);
  // console.log(showBlock), "block show";

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
        documentReady;
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

  //


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

  // State for the cell fill color
  const [cellFillColor, setCellFillColor] = useState(""); // Default color

  const applyCellFillColor = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    documentEditor.selection.cellFormat.background = cellFillColor;
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

  const save = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    const userFileName = prompt("Enter a file name for your docs", "My File");
    if (userFileName) {
      documentEditor.save(userFileName, "Docx");
    }
  };
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

  // Effect to load document data into the editor
  useEffect(() => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor && documentData) {
      console.log(documentData, "documentData");
      documentEditor.open(documentData, "Sfdt");
    }
  }, [documentData]);

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
    if (recipients.length > 0) {
      highlightStep = "Review";
    }
    if (hasReqOption) {
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

    // documentEditor.focusIn(); // Focusing the editor
    // const buttons = document.querySelectorAll(".e-tbar-btn");
    // const items = document.querySelectorAll(".e-toolbar-item");
    // items.forEach((item) => {
    //   item.classList.add("e-overlay");
    // });

    // buttons.forEach((button) => {
    //   button.setAttribute("aria-disabled", "true");
    // });
  }, [enabelEditing]);
  useEffect(() => {
    if (editMode) {
      handleClick();
    }
  }, [editMode]);

  const handleClick = () => {
    setEditMode(true);
    setEnabelEditing(false);
    const documentEditor = editorContainerRef.current?.documentEditor;
    // documentEditor.focusIn(); // Focusing the editor
    const buttons = document.querySelectorAll(".e-tbar-btn");
    const items = document.querySelectorAll(".e-toolbar-item");
    items.forEach((item) => {
      item.classList.remove("e-overlay");

      console.log(item, "e-overlay"); // This line is optional, for debugging purposes
    });

    buttons.forEach((button) => {
      button.setAttribute("aria-disabled", "false");

      console.log(button.id, "aria-disabled set to false"); // This line is optional, for debugging purposes
    });
  };
  const handleClickCencel = () => {
    // navigate("/dashboard/contract-list");

    setEditMode(false);
    setEnabelEditing(true);
    const documentEditor = editorContainerRef.current?.documentEditor;
    // documentEditor.focusIn(); // Focusing the editor
    const buttons = document.querySelectorAll(".e-tbar-btn");
    const items = document.querySelectorAll(".e-toolbar-item");
    items.forEach((item) => {
      item.classList.add("e-overlay");
    });

    buttons.forEach((button) => {
      button.setAttribute("aria-disabled", "true");
    });
  };

  useEffect(() => {
    const calculateWidth = () => {
      const context = document.createElement("canvas").getContext("2d");
      if (context && inputRef.current) {
        inputRef.current.focus();
        context.font = getComputedStyle(inputRef.current).font; // Get the font style from the input
        let totalWidth = 0;
        for (const char of documentName) {
          totalWidth += context.measureText(char).width; // Calculate total width of all characters
        }
        inputRef.current.style.width = `${Math.max(170, totalWidth)}px`; // Set input width
      }
    };

    calculateWidth(); // Call on mount and documentName change
  }, [documentName]);

  const initialText =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium minima doloremque pariatur?";

  const [editorHtml, setEditorHtml] = useState<any>();
  const [addedString, setAddedString] = useState("");
  const [deletedString, setDeletedString] = useState("");
  const stripHtml = (html: any) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  // const getTextPositions = (text: any) => {
  //   // Function to get the positions of each line or text block
  //   const lines: any = text.split('\n');
  //   return lines.map((line: any, index: number) => ({
  //     line,
  //     position: index
  //   }));
  // };

  const dmp = new DiffMatchPatch();

  const [cursorPosition, setCursorPosition] = useState<number | null>(null); // State to store cursor position

  const handleChange = (html: string,range:any) => {
    // const newText = html;
    // const oldText = editorHtml;

    // // Compute differences between old and new text
    // const diffs = dmp.diff_main(oldText, newText);
    // dmp.diff_cleanupSemantic(diffs);

    // let addedContent = "";
    // let deletedContent = "";
    // let position = 0; // Track position in the text

    // // Process differences
    // diffs.forEach((diff: any) => {
    //   if (diff[0] === 1) {
    //     // DIFF_INSERT
    //     addedContent += diff[1];
    //     position += diff[1].length; // Update position
    //   } else if (diff[0] === -1) {
    //     // DIFF_DELETE
    //     deletedContent += diff[1];
    //   }
    // });

    // // Handle added content
    // if (addedContent) {
    //   setAddedString((prev) => {
    //     const updatedAddedString = prev + addedContent;

    //     // Update track changes for insertion with position
    //     setTrackChanges((prevTrackChanges: any) => [
    //       ...prevTrackChanges.filter(
    //         (change: any) => change.action !== "INSERTED"
    //       ),
    //       {
    //         user: user?.firstName,
    //         changes: updatedAddedString,
    //         action: "INSERTED",
    //         date: new Date(),
    //         position: position, // Track position
    //       },
    //     ]);

    //     return updatedAddedString;
    //   });
    // }

    // // Handle deleted content
    // if (deletedContent) {
    //   setAddedString((prevAdded) => {
    //     const updatedAddedString = prevAdded.replace(deletedContent, "");
    //     setTrackChanges((prevTrackChanges: any) => [
    //       ...prevTrackChanges.filter(
    //         (change: any) => change.action !== "INSERTED"
    //       ),
    //       {
    //         user: user?.firstName,
    //         changes: updatedAddedString,
    //         action: "INSERTED",
    //         date: new Date(),
    //         position: position, // Track position
    //       },
    //     ]);
    //     return updatedAddedString;
    //   });

    //   setDeletedString((prev) => {
    //     const updatedDeletedString = prev + deletedContent;

    //     // Update track changes for deletion with position
    //     setTrackChanges((prevTrackChanges: any) => [
    //       ...prevTrackChanges.filter(
    //         (change: any) => change.action !== "DELETED"
    //       ),
    //       {
    //         user: user?.firstName,
    //         changes: updatedDeletedString,
    //         action: "DELETED",
    //         date: new Date(),
    //         position: position, // Track position
    //       },
    //     ]);

    //     return updatedDeletedString;
    //   });
    // }

    // // Clean up track changes
    // if (
    //   !addedString ||
    //   addedString.trim().replace(/<\/?p>/g, "").length === 0
    // ) {
    //   setTrackChanges((prev: any) =>
    //     prev.filter((a: any) => a.action !== "INSERTED")
    //   );
    // }
    // if (!deletedContent) {
    //   setTrackChanges((prev: any) =>
    //     prev.filter((a: any) => a.action !== "DELETED")
    //   );
    // }
    // Update editorHtml state
    setEditorHtml(html);
  };

  const rejectChange = (changeToReject: any) => {
    const { action, changes } = changeToReject;

    if (action === "INSERTED") {
      // Remove inserted content from the editor
      let updatedHtml = editorHtml;

      // Use a regex to remove all occurrences of the changes text
      updatedHtml = updatedHtml.replace(new RegExp(changes, "g"), "");

      // Update state
      setEditorHtml(updatedHtml);

      // Update track changes
      setTrackChanges((prev: any) =>
        prev.filter((change: any) => change !== changeToReject)
      );
    } else if (action === "DELETED") {
      // Add deleted content back to the editor
      const updatedHtml = editorHtml + changes;

      // Update state
      setEditorHtml(updatedHtml);

      // Update track changes
      setTrackChanges((prev: any) =>
        prev.filter((change: any) => change !== changeToReject)
      );
    }
  };

  const [selection, setSelection] = useState<any>(null);
  const [comments, setComments] = useState<any>([]);
  

  const [selectedRange, setSelectedRange] = useState<any>(null);
  useEffect(() => {
    const editor = editorContainerRef.current.getEditor();
    if (editor && selection) {
      const bounds = editor.getBounds(selection.index);
      setButtonPosition({ top: bounds.bottom - 10 });
    }
  }, [selection]);


  // console.log(cursorPosition)
  
  const handleChangeSelection = (range: any,source:any) => {
    
    if (range) {
      if(source === "user") {
        const format = editorContainerRef.current.getEditor().getFormat(range.index); 
        if(format.color) {
          setFontColorSvg(format.color);
        }else {
          setFontColorSvg("black")
        }
        if(format.background) {
          console.log(format.background)
        if(format.background == "#ffffff" || format.background == "#fefefe") {
          setBgColorSvg("#D9D9D940")
        }
          setBgColorSvg(format.background)
        }
        else {
          setBgColorSvg("#D9D9D940")
        }
        
      }
    }
    if (range && range.length > 0) {
      setSelection(range);
      selectionRef.current = range;
      const existingComment = comments?.find(
        (comment: any) =>
          comment.range.index === range.index &&
          comment.range.length === range.length
      );
      if (existingComment) {
        setCurrentComment(existingComment.text);
      } else {
        setCurrentComment("");
      }
    } else {
      setSelection(null);
    }
  };

 
  // Use the focus event to move cursor to the end
  const handleFocus = () => {
    const quill = editorContainerRef?.current?.getEditor();
    if (quill && cursorPosition !== null) {
      quill.setSelection(cursorPosition, 0); 
    }
  };

  const [buttonPosition, setButtonPosition] = useState<any>({
    top: 0,
    left: 0,
  });

  const [openComment, SetOpenComment] = useState<boolean>(false);
  const [isFocusedInput, setIsFocusedInput] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isInternal, setIsInternal] = useState<boolean>(false);
  const [currentComment, setCurrentComment] = useState("");

  const commentInputRef: any = useRef(null);

  useEffect(() => {
    if (openComment && inputRef.current) {
      commentInputRef.current.focus();
    }
  }, [openComment]);

  const addComment = () => {
    const checkOverlap = (newComment: any) => {
      const commentHeight = 119;
      const commentWidth = 300;

      return comments.some((comment: any) => {
        const newCommentTop = newComment.style.top;
        const newCommentLeft =
          parseInt(newComment.style.left.replace("rem", "")) * 16; // Convert rem to pixels
        const existingCommentTop = comment.style.top;
        const existingCommentLeft =
          parseInt(comment.style.left.replace("rem", "")) * 16; // Convert rem to pixels

        return (
          Math.abs(newCommentTop - existingCommentTop) < commentHeight &&
          Math.abs(newCommentLeft - existingCommentLeft) < commentWidth
        );
      });
    };

    if (editComment) {
      const updatedComments = comments.map((comment: any, index: any) => {
        if (index === editCommentIndex) {
          return {
            ...comment,
            text: currentComment,
            date: new Date(),
            user: user?.firstName || user?.email,
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setEditComment(false);
      SetOpenComment(false);
      setCurrentComment("");
    } else {
      if (currentComment) {
        let initialTop = buttonPosition.top;
        let initialLeft = parseFloat(`52rem`);

        let newComment = {
          range: selectionRef.current,
          text: currentComment,
          style: {
            top: initialTop,
            left: `52rem`,
          },
          access: isInternal ? "Internal" : "Public",
          date: new Date(),
          user: user?.firstName || user?.email,
        };

        // Adjust position to avoid overlap
        while (checkOverlap(newComment)) {
          initialTop += 60; // Adjust the value based on your requirement
          newComment.style.top = initialTop;
        }

        const newComments = [...comments, newComment];
        setComments(newComments);
        SetOpenComment(false);
        setCurrentComment("");
        setEditComment(false);

        if (editorContainerRef) {
          const editor = editorContainerRef.current.getEditor();
          const { index, length } = selectionRef.current;
          editor.formatText(index, length, { background: "#fde9ae" });
        }
      }
    }
    setSelection(null);
    selectionRef.current = null;
  };


  const handleReply = (index: number) => {
    if (reply.length > 0) {
      setComments((prevComments: any) => {
        const updatedComments = [...prevComments];
        if (!updatedComments[index].replies) {
          updatedComments[index].replies = [];
        }
        updatedComments[index].replies.push({
          text: reply,
          date: new Date(),
          user: user?.firstName || user?.email,
        });

        return updatedComments;
      });
    }
    setCurrentComment("");
    setReply("");
    SetOpenComment(false);
    setEditComment(false);
    setAddReply({ open: false, id: "" });
  };

  const [editComment, setEditComment] = useState<boolean>(false);
  const [editCommentIndex, setEditCommmentIndex] = useState<number>(0);
  const [addReply, setAddReply] = useState<any>({
    open: false,
    id: "",
  });
  const [reply, setReply] = useState<string>("");

  const [addSigns, setAddSigns] = useState<boolean>(true);
  const handleClickSignatures = () => {
    setAddSigns(!addSigns);
    if (addSigns) {
      setAuditTrails([
        ...auditTrails,
        {
          user: user.firstName,
          date: new Date(),
          message: "enabled the pre-set signature block",
        },
      ]);
      if (editorContainerRef && editorContainerRef.current) {
        const quill = editorContainerRef.current.getEditor();
        const length = quill.getLength(); // Get the length of the editor content

        // Clear existing signature content by removing the last signature-blot
        const root = quill.root;
        const existingBlots = root.querySelectorAll(".main-signature");
        existingBlots.forEach((blot: any) => blot.remove());

        // Insert new signature blot
        quill.insertEmbed(length - 1, "signature-blot", { recipients });
      }
    } else {
      if (editorContainerRef && editorContainerRef.current) {
        setAuditTrails([
          ...auditTrails,
          {
            user: user.firstName,
            date: new Date(),
            message: "disabled the pre-set signature block",
          },
        ]);
        const quill = editorContainerRef.current.getEditor();
        const root = quill.root;
        const existingBlots = root.querySelectorAll(".main-signature");
        existingBlots.forEach((blot: any) => blot.remove());
      }
    }
  };

  // useEffect(() => {
  //   const quill = editorContainerRef.current.getEditor();

  //   if (quill) {
  //     const applyFormatting = () => {
  //       const range = quill.getSelection();
  //       if (range) {
  //         if (range.length > 0) {
  //           // Apply formatting to the selected text
  //           quill.formatText(range.index, range.length, {
  //             background: bgColor,
  //             color: fontColor,
  //           });

  //         } else {
  //           // Apply formatting to the cursor position for future text input
  //           quill.format('background', bgColor);
  //           quill.format('color', fontColor);
  //         }
  //       }
  //     };

  //     // Attach event listeners for text and selection changes
  //     quill.on('text-change', applyFormatting);
  //     quill.on('selection-change', applyFormatting);

  //     // Cleanup event listeners on component unmount
  //     return () => {
  //       quill.off('text-change', applyFormatting);
  //       quill.off('selection-change', applyFormatting);
  //     };
  //   }
  // }, [bgColor, fontColor]); 

  useEffect(() => {
    const quill = editorContainerRef.current.getEditor();
    if (quill) {
      const handleTextChange = () => {
        const range = quill.getSelection(); 
        if (!selection) {
          quill.format("background", bgColor);
          quill.format("color", fontColor);
        } else {
          const { index, length } = range;

          quill.formatText(index, length, { background: bgColor, color: fontColor });
          setSelection(null)
        }
      };
  
      handleTextChange(); 

      quill.on("text-change", handleTextChange); 
  
      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [bgColor, fontColor]);
  


  useEffect(() => {
    if (addReply.open && addReply.id !== null) {
      // Example: Auto-focus the textarea when it opens

      // Example: Scroll to the opened reply section (if needed)
      const replyElement = document.getElementById(`reply-${addReply.id}`);
      if (replyElement) {
        replyElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [addReply]);

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            height: "50vh",
          }}
        >
          {" "}
          {/* <ProgressCircularCustomization /> */}
        </Box>
      )}
      <div
        style={{
          width: "100%",
          // height: "100vh",
          opacity: isLoading ? "0%" : "100%",
        }}
      >
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
            <input
              ref={inputRef}
              type="text"
              value={documentName}
              onChange={(e) => setDucomentName(e.target.value)}
              placeholder="Untitled Document"
              className="input-placeholder-color"
              style={{
                minWidth: "150px",
                fontSize: "1.3rem",
                color: "#155BE5",
                borderBottom: "1px solid #174B8B",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderBottom = "1px solid #174B8B"; // Darken border on focus
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = "1px solid #174B8B"; // Revert to normal on blur
              }}
            />

            <div
              className="px-1 border- flex justify-center items-end space-x-1.5 cursor-pointer mx-2 mt-1"
              style={{
                border: "1px solid #174B8B",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
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

              <span className="text-[#155be5] text-[15px] leading-[28px] ">
                Manage Folder
              </span>
            </div>
          </Box>
          {IsTemplate ? (
            <ListItemButton
              sx={{
                mt: 1,
                pl: 2, // Adjust padding left value as needed
                fontSize: "10px",
              }}
            >
              <div
                style={{
                  height: "10px",
                  width: "10px",
                  backgroundColor: "#FFAA04",
                  borderRadius: "50%",
                  marginRight: "10px",
                  alignSelf: "center",
                }}
              />
              <ListItemText
                sx={{
                  fontSize: "10px",
                  color: "#1976d2",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "16px",
                  color: "#155be5",
                }}
                primary="Template"
              />
            </ListItemButton>
          ) : (
            (showBlock === "" || showBlock === "pdf") && (
              <>
                <div style={{ marginTop: "12px" }}>
                  <Breadcrumb recipients={recipients} />
                </div>
              </>
            )
          )}
        </div>

        <div
          className="w-full flex justify-between"
          style={{
            borderTop:
              showBlock == "uploadTrack" ? "1px solid #174B8B" : "none",
            background: "#fefefe",
          }}
        >
          <div className="flex items-center gap-x-8 min-w-[500px] pb-0 my-2 pl-4">
            {showBlock == "uploadTrack" && (
              <Typography
                variant="body2"
                component="span"
                style={{
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
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
                <div className="relative  ">
                  <button
                    className={`text-black text-[14px]   rounded focus:outline-none flex whitespace-nowrap  ${showBlock == "uploadTrack"
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
                          // saveDocumentToState();
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
                          // saveDocumentToState();
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
                        className="px-2 py-2 hover:bg-gray-200 cursor-pointer  pt-2 border-b border-[#174B8B]  flex items-center gap-x-2"
                        onClick={() => {
                          triggerClick("container_toolbar_open");
                          toggleDropdown("signature");
                        }}
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.2547 1.19687L14.0629 1H14.3474L21.1538 7.98557V8.27758L21.0239 8.14424L14.2547 1.19687ZM12.5385 1V1.89474V8.8421V9.8421H13.5385H20.3077H21.1538V11.7682C20.6813 11.68 20.1934 11.6316 19.6923 11.6316C15.0419 11.6316 11.3077 15.5018 11.3077 20.2105C11.3077 20.7339 11.357 21.2435 11.4468 21.7368H2.46154C1.68109 21.7368 1 21.0817 1 20.2105V2.52632C1 1.65185 1.672 1 2.46154 1H12.5385ZM16.1969 20.1782L17.4376 21.4515L18.1538 22.1866L18.8701 21.4515L22.4994 17.7268L22.6667 17.9355L18.1856 22.5344L16.1365 20.2402L16.1969 20.1782Z"
                            stroke="#174B8B"
                            stroke-width="2"
                          />
                        </svg>
                        Clauses
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
                <span className="text-[14px] font-regular flex whitespace-nowrap ">
                  Approvals:{" "}
                  {
                    approvers.filter((recipient: any) => recipient.signature)
                      .length
                  }
                  /{approvers.length}
                  <span
                    style={{ color: !approvers.length ? "#92929D" : "blue" }}
                    className="ml-1 text-[12px] font-regular mt-0.5 cursor-pointer"
                    onClick={() => {
                      setSelectedModule("approval"), setSidebarExpanded(true);
                    }}
                  >
                    Manage{" "}
                  </span>{" "}
                </span>

                <span className="text-[14px] font-regular flex whitespace-nowrap">
                  Signers:{" "}
                  {
                    recipients.filter((recipient: any) => recipient.signature)
                      .length
                  }
                  /{recipients.length}
                  <span
                    style={{ color: !recipients?.length ? "#92929D" : "blue" }}
                    className="ml-1 text-[12px] font-regular mt-0.5  cursor-pointer"
                    onClick={() => {
                      setSelectedModule("signature"), setSidebarExpanded(true);
                    }}
                  >
                    Manage{" "}
                  </span>{" "}
                </span>

                <span className="text-[14px] font-regular flex whitespace-nowrap">
                  Collaborators:{" "}
                  {collaborater?.filter((dt: any) => dt.permission).length}/
                  {collaborater?.length}
                  <span
                    style={{
                      color: !collaborater?.length ? "#92929D" : "blue",
                    }}
                    className="ml-1  text-[12px] font-regular mt-0.5 cursor-pointer "
                    onClick={() => {
                      setSelectedModule("share");
                      setSidebarExpanded(true);
                    }}
                  >
                    Manage{" "}
                  </span>{" "}
                </span>

                <span className="text-[14px] font-regular flex whitespace-nowrap">
                  Fields: 0/0{" "}
                  <span
                    style={{
                      color: !recipients?.length ? "#92929D" : "#92929D",
                    }}
                    className="ml-1  text-[12px] font-regular  mt-0.5 cursor-pointer"
                    onClick={() => {
                      setSelectedModule("fields"), setSidebarExpanded(true);
                    }}
                  >
                    Manage{" "}
                  </span>{" "}
                </span>
              </>
            )}
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
                    handleClickCencel();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  sx={{ ml: 2, textTransform: "none" }}
                  onClick={() => {
                    handleSubmit();
                    if (showBlock !== "uploadTrack") {
                      handleClickCencel();
                    }
                  }}
                  variant="outlined"
                  color="success"
                >
                  save
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

        {/* <div id="xyz">show </div> */}
        {showBlock == "uploadTrack" && uplodTrackFile && (
          <div>
            <PDFUploaderViewer documentPath={uplodTrackFile} />
            {
              // uplodTrackFile && uplodTrackFile.type === "application/pdf" && (
              // <div className="  w-full h-[75vh] bg-white overflow-auto  px-4 py-3">
              //   <div className="max-w-[930px] w-full mx-auto">
              //     <Worker workerUrl={workerUrl}>
              //       <Viewer fileUrl={URL.createObjectURL(uplodTrackFile)} />
              //     </Worker>
              //   </div>
              // </div>
              // )
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
              borderTop: "1px solid #174b8b",
              height: "100%",
              // overflow: "auto",
            }}
          >
            {/* <DocumentEditorContainerComponent
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
            /> */}
            <div
              style={{
                backgroundColor: "#fefefe",
              }}
            >
              <QuillToolbar />
            </div>

            <div
              style={{
                height: "75vh",
                overflowX: "auto",
              }}
              onClick={() => {
                setAddReply({
                  open: false,
                  id: "",
                });
                SetOpenComment(false);
                if (editorContainerRef && selectionRef.current) {
                  const editor = editorContainerRef.current.getEditor();
                  const { index, length } = selectionRef.current;
                  const formats = editor.getFormat(index, length);

                  const isOverlap = comments.some(
                    (comment: any) =>
                      comment.range.index < index + length &&
                      comment.range.index + comment.range.length > index
                  );

                  if (!isOverlap) {
                    // editor.formatText(index, length, { background: "#fefefe" });
                  }
                }
              }}
            >
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                style={{
                  height: "100%",
                  padding: "20px 20px",
                  overflowX: "auto",
                }}
              >
                <Grid
                  item
                  style={{
                    height: "100%",
                    position: "relative",
                    width:documentPageSize?.title === "Landscape"? "100%":""
                  }}
                >
                  <ReactQuill
                    ref={editorContainerRef}
                    modules={modules}
                    formats={formats}
                    value={editorHtml}
                    onChange={handleChange}
                    onBlur={()=>{
                      const handleBlur = () => {
                        const quill = editorContainerRef.current?.getEditor();
                        if (quill) {
                          const range = quill.getSelection();
                          if (range) {
                            setCursorPosition(range.index); // Store the current cursor position
                          }
                        }
                      };
                      handleBlur()
                    }}
                    // @ts-ignore
                    onChangeSelection={handleChangeSelection}
                    style={{
                      border: "1px solid #f2f2f2",
                      borderRadius: "5px",
                      background: "#fefefe",
                      width: documentPageSize.width,
                      height: documentPageSize.height,
                    }}
                    onFocus={() => {
                      handleFocus()
                      // setAddReply({ open: false, id: "" });
                    }}
                  />
                  <style>
                    {`
                      .ql-container.ql-snow {
                         min-height: 375px;
                         padding-top: ${documentPageMargins.top} !important;
                         padding-bottom: ${documentPageMargins.bottom} !important;
                         padding-left: ${documentPageMargins.left} !important;
                         padding-right: ${documentPageMargins.right} !important;
                      } 
                      `}
                  </style>
                  {selection && (
                    <Tooltip title="Add Commment">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (editorContainerRef) {
                            const editor =
                              editorContainerRef.current.getEditor();
                            const range = editor.getSelection();
                            editor.formatText(range.index, range.length, {
                              background: "#c8c8c8",
                            });
                          }
                          SetOpenComment(true);
                        }}
                        style={{
                          position: "absolute",
                          top: `${buttonPosition.top}px`,
                          left: `49rem`,
                          padding: "8px 12px",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <svg
                          width="30px"
                          height="30px"
                          viewBox="0 0 1024 1024"
                          className="icon"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z"
                            fill="#4CAF50"
                          />
                          <path
                            d="M448 298.666667h128v426.666666h-128z"
                            fill="#FFFFFF"
                          />
                          <path
                            d="M298.666667 448h426.666666v128H298.666667z"
                            fill="#FFFFFF"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  )}
                  {openComment === true && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: "white",
                        width: 250,
                        position: "absolute",
                        top: `${buttonPosition.top}px`,
                        left: "51rem",
                        border: "1px solid #fefefe",
                        boxShadow: "rgba(60,64,67,.15) 0 1px 3px 1px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          padding: 10,
                          alignItems: "center",
                        }}
                      >
                        <div
                          className="icon mx-2"
                          style={{
                            height: 25,
                            width: 25,
                            borderRadius: "50%",
                            background: "#b5082e",
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                          }}
                        >
                          {user?.firstName
                            ? user.firstName
                              .split(" ")
                              .map((name: string) => name.charAt(0))
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()
                            : user?.email
                              ?.split(" ")
                              .map((e: string) => e.charAt(0))
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                        </div>
                        <div style={{ padding: 0 }}>
                          <b
                            style={{
                              fontSize: user?.firstName
                                ? 14
                                : user?.email
                                  ? 11
                                  : "",
                            }}
                          >
                            {user?.firstName || user?.email}
                          </b>
                          <div style={{ fontSize: 13, margin: 0 - 2 }}>
                            {isInternal ? (
                              <span style={{ display: "flex" }}>
                                <svg
                                  width="18px"
                                  height="18px"
                                  viewBox="0 0 512 512"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g
                                    id="Page-1"
                                    stroke="none"
                                    stroke-width="1"
                                    fill="none"
                                    fill-rule="evenodd"
                                  >
                                    <g
                                      id="icon"
                                      fill="#000000"
                                      transform="translate(42.666667, 64.000000)"
                                    >
                                      <path
                                        d="M234.666667,1.42108547e-14 L234.666667,341.333333 L362.666667,341.333333 L362.666667,128 L277.333333,128 L277.333333,85.3333333 L405.333333,85.3333333 L405.333,341.333 L426.666667,341.333333 L426.666667,384 L234.666667,384 L234.666667,384 L21.3333333,384 L21.333,383.999 L3.55271368e-14,384 L3.55271368e-14,341.333333 L21.333,341.333 L21.3333333,1.42108547e-14 L234.666667,1.42108547e-14 Z M192,42.6666667 L64,42.6666667 L64,341.333333 L106.666667,341.333333 L106.666667,277.333333 L149.333333,277.333333 L149.333333,341.333333 L192,341.333333 L192,42.6666667 Z M320,256 L320,298.666667 L277.333333,298.666667 L277.333333,256 L320,256 Z M149.333333,170.666667 L149.333333,213.333333 L106.666667,213.333333 L106.666667,170.666667 L149.333333,170.666667 Z M320,170.666667 L320,213.333333 L277.333333,213.333333 L277.333333,170.666667 L320,170.666667 Z M149.333333,85.3333333 L149.333333,128 L106.666667,128 L106.666667,85.3333333 L149.333333,85.3333333 Z"
                                        id="Combined-Shape"
                                      ></path>
                                    </g>
                                  </g>
                                </svg>{" "}
                                Internal
                              </span>
                            ) : (
                              <span style={{ display: "flex" }}>
                                <svg
                                  fill="#000000"
                                  width="18px"
                                  height="18px"
                                  viewBox="0 -8 72 72"
                                  id="Layer_1"
                                  data-name="Layer 1"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <title>world</title>
                                  <path d="M59.25,12.42l-.83.27L54,13.08l-1.27,2-.91-.29L48.23,11.6l-.52-1.66L47,8.16l-2.23-2-2.63-.51-.06,1.2,2.58,2.52,1.26,1.48-1.42.75-1.15-.34-1.73-.73,0-1.39L39.42,8.2l-.75,3.29L36.38,12l.23,1.84,3,.57.52-2.93,2.46.37,1.14.67h1.84L46.8,15l3.34,3.38-.25,1.32-2.69-.34-4.64,2.34-3.34,4-.43,1.78H37.58l-2.23-1-2.17,1,.54,2.29.94-1.09,1.67,0-.12,2,1.38.4L39,32.67,41.2,32l2.57.4,3,.8,1.48.18,2.52,2.86,4.87,2.86-3.15,6-3.32,1.54-1.26,3.44-4.81,3.21-.51,1.85A28,28,0,0,0,59.25,12.42Z" />
                                  <path d="M39.22,42.63l-2-3.78L39.05,35l-1.87-.56-2.1-2.11-4.66-1L28.88,28v1.92H28.2l-4-5.44V20l-2.94-4.78-4.67.83H13.43l-1.59-1,2-1.6-2,.46A28,28,0,0,0,36,56a29,29,0,0,0,3.51-.25l-.29-3.39s1.29-5,1.29-5.2S39.22,42.63,39.22,42.63Z" />
                                  <path d="M18.41,9l5-.7,2.29-1.25,2.58.74,4.12-.23,1.42-2.22,2.05.34,5-.47,1.38-1.52,2-1.29,2.74.41,1-.15a27.91,27.91,0,0,0-33.51,7.49h0ZM37.18,2.78,40,1.21l1.84,1.06-2.66,2-2.54.26-1.14-.74ZM28.71,3,30,3.54,31.63,3l.9,1.56-3.82,1L26.88,4.5S28.67,3.35,28.71,3Z" />
                                </svg>{" "}
                                Public
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <textarea
                          name="comment"
                          placeholder="Enter Comment"
                          rows={1}
                          ref={commentInputRef}
                          value={currentComment}
                          onChange={(e) => setCurrentComment(e.target.value)}
                          style={{
                            borderBottom: isFocusedInput
                              ? "1px solid #5280ff"
                              : "1px solid #c8c8c8",
                            background: "#f4f4f4",
                            width: "90%",
                            outline: "none",
                          }}
                          onFocus={() => {
                            setIsFocusedInput(true);
                          }}
                          onBlur={() => setIsFocusedInput(false)}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          padding: 10,
                        }}
                      >
                        <Tooltip title="Visible by everyone including external users">
                          <div
                            style={{
                              display: "flex",
                              marginLeft: 3,
                              background: isPublic ? "#e4ebff" : "",
                              alignItems: "center",
                              padding: 2,
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setIsPublic(true);
                              setIsInternal(false);
                            }}
                          >
                            <span>
                              <svg
                                fill="#000000"
                                width="18px"
                                height="18px"
                                viewBox="0 -8 72 72"
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <title>world</title>
                                <path d="M59.25,12.42l-.83.27L54,13.08l-1.27,2-.91-.29L48.23,11.6l-.52-1.66L47,8.16l-2.23-2-2.63-.51-.06,1.2,2.58,2.52,1.26,1.48-1.42.75-1.15-.34-1.73-.73,0-1.39L39.42,8.2l-.75,3.29L36.38,12l.23,1.84,3,.57.52-2.93,2.46.37,1.14.67h1.84L46.8,15l3.34,3.38-.25,1.32-2.69-.34-4.64,2.34-3.34,4-.43,1.78H37.58l-2.23-1-2.17,1,.54,2.29.94-1.09,1.67,0-.12,2,1.38.4L39,32.67,41.2,32l2.57.4,3,.8,1.48.18,2.52,2.86,4.87,2.86-3.15,6-3.32,1.54-1.26,3.44-4.81,3.21-.51,1.85A28,28,0,0,0,59.25,12.42Z" />
                                <path d="M39.22,42.63l-2-3.78L39.05,35l-1.87-.56-2.1-2.11-4.66-1L28.88,28v1.92H28.2l-4-5.44V20l-2.94-4.78-4.67.83H13.43l-1.59-1,2-1.6-2,.46A28,28,0,0,0,36,56a29,29,0,0,0,3.51-.25l-.29-3.39s1.29-5,1.29-5.2S39.22,42.63,39.22,42.63Z" />
                                <path d="M18.41,9l5-.7,2.29-1.25,2.58.74,4.12-.23,1.42-2.22,2.05.34,5-.47,1.38-1.52,2-1.29,2.74.41,1-.15a27.91,27.91,0,0,0-33.51,7.49h0ZM37.18,2.78,40,1.21l1.84,1.06-2.66,2-2.54.26-1.14-.74ZM28.71,3,30,3.54,31.63,3l.9,1.56-3.82,1L26.88,4.5S28.67,3.35,28.71,3Z" />
                              </svg>
                            </span>
                            <span style={{ fontSize: 14 }}>Public</span>
                          </div>
                        </Tooltip>
                        <Tooltip title="Only visible by you and your company's users">
                          <div
                            style={{
                              display: "flex",
                              marginLeft: 6,
                              background: isInternal ? "#e4ebff" : "",
                              alignItems: "center",
                              padding: 2,
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setIsPublic(false);
                              setIsInternal(true);
                            }}
                          >
                            <span>
                              <svg
                                width="18px"
                                height="18px"
                                viewBox="0 0 512 512"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g
                                  id="Page-1"
                                  stroke="none"
                                  stroke-width="1"
                                  fill="none"
                                  fill-rule="evenodd"
                                >
                                  <g
                                    id="icon"
                                    fill="#000000"
                                    transform="translate(42.666667, 64.000000)"
                                  >
                                    <path
                                      d="M234.666667,1.42108547e-14 L234.666667,341.333333 L362.666667,341.333333 L362.666667,128 L277.333333,128 L277.333333,85.3333333 L405.333333,85.3333333 L405.333,341.333 L426.666667,341.333333 L426.666667,384 L234.666667,384 L234.666667,384 L21.3333333,384 L21.333,383.999 L3.55271368e-14,384 L3.55271368e-14,341.333333 L21.333,341.333 L21.3333333,1.42108547e-14 L234.666667,1.42108547e-14 Z M192,42.6666667 L64,42.6666667 L64,341.333333 L106.666667,341.333333 L106.666667,277.333333 L149.333333,277.333333 L149.333333,341.333333 L192,341.333333 L192,42.6666667 Z M320,256 L320,298.666667 L277.333333,298.666667 L277.333333,256 L320,256 Z M149.333333,170.666667 L149.333333,213.333333 L106.666667,213.333333 L106.666667,170.666667 L149.333333,170.666667 Z M320,170.666667 L320,213.333333 L277.333333,213.333333 L277.333333,170.666667 L320,170.666667 Z M149.333333,85.3333333 L149.333333,128 L106.666667,128 L106.666667,85.3333333 L149.333333,85.3333333 Z"
                                      id="Combined-Shape"
                                    ></path>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span style={{ fontSize: 14 }}>Internal</span>
                          </div>
                        </Tooltip>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            width: "100%",
                          }}
                        >
                          <button
                            style={{
                              backgroundColor:
                                currentComment.trim().length === 0
                                  ? "#a3b9ff"
                                  : "#5280ff",
                              border: "1px solid #5280ff",
                              color: "white",
                              borderRadius: 4,
                              padding: 1,
                              fontSize: 13,
                            }}
                            disabled={
                              currentComment.trim().length === 0 ? true : false
                            }
                            onClick={addComment}
                          >
                            <b>Comment</b>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    {comments?.map((e: any, indexComment: number) => {
                      const isInternal = e.access === "Internal";
                      if (isInternal && recipients.length === 0) {
                        return null;
                      }
                      return (
                        <div
                          key={indexComment}
                          className="comment-container"
                          style={{
                            background: "#fffceb",
                            width: 300,
                            position: "absolute",
                            top:
                              openComment && e?.replies?.length > 0
                                ? "-18rem"
                                : openComment
                                  ? "-51px"
                                  : `${e.style.top}px`,
                            left: `52rem`,
                            border: "1px solid #fefefe",
                            boxShadow: "rgba(60,64,67,.15) 0 1px 3px 1px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              padding: 10,
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="d-flex">
                              <div
                                className="icon mx-2"
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: "50%",
                                  background: "#b5082e",
                                  textAlign: "center",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  color: "white",
                                }}
                              >
                                {e.user
                                  ?.split(" ")
                                  .map((e: any) => e.charAt(0))
                                  .join("")
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div style={{ padding: 0 }}>
                                <b
                                  style={{
                                    fontSize: e.user?.includes("@") ? 10 : 14,
                                  }}
                                >
                                  {e.user}
                                </b>
                                <div
                                  style={{
                                    fontSize: 14,
                                    display: "flex",
                                    margin: 0 - 3,
                                  }}
                                  className="py-1"
                                >
                                  {e.access === "Internal" ? (
                                    <span style={{ display: "flex" }}>
                                      <svg
                                        width="18px"
                                        height="18px"
                                        viewBox="0 0 512 512"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g
                                          id="Page-1"
                                          stroke="none"
                                          stroke-width="1"
                                          fill="none"
                                          fill-rule="evenodd"
                                        >
                                          <g
                                            id="icon"
                                            fill="#000000"
                                            transform="translate(42.666667, 64.000000)"
                                          >
                                            <path
                                              d="M234.666667,1.42108547e-14 L234.666667,341.333333 L362.666667,341.333333 L362.666667,128 L277.333333,128 L277.333333,85.3333333 L405.333333,85.3333333 L405.333,341.333 L426.666667,341.333333 L426.666667,384 L234.666667,384 L234.666667,384 L21.3333333,384 L21.333,383.999 L3.55271368e-14,384 L3.55271368e-14,341.333333 L21.333,341.333 L21.3333333,1.42108547e-14 L234.666667,1.42108547e-14 Z M192,42.6666667 L64,42.6666667 L64,341.333333 L106.666667,341.333333 L106.666667,277.333333 L149.333333,277.333333 L149.333333,341.333333 L192,341.333333 L192,42.6666667 Z M320,256 L320,298.666667 L277.333333,298.666667 L277.333333,256 L320,256 Z M149.333333,170.666667 L149.333333,213.333333 L106.666667,213.333333 L106.666667,170.666667 L149.333333,170.666667 Z M320,170.666667 L320,213.333333 L277.333333,213.333333 L277.333333,170.666667 L320,170.666667 Z M149.333333,85.3333333 L149.333333,128 L106.666667,128 L106.666667,85.3333333 L149.333333,85.3333333 Z"
                                              id="Combined-Shape"
                                            ></path>
                                          </g>
                                        </g>
                                      </svg>{" "}
                                      Internal
                                    </span>
                                  ) : (
                                    <span style={{ display: "flex" }}>
                                      <svg
                                        fill="#000000"
                                        width="18px"
                                        height="18px"
                                        viewBox="0 -8 72 72"
                                        id="Layer_1"
                                        data-name="Layer 1"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <title>world</title>
                                        <path d="M59.25,12.42l-.83.27L54,13.08l-1.27,2-.91-.29L48.23,11.6l-.52-1.66L47,8.16l-2.23-2-2.63-.51-.06,1.2,2.58,2.52,1.26,1.48-1.42.75-1.15-.34-1.73-.73,0-1.39L39.42,8.2l-.75,3.29L36.38,12l.23,1.84,3,.57.52-2.93,2.46.37,1.14.67h1.84L46.8,15l3.34,3.38-.25,1.32-2.69-.34-4.64,2.34-3.34,4-.43,1.78H37.58l-2.23-1-2.17,1,.54,2.29.94-1.09,1.67,0-.12,2,1.38.4L39,32.67,41.2,32l2.57.4,3,.8,1.48.18,2.52,2.86,4.87,2.86-3.15,6-3.32,1.54-1.26,3.44-4.81,3.21-.51,1.85A28,28,0,0,0,59.25,12.42Z" />
                                        <path d="M39.22,42.63l-2-3.78L39.05,35l-1.87-.56-2.1-2.11-4.66-1L28.88,28v1.92H28.2l-4-5.44V20l-2.94-4.78-4.67.83H13.43l-1.59-1,2-1.6-2,.46A28,28,0,0,0,36,56a29,29,0,0,0,3.51-.25l-.29-3.39s1.29-5,1.29-5.2S39.22,42.63,39.22,42.63Z" />
                                        <path d="M18.41,9l5-.7,2.29-1.25,2.58.74,4.12-.23,1.42-2.22,2.05.34,5-.47,1.38-1.52,2-1.29,2.74.41,1-.15a27.91,27.91,0,0,0-33.51,7.49h0ZM37.18,2.78,40,1.21l1.84,1.06-2.66,2-2.54.26-1.14-.74ZM28.71,3,30,3.54,31.63,3l.9,1.56-3.82,1L26.88,4.5S28.67,3.35,28.71,3Z" />
                                      </svg>{" "}
                                      Public
                                    </span>
                                  )}
                                  <span style={{ marginLeft: 10 }}>
                                    {new Date(e.date).toDateString() ===
                                      new Date().toDateString()
                                      ? new Date(e.date).getTime() ===
                                        new Date().getTime()
                                        ? "Just now"
                                        : `Today ${new Date(
                                          e.date
                                        ).toLocaleTimeString()}`
                                      : `${new Date(
                                        e.date
                                      ).toDateString()} ${new Date(
                                        e.date
                                      ).toLocaleTimeString()}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex align-self-start">
                              <div
                                style={{ marginLeft: 3, alignSelf: "start" }}
                                onClick={() => {
                                  setEditComment(true);
                                  setEditCommmentIndex(indexComment);
                                  setCurrentComment(e.text);
                                }}
                              >
                                <svg
                                  width="18px"
                                  height="18px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g id="SVGRepo_bgCarrier" stroke-width="0" />
                                  <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <g id="SVGRepo_iconCarrier">
                                    {" "}
                                    <path
                                      fill-rule="evenodd"
                                      clip-rule="evenodd"
                                      d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
                                      fill="#505050"
                                    />{" "}
                                  </g>
                                </svg>
                              </div>
                              <div
                                onClick={() => {
                                  setComments((prevComment: any) =>
                                    prevComment.filter(
                                      (_: any, i: number) => i !== indexComment
                                    )
                                  );
                                  if (
                                    comments.length > 1 &&
                                    editorContainerRef
                                  ) {
                                    const editor =
                                      editorContainerRef.current.getEditor();
                                    editor.formatText(
                                      e.range.index,
                                      e.range.length,
                                      { background: "#fefefe" }
                                    );
                                  } else if (comments.length === 1) {
                                    const editor =
                                      editorContainerRef.current.getEditor();
                                    editor.formatText(0, editor.getLength(), {
                                      background: "#fefefe",
                                    });
                                  }
                                }}
                              >
                                <svg
                                  width="20px"
                                  height="20px"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="#000000"
                                >
                                  <g id="SVGRepo_bgCarrier" stroke-width="0" />

                                  <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />

                                  <g id="SVGRepo_iconCarrier">
                                    {" "}
                                    <title />{" "}
                                    <g id="Complete">
                                      {" "}
                                      <g id="tick">
                                        {" "}
                                        <polyline
                                          fill="none"
                                          points="3.7 14.3 9.6 19 20.3 5"
                                          stroke="#505050"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                        />{" "}
                                      </g>{" "}
                                    </g>{" "}
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {editComment && editCommentIndex === indexComment ? (
                            <>
                              <div style={{ textAlign: "center" }}>
                                <textarea
                                  name="comment"
                                  placeholder="Enter Comment"
                                  rows={1}
                                  value={currentComment}
                                  onChange={(e) =>
                                    setCurrentComment(e.target.value)
                                  }
                                  style={{
                                    borderBottom: isFocusedInput
                                      ? "1px solid #5280ff"
                                      : "1px solid #c8c8c8",
                                    background: "#f4f4f4",
                                    width: "90%",
                                    outline: "none",
                                  }}
                                  onFocus={() => setIsFocusedInput(true)}
                                  onBlur={() => setIsFocusedInput(false)}
                                />
                              </div>
                              <div style={{ display: "flex", padding: 10 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "end",
                                    width: "100%",
                                  }}
                                >
                                  <button
                                    style={{
                                      backgroundColor: "#5280ff",
                                      border: "1px solid #5280ff",
                                      color: "white",
                                      borderRadius: 4,
                                      padding: 1,
                                      fontSize: 13,
                                    }}
                                    onClick={addComment}
                                  >
                                    <b>Update</b>
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div
                              style={{ padding: "0 20px", paddingBottom: 10 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddReply({ open: true, id: indexComment });
                              }}
                            >
                              <p
                                style={{
                                  wordBreak: "break-word",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {e.text}
                              </p>
                            </div>
                          )}

                          {e?.replies &&
                            e?.replies?.map((reply: any, index: any) => {
                              return (
                                <div
                                  className="reply-container"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    borderTop: "1px solid #deddd7",
                                    position: "relative",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      padding: 10,
                                      alignItems: "center",
                                    }}
                                  >
                                    <div
                                      className="icon mx-2"
                                      style={{
                                        height: 30,
                                        width: 30,
                                        borderRadius: "50%",
                                        background: "#b5082e",
                                        textAlign: "center",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "white",
                                      }}
                                    >
                                      {reply.user
                                        ?.split(" ")
                                        .map((e: any) => e.charAt(0))
                                        .join("")
                                        .substring(0, 2)
                                        .toUpperCase()}
                                    </div>
                                    <div style={{ padding: 0 }}>
                                      <b
                                        style={{
                                          fontSize: reply.user.includes("@")
                                            ? 11
                                            : 14,
                                        }}
                                      >
                                        {reply.user}
                                      </b>
                                      <div
                                        className="py-1"
                                        style={{
                                          fontSize: 14,
                                          display: "flex",
                                          margin: 0 - 3,
                                        }}
                                      >
                                        {e.access === "Internal" ? (
                                          <span style={{ display: "flex" }}>
                                            <svg
                                              width="18px"
                                              height="18px"
                                              viewBox="0 0 512 512"
                                              version="1.1"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <g
                                                id="Page-1"
                                                stroke="none"
                                                stroke-width="1"
                                                fill="none"
                                                fill-rule="evenodd"
                                              >
                                                <g
                                                  id="icon"
                                                  fill="#000000"
                                                  transform="translate(42.666667, 64.000000)"
                                                >
                                                  <path
                                                    d="M234.666667,1.42108547e-14 L234.666667,341.333333 L362.666667,341.333333 L362.666667,128 L277.333333,128 L277.333333,85.3333333 L405.333333,85.3333333 L405.333,341.333 L426.666667,341.333333 L426.666667,384 L234.666667,384 L234.666667,384 L21.3333333,384 L21.333,383.999 L3.55271368e-14,384 L3.55271368e-14,341.333333 L21.333,341.333 L21.3333333,1.42108547e-14 L234.666667,1.42108547e-14 Z M192,42.6666667 L64,42.6666667 L64,341.333333 L106.666667,341.333333 L106.666667,277.333333 L149.333333,277.333333 L149.333333,341.333333 L192,341.333333 L192,42.6666667 Z M320,256 L320,298.666667 L277.333333,298.666667 L277.333333,256 L320,256 Z M149.333333,170.666667 L149.333333,213.333333 L106.666667,213.333333 L106.666667,170.666667 L149.333333,170.666667 Z M320,170.666667 L320,213.333333 L277.333333,213.333333 L277.333333,170.666667 L320,170.666667 Z M149.333333,85.3333333 L149.333333,128 L106.666667,128 L106.666667,85.3333333 L149.333333,85.3333333 Z"
                                                    id="Combined-Shape"
                                                  ></path>
                                                </g>
                                              </g>
                                            </svg>{" "}
                                            Internal
                                          </span>
                                        ) : (
                                          <span style={{ display: "flex" }}>
                                            <svg
                                              fill="#000000"
                                              width="18px"
                                              height="18px"
                                              viewBox="0 -8 72 72"
                                              id="Layer_1"
                                              data-name="Layer 1"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <title>world</title>
                                              <path d="M59.25,12.42l-.83.27L54,13.08l-1.27,2-.91-.29L48.23,11.6l-.52-1.66L47,8.16l-2.23-2-2.63-.51-.06,1.2,2.58,2.52,1.26,1.48-1.42.75-1.15-.34-1.73-.73,0-1.39L39.42,8.2l-.75,3.29L36.38,12l.23,1.84,3,.57.52-2.93,2.46.37,1.14.67h1.84L46.8,15l3.34,3.38-.25,1.32-2.69-.34-4.64,2.34-3.34,4-.43,1.78H37.58l-2.23-1-2.17,1,.54,2.29.94-1.09,1.67,0-.12,2,1.38.4L39,32.67,41.2,32l2.57.4,3,.8,1.48.18,2.52,2.86,4.87,2.86-3.15,6-3.32,1.54-1.26,3.44-4.81,3.21-.51,1.85A28,28,0,0,0,59.25,12.42Z" />
                                              <path d="M39.22,42.63l-2-3.78L39.05,35l-1.87-.56-2.1-2.11-4.66-1L28.88,28v1.92H28.2l-4-5.44V20l-2.94-4.78-4.67.83H13.43l-1.59-1,2-1.6-2,.46A28,28,0,0,0,36,56a29,29,0,0,0,3.51-.25l-.29-3.39s1.29-5,1.29-5.2S39.22,42.63,39.22,42.63Z" />
                                              <path d="M18.41,9l5-.7,2.29-1.25,2.58.74,4.12-.23,1.42-2.22,2.05.34,5-.47,1.38-1.52,2-1.29,2.74.41,1-.15a27.91,27.91,0,0,0-33.51,7.49h0ZM37.18,2.78,40,1.21l1.84,1.06-2.66,2-2.54.26-1.14-.74ZM28.71,3,30,3.54,31.63,3l.9,1.56-3.82,1L26.88,4.5S28.67,3.35,28.71,3Z" />
                                            </svg>{" "}
                                            Public
                                          </span>
                                        )}
                                        <span style={{ marginLeft: 10 }}>
                                          {new Date(
                                            reply.date
                                          ).toDateString() ===
                                            new Date().toDateString()
                                            ? new Date(reply.date).getTime() ===
                                              new Date().getTime()
                                              ? "Just now"
                                              : `Today ${new Date(
                                                reply.date
                                              ).toLocaleTimeString()}`
                                            : `${new Date(
                                              reply.date
                                            ).toDateString()} ${new Date(
                                              reply.date
                                            ).toLocaleTimeString()}`}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      padding: "0 20px",
                                      paddingBottom: 10,
                                    }}
                                    onClick={() => {
                                      setAddReply({
                                        open: true,
                                        id: indexComment,
                                      });
                                    }}
                                  >
                                    <p
                                      style={{
                                        wordBreak: "break-word",
                                        whiteSpace: "pre-wrap",
                                      }}
                                    >
                                      {reply?.text}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          {addReply.open && addReply.id === indexComment && (
                            <div
                              id={`reply-${indexComment}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                borderTop: "1px solid red",
                                padding: 20,
                              }}
                            >
                              <div
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                <textarea
                                  name="comment"
                                  placeholder="Reply"
                                  rows={1}
                                  value={reply}
                                  onChange={(e) => setReply(e.target.value)}
                                  style={{
                                    borderBottom: isFocusedInput
                                      ? "1px solid #5280ff"
                                      : "1px solid #c8c8c8",
                                    background: "#f4f4f4",
                                    width: "90%",
                                    outline: "none",
                                  }}
                                  onFocus={() => {
                                    setIsFocusedInput(true);
                                  }}
                                  onBlur={() => setIsFocusedInput(false)}
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "end",
                                    width: "100%",
                                    padding: 10,
                                  }}
                                >
                                  <button
                                    style={{
                                      backgroundColor:
                                        reply.trim().length === 0
                                          ? "#a3b9ff"
                                          : "#5280ff",
                                      border: "1px solid #5280ff",
                                      color: "white",
                                      borderRadius: 4,
                                      padding: 1,
                                      fontSize: 13,
                                    }}
                                    onClick={() => handleReply(indexComment)}
                                    disabled={
                                      reply.trim().length === 0 ? true : false
                                    }
                                  >
                                    <b>Comment</b>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
              
                </Grid>
                {/* <Grid item xs={3.8}>
                  <TrackChanges rejectChange={rejectChange} />
                </Grid> */}
              </Grid>
            </div>
          </div>
        )}
        <Dialog
          open={temlatePoupup}
          onClose={() => setTemlatePoupup(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiPaper-root": {
              // Targeting the Paper component inside the Dialog
              border: "1.5px dashed #174B8B", // Customizing the border to dashed
              borderRadius: "16px", // Adding border radius
            },
          }}
        >
          <DialogContent
            sx={{
              maxHeight: "30vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              lineHeight: "auto",
            }}
          >
            <svg
              width="76"
              height="80"
              viewBox="0 0 76 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M47.5 0L76 24V72C76 74.1217 74.9991 76.1566 73.2175 77.6569C71.4359 79.1571 69.0196 80 66.5 80H9.5C6.98044 80 4.56408 79.1571 2.78249 77.6569C1.00089 76.1566 0 74.1217 0 72V8C0 5.87827 1.00089 3.84344 2.78249 2.34315C4.56408 0.842854 6.98044 0 9.5 0H47.5ZM66.5 72V28H42.75V8H9.5V72H66.5ZM38 40L57 56H45.125V68H30.875V56H19L38 40Z"
                fill="#174B8B"
              />
            </svg>
            <Typography variant="subtitle2" color="black" sx={{ my: 2 }}>
              Browse to openFile
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                float: "right",
                marginTop: "8px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  mt: "4",
                  backgroundColor: "#174B8B", // Set the button color to green
                  "&:hover": {
                    backgroundColor: "#2B6EC2", // Darker green on hover
                  },
                }}
                onClick={() => {
                  triggerClick("container_toolbar_open"),
                    setTemlatePoupup(false);
                }}
              >
                Browse
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <SyncFesionFileDilog
          open={showPopup}
          onClose={() => setShowPopup(false)}
          setDocumentPath={setDocumentPath}
          documentPath={documentPath}
          triggerClick={() => triggerClick("container_toolbar_open")}
        />
      </div>
    </>
  );
}

export default SyncFesion;