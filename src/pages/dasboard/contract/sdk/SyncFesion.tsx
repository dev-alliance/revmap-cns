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

import {
  DocumentEditorComponent,
  Selection,
  Editor,
  EditorHistory,
  ContextMenu,
  TableDialog,
} from "@syncfusion/ej2-react-documenteditor";
import {
  ToolbarComponent,
  ItemDirective,
  ItemsDirective,
} from "@syncfusion/ej2-react-navigations";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { ColorPickerComponent } from "@syncfusion/ej2-react-inputs";
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

  // To change the font color of selected content
  function changeFontColor(args: any) {
    const documentEditor = editorContainerRef.current.documentEditor;
    if (documentEditor && documentEditor.selection) {
      documentEditor.selection.characterFormat.fontColor = args.currentValue.hex;
      documentEditor.focusIn();
    }
  }

  // To change the highlight color of selected content
  function changeHighlightColor(color: string) {
    const documentEditor = editorContainerRef.current.documentEditor;
    if (documentEditor && documentEditor.selection) {
      // Sets the highlight color of the selection
      // Possible color values: 'Yellow', 'Green', 'Blue', 'Red', etc., or HEX color codes
      documentEditor.selection.characterFormat.highlightColor = color;
      documentEditor.focusIn();
    }
  }
  const onToolbarClick = (args: any) => {
    const documentEditor = editorContainerRef.current.documentEditor;
    console.log('args :', args.item.id)
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
          let highlightColor: HighlightColor = documentEditor.selection.characterFormat.highlightColor;
          //Sets highlightColor formatting for selected text.
          documentEditor.selection.characterFormat.highlightColor = 'Pink';
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

      // Removed the duplicated 'Custom' case as it seems unnecessary
      default:
        console.warn("Unhandled toolbar item:", args.item.id);
      // Implement any default action or log an unhandled case
    }
  };



  // tables formatting 

  // let documenteditor: DocumentEditorComponent;
  // React.useEffect(() => {
  //   ComponentDidMount();
  // }, []);
  // function ComponentDidMount() {
  //   documenteditor.editor.insertTable(2, 2);
  // }

  function toolbarButtonClick(arg) {
    const documentEditor = editorContainerRef.current.documentEditor;
    switch (arg.item.id) {
      case 'table':
        //Insert table API to add table
        documentEditor.editor.insertTable(3, 2);
        break;
      case 'insert_above':
        //Insert the specified number of rows to the table above to the row at cursor position
        documentEditor.editor.insertRow(true, 2);
        break;
      case 'insert_below':
        //Insert the specified number of rows to the table below to the row at cursor position
        documentEditor.editor.insertRow();
        break;
      case 'insert_left':
        //Insert the specified number of columns to the table left to the column at cursor position
        documentEditor.editor.insertColumn(true, 2);
        break;
      case 'insert_right':
        //Insert the specified number of columns to the table right to the column at cursor position
        documentEditor.editor.insertColumn();
        break;
      case 'delete_table':
        //Delete the entire table
        documentEditor.editor.deleteTable();
        break;
      case 'delete_rows':
        //Delete the selected number of rows
        documentEditor.editor.deleteRow();
        break;
      case 'delete_columns':
        //Delete the selected number of columns
        documentEditor.editor.deleteColumn();
        break;
      case 'merge_cell':
        //Merge the selected cells into one (both vertically and horizontally)
        documentEditor.editor.mergeCells();
        break;
      case 'table_dialog':
        //Opens insert table dialog
        documentEditor.showDialog('Table');
        break;
    }
  }














  // const onToolbarClick = (args: any) => {
  //   const documentEditor = editorContainerRef.current.documentEditor;

  //   if (!documentEditor) {
  //     console.error('Document Editor is not initialized yet.');
  //     return;
  //   }

  //   switch (args.item.id) {
  //     case 'bold':
  //       documentEditor.editor.toggleBold();
  //       break;
  //     case 'italic':
  //       documentEditor.editor.toggleItalic();
  //       break;
  //     case 'underline':
  //       documentEditor.editor.toggleUnderline();
  //       break;
  //     // add other cases
  //     default:
  //       console.warn('Unhandled toolbar item:', args.item.id);
  //   }
  // };

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

  // paragraph

  // let documenteditor: DocumentEditorComponent;
  // React.useEffect(() => {
  //   componentDidMount()
  // }, []);
  // function componentDidMount() {
  //   documenteditor.selectionChange = () => {
  //     setTimeout(() => { onSelectionChange(); }, 20);
  //   };
  // }

  // function toolbarButtonClick(arg) {
  //   switch (arg.item.id) {
  //     case 'bold':
  //       //Toggles the bold of selected content
  //       documenteditor.editor.toggleBold();
  //       break;
  //     case 'italic':
  //       //Toggles the Italic of selected content
  //       documenteditor.editor.toggleItalic();
  //       break;
  //     case 'underline':
  //       //Toggles the underline of selected content
  //       documenteditor.editor.toggleUnderline('Single');
  //       break;
  //     case 'strikethrough':
  //       //Toggles the strikethrough of selected content
  //       documenteditor.editor.toggleStrikethrough();
  //       break;
  //     case 'subscript':
  //       //Toggles the subscript of selected content
  //       documenteditor.editor.toggleSubscript();
  //       break;
  //     case 'superscript':
  //       //Toggles the superscript of selected content
  //       documenteditor.editor.toggleSuperscript();
  //       break;
  //   }
  // }
  // //To change the font Style of selected content
  // function changeFontFamily(args): void {
  //   documenteditor.selection.characterFormat.fontFamily = args.value;
  //   documenteditor.focusIn();
  // }
  // //To Change the font Size of selected content
  // function changeFontSize(args): void {
  //   documenteditor.selection.characterFormat.fontSize = args.value;
  //   documenteditor.focusIn();
  // }
  // //To Change the font Color of selected content
  // function changeFontColor(args) {
  //   documenteditor.selection.characterFormat.fontColor = args.currentValue.hex;
  //   documenteditor.focusIn();
  // }

  // //Selection change to retrieve formatting
  // function onSelectionChange() {
  //   if (documenteditor.selection) {
  //     enableDisableFontOptions();
  //     // #endregion
  //   }
  // }
  // function enableDisableFontOptions() {
  //   var characterformat = documenteditor.selection.characterFormat;
  //   var properties = [characterformat.bold, characterformat.italic, characterformat.underline, characterformat.strikethrough];
  //   var toggleBtnId = ["bold", "italic", "underline", "strikethrough"];
  //   for (let i = 0; i < properties.length; i++) {
  //     changeActiveState(properties[i], toggleBtnId[i]);
  //   }
  // }
  // function changeActiveState(property, btnId) {
  //   let toggleBtn: HTMLElement = document.getElementById(btnId);
  //   if ((typeof (property) == 'boolean' && property == true) || (typeof (property) == 'string' && property !== 'None'))
  //     toggleBtn.classList.add("e-btn-toggle");
  //   else {
  //     if (toggleBtn.classList.contains("e-btn-toggle"))
  //       toggleBtn.classList.remove("e-btn-toggle");
  //   }
  // }
  // let fontStyle: string[] = ['Algerian', 'Arial', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Courier New', 'Georgia', 'Impact', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Symbol', 'Times New Roman', 'Verdana', 'Windings'
  // ];
  // let fontSize: string[] = ['8', '9', '10', '11', '12', '14', '16', '18',
  //   '20', '22', '24', '26', '28', '36', '48', '72', '96'];
  // function contentTemplate1() {
  //   return (<ColorPickerComponent showButtons={true} value='#000000' change={changeFontColor}></ColorPickerComponent>);
  // }
  // function contentTemplate2() {
  //   return (<ComboBoxComponent dataSource={fontStyle} change={changeFontFamily} index={2} allowCustom={true} showClearButton={false} ></ComboBoxComponent>);
  // }
  // function contentTemplate3() {
  //   return (<ComboBoxComponent dataSource={fontSize} change={changeFontSize} index={2} allowCustom={true} showClearButton={false} ></ComboBoxComponent>);
  // }

  // paragraph alignment

  // let documenteditor: DocumentEditorComponent;
  // React.useEffect(() => {
  //   componentDidMount()
  // }, []);
  // let items3: ItemModel[] = [
  //   {
  //     text: 'Single',
  //   },
  //   {
  //     text: '1.15',
  //   },
  //   {
  //     text: '1.5',
  //   },
  //   {
  //     text: 'Double',
  //   },
  // ];

  // function contentTemplate1() {
  //   return (<DropDownButtonComponent items={items3} iconCss="e-de-icon-LineSpacing" select={lineSpacingAction} ></DropDownButtonComponent>);
  // }
  // function componentDidMount(): void {
  //   documenteditor.selectionChange = () => {
  //     setTimeout(() => { onSelectionChange(); }, 20);
  //   };
  // }

  // function toolbarButtonClick(arg): void {
  //   switch (arg.item.id) {
  //     case 'AlignLeft':
  //       //Toggle the Left alignment for selected or current paragraph
  //       documenteditor.editor.toggleTextAlignment('Left');
  //       break;
  //     case 'AlignRight':
  //       //Toggle the Right alignment for selected or current paragraph
  //       documenteditor.editor.toggleTextAlignment('Right');
  //       break;
  //     case 'AlignCenter':
  //       //Toggle the Center alignment for selected or current paragraph
  //       documenteditor.editor.toggleTextAlignment('Center');
  //       break;
  //     case 'Justify':
  //       //Toggle the Justify alignment for selected or current paragraph
  //       documenteditor.editor.toggleTextAlignment('Justify');
  //       break;
  //     case 'IncreaseIndent':
  //       //Increase the left indent of selected or current paragraph
  //       documenteditor.editor.increaseIndent();
  //       break;
  //     case 'DecreaseIndent':
  //       //Decrease the left indent of selected or current paragraph
  //       documenteditor.editor.decreaseIndent();
  //       break;
  //     case 'ClearFormat':
  //       documenteditor.editor.clearFormatting();
  //       break;
  //     case 'ShowParagraphMark':
  //       //Show or hide the hidden characters like spaces, tab, paragraph marks, and breaks.
  //       documenteditor.documentEditorSettings.showHiddenMarks = !documenteditor.documentEditorSettings.showHiddenMarks;
  //       break;
  //   }
  // }
  // //Change the line spacing of selected or current paragraph
  // function lineSpacingAction(args: any) {
  //   let text: string = args.item.text;
  //   switch (text) {
  //     case 'Single':
  //       documenteditor.selection.paragraphFormat.lineSpacing = 1;
  //       break;
  //     case '1.15':
  //       documenteditor.selection.paragraphFormat.lineSpacing = 1.15;
  //       break;
  //     case '1.5':
  //       documenteditor.selection.paragraphFormat.lineSpacing = 1.5;
  //       break;
  //     case 'Double':
  //       documenteditor.selection.paragraphFormat.lineSpacing = 2;
  //       break;
  //   }
  //   setTimeout((): void => {
  //     documenteditor.focusIn();
  //   }, 30);
  // }
  // // Selection change to retrieve formatting
  // function onSelectionChange() {
  //   if (documenteditor.selection) {
  //     var paragraphFormat = documenteditor.selection.paragraphFormat;
  //     var toggleBtnId = ['AlignLeft', 'AlignCenter', 'AlignRight', 'Justify', 'ShowParagraphMark'];
  //     //Remove toggle state.
  //     for (var i = 0; i < toggleBtnId.length; i++) {
  //       let toggleBtn: HTMLElement = document.getElementById(toggleBtnId[i]);
  //       toggleBtn.classList.remove('e-btn-toggle');
  //     }
  //     //Add toggle state based on selection paragraph format.
  //     if (paragraphFormat.textAlignment === 'Left') {
  //       document.getElementById('AlignLeft').classList.add('e-btn-toggle');
  //     } else if (paragraphFormat.textAlignment === 'Right') {
  //       document.getElementById('AlignRight').classList.add('e-btn-toggle');
  //     } else if (paragraphFormat.textAlignment === 'Center') {
  //       document.getElementById('AlignCenter').classList.add('e-btn-toggle');
  //     } else {
  //       document.getElementById('Justify').classList.add('e-btn-toggle');
  //     }
  //     if (documenteditor.documentEditorSettings.showHiddenMarks) {
  //       document.getElementById('ShowParagraphMark').classList.add('e-btn-toggle');
  //     }
  //     // #endregion
  //   }
  // }

  // let documenteditor: DocumentEditorComponent;
  // React.useEffect(() => {
  //   componentDidMount();
  // }, []);
  // function componentDidMount() {
  //   documenteditor.selectionChange = () => {
  //     setTimeout(() => {
  //       onSelectionChange();
  //     }, 20);
  //   };
  // }

  // //To change the font Style of selected content
  // function changeFontFamily(args: any): void {
  //   documenteditor.selection.characterFormat.fontFamily = args.value;
  //   documenteditor.focusIn();
  // }
  // //To Change the font Size of selected content
  // function changeFontSize(args: any): void {
  //   documenteditor.selection.characterFormat.fontSize = args.value;
  //   documenteditor.focusIn();
  // }
  // //To Change the font Color of selected content
  // function changeFontColor(args: any) {
  //   documenteditor.selection.characterFormat.fontColor = args.currentValue.hex;
  //   documenteditor.focusIn();
  // }

  //Selection change to retrieve formatting
  // function onSelectionChange() {
  //   if (documenteditor.selection) {
  //     enableDisableFontOptions();
  //     // #endregion
  //   }
  // }
  // function enableDisableFontOptions() {
  //   const characterformat = documenteditor.selection.characterFormat;
  //   const properties = [
  //     characterformat.bold,
  //     characterformat.italic,
  //     characterformat.underline,
  //     characterformat.strikethrough,
  //   ];
  //   const toggleBtnId = ["bold", "italic", "underline", "strikethrough"];
  //   for (let i = 0; i < properties.length; i++) {
  //     changeActiveState(properties[i], toggleBtnId[i]);
  //   }
  // }
  // function changeActiveState(property: any, btnId: any) {
  //   const toggleBtn: any | null = document.getElementById(btnId);
  //   if (
  //     (typeof property == "boolean" && property == true) ||
  //     (typeof property == "string" && property !== "None")
  //   )
  //     toggleBtn.classList.add("e-btn-toggle");
  //   else {
  //     if (toggleBtn.classList.contains("e-btn-toggle"))
  //       toggleBtn.classList.remove("e-btn-toggle");
  //   }
  // }



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
  function contentTemplate1() {
    return (
      <ColorPickerComponent
        showButtons={true}
        value="#000000"
        change={changeFontColor}
      ></ColorPickerComponent>
    );
  }
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
  const [highlightColor, setHighlightColor] = useState('#FF5733'); // Default color
  const applyHighlightColor = () => {
    const documentEditor = editorContainerRef.current.documentEditor;
    if (documentEditor && documentEditor.selection) {
      // Apply the selected highlight color
      documentEditor.selection.characterFormat.highlightColor = highlightColor;
    }
  };

  const handleColorChange = (args) => {
    setHighlightColor(args.currentValue.hex);
    applyHighlightColor();
  };
  return (
    <div>
      {/* 
      <div>
        <ToolbarComponent id='toolbar' clicked={toolbarButtonClick}>
          <ItemsDirective>
            <ItemDirective id="bold" prefixIcon="e-de-icon-Bold" text="Bold" tooltipText="Bold" />
            <ItemDirective id="italic" prefixIcon="e-de-icon-Italic" text="Italic" tooltipText="Italic" />
            <ItemDirective id="underline" prefixIcon="e-de-icon-Underline" text="Underline" tooltipText="Underline" />
            <ItemDirective id="strikethrough" prefixIcon="e-de-icon-Strikethrough" text="Strikethrough" tooltipText="Strikethrough" />
            <ItemDirective id="subscript" prefixIcon="e-de-icon-Subscript" text="Subscript" tooltipText="Subscript" />
            <ItemDirective id="superscript" prefixIcon="e-de-icon-Superscript" text="Superscript" tooltipText="Superscript" />
            <ItemDirective type="Separator" />

            <ItemDirective template={contentTemplate1} />
            <ItemDirective type="Separator" />
             
          </ItemsDirective>
        </ToolbarComponent>

        <DocumentEditorComponent
          id="container"
          height={'330px'}
          ref={scope => {
            documenteditor = scope;
          }}
          isReadOnly={false}
          enableSelection={true}
          enableEditor={true}
          enableEditorHistory={true}
          enableContextMenu={true}
        />
      </div> */}

      {/* <div>
        <ToolbarComponent id='toolbar' clicked={toolbarButtonClick}>
          <ItemDirective id="AlignLeft" prefixIcon="e-de-ctnr-alignleft e-icons" tooltipText="Align Left" />
          <ItemDirective id="AlignCenter" prefixIcon="e-de-ctnr-aligncenter e-icons" tooltipText="Align Center" />
          <ItemDirective id="AlignRight" prefixIcon="e-de-ctnr-alignright e-icons" tooltipText="Align Right" />
          <ItemDirective id="Justify" prefixIcon="e-de-ctnr-justify e-icons" tooltipText="Justify" />
          <ItemDirective type="Separator" />
          <ItemDirective id="IncreaseIndent" prefixIcon="e-de-ctnr-increaseindent e-icons" tooltipText="Increase Indent" />
          <ItemDirective id="DecreaseIndent" prefixIcon="e-de-ctnr-decreaseindent e-icons" tooltipText="Decrease Indent" />
          <ItemDirective type="Separator" />
          <ItemDirective template={contentTemplate1} />
          <ItemDirective id="ClearFormat" prefixIcon="e-de-ctnr-clearall e-icons" tooltipText="Clear Formatting" />
          <ItemDirective type="Separator" />
          <ItemDirective id="ShowParagraphMark" prefixIcon="e-de-e-paragraph-mark e-icons" tooltipText="Show the hidden characters like spaces, tab, paragraph marks, and breaks.(Ctrl + *)" />
        </ToolbarComponent>

        <DocumentEditorComponent
          id="container"
          ref={scope => {
            documenteditor = scope;
          }}
          isReadOnly={false}
          enableSelection={true}
          enableEditor={true}
          enableEditorHistory={true}
          enableContextMenu={true}
          enableTableDialog={true}
          height={'330px'}
        />
      </div> */}

      <div>
        <ToolbarComponent id="toolbar" clicked={onToolbarClick}>
          <ItemsDirective>
            <ItemDirective id="bold" prefixIcon="e-icons e-bold" tooltipText="Bold" />
            <ItemDirective id="italic" prefixIcon="e-icons e-italic" tooltipText="Italic" />
            <ItemDirective id="underline" prefixIcon="e-icons e-underline" tooltipText="Underline" />
            <ItemDirective id="highlight" prefixIcon="e-icons e-highlight" tooltipText="Highlight" />
            <ItemDirective
              id="strikethrough"
              prefixIcon="e-de-icon-Strikethrough"
              text="Strikethrough"
              tooltipText="Strikethrough"
            />
            <ItemDirective
              id="subscript"
              prefixIcon="e-de-icon-Subscript"
              text="Subscript"
              tooltipText="Subscript"
            />
            <ItemDirective
              id="superscript"
              prefixIcon="e-de-icon-Superscript"
              text="Superscript"
              tooltipText="Superscript"
            />
            <ItemDirective type="Separator" />

            <ItemDirective template={contentTemplate1} />
            <ItemDirective type="Separator" />
            <ItemDirective template={contentTemplate2} />
            <ItemDirective template={contentTemplate3} />

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
          </ItemsDirective>
        </ToolbarComponent>

        <ColorPickerComponent value={highlightColor} change={handleColorChange} />


        <ToolbarComponent clicked={toolbarButtonClick}>
          <ItemsDirective>
            <ItemDirective id="table" prefixIcon="e-de-ctnr-table e-icons" />
            <ItemDirective type="Separator" />
            <ItemDirective id="insert_above" prefixIcon="e-de-ctnr-insertabove e-icons" />
            <ItemDirective id="insert_below" prefixIcon="e-de-ctnr-insertbelow e-icons" />
            <ItemDirective type="Separator" />
            <ItemDirective id="insert_left" prefixIcon="e-de-ctnr-insertleft e-icons" />
            <ItemDirective id="insert_right" prefixIcon="e-de-ctnr-insertright e-icons" />
            <ItemDirective type="Separator" />
            <ItemDirective id="delete_table" tooltipText="Delete" text='Delete' prefixIcon="custom-delete-icon" />

            <ItemDirective id="delete_rows" prefixIcon="e-de-ctnr-deleterows e-icons" />
            <ItemDirective id="delete_columns" prefixIcon="e-de-ctnr-deletecolumns e-icons" />
            <ItemDirective type="Separator" />
            <ItemDirective text="Dialog" />
          </ItemsDirective>

        </ToolbarComponent>

        {/* <DocumentEditorComponent
          id="container"
          height={"100px"}
          ref={(scope) => {
            documenteditor = scope;
          }}
          isReadOnly={false}
          enableSelection={true}
          enableEditor={true}
          enableEditorHistory={true}
          enableContextMenu={true}
        /> */}
      </div>

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
        {/* <div className="relative">
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
        </div> */}
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
