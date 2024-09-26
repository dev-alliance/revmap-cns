import { ContractContext } from "@/context/ContractContext";
import useStore from "@/context/ZustandStore";
import { Menu, MenuItem, Select, Tooltip } from "@mui/material";
import Form from "react-bootstrap/Form";

import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Quill } from "react-quill";
import DropdownBarImage from "../../../../assets/shape.png";
import { Sketch } from "@uiw/react-color";

function undoChange() {
  // @ts-ignore
  this.quill.history.undo();
}

function redoChange() {
  // @ts-ignore
  this.quill.history.redo();
}

// Custom CheckboxBlot for Quill
const BlockEmbed = Quill.import("blots/block/embed");

class VideoBlot extends BlockEmbed {
  static create(value: any) {
    const node = super.create();
    node.setAttribute("controls", true); // Add controls to the video
    node.setAttribute("src", value); // Set the video source
    node.setAttribute("width", "100%"); // Optional: Set default width
    node.setAttribute("height", "auto"); // Optional: Set default height
    return node;
  }

  static value(node: any) {
    return node.getAttribute("src"); // Get the video source
  }

  format(name: any, value: any) {
    if (name === "video" && value) {
      this.domNode.setAttribute("src", value); // Update the video source
    } else {
      super.format(name, value);
    }
  }
}

VideoBlot.blotName = "video";
VideoBlot.tagName = "video";

Quill.register(VideoBlot);

class AudioBlot extends BlockEmbed {
  static create(value: any) {
    const node = super.create();
    node.setAttribute("src", value);
    node.setAttribute("controls", true);
    node.setAttribute("width", "100%");
    return node;
  }

  static value(node: any) {
    return node.getAttribute("src");
  }
}

AudioBlot.blotName = "audio";
AudioBlot.tagName = "audio";

Quill.register(AudioBlot);

class CheckboxContainerBlot extends BlockEmbed {
  static create(value: any) {
    const store: any = useStore.getState();
    const checkboxes = store.checkboxes;

    let node = super.create();
    node.setAttribute("contenteditable", "false");
    node.innerHTML = `<input type="checkbox" id="${value.id}" name="${
      value.name
    }" ${value.checked ? "checked" : ""} data-id="${value.id}"> ${value.label}`;
    node.classList.add("checkbox-container");
    node.setAttribute("draggable", "true");

    node.style.backgroundColor = value.backgroundColor || "#f0f0f0"; // Set the background color
    node.style.padding = "4px";
    node.style.margin = "2px 0px"; // Set margin as needed
    node.style.position = "relative"; // Ensure the container is the reference for the asterisk positioning

    node.addEventListener("click", () => {
      const checkboxElements = node.querySelectorAll('input[type="checkbox"]');
      const checkboxArray: any = [];

      checkboxElements.forEach((checkbox: any) => {
        const label = checkbox.nextSibling.nodeValue.trim();
        const checkboxData = {
          id: checkbox.getAttribute("data-id"),
          label,
          checked: checkbox.checked,
        };
        checkboxArray.push(checkboxData);
      });

      const isRequired = node.querySelector(".asterisk") !== null;
      // @ts-ignore
      store.setRequiredCheckbox(isRequired);
      // Update Zustand state
      store.setRadios([]);
      store.setTextFields({});
      store.setCheckboxes(checkboxArray);
    });

    // Check if the required attribute is true and add asterisk accordingly
    if (value.required) {
      const asterisk = document.createElement("span");
      asterisk.innerText = "*";
      asterisk.classList.add("asterisk");
      asterisk.style.position = "absolute";
      asterisk.style.top = "50%";
      asterisk.style.transform = "translateY(-50%)";
      asterisk.style.right = "10px"; // Adjust right position as needed
      asterisk.style.color = "red"; // Adjust color as needed
      asterisk.style.fontSize = "20px"; // Increase font size for larger asterisk
      asterisk.style.lineHeight = "1"; // Ensure the asterisk is vertically centered
      asterisk.style.height = "20px"; // Increase height of asterisk
      asterisk.style.width = "20px"; // Increase width of asterisk for better visibility
      node.appendChild(asterisk);
    }

    return node;
  }

  static value(node: any) {
    return {
      backgroundColor: node.style.backgroundColor,
      margin: node.style.margin,
      required: node.querySelector(".asterisk") !== null, // Check if the asterisk is present
    };
  }
}

CheckboxContainerBlot.blotName = "checkbox-container";
CheckboxContainerBlot.tagName = "div";

// Register CheckboxContainerBlot with Quill
Quill.register(CheckboxContainerBlot);

class RadioContainerBlot extends BlockEmbed {
  static create(value: any) {
    let node = super.create();
    node.setAttribute("contenteditable", "false");
    node.innerHTML = `<input type="radio" id="${value.id}" name="${value.name}" data-id="${value.id}"> ${value.label}`;
    node.setAttribute("draggable", "true");
    node.classList.add("radio-container");
    node.style.backgroundColor = value.backgroundColor || "#f0f0f0"; // Set the background color
    node.style.margin = "2px 0px";
    node.style.padding = "4px";
    node.style.position = "relative"; // Ensure position for absolute elements

    const required = value.required; // Check if required flag is passed

    // Add event listener for updating Zustand state
    node.addEventListener("click", () => {
      const store = useStore.getState();
      const radios: any[] = node.querySelectorAll('input[type="radio"]');
      const radioArray: any[] = [];

      radios.forEach((radio: any) => {
        const label = radio.nextSibling.nodeValue.trim();
        const radioData = {
          id: radio.getAttribute("data-id"),
          label,
        };
        radioArray.push(radioData);
      });

      // Update Zustand state
      store.setCheckboxes([]);
      store.setTextFields({});
      store.setRadios(radioArray);
      const isRequired = node.querySelector(".asterisk") !== null;
      // @ts-ignore
      store.setRequiredCheckbox(isRequired);
    });

    // Handle asterisk addition or removal
    const existingAsterisk = node.querySelector(".asterisk");
    if (required) {
      if (!existingAsterisk) {
        const asterisk = document.createElement("span");
        asterisk.innerText = "*";
        asterisk.classList.add("asterisk");
        asterisk.style.position = "absolute";
        asterisk.style.bottom = "2px";
        asterisk.style.right = "4px";
        asterisk.style.color = "red"; // Adjust color as needed
        asterisk.style.fontSize = "20px"; // Increase font size for larger asterisk
        asterisk.style.lineHeight = "1"; // Ensure the asterisk is vertically centered
        asterisk.style.height = "20px"; // Increase height of asterisk
        asterisk.style.width = "20px"; // Increase width of asterisk for better visibility
        node.appendChild(asterisk);
      }
    } else {
      if (existingAsterisk) {
        existingAsterisk.remove();
      }
    }

    return node;
  }

  static value(node: any) {
    return {
      backgroundColor: node.style.backgroundColor,
      margin: node.style.margin,
      required: node.querySelector(".asterisk") !== null,
    };
  }
}

RadioContainerBlot.blotName = "radio-container";
RadioContainerBlot.tagName = "div";
Quill.register(RadioContainerBlot);

class TextFieldContainerBlot extends BlockEmbed {
  static create(value: any) {
    console.log("value", value);
    const store: any = useStore.getState();

    let node = super.create();
    node.setAttribute("contenteditable", "false");
    node.classList.add("text-field-container");

    const input = document.createElement("input");
    input.type = "text";
    input.id = value.id;
    input.placeholder = value.placeholder || "";
    input.setAttribute("data-id", value.id);

    // Style the input
    input.style.backgroundColor = value.backgroundColor;
    input.style.outline = "none";
    node.appendChild(input);

    node.style.margin = "2px 0px"; // Set margin as needed
    node.style.position = "relative"; // Ensure the container is the reference for the asterisk positioning

    // Event listener to handle clicks on the node
    const handleClick = () => {
      const textFieldElement = node.querySelector('input[type="text"]');
      if (textFieldElement) {
        const textFieldData = {
          id: textFieldElement.getAttribute("data-id"),
          placeholder: textFieldElement.placeholder,
        };
        store.setCheckboxes([]);
        store.setRadios([]);
        store.setTextFields(textFieldData);

        const isRequired = node.querySelector(".asterisk") !== null;
        store.setRequiredCheckbox(isRequired);
      }
    };

    node.addEventListener("click", handleClick);

    // Check if the required attribute is true and add asterisk accordingly
    if (value.required) {
      const asterisk = document.createElement("span");
      asterisk.innerText = "*";
      asterisk.classList.add("asterisk");
      asterisk.style.position = "relative"; // Use absolute positioning
      asterisk.style.top = "5px"; // Center vertically
      asterisk.style.right = "10px"; // Adjust right position as needed
      asterisk.style.color = "red"; // Adjust color as needed
      asterisk.style.fontSize = "20px"; // Increase font size for larger asterisk
      asterisk.style.transform = "translateY(-50%)"; // Ensure the asterisk is vertically centered
      asterisk.style.lineHeight = "1"; // Ensure the asterisk is vertically centered
      asterisk.style.height = "20px"; // Increase height of asterisk
      asterisk.style.width = "20px"; // Increase width of asterisk for better visibility
      node.appendChild(asterisk);
    }

    // Attach the handleClick function to the node, and keep a reference to remove it later if needed
    node.__handleClick = handleClick;

    return node;
  }

  static value(node: any) {
    const input = node.querySelector('input[type="text"]');
    if (input) {
      return {
        backgroundColor: node.style.backgroundColor,
        margin: node.style.margin,
        required: node.querySelector(".asterisk") !== null, // Check if the asterisk is present
        id: input.getAttribute("data-id"),
        placeholder: input.placeholder,
      };
    }
    return {
      backgroundColor: node.style.backgroundColor,
      margin: node.style.margin,
      required: node.querySelector(".asterisk") !== null, // Check if the asterisk is present
    };
  }

  static destroy(node: any) {
    // Clean up event listeners or any other resources when the node is destroyed
    if (node.__handleClick) {
      node.removeEventListener("click", node.__handleClick);
    }
    // Remove any other resources if necessary
  }
}

TextFieldContainerBlot.blotName = "text-field-container";
TextFieldContainerBlot.tagName = "div";

// Register TextFieldContainerBlot with Quill
Quill.register(TextFieldContainerBlot);

class SignatureBlot extends BlockEmbed {
  static create(value: any) {
    let node = super.create();
    node.setAttribute("contenteditable", "false");
    node.classList.add("main-signature");
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("outer-row");
    outerDiv.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-2" style="background-color:#f8f9fa;">
      <div style="font-size:14px; color:#202124; font-weight:600;">SIGNATURES</div>
      <div class="d-flex justify-content-end" style="font-size:12px; color:#007bff; cursor:pointer;">Add Signers</div>
    </div>
  `;
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    const recipients = value.recipients || [];
    const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
    recipients.forEach((recipient: any, index: number) => {
      const initials = recipient.label
        ? recipient.label
            .split(" ")
            .map((word: any) => word.charAt(0))
            .join("")
            .substring(0, 2)
        : recipient.email
        ? recipient.email.charAt(0)
        : "P";

      const child = document.createElement("div");
      child.className = "col-6";
      child.innerHTML = ` <div style="background-color: ${
        bubbleColors[index % bubbleColors.length]
      }; height: 28px; width: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; text-align: center; margin-left:50%">${initials.toUpperCase()}</div>    <div style="margin-left:15%;"><label style="color:#aaa;font-size:14px;">Full Name</label> <input type="text" value=${
        recipient.label || recipient.email
      } /> </div>  <div style="margin-left:15%;"><label style="color:#aaa;font-size:14px;">Company</label> <input type="text"/> </div> <div style="margin-left:15%;"><label style="color:#aaa;font-size:14px;" className='px-2'>Title</label> <input type="text" /> </div> `;
      rowDiv.appendChild(child);
    });
    node.appendChild(outerDiv);
    node.appendChild(rowDiv);
    return node;
  }
  static value(node: any) {
    return {
      recipients: Array.from(node.querySelectorAll(".col-6")).map(
        (div: any) => {
          return {
            label: div.querySelector('input[placeholder="Full Name"]').value,
            // Add other fields as needed
          };
        }
      ),
    };
  }
}

SignatureBlot.blotName = "signature-blot";
SignatureBlot.tagName = "div";

Quill.register(SignatureBlot);
// Add sizes to whitelist and register them
const SizeStyle = Quill.import("attributors/style/size");
SizeStyle.whitelist = [
  "8px",
  "10px",
  "12px",
  "13px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "26px",
  "28px",
  "32px",
  "36px",
  "40px",
  "44px",
  "48px",
  "54px",
  "60px",
  "72px",
];
Quill.register(SizeStyle, true);

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
  "algerian",
  "arial",
  "calibri",
  "cambria",
  "cambria-math",
  "candara",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "impact",
  "segoe-print",
  "segoe-script",
  "segoe-ui",
  "lucida",
  "times-new-roman",
  "verdana",
  "wingdings",
];

Quill.register(Font, true);

const listHandler = function (value: any) {
  // @ts-ignore
  const formats = this.quill.getFormat();
  if (value === "upper-alpha" || value === "lower-alpha") {
    // @ts-ignore
    this.quill.format("list", value);
  } else if (value === "ordered" || value === "bullet") {
    // @ts-ignore
    this.quill.format("list", value);
  }
};

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange,
      list: listHandler,
    },
  },
  history: {
    delay: 0,
    maxStack: 100,
    userOnly: true,
  },
};

// Formats objects for setting up the Quill editor
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
  "radio-container",
  "checkbox-container",
  "text-field-container",
  "signature-blot",
  "lineHeight",
  "video",
  "audio",
];

const List = Quill.import("formats/list");

// Custom Lists
class FlowerList extends List {
  static create(value: any) {
    const node = super.create(value);
    node.setAttribute("data-list-type", value);
    return node;
  }

  static formats(node: any) {
    return node.getAttribute("data-list-type") || "";
  }
}

Quill.register(FlowerList, true);

const Parchment = Quill.import("parchment");
const lineHeightConfig = {
  scope: Parchment.Scope.BLOCK,
  whitelist: ["1.5", "1.7", "2", "2.5", "3", "3.5"],
};
const LineHeightStyle = new Parchment.Attributor.Style(
  "lineHeight",
  "line-height",
  lineHeightConfig
);
Quill.register(LineHeightStyle, true);

export default function QuillToolbar(props: any) {
  const {
    isBoldActive,
    setIsBoldActive,
    isItalicActive,
    setIsItalicActive,
    isUnderlineActive,
    setIsUnderlineActive,
    isStrikeActive,
    setIsStrikeActive,
    isScriptActive,
    setIsScriptActive,
    isListActive,
    setIsListActive
  } = props;

  const {
    editorRefContext,
    setDocumentPageSize,
    documentPageSize,
    documentPageMargins,
    setDocumentPageMargins,
    setBgColor,
    setShadeColor,
    setFontColor,
    fontColor,
    bgColor,
    bgColorSvg,
    setBgColorSvg,
    fontColorSvg,
    setFontColorSvg,
    shadeColor,
    setSelectedFont,
    setSelectedHeaders,
    setSelectedFontSize,
    selectedFontValue,
    selectedFontSizeValue,
    selectedHeadersValue,
    setSelectedFontValue,
    setSelectedFontSizeValue,
    setSelectedHeadersValue,
    selectionRef,
    setPages,
    setCurrentPage,
    spacing,
    setSpacing,
    setBgColorSelection,
    editMode,
  } = useContext(ContractContext);

  const toolbarRef: any = useRef(null);

  const handleListClick = (value: string) => {
    const editor = editorRefContext.getEditor();
    if (!editor) return;

    if (value === "none") {
      editor.format("list", false, "user");
    } else {
      editor.format("list", value, "user");
    }
    setAnchorEl2(null);
    setAnchorEl(null);
  };

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const [tooltipOpenSize, setTooltipOpenSize] = useState(false);
  const [tooltipOpenSpacing, setTooltipOpenSpacing] = useState(false);
  const [tooltipOpenLink, setTooltipOpenLink] = useState(false);
  const [tooltipOpenAlignment, setTooltipOpenAlignment] = useState(false);
  const [tooltipOpenColumns, setTooltipOpenColumns] = useState(false);

  const [tooltipOpenHeader, setTooltipOpenHeader] = useState(false);
  const [tooltipOpenHighlight, setTooltipOpenHighlight] = useState(false);

  const [tooltipOpenColor, setTooltipOpenColor] = useState(false);
  const [tooltipOpenShading, setTooltipOpenShading] = useState(false);

  const [tooltipOpenCase, setTooltipOpenCase] = useState(false);
  const [tooltipOpenPicture, setTooltipOpenPicture] = useState(false);

  const [tooltipOpenMargins, setTooltipOpenMargins] = useState(false);

  const [tooltipOpenOrientation, setTooltipOpenOrientation] = useState(false);
  const [tooltipOpenMedia, setTooltipOpenMedia] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open1 = Boolean(anchorEl);

  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open = Boolean(anchorEl2);

  const [anchorElMargins, setAnchorElMargins] = React.useState(null);
  const openMargins = Boolean(anchorElMargins);

  const [anchorElOrientation, setAnchorElOrientation] = React.useState(null);
  const openOrientation = Boolean(anchorElOrientation);

  const [anchorElTextColr, setAnchorElTextColor] = React.useState(null);
  const openTextColor = Boolean(anchorElTextColr);

  const [anchorElFontColor, setAnchorElFontColor] = React.useState(null);
  const openFontColor = Boolean(anchorElFontColor);

  const [anchorElBgColor, setAnchorElBgColor] = React.useState(null);
  const openBgColor = Boolean(anchorElBgColor);

  const [anchorElSize, setAnchorElSize] = React.useState(null);
  const openSize = Boolean(anchorElSize);

  const [anchorElSpacing, setAnchorElSpacing] = React.useState(null);
  const openSpacing = Boolean(anchorElSpacing);

  const [anchorElPicture, setAnchorElPicture] = React.useState(null);
  const openPicutre = Boolean(anchorElPicture);

  const [anchorElMedia, setAnchorElMedia] = React.useState(null);
  const openMedia = Boolean(anchorElMedia);

  const [anchorElAlignment, setAnchorElAlignment] = React.useState(null);
  const openAlignment = Boolean(anchorElAlignment);

  const [anchorElColumns, setAnchorElColumns] = React.useState(null);
  const openColumns = Boolean(anchorElColumns);

  const [anchorElCase, setAnchorElCase] = React.useState(null);
  const openCase = Boolean(anchorElCase);

  const [anchorElLink, setAnchorElLink] = React.useState(null);
  const openLink = Boolean(anchorElLink);

  const [anchorElLinkPicture, setAnchorElLinkPicture] = React.useState(null);
  const openLinkPicture = Boolean(anchorElLinkPicture);

  const handleClick2 = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    if (range.length > 0) {
      editor.setSelection(range.index, range.length);
    }
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleClick = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    if (range.length > 0) {
      editor.setSelection(range.index, range.length);
    }
    setAnchorEl(event.currentTarget);
    setTooltipOpenNumbering(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setTooltipOpenNumbering(false);
  };

  const handleOpenMargins = (event: any) => {
    setAnchorElMargins(event.currentTarget);
  };
  const handleCloseMargins = () => {
    setAnchorElMargins(null);
  };

  const handleOpenOrientation = (event: any) => {
    setAnchorElOrientation(event.currentTarget);
  };
  const handleCloseOrientation = () => {
    setAnchorElOrientation(null);
  };

  const handleOpenTextColor = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    if (range.length > 0) {
      editor.setSelection(range.index, range.length);
      setBgColorSelection(range);
    }
    setAnchorElTextColor(event.currentTarget);
  };

  const handleCloseTextColor = () => {
    const editor = editorRefContext.getEditor();
    const selection = editor.getSelection(true);
    setBgColorSelection(null);
    if (selection.length) {
      editor.setSelection(selection.length, 0);
    }
    setAnchorElTextColor(null);
    editor.focus();
  };

  const handleOpenFontColor = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    if (range.length > 0) {
      editor.setSelection(range.index, range.length);
    }
    setAnchorElFontColor(event.currentTarget);
  };

  const handleCloseFontColor = () => {
    setAnchorElFontColor(null);
    const editor = editorRefContext.getEditor();
    editor.focus();
  };

  const handleSaveFontColor = () => {
    const editor = editorRefContext.getEditor();
    setFontColor(textColor);
    setFontColorSvg(textColor);
    setAnchorElFontColor(null);
    editor.focus();
  };

  const handleCancelFontColor = () => {
    const editor = editorRefContext.getEditor();
    setTimeout(() => {
      editor.focus();
    }, 0);
    setAnchorElFontColor(null);
  };

  const handleOpenBgColor = (event: any) => {
    setAnchorElBgColor(event.currentTarget);
  };
  const handleCloseBgColor = () => {
    setAnchorElBgColor(null);
  };

  const handleOpenSize = (event: any) => {
    setAnchorElSize(event.currentTarget);
  };

  const handleCloseSize = (event: any) => {
    setAnchorElSize(null);
  };

  const handleOpenAlignment = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    if (range.length > 0) {
      editor.setSelection(range.index, range.length);
    }
    setAnchorElAlignment(event.currentTarget);
  };

  const handleCloseAlignment = (event: any) => {
    setAnchorElAlignment(null);
  };

  const handleOpenPicture = (event: any) => {
    const editor = editorRefContext.getEditor();
    setAnchorElPicture(event.currentTarget);
    const range = editor.getSelection(true);
    setCursorIndex(range.index);
  };

  const handleClosePicture = (event: any) => {
    setAnchorElPicture(null);
  };

  const handleOpenMedia = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setCursorIndex(range.index);
    setAnchorElMedia(event.currentTarget);
  };

  const handleCloseMedia = (event: any) => {
    setAnchorElMedia(null);
  };

  const handleOpenColumns = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    if (range.length > 0) {
      editor.setSelection(range.index, range.length);
    }
    setAnchorElColumns(event.currentTarget);
  };

  const handleCloseColumns = () => {
    setAnchorElColumns(null);
  };

  const handleOpenSpacing = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    if (range.length > 0) {
      editor.setSelection(range.index, range.length);
    }
    setAnchorElSpacing(event.currentTarget);
  };

  const handleCloseSpacing = () => {
    setAnchorElSpacing(null);
  };

  const handleOpenLinkPicture = (event: any) => {
    // setAnchorElPicture(null)
    setAnchorElLinkPicture(event.currentTarget);
  };

  const handleCloseLinkPicture = () => {
    setAnchorElLinkPicture(null);
  };

  const handleOpenCase = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    if (range.length > 0) {
      editor.setSelection(range.index, range.length);
    }
    setAnchorElCase(event.currentTarget);
    setTooltipOpenCase(false);
  };

  const handleCloseCase = () => {
    setAnchorElCase(null);
    setTooltipOpenCase(false);
  };

  const scrollLeft = () => {
    toolbarRef.current.scrollBy({ left: -1000, behavior: "smooth" });
    const editor = editorRefContext.getEditor();
    editor.focus();
  };

  const scrollRight = () => {
    toolbarRef.current.scrollBy({ left: 1000, behavior: "smooth" });
    const editor = editorRefContext.getEditor();
    editor.focus();
  };

  const handleFontChange = (event: any) => {
    const editor = editorRefContext.getEditor();
    setSelectedFont(event.target.value);
    setSelectedFontValue(event.target.value);
    setTimeout(() => {
      editor.focus();
    }, 0);
  };

  const handleFontSizeChange = (event: any) => {
    const editor = editorRefContext.getEditor();
    setSelectedFontSize(event.target.value);
    setSelectedFontSizeValue(event.target.value);
    editor.focus();
  };

  const handleHeaderChange = (event: any) => {
    const editor = editorRefContext.getEditor();
    setSelectedHeaders(event.target.value);

    // Get the current selection range
    const range = editor.getSelection();

    if (range) {
      // If there is a selection, format the selected text
      editor.format("size", false, "user"); // Reset the size format
      editor.format("header", event.target.value, "user"); // Apply the new header format
    } else {
      // If there is no selection, apply format to the current cursor position
      const currentFormat = editor.getFormat(); // Get the current format at the cursor
      editor.formatText(
        editor.getLength() - 1,
        0,
        { ...currentFormat, size: false, header: event.target.value },
        "user"
      );
    }

    setSelectedHeadersValue(event.target.value);

    // Refocus the editor after formatting
    setTimeout(() => {
      editor.focus();
    }, 0);
  };

  const [tooltipOpenNumbering, setTooltipOpenNumbering] = useState(false);
  const [tooltipOpenBullets, setTooltipOpenBullets] = useState(false);

  const handleSelectOrientation = (value: any) => {
    if (value === "landscape") {
      setDocumentPageSize({
        width: "30cm",
        height: "21cm",
        title: "Landscape",
        desc: "Landscape",
      });
    } else {
      setDocumentPageSize({
        title: "A4",
        desc: "21 cm x 29.7 cm",
        width: "21cm",
        height: "29.7cm",
      });
    }
    handleCloseOrientation();
  };

  const handleSelectMargins = (value: any) => {
    setDocumentPageMargins(value);
    handleCloseMargins();
  };

  const [canUndo, setCanUndo] = useState(false);

  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const checkHistory = () => {
      if (editorRefContext) {
        const quill = editorRefContext.getEditor();
        const undoStack = quill.history.stack.undo;
        const redoStack = quill.history.stack.redo;
        setCanUndo(undoStack.length > 0);
        setCanRedo(redoStack.length > 0);
      }
    };

    if (editorRefContext) {
      const quill = editorRefContext.getEditor();

      quill.on("text-change", checkHistory);
      quill.on("selection-change", checkHistory);

      checkHistory(); // Initial check

      return () => {
        quill.off("text-change", checkHistory);
        quill.off("selection-change", checkHistory);
      };
    }
  }, [editorRefContext]);

  const handleSelectSize = (value: any) => {
    setAnchorElSize(null);
    setDocumentPageSize(value);
  };

  const pageSizes = [
    {
      title: "A3",
      desc: "29.7 cm x 42 cm",
      width: "29.7cm",
      height: "42cm",
    },
    {
      title: "A4",
      desc: "21 cm x 29.7 cm",
      width: "21cm",
      height: "29.7cm",
    },
    {
      title: "A5",
      desc: "14.8 cm x 21 cm",
      width: "14.8cm",
      height: "21cm",
    },
    {
      title: "A6",
      desc: "10.5 cm x 14.8 cm",
      width: "10.5cm",
      height: "14.8cm",
    },
    {
      title: "JIS B5",
      desc: "18.2 cm x 25.7 cm",
      width: "18.2cm",
      height: "25.7cm",
    },
    {
      title: "JIS B6",
      desc: "12.8 cm x 18.2 cm",
      width: "12.8cm",
      height: "18.2cm",
    },
    {
      title: "US Letter",
      desc: "21.59 cm x 27.94 cm",
      width: "21.59cm",
      height: "27.94cm",
    },
    {
      title: "US Legal",
      desc: "21.59 cm x 35.56 cm",
      width: "21.59cm",
      height: "35.56cm",
    },
    {
      title: "Indian Legal",
      desc: "21.5 cm x 34.5 cm",
      width: "21.5cm",
      height: "35.56cm",
    },
  ];

  const lineSpacing = [
    {
      value: "1.5",
    },
    {
      value: "1.7",
    },
    {
      value: "2",
    },
    {
      value: "2.5",
    },
    {
      value: "3",
    },
    {
      value: "3.5",
    },
  ];

  const handleTextHighlightColorChange = (color: any) => {
    setBgColor(color.hex);
    setBgColorSvg(color.hex);
  };

  const handleTextHighlight = () => {
    const editor = editorRefContext.getEditor();
    setBgColor(bgColor);
    setBgColorSvg(bgColor);

    setTimeout(() => {
      editor.focus();
    }, 0);
  };

  const [textColor, setTextColor] = useState("");

  const handleFontColorChange = (color: any) => {
    setTextColor(color.hex);
  };

  const handleBgColorChange = (color: any) => {
    setBgColor(color.hex);
    setBgColorSvg(color.hex);
  };

  const handleFontColor = () => {
    const editor = editorRefContext.getEditor();
    setFontColor(fontColor);
    setFontColorSvg(fontColor);
    setTimeout(() => {
      editor.focus();
    }, 0);
  };

  const [bgCount, setBgCount] = useState(0);
  const [isBg, setIsBg] = useState(false);

  const handleBgColor = () => {
    const editor = editorRefContext.getEditor();

    const newCount = bgCount + 1;

    if (isBg) {
      editor.format("background", bgColor);
      setIsBg(false);
      setBgCount(1);

      setTimeout(() => {
        editor.focus();
      }, 0);

      return;
    }

    if (newCount % 2 === 0) {
      editor.format("background", false);
    } else {
      editor.format("background", bgColor);
    }

    setBgCount(newCount);

    setTimeout(() => {
      editor.focus();
    }, 0);
  };

  const toSentenceCase = (text: any) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const toLowerCase = (text: any) => {
    return text.toLowerCase();
  };

  const toUpperCase = (text: any) => {
    return text.toUpperCase();
  };

  const toCapitalizeEachWord = (text: any) => {
    return text.replace(
      /\w\S*/g,
      (word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  };

  const toToggleCase = (text: any) => {
    return text
      .split("")
      .map((char: any) =>
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      )
      .join("");
  };

  const handleTextTransformation = (transformationFunction: Function) => {
    const editor = editorRefContext.getEditor();
    const selection = editor.getSelection();

    if (selection && selection.length > 0) {
      const { index, length } = selection;

      const contents = editor.getContents(index, length);

      let transformedText = "";
      let delta = new editor.constructor.imports.delta();

      contents.ops.forEach((op: any, i: number) => {
        if (op.insert && typeof op.insert === "string") {
          const segment = op.insert;
          const transformedSegment = transformationFunction(segment);
          transformedText += transformedSegment;
          delta = delta
            .retain(index)
            .delete(length)
            .insert(transformedSegment, op.attributes || {});

          console.log(`Transformed segment #${i}:`, transformedSegment);
        }
      });

      editor.updateContents(delta, "user");

      editor.setSelection(index, transformedText.length);

    }
    handleCloseCase()
  };

  const [selectedColumn, setSelectedColumn] = useState("one");

  const handleClickColumns = (value: string) => {
    const editorContainer = editorRefContext.editor?.root;

    if (!editorContainer) {
      console.error("Editor container not found");
      return;
    }

    setSelectedColumn(value);

    // Reset grid styles before applying new styles
    editorContainer.style.display = ""; // Reset display property
    editorContainer.style.gridTemplateColumns = ""; // Reset grid columns
    editorContainer.style.gridColumnGap = ""; // Reset column gap
    editorContainer.style.width = "100%"; // Ensure full width
    editorContainer.style.gridTemplateAreas = ""; // Reset grid areas

    switch (value) {
      case "one":
        editorContainer.style.display = "block"; // Single column layout, block-level by default
        break;
      case "two":
        editorContainer.style.display = "grid";
        editorContainer.style.gridTemplateColumns = "50% 50%"; // Two equal columns
        editorContainer.style.gridColumnGap = "20px"; // Gap between columns
        break;
      case "three":
        editorContainer.style.display = "grid";
        editorContainer.style.gridTemplateColumns = "33% 33% 33%"; // Three equal columns
        editorContainer.style.gridColumnGap = "20px"; // Gap between columns
        break;
      case "left":
        editorContainer.style.display = "grid";
        editorContainer.style.gridTemplateColumns = "25% 75%"; // Left 25% and right 75%
        editorContainer.style.gridColumnGap = "20px"; // Gap between columns
        editorContainer.style.gridTemplateAreas = `
          "left right"
        `;
        break;
      case "right":
        editorContainer.style.display = "grid";
        editorContainer.style.gridTemplateColumns = "75% 25%"; // Left 75% and right 25%
        editorContainer.style.gridColumnGap = "20px"; // Gap between columns
        editorContainer.style.gridTemplateAreas = `
          "left right"
        `;
        break;
      default:
        editorContainer.style.display = "block"; // Default to single column
    }

    handleCloseColumns();
  };

  const [showFormattingMarks, setShowFormattingMarks] = useState(false);

  const toggleFormattingMarks = () => {
    setShowFormattingMarks(!showFormattingMarks);
  };

  useEffect(() => {
    if (!editorRefContext) return;
    const editor = editorRefContext.getEditor();
    const editorContainer = editor.root;

    // Get all paragraphs
    const paragraphs = editorContainer.querySelectorAll("p");
    console.log("Paragraphs:", paragraphs);

    paragraphs.forEach((p: HTMLElement) => {
      // Remove text nodes containing '¶'
      const childNodes = Array.from(p.childNodes);
      childNodes.forEach((node: Node) => {
        if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent?.includes("¶")
        ) {
          node.textContent = node.textContent.replace(/¶/g, "");
        }
      });

      // If showFormattingMarks is true, add new formatting mark
      const lineText = p.innerText.trim();
      if (lineText === "" || lineText.length < 95) {
        if (showFormattingMarks) {
          // Create and append new formatting mark
          const mark = document.createElement("span");
          mark.className = "formatting-mark";
          mark.innerHTML = "¶";

          // Append the new mark at the end of the paragraph
          p.appendChild(mark);
        }
      }
    });
  }, [showFormattingMarks]);

  const handleSelectSpacing = (value: any) => {
    setSpacing(value);
    setAnchorElSpacing(null);

    const quillEditor = editorRefContext.getEditor();

    if (quillEditor) {
      const savedRange = quillEditor.getSelection(true);

      if (savedRange && savedRange.length > 0) {
        quillEditor.formatLine(
          savedRange.index,
          savedRange.length,
          {
            lineHeight: value,
          },
          "user"
        );
      } else {
        quillEditor.format("lineHeight", value, "user");
      }
    }
  };

  useEffect(() => {
    if (!editorRefContext) return;
    const quill = editorRefContext.getEditor();
    let savedSelection: any = false;

    const restoreSelection = () => {
      if (savedSelection) {
        quill.setSelection(savedSelection.index, savedSelection.length);
      }
    };

    const selection = quill.getSelection();
    if (selection) {
      selectionRef.current = selection;
    }

    // Assuming there's a button or a way to detect the menu opening
    const menuToggle = document.getElementById("menu-toggle-button");

    const attachColorListeners = () => {
      // Ensure that the menu-color element is available
      const menuColor = document.getElementById("menu-color");
      if (menuColor) {
        menuColor.addEventListener("click", restoreSelection);
        menuColor.addEventListener("change", restoreSelection); // change event for inputs/select elements
      }
    };

    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        setTimeout(() => {
          attachColorListeners(); // Attach listeners after the menu is likely opened
        }, 300); // Delay to ensure the menu is rendered
      });
    }

    // Cleanup event listeners when the component unmounts
    return () => {
      if (menuToggle) {
        menuToggle.removeEventListener("click", attachColorListeners);
      }
      const menuColor = document.getElementById("menu-color");
      if (menuColor) {
        menuColor.removeEventListener("click", restoreSelection);
        menuColor.removeEventListener("change", restoreSelection);
      }
    };
  }, [openFontColor]);

  const [selectedAlign, setSelectedAlign] = useState("left");
  const handleAlignment = (align: string) => {
    console.log(align);
    setSelectedAlign(align);
    const quill = editorRefContext.getEditor();
    const range = quill.getSelection();

    if (align === "left") {
      quill.format("align", false, "user");
    } else {
      quill.format("align", align, "user");
    }

    setAnchorElAlignment(null);
    quill.focus();
  };

  const [linkUrl, setLinkUrl] = useState("");
  const [displayText, setDisplayText] = useState("");

  const [selection, setSelection] = useState<any>(null);
  const [cursorIndex, setCursorIndex] = useState<number>(0);

  const handleOpenLink = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setCursorIndex(range.index);

    if (range && range.length > 0) {
      setSelection(range);
      const selectedText = editor.getText(range.index, range.length);
      setDisplayText(selectedText);
      setDisplayTextChange(true);
      editor.setSelection(range.index, range.length);
    } else {
      setDisplayText("");
    }
    setAnchorElLink(event.currentTarget);
  };

  const handleAddLink = () => {
    const editor = editorRefContext.getEditor();

    if (selection) {
      const { index, length } = selection;

      // Create a Delta for deleting the selected text and inserting the link
      let delta = new editor.constructor.imports.delta();

      // Delete the selected text and insert the link
      delta = delta
        .retain(index) // Retain the text before the selection
        .delete(length) // Delete the selected text
        .insert(displayText, { link: linkUrl }); // Insert the display text with link formatting

      // Apply the delta with 'user' action to track undo/redo
      editor.updateContents(delta, "user");
    } else {
      // If no selection, insert the link at the cursor position
      editor.insertText(cursorIndex, displayText, { link: linkUrl }, "user");
    }

    // Clear inputs and close the link dialog
    setDisplayText("");
    setLinkUrl("");
    handleCloseLink();
    setSelection(null);
  };

  const handleCloseLink = () => {
    setDisplayTextChange(false);
    const editor = editorRefContext.getEditor();
    setAnchorElLink(null);
    editor.focus();
    setSelection(null);
  };

  const [dispalyTextChange, setDisplayTextChange] = useState(false);

  const handleLinkUrlChange = (e: any) => {
    const url = e.target.value;
    setLinkUrl(url);

    if (!dispalyTextChange) {
      setDisplayText(url);
    }
  };

  const handleDisplayTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayText(e.target.value);
    setDisplayTextChange(true);
  };

  const handlePictureFromFile = () => {
    // Open a file input dialog
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // Create a URL for the selected image
        const reader = new FileReader();

        reader.onload = (event: any) => {
          const imageUrl = event.target.result;

          const quill = editorRefContext.getEditor();
          quill.insertEmbed(cursorIndex, "image", imageUrl, "user");

          const img = quill.root.querySelector(`img[src="${imageUrl}"]`);
          if (img) {
            img.classList.add("resizable");
          }

          // quill.setSelection(cursorIndex + 1);
          quill.focus();
        };

        reader.readAsDataURL(file);
      }
    };

    // Trigger the file input dialog
    fileInput.click();
    setAnchorElPicture(null);
  };

  const handleVideoFromFile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*";

    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const videoUrl = event.target.result;
          const quill = editorRefContext.getEditor();
          quill.insertEmbed(cursorIndex, "video", videoUrl, "user");
          quill.setSelection(cursorIndex + 1);
          quill.focus();
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
    setAnchorElMedia(null);
  };

  const handleAudioFromFile = () => {
    // Create a file input element for audio files
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "audio/*";

    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const audioUrl = event.target.result;
          const quill = editorRefContext.getEditor();
          quill.insertEmbed(cursorIndex, "audio", audioUrl, "user");
          quill.setSelection(cursorIndex + 1);
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  };

  const [linkUrlImage, setLinkUrlImage] = useState("");
  const handleAddLinkPicture = () => {
    if (linkUrlImage.trim().length > 0) {
      const quill = editorRefContext.getEditor();
      quill.insertEmbed(cursorIndex, "image", linkUrlImage, "user");
      const img = quill.root.querySelector(`img[src="${linkUrlImage}"]`);
      if (img) {
        img.classList.add("resizable");
      }
      setAnchorElLinkPicture(null);
      setAnchorElPicture(null);
    }
  };

  const handleClean = () => {
    const editor = editorRefContext.getEditor();
    const length = editor.getLength();

    editor.formatText(
      0,
      length,
      {
        color: "black",
        background: "#fefefe",
        lineHeight: "1.5",
        font: "arial",
        size: "13px",
        header: false,
        bold: false,
        italic: false,
        underline: false,
        strike: false,
        list: false,
      },
      "user"
    );

    setBgColor("#fefefe");
    setFontColor("black");
    setSelectedFont("arial");
    setSelectedFontSize("13px");
    setSelectedHeaders(0);
  };

  const handleUndo = () => {
    const editor = editorRefContext?.getEditor();
    editor.history.undo();
  };

  const handleRedo = () => {
    const editor = editorRefContext?.getEditor();
    editor.history.redo();
  };

  interface delta {
    ops: any[];
  }



  const ScrollLeftSvg = () => {
    return (
      <svg
        className="scroll-left"
        width="20"
        height="53"
        viewBox="0 0 14 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="0.5" width="13" height="39" fill="white" />
        <rect
          className="scroll-left-stroke"
          x="0.5"
          y="0.5"
          width="13"
          height="39"
          stroke="#EEEEEE"
        />
        <path
          className="scroll-left-stroke"
          d="M10 24L4 20L10 16"
          stroke="#7F7F7F"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const ScrollRightSvg = () => {
    return (
      <svg
        width="20"
        height="53"
        viewBox="0 0 15 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="0.5" width="13.0453" height="39" fill="white" />
        <rect
          className="scroll-left-stroke"
          x="0.5"
          y="0.5"
          width="13.0453"
          height="39"
          stroke="#EEEEEE"
        />
        <path
          className="scroll-left-stroke"
          d="M4 16.0171L10.0226 19.983L4.04541 24.017"
          stroke="#7F7F7F"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const RedoSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.924 14.7462C14.796 13.2368 16 10.8859 16 8.24643C16 3.6912 12.43 0.00619412 8.012 7.76047e-06C3.588 -0.0061786 0 3.68708 0 8.24643C0 10.8282 1.15 13.1316 2.952 14.6431C3.022 14.7009 3.124 14.6885 3.18 14.6163L3.968 13.5749C4.022 13.5048 4.01 13.4038 3.944 13.3461C3.782 13.21 3.626 13.0635 3.476 12.9089C2.89124 12.308 2.42527 11.5958 2.104 10.8117C1.768 10.0013 1.6 9.13726 1.6 8.24643C1.6 7.35559 1.768 6.49156 2.102 5.67909C2.424 4.89342 2.886 4.18817 3.474 3.58191C4.062 2.97565 4.746 2.4993 5.508 2.1673C6.298 1.82292 7.136 1.6497 8 1.6497C8.864 1.6497 9.702 1.82292 10.49 2.1673C11.252 2.4993 11.936 2.97565 12.524 3.58191C13.112 4.18817 13.574 4.89342 13.896 5.67909C14.23 6.49156 14.398 7.35559 14.398 8.24643C14.398 9.13726 14.23 10.0013 13.896 10.8138C13.5747 11.5979 13.1088 12.3101 12.524 12.9109C12.338 13.1027 12.142 13.2821 11.938 13.4471L11.124 12.3727C11.1056 12.3482 11.0808 12.3295 11.0525 12.3188C11.0242 12.3081 10.9936 12.3058 10.9641 12.3123C10.9347 12.3188 10.9076 12.3337 10.886 12.3553C10.8644 12.3769 10.8491 12.4044 10.842 12.4346L10.05 15.7794C10.026 15.8825 10.102 15.9835 10.204 15.9835L13.544 16C13.678 16 13.754 15.8412 13.67 15.734L12.924 14.7462Z"
          fill={canRedo ? "#7771E8" : "#7F7F7F"}
        />
      </svg>
    );
  };

  const UndoSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.988 7.75946e-06C3.57 0.00619332 0 3.69072 0 8.24535C0 10.8845 1.204 13.235 3.076 14.7443L2.326 15.734C2.244 15.8433 2.32 16.002 2.452 16L5.792 15.9835C5.896 15.9835 5.972 15.8825 5.946 15.7794L5.156 12.433C5.14887 12.4028 5.13362 12.3753 5.11201 12.3537C5.0904 12.3321 5.06331 12.3172 5.03385 12.3107C5.00439 12.3042 4.97376 12.3065 4.94548 12.3172C4.91721 12.3279 4.89243 12.3466 4.874 12.3711L4.06 13.4453C3.856 13.2804 3.66 13.101 3.474 12.9093C2.88924 12.3085 2.42327 11.5963 2.102 10.8124C1.768 9.99999 1.6 9.13607 1.6 8.24535C1.6 7.35463 1.768 6.49072 2.102 5.67835C2.424 4.89278 2.886 4.18763 3.474 3.58144C4.062 2.97526 4.746 2.49897 5.508 2.16701C6.298 1.82269 7.136 1.64949 8 1.64949C8.864 1.64949 9.702 1.82269 10.49 2.16701C11.252 2.49897 11.936 2.97526 12.524 3.58144C13.112 4.18763 13.574 4.89278 13.896 5.67835C14.23 6.49072 14.398 7.35463 14.398 8.24535C14.398 9.13607 14.23 9.99999 13.896 10.8124C13.5747 11.5963 13.1088 12.3085 12.524 12.9093C12.374 13.0639 12.218 13.2082 12.056 13.3464C12.0235 13.3736 12.0028 13.4129 11.9983 13.4557C11.9938 13.4986 12.0059 13.5415 12.032 13.5752L12.82 14.6165C12.876 14.6886 12.978 14.701 13.048 14.6433C14.85 13.1299 16 10.8268 16 8.24535C16 3.6866 12.412 -0.0061778 7.988 7.75946e-06Z"
          fill={canUndo ? "#7771E8" : "#7F7F7F"}
          className=""
        />
        gi
      </svg>
    );
  };

  const TextHighlightSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M15.9591 7.89808L9.62977 0.0522995C9.61666 0.0357239 9.60107 0.0225709 9.58391 0.0135957C9.56675 0.00462048 9.54834 0 9.52975 0C9.51117 0 9.49276 0.00462048 9.4756 0.0135957C9.45844 0.0225709 9.44285 0.0357239 9.42974 0.0522995L5.16671 5.33674C5.13988 5.37023 5.12465 5.41568 5.12431 5.46323C5.12398 5.51077 5.13857 5.55655 5.16493 5.59063L5.16671 5.59288L5.88109 6.47811L3.78797 9.06866C3.76114 9.10215 3.7459 9.1476 3.74557 9.19514C3.74524 9.24268 3.75983 9.28847 3.78618 9.32255L3.78797 9.32479L4.49342 10.1988L1.11621 14.4003H0.144661C0.0660796 14.4003 0 14.4812 0 14.58V15.8203C0 15.9191 0.0642937 16 0.142875 16H6.30257C6.34007 16 6.37579 15.982 6.40258 15.9483L7.76168 14.2498L8.4832 15.144C8.49631 15.1606 8.51189 15.1737 8.52905 15.1827C8.54622 15.1917 8.56462 15.1963 8.58321 15.1963C8.6018 15.1963 8.6202 15.1917 8.63736 15.1827C8.65453 15.1737 8.67011 15.1606 8.68322 15.144L10.7746 12.5467L11.4907 13.4342C11.5038 13.4507 11.5194 13.4639 11.5366 13.4729C11.5537 13.4818 11.5721 13.4865 11.5907 13.4865C11.6093 13.4865 11.6277 13.4818 11.6449 13.4729C11.662 13.4639 11.6776 13.4507 11.6907 13.4342L15.9538 8.14972C16.0145 8.08232 16.0145 7.96998 15.9591 7.89808ZM5.81858 14.3868H2.95751L5.35781 11.3986L6.78834 13.1713L5.81858 14.3868ZM8.58321 12.9916L5.52211 9.19673L6.74727 7.6779L9.80836 11.4727L8.58321 12.9916ZM11.5925 11.2817L6.89907 5.46481L9.52975 2.20472L14.2232 8.0239L11.5925 11.2817Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const FontColorSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M3.70265 14.6667H2.2666L7.33327 2H8.6666L13.7333 14.6667H12.2972L10.6972 10.6667H5.30265L3.70265 14.6667ZM5.83598 9.33333H10.1639L7.99994 3.92345L5.83598 9.33333Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const ShadeColorSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M14.2783 10.2395C14.1991 10.2964 12.5565 12.0614 12.5565 13.3008C12.5565 14.6076 13.3735 15.442 14.2783 15.4875C15.0582 15.5259 16 14.7081 16 13.3008C16 11.9888 14.3575 10.2964 14.2783 10.2395ZM0 9.36489C0 9.83196 0.179059 10.271 0.504466 10.6017L5.31325 15.4875C5.63865 15.8181 6.07081 16 6.53051 16C6.99021 16 7.42236 15.8181 7.74777 15.4875L13.7738 9.36489L13.1652 8.74652L6.53051 2.00558L4.55655 0L3.33929 1.23676L5.31325 3.24233L0.504466 8.12814C0.179059 8.45875 0 8.89783 0 9.36489ZM6.53051 4.47909L11.3393 9.36489L6.53051 14.2507H6.53137L6.53051 15.1253V14.2507L1.72173 9.36489L6.53051 4.47909Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const ChangeCaseSvg = () => {
    return (
      <svg
        width="18"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M7.09727 10.3333H2.76937L1.43604 13.6667H0L4.26667 3H5.6L9.86667 13.6667H8.4306L7.09727 10.3333ZM6.56394 9L4.93333 4.92344L3.30271 9H6.56394ZM13.6 8.69007V8.33333H14.9333V13.6667H13.6V13.3099C13.2078 13.5368 12.7524 13.6667 12.2667 13.6667C10.7939 13.6667 9.6 12.4727 9.6 11C9.6 9.52727 10.7939 8.33333 12.2667 8.33333C12.7524 8.33333 13.2078 8.4632 13.6 8.69007ZM12.2667 12.3333C13.0031 12.3333 13.6 11.7364 13.6 11C13.6 10.2636 13.0031 9.66667 12.2667 9.66667C11.5303 9.66667 10.9333 10.2636 10.9333 11C10.9333 11.7364 11.5303 12.3333 12.2667 12.3333Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const BoldSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          className="stroke-hover"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.99984 7.99998C9.83504 7.99998 11.3228 6.50758 11.3228 4.66665C11.3228 2.8257 9.83504 1.33331 7.99984 1.33331H3.6665V7.99998H7.99984Z"
          stroke={isBoldActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.34357 14.6667C11.1788 14.6667 12.6665 13.1743 12.6665 11.3333C12.6665 9.4924 11.1788 8 9.34357 8H3.6665V14.6667H9.34357Z"
          stroke={isBoldActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const ItalicSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          className="stroke-hover"
          d="M6.6665 2H11.9998"
          stroke={isItalicActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          d="M4 14H9.33333"
          stroke={isItalicActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          d="M9.66683 1.98413L6.3335 14"
          stroke={isItalicActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const UnderlineSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          className="stroke-hover"
          d="M2.6665 14.6667H13.3332"
          stroke={isUnderlineActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          d="M12.3332 2.03232C12.3332 4.25452 12.3332 5.11109 12.3332 7.33332C12.3332 9.72656 10.3931 11.6667 7.99984 11.6667C5.6066 11.6667 3.6665 9.72656 3.6665 7.33332C3.6665 5.11109 3.6665 4.25452 3.6665 2.03232"
          stroke={isUnderlineActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
        />
      </svg>
    );
  };

  const StrikeThroughSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          className="stroke-hover"
          d="M1 10.0421H17"
          stroke={isStrikeActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          d="M11.4352 5.17391C11.462 4.07617 11.0446 3.01408 10.2776 2.22833C9.51057 1.44257 8.45886 0.999673 7.36079 1C5.58204 1.00167 4.07465 2.30984 3.82253 4.07064C3.57042 5.83143 4.65015 7.51004 6.35697 8.01078L9.12358 8.81774C11.1197 9.39737 12.3852 11.3574 12.0918 13.4152C11.7984 15.473 10.0356 17.0013 7.95697 17C5.26758 17 3.0874 14.8198 3.0874 12.1304"
          stroke={isStrikeActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const SubScriptSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M15.5 13C15.5 13.1326 15.4474 13.2598 15.3536 13.3536C15.2598 13.4473 15.1326 13.5 15 13.5H12C11.9072 13.5 11.8162 13.4742 11.7372 13.4253C11.6582 13.3765 11.5944 13.3067 11.5528 13.2236C11.5113 13.1406 11.4937 13.0476 11.5021 12.9551C11.5104 12.8626 11.5443 12.7743 11.6 12.7L14.2982 9.10251C14.3846 8.98738 14.4451 8.85495 14.4756 8.71428C14.5061 8.57361 14.5059 8.42801 14.4749 8.28743C14.444 8.14685 14.3831 8.01461 14.2964 7.89973C14.2096 7.78486 14.0991 7.69007 13.9724 7.62183C13.8456 7.55359 13.7057 7.51352 13.562 7.50435C13.4184 7.49518 13.2744 7.51713 13.14 7.56871C13.0056 7.62028 12.884 7.70025 12.7833 7.80317C12.6827 7.90608 12.6055 8.02951 12.5569 8.16501C12.535 8.22694 12.5011 8.28394 12.4572 8.33277C12.4132 8.3816 12.3601 8.42129 12.3008 8.44958C12.2415 8.47788 12.1772 8.49421 12.1116 8.49767C12.046 8.50112 11.9804 8.49162 11.9185 8.4697C11.8566 8.44779 11.7995 8.41389 11.7507 8.36995C11.7019 8.326 11.6622 8.27287 11.6339 8.21359C11.6056 8.1543 11.5893 8.09002 11.5858 8.02443C11.5824 7.95883 11.5919 7.89319 11.6138 7.83126C11.6824 7.63864 11.78 7.4576 11.9032 7.29439C12.2224 6.87079 12.6969 6.59136 13.2221 6.51758C13.7474 6.44379 14.2805 6.5817 14.7041 6.90095C15.1277 7.22021 15.4071 7.69466 15.4809 8.21994C15.5547 8.74521 15.4168 9.27829 15.0975 9.70189L13 12.5H15C15.1326 12.5 15.2598 12.5527 15.3536 12.6465C15.4474 12.7402 15.5 12.8674 15.5 13ZM9.32754 3.12501C9.2779 3.08198 9.22026 3.04915 9.15792 3.0284C9.09558 3.00765 9.02977 2.99939 8.96424 3.00409C8.8987 3.00879 8.83474 3.02636 8.776 3.0558C8.71727 3.08523 8.66491 3.12596 8.62192 3.17564L5.75004 6.48626L2.87817 3.17376C2.78862 3.08478 2.66873 3.03296 2.54256 3.0287C2.4164 3.02445 2.29329 3.06808 2.19796 3.15083C2.10262 3.23359 2.04212 3.34934 2.0286 3.47485C2.01507 3.60037 2.04953 3.72635 2.12504 3.82751L5.08817 7.25001L2.12504 10.6725C2.03818 10.7728 1.99472 10.9035 2.00421 11.0358C2.01371 11.1681 2.07538 11.2913 2.17567 11.3781C2.27595 11.465 2.40663 11.5085 2.53896 11.499C2.67129 11.4895 2.79443 11.4278 2.88129 11.3275L5.75629 8.01501L8.62817 11.3275C8.67117 11.3772 8.72354 11.4179 8.78228 11.4473C8.84101 11.4767 8.90497 11.4943 8.97049 11.499C9.03602 11.5037 9.10182 11.4954 9.16416 11.4747C9.22649 11.454 9.28413 11.4211 9.33379 11.3781C9.38345 11.3351 9.42415 11.2828 9.45356 11.224C9.48298 11.1653 9.50054 11.1013 9.50524 11.0358C9.50994 10.9703 9.50169 10.9045 9.48096 10.8421C9.46023 10.7798 9.42742 10.7222 9.38442 10.6725L6.41192 7.25001L9.37817 3.82751C9.46411 3.72742 9.50702 3.59742 9.49754 3.46584C9.48805 3.33425 9.42695 3.21175 9.32754 3.12501Z"
          fill={isScriptActive == "sub"? "#7771E8":"#7F7F7F"}
        />
      </svg>
    );
  };

  const SuperScriptSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M15.5 13C15.5 13.1326 15.4474 13.2598 15.3536 13.3536C15.2598 13.4473 15.1326 13.5 15 13.5H12C11.9072 13.5 11.8162 13.4742 11.7372 13.4253C11.6582 13.3765 11.5944 13.3067 11.5528 13.2236C11.5113 13.1406 11.4937 13.0476 11.5021 12.9551C11.5104 12.8626 11.5443 12.7743 11.6 12.7L14.2982 9.10251C14.3846 8.98738 14.4451 8.85495 14.4756 8.71428C14.5061 8.57361 14.5059 8.42801 14.4749 8.28743C14.444 8.14685 14.3831 8.01461 14.2964 7.89973C14.2096 7.78486 14.0991 7.69007 13.9724 7.62183C13.8456 7.55359 13.7057 7.51352 13.562 7.50435C13.4184 7.49518 13.2744 7.51713 13.14 7.56871C13.0056 7.62028 12.884 7.70025 12.7833 7.80317C12.6827 7.90608 12.6055 8.02951 12.5569 8.16501C12.535 8.22694 12.5011 8.28394 12.4572 8.33277C12.4132 8.3816 12.3601 8.42129 12.3008 8.44958C12.2415 8.47788 12.1772 8.49421 12.1116 8.49767C12.046 8.50112 11.9804 8.49162 11.9185 8.4697C11.8566 8.44779 11.7995 8.41389 11.7507 8.36995C11.7019 8.326 11.6622 8.27287 11.6339 8.21359C11.6056 8.1543 11.5893 8.09002 11.5858 8.02443C11.5824 7.95883 11.5919 7.89319 11.6138 7.83126C11.6824 7.63864 11.78 7.4576 11.9032 7.29439C12.2224 6.87079 12.6969 6.59136 13.2221 6.51758C13.7474 6.44379 14.2805 6.5817 14.7041 6.90095C15.1277 7.22021 15.4071 7.69466 15.4809 8.21994C15.5547 8.74521 15.4168 9.27829 15.0975 9.70189L13 12.5H15C15.1326 12.5 15.2598 12.5527 15.3536 12.6465C15.4474 12.7402 15.5 12.8674 15.5 13ZM9.32754 3.12501C9.2779 3.08198 9.22026 3.04915 9.15792 3.0284C9.09558 3.00765 9.02977 2.99939 8.96424 3.00409C8.8987 3.00879 8.83474 3.02636 8.776 3.0558C8.71727 3.08523 8.66491 3.12596 8.62192 3.17564L5.75004 6.48626L2.87817 3.17376C2.78862 3.08478 2.66873 3.03296 2.54256 3.0287C2.4164 3.02445 2.29329 3.06808 2.19796 3.15083C2.10262 3.23359 2.04212 3.34934 2.0286 3.47485C2.01507 3.60037 2.04953 3.72635 2.12504 3.82751L5.08817 7.25001L2.12504 10.6725C2.03818 10.7728 1.99472 10.9035 2.00421 11.0358C2.01371 11.1681 2.07538 11.2913 2.17567 11.3781C2.27595 11.465 2.40663 11.5085 2.53896 11.499C2.67129 11.4895 2.79443 11.4278 2.88129 11.3275L5.75629 8.01501L8.62817 11.3275C8.67117 11.3772 8.72354 11.4179 8.78228 11.4473C8.84101 11.4767 8.90497 11.4943 8.97049 11.499C9.03602 11.5037 9.10182 11.4954 9.16416 11.4747C9.22649 11.454 9.28413 11.4211 9.33379 11.3781C9.38345 11.3351 9.42415 11.2828 9.45356 11.224C9.48298 11.1653 9.50054 11.1013 9.50524 11.0358C9.50994 10.9703 9.50169 10.9045 9.48096 10.8421C9.46023 10.7798 9.42742 10.7222 9.38442 10.6725L6.41192 7.25001L9.37817 3.82751C9.46411 3.72742 9.50702 3.59742 9.49754 3.46584C9.48805 3.33425 9.42695 3.21175 9.32754 3.12501Z"
          fill={isScriptActive == "super"? "#7771E8":"#7F7F7F"}
        />
      </svg>
    );
  };

  const FormattingSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <mask id="path-1-inside-1_2581_537" fill="white">
          <path d="M13.75 2H6.5C5.43913 2 4.42172 2.42143 3.67157 3.17157C2.92143 3.92172 2.5 4.93913 2.5 6C2.5 7.06087 2.92143 8.07828 3.67157 8.82843C4.42172 9.57857 5.43913 10 6.5 10H8.25V14H11.75V3H13.75V2ZM8.25 9H6.5C5.70435 9 4.94129 8.68393 4.37868 8.12132C3.81607 7.55871 3.5 6.79565 3.5 6C3.5 5.20435 3.81607 4.44129 4.37868 3.87868C4.94129 3.31607 5.70435 3 6.5 3H8.25V9ZM10.75 13H9.25V3H10.75V13Z" />
        </mask>
        <path
          className="fill-hover"
          d="M13.75 2H6.5C5.43913 2 4.42172 2.42143 3.67157 3.17157C2.92143 3.92172 2.5 4.93913 2.5 6C2.5 7.06087 2.92143 8.07828 3.67157 8.82843C4.42172 9.57857 5.43913 10 6.5 10H8.25V14H11.75V3H13.75V2ZM8.25 9H6.5C5.70435 9 4.94129 8.68393 4.37868 8.12132C3.81607 7.55871 3.5 6.79565 3.5 6C3.5 5.20435 3.81607 4.44129 4.37868 3.87868C4.94129 3.31607 5.70435 3 6.5 3H8.25V9ZM10.75 13H9.25V3H10.75V13Z"
          fill={showFormattingMarks? "#7771E8":"#7F7F7F"}
        />
        <path
          className="fill-hover"
          d="M13.75 2H15V0.75H13.75V2ZM6.5 2V0.75V2ZM2.5 6H1.25H2.5ZM6.5 10V11.25V10ZM8.25 10H9.5V8.75H8.25V10ZM8.25 14H7V15.25H8.25V14ZM11.75 14V15.25H13V14H11.75ZM11.75 3V1.75H10.5V3H11.75ZM13.75 3V4.25H15V3H13.75ZM8.25 9V10.25H9.5V9H8.25ZM3.5 6H2.25H3.5ZM6.5 3V1.75V3ZM8.25 3H9.5V1.75H8.25V3ZM10.75 13V14.25H12V13H10.75ZM9.25 13H8V14.25H9.25V13ZM9.25 3V1.75H8V3H9.25ZM10.75 3H12V1.75H10.75V3ZM13.75 0.75H6.5V3.25H13.75V0.75ZM6.5 0.75C5.10761 0.75 3.77226 1.30312 2.78769 2.28769L4.55546 4.05546C5.07118 3.53973 5.77065 3.25 6.5 3.25V0.75ZM2.78769 2.28769C1.80312 3.27226 1.25 4.60761 1.25 6H3.75C3.75 5.27065 4.03973 4.57118 4.55546 4.05546L2.78769 2.28769ZM1.25 6C1.25 7.39239 1.80312 8.72774 2.78769 9.71231L4.55546 7.94454C4.03973 7.42882 3.75 6.72935 3.75 6H1.25ZM2.78769 9.71231C3.77226 10.6969 5.10761 11.25 6.5 11.25V8.75C5.77065 8.75 5.07118 8.46027 4.55546 7.94454L2.78769 9.71231ZM6.5 11.25H8.25V8.75H6.5V11.25ZM7 10V14H9.5V10H7ZM8.25 15.25H11.75V12.75H8.25V15.25ZM13 14V3H10.5V14H13ZM11.75 4.25H13.75V1.75H11.75V4.25ZM15 3V2H12.5V3H15ZM8.25 7.75H6.5V10.25H8.25V7.75ZM6.5 7.75C6.03587 7.75 5.59075 7.56563 5.26256 7.23744L3.4948 9.0052C4.29183 9.80223 5.37283 10.25 6.5 10.25V7.75ZM5.26256 7.23744C4.93437 6.90925 4.75 6.46413 4.75 6H2.25C2.25 7.12717 2.69777 8.20817 3.4948 9.0052L5.26256 7.23744ZM4.75 6C4.75 5.53587 4.93437 5.09075 5.26256 4.76256L3.4948 2.9948C2.69777 3.79183 2.25 4.87283 2.25 6H4.75ZM5.26256 4.76256C5.59075 4.43437 6.03587 4.25 6.5 4.25V1.75C5.37283 1.75 4.29183 2.19777 3.4948 2.9948L5.26256 4.76256ZM6.5 4.25H8.25V1.75H6.5V4.25ZM7 3V9H9.5V3H7ZM10.75 11.75H9.25V14.25H10.75V11.75ZM10.5 13V3H8V13H10.5ZM9.25 4.25H10.75V1.75H9.25V4.25ZM9.5 3V13H12V3H9.5Z"
          // fill="#7F7F7F"
          fill={showFormattingMarks? "#7771E8":"#7F7F7F"}
          mask="url(#path-1-inside-1_2581_537)"
        />
      </svg>
    );
  };

  const NumberingSvg = () => {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 11.5C5 11.3674 5.05268 11.2402 5.14645 11.1464C5.24021 11.0527 5.36739 11 5.5 11H14.5C14.6326 11 14.7598 11.0527 14.8536 11.1464C14.9473 11.2402 15 11.3674 15 11.5C15 11.6326 14.9473 11.7598 14.8536 11.8536C14.7598 11.9473 14.6326 12 14.5 12H5.5C5.36739 12 5.24021 11.9473 5.14645 11.8536C5.05268 11.7598 5 11.6326 5 11.5ZM5 7.5C5 7.36739 5.05268 7.24021 5.14645 7.14645C5.24021 7.05268 5.36739 7 5.5 7H14.5C14.6326 7 14.7598 7.05268 14.8536 7.14645C14.9473 7.24021 15 7.36739 15 7.5C15 7.63261 14.9473 7.75979 14.8536 7.85355C14.7598 7.94732 14.6326 8 14.5 8H5.5C5.36739 8 5.24021 7.94732 5.14645 7.85355C5.05268 7.75979 5 7.63261 5 7.5ZM5 3.5C5 3.36739 5.05268 3.24021 5.14645 3.14645C5.24021 3.05268 5.36739 3 5.5 3H14.5C14.6326 3 14.7598 3.05268 14.8536 3.14645C14.9473 3.24021 15 3.36739 15 3.5C15 3.63261 14.9473 3.75979 14.8536 3.85355C14.7598 3.94732 14.6326 4 14.5 4H5.5C5.36739 4 5.24021 3.94732 5.14645 3.85355C5.05268 3.75979 5 3.63261 5 3.5Z"
          fill="#7F7F7F"
        />
        <path
          className="stroke-highlighter"
          d="M1.713 11.865V11.391H2C2.217 11.391 2.363 11.254 2.363 11.074C2.363 10.889 2.205 10.764 2.002 10.764C1.779 10.764 1.635 10.916 1.629 11.074H1.039C1.055 10.607 1.412 10.287 2.025 10.287C2.613 10.285 2.979 10.578 2.982 10.99C2.98389 11.1313 2.93543 11.2687 2.84528 11.3775C2.75513 11.4863 2.62919 11.5595 2.49 11.584V11.617C2.64781 11.6288 2.79501 11.7009 2.90098 11.8184C3.00696 11.936 3.06356 12.0898 3.059 12.248C3.062 12.781 2.557 13.048 2.008 13.048C1.352 13.048 1.008 12.678 1 12.254H1.582C1.59 12.432 1.768 12.56 2.004 12.563C2.258 12.563 2.428 12.418 2.426 12.213C2.424 12.018 2.271 11.865 2.012 11.865H1.712H1.713ZM1.709 7.16598H1.105V7.13098C1.105 6.72298 1.4 6.28698 2.063 6.28698C2.646 6.28698 3.023 6.61298 3.023 7.04298C3.023 7.43198 2.766 7.65998 2.547 7.89098L2.01 8.46298V8.49298H3.064V8.99998H1.143V8.60498L2.1 7.61498C2.238 7.47298 2.393 7.31098 2.393 7.10698C2.393 6.92698 2.246 6.78698 2.051 6.78698C2.00598 6.78533 1.9611 6.79291 1.91913 6.80926C1.87715 6.82561 1.83897 6.85038 1.80693 6.88205C1.77489 6.91371 1.74967 6.9516 1.73283 6.99338C1.71599 7.03516 1.70788 7.07995 1.709 7.12498V7.16598ZM2.564 4.99998H1.929V2.92398H1.898L1.3 3.34398V2.77698L1.929 2.33398H2.564V4.99998Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const BulletSvg = () => {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 11.5C5 11.3674 5.05268 11.2402 5.14645 11.1464C5.24021 11.0527 5.36739 11 5.5 11H14.5C14.6326 11 14.7598 11.0527 14.8536 11.1464C14.9473 11.2402 15 11.3674 15 11.5C15 11.6326 14.9473 11.7598 14.8536 11.8536C14.7598 11.9473 14.6326 12 14.5 12H5.5C5.36739 12 5.24021 11.9473 5.14645 11.8536C5.05268 11.7598 5 11.6326 5 11.5ZM5 7.5C5 7.36739 5.05268 7.24021 5.14645 7.14645C5.24021 7.05268 5.36739 7 5.5 7H14.5C14.6326 7 14.7598 7.05268 14.8536 7.14645C14.9473 7.24021 15 7.36739 15 7.5C15 7.63261 14.9473 7.75979 14.8536 7.85355C14.7598 7.94732 14.6326 8 14.5 8H5.5C5.36739 8 5.24021 7.94732 5.14645 7.85355C5.05268 7.75979 5 7.63261 5 7.5ZM5 3.5C5 3.36739 5.05268 3.24021 5.14645 3.14645C5.24021 3.05268 5.36739 3 5.5 3H14.5C14.6326 3 14.7598 3.05268 14.8536 3.14645C14.9473 3.24021 15 3.36739 15 3.5C15 3.63261 14.9473 3.75979 14.8536 3.85355C14.7598 3.94732 14.6326 4 14.5 4H5.5C5.36739 4 5.24021 3.94732 5.14645 3.85355C5.05268 3.75979 5 3.63261 5 3.5ZM2 4.5C2.26522 4.5 2.51957 4.39464 2.70711 4.20711C2.89464 4.01957 3 3.76522 3 3.5C3 3.23478 2.89464 2.98043 2.70711 2.79289C2.51957 2.60536 2.26522 2.5 2 2.5C1.73478 2.5 1.48043 2.60536 1.29289 2.79289C1.10536 2.98043 1 3.23478 1 3.5C1 3.76522 1.10536 4.01957 1.29289 4.20711C1.48043 4.39464 1.73478 4.5 2 4.5ZM2 8.5C2.26522 8.5 2.51957 8.39464 2.70711 8.20711C2.89464 8.01957 3 7.76522 3 7.5C3 7.23478 2.89464 6.98043 2.70711 6.79289C2.51957 6.60536 2.26522 6.5 2 6.5C1.73478 6.5 1.48043 6.60536 1.29289 6.79289C1.10536 6.98043 1 7.23478 1 7.5C1 7.76522 1.10536 8.01957 1.29289 8.20711C1.48043 8.39464 1.73478 8.5 2 8.5ZM2 12.5C2.26522 12.5 2.51957 12.3946 2.70711 12.2071C2.89464 12.0196 3 11.7652 3 11.5C3 11.2348 2.89464 10.9804 2.70711 10.7929C2.51957 10.6054 2.26522 10.5 2 10.5C1.73478 10.5 1.48043 10.6054 1.29289 10.7929C1.10536 10.9804 1 11.2348 1 11.5C1 11.7652 1.10536 12.0196 1.29289 12.2071C1.48043 12.3946 1.73478 12.5 2 12.5Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const LineSpacingSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_2581_616)">
          <mask id="path-1-inside-1_2581_616" fill="white">
            <path d="M15.5 1.5H7.5V2.5H15.5V1.5Z" />
          </mask>
          <path
            className="stroke-highlighter"
            d="M15.5 1.5H7.5V2.5H15.5V1.5Z"
            fill="#7F7F7F"
          />
          <path
            className="stroke-highlighter"
            d="M7.5 1.5V0.25H6.25V1.5H7.5ZM15.5 1.5H16.75V0.25H15.5V1.5ZM15.5 2.5V3.75H16.75V2.5H15.5ZM7.5 2.5H6.25V3.75H7.5V2.5ZM7.5 2.75H15.5V0.25H7.5V2.75ZM14.25 1.5V2.5H16.75V1.5H14.25ZM15.5 1.25H7.5V3.75H15.5V1.25ZM8.75 2.5V1.5H6.25V2.5H8.75Z"
            fill="#7F7F7F"
            mask="url(#path-1-inside-1_2581_616)"
          />
          <mask id="path-3-inside-2_2581_616" fill="white">
            <path d="M15.5 5.5H7.5V6.5H15.5V5.5Z" />
          </mask>
          <path
            className="stroke-highlighter"
            d="M15.5 5.5H7.5V6.5H15.5V5.5Z"
            fill="#7F7F7F"
          />
          <path
            className="stroke-highlighter"
            d="M7.5 5.5V4.25H6.25V5.5H7.5ZM15.5 5.5H16.75V4.25H15.5V5.5ZM15.5 6.5V7.75H16.75V6.5H15.5ZM7.5 6.5H6.25V7.75H7.5V6.5ZM7.5 6.75H15.5V4.25H7.5V6.75ZM14.25 5.5V6.5H16.75V5.5H14.25ZM15.5 5.25H7.5V7.75H15.5V5.25ZM8.75 6.5V5.5H6.25V6.5H8.75Z"
            fill="#7F7F7F"
            mask="url(#path-3-inside-2_2581_616)"
          />
          <mask id="path-5-inside-3_2581_616" fill="white">
            <path d="M15.5 9.5H7.5V10.5H15.5V9.5Z" />
          </mask>
          <path
            className="stroke-highlighter"
            d="M15.5 9.5H7.5V10.5H15.5V9.5Z"
            fill="#7F7F7F"
          />
          <path
            className="stroke-highlighter"
            d="M7.5 9.5V8.25H6.25V9.5H7.5ZM15.5 9.5H16.75V8.25H15.5V9.5ZM15.5 10.5V11.75H16.75V10.5H15.5ZM7.5 10.5H6.25V11.75H7.5V10.5ZM7.5 10.75H15.5V8.25H7.5V10.75ZM14.25 9.5V10.5H16.75V9.5H14.25ZM15.5 9.25H7.5V11.75H15.5V9.25ZM8.75 10.5V9.5H6.25V10.5H8.75Z"
            fill="#7F7F7F"
            mask="url(#path-5-inside-3_2581_616)"
          />
          <mask id="path-7-inside-4_2581_616" fill="white">
            <path d="M15.5 13.5H7.5V14.5H15.5V13.5Z" />
          </mask>
          <path
            className="stroke-highlighter"
            d="M15.5 13.5H7.5V14.5H15.5V13.5Z"
            fill="#7F7F7F"
          />
          <path
            className="stroke-highlighter"
            d="M7.5 13.5V12.25H6.25V13.5H7.5ZM15.5 13.5H16.75V12.25H15.5V13.5ZM15.5 14.5V15.75H16.75V14.5H15.5ZM7.5 14.5H6.25V15.75H7.5V14.5ZM7.5 14.75H15.5V12.25H7.5V14.75ZM14.25 13.5V14.5H16.75V13.5H14.25ZM15.5 13.25H7.5V15.75H15.5V13.25ZM8.75 14.5V13.5H6.25V14.5H8.75Z"
            fill="#7F7F7F"
            mask="url(#path-7-inside-4_2581_616)"
          />
          <mask id="path-9-inside-5_2581_616" fill="white">
            <path d="M0.75 11.5V12.4434L3.52928 15.4974L6.25 12.4403V11.5H3.975V4.49997H6.25V3.55653L3.47072 0.502533L0.75 3.55969V4.49997H2.975V11.5H0.75ZM2.14181 3.49997L3.47903 1.99741L4.84644 3.49997H2.14181ZM4.85819 12.5L3.52097 14.0025L2.15356 12.5H4.85819Z" />
          </mask>
          <path
            className="stroke-highlighter"
            d="M0.75 11.5V12.4434L3.52928 15.4974L6.25 12.4403V11.5H3.975V4.49997H6.25V3.55653L3.47072 0.502533L0.75 3.55969V4.49997H2.975V11.5H0.75ZM2.14181 3.49997L3.47903 1.99741L4.84644 3.49997H2.14181ZM4.85819 12.5L3.52097 14.0025L2.15356 12.5H4.85819Z"
            fill="#7F7F7F"
          />
          <path
            className="stroke-highlighter"
            d="M0.75 11.5V10.25H-0.5V11.5H0.75ZM0.75 12.4434H-0.5V12.927L-0.174485 13.2847L0.75 12.4434ZM3.52928 15.4974L2.6048 16.3387L3.53965 17.366L4.46305 16.3284L3.52928 15.4974ZM6.25 12.4403L7.18377 13.2713L7.5 12.9159V12.4403H6.25ZM6.25 11.5H7.5V10.25H6.25V11.5ZM3.975 11.5H2.725V12.75H3.975V11.5ZM3.975 4.49997V3.24997H2.725V4.49997H3.975ZM6.25 4.49997V5.74997H7.5V4.49997H6.25ZM6.25 3.55653H7.5V3.0729L7.17449 2.71521L6.25 3.55653ZM3.47072 0.502533L4.3952 -0.338791L3.46035 -1.36606L2.53695 -0.328476L3.47072 0.502533ZM0.75 3.55969L-0.183769 2.72868L-0.5 3.08402V3.55969H0.75ZM0.75 4.49997H-0.5V5.74997H0.75V4.49997ZM2.975 4.49997H4.225V3.24997H2.975V4.49997ZM2.975 11.5V12.75H4.225V11.5H2.975ZM2.14181 3.49997L1.20805 2.66896L-0.643968 4.74997H2.14181V3.49997ZM3.47903 1.99741L4.40352 1.15608L3.46866 0.128825L2.54527 1.1664L3.47903 1.99741ZM4.84644 3.49997V4.74997H7.67413L5.77092 2.65864L4.84644 3.49997ZM4.85819 12.5L5.79195 13.331L7.64397 11.25H4.85819V12.5ZM3.52097 14.0025L2.59648 14.8439L3.53134 15.8711L4.45473 14.8335L3.52097 14.0025ZM2.15356 12.5V11.25H-0.674131L1.22908 13.3413L2.15356 12.5ZM-0.5 11.5V12.4434H2V11.5H-0.5ZM-0.174485 13.2847L2.6048 16.3387L4.45377 14.6561L1.67449 11.6021L-0.174485 13.2847ZM4.46305 16.3284L7.18377 13.2713L5.31623 11.6092L2.59551 14.6664L4.46305 16.3284ZM7.5 12.4403V11.5H5V12.4403H7.5ZM6.25 10.25H3.975V12.75H6.25V10.25ZM5.225 11.5V4.49997H2.725V11.5H5.225ZM3.975 5.74997H6.25V3.24997H3.975V5.74997ZM7.5 4.49997V3.55653H5V4.49997H7.5ZM7.17449 2.71521L4.3952 -0.338791L2.54623 1.34386L5.32551 4.39786L7.17449 2.71521ZM2.53695 -0.328476L-0.183769 2.72868L1.68377 4.3907L4.40449 1.33354L2.53695 -0.328476ZM-0.5 3.55969V4.49997H2V3.55969H-0.5ZM0.75 5.74997H2.975V3.24997H0.75V5.74997ZM1.725 4.49997V11.5H4.225V4.49997H1.725ZM2.975 10.25H0.75V12.75H2.975V10.25ZM3.07558 4.33098L4.4128 2.82842L2.54527 1.1664L1.20805 2.66896L3.07558 4.33098ZM2.55455 2.83873L3.92195 4.3413L5.77092 2.65864L4.40352 1.15608L2.55455 2.83873ZM4.84644 2.24997H2.14181V4.74997H4.84644V2.24997ZM3.92442 11.669L2.5872 13.1715L4.45473 14.8335L5.79195 13.331L3.92442 11.669ZM4.44545 13.1612L3.07805 11.6586L1.22908 13.3413L2.59648 14.8439L4.44545 13.1612ZM2.15356 13.75H4.85819V11.25H2.15356V13.75Z"
            fill="#7F7F7F"
            mask="url(#path-9-inside-5_2581_616)"
          />
        </g>
        <defs>
          <clipPath id="clip0_2581_616">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const AlignmentSvg = () => {
    return (
      <svg
        width="24"
        height="23"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M1.5 3.5V4.5H14.5V3.5H1.5ZM1.5 5.5V6.5H10.5V5.5H1.5ZM1.5 7.5V8.5H14.5V7.5H1.5ZM1.5 9.5V10.5H10.5V9.5H1.5ZM1.5 11.5V12.5H14.5V11.5H1.5Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const IncreaseIndentSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M2 3.5C2 3.36739 2.05268 3.24021 2.14645 3.14645C2.24021 3.05268 2.36739 3 2.5 3H13.5C13.6326 3 13.7598 3.05268 13.8536 3.14645C13.9473 3.24021 14 3.36739 14 3.5C14 3.63261 13.9473 3.75979 13.8536 3.85355C13.7598 3.94732 13.6326 4 13.5 4H2.5C2.36739 4 2.24021 3.94732 2.14645 3.85355C2.05268 3.75979 2 3.63261 2 3.5ZM2.646 5.646C2.69245 5.59944 2.74762 5.56249 2.80837 5.53729C2.86911 5.51208 2.93423 5.49911 3 5.49911C3.06577 5.49911 3.13089 5.51208 3.19163 5.53729C3.25238 5.56249 3.30755 5.59944 3.354 5.646L5.354 7.646C5.40056 7.69245 5.43751 7.74762 5.46271 7.80837C5.48792 7.86911 5.50089 7.93423 5.50089 8C5.50089 8.06577 5.48792 8.13089 5.46271 8.19163C5.43751 8.25238 5.40056 8.30755 5.354 8.354L3.354 10.354C3.30751 10.4005 3.25232 10.4374 3.19158 10.4625C3.13084 10.4877 3.06574 10.5006 3 10.5006C2.93426 10.5006 2.86916 10.4877 2.80842 10.4625C2.74768 10.4374 2.69249 10.4005 2.646 10.354C2.59951 10.3075 2.56264 10.2523 2.53748 10.1916C2.51232 10.1308 2.49937 10.0657 2.49937 10C2.49937 9.93426 2.51232 9.86916 2.53748 9.80842C2.56264 9.74768 2.59951 9.69249 2.646 9.646L4.293 8L2.646 6.354C2.59944 6.30755 2.56249 6.25238 2.53729 6.19163C2.51208 6.13089 2.49911 6.06577 2.49911 6C2.49911 5.93423 2.51208 5.86911 2.53729 5.80837C2.56249 5.74762 2.59944 5.69245 2.646 5.646ZM7 6.5C7 6.36739 7.05268 6.24021 7.14645 6.14645C7.24021 6.05268 7.36739 6 7.5 6H13.5C13.6326 6 13.7598 6.05268 13.8536 6.14645C13.9473 6.24021 14 6.36739 14 6.5C14 6.63261 13.9473 6.75979 13.8536 6.85355C13.7598 6.94732 13.6326 7 13.5 7H7.5C7.36739 7 7.24021 6.94732 7.14645 6.85355C7.05268 6.75979 7 6.63261 7 6.5ZM7 9.5C7 9.36739 7.05268 9.24021 7.14645 9.14645C7.24021 9.05268 7.36739 9 7.5 9H13.5C13.6326 9 13.7598 9.05268 13.8536 9.14645C13.9473 9.24021 14 9.36739 14 9.5C14 9.63261 13.9473 9.75979 13.8536 9.85355C13.7598 9.94732 13.6326 10 13.5 10H7.5C7.36739 10 7.24021 9.94732 7.14645 9.85355C7.05268 9.75979 7 9.63261 7 9.5ZM2 12.5C2 12.3674 2.05268 12.2402 2.14645 12.1464C2.24021 12.0527 2.36739 12 2.5 12H13.5C13.6326 12 13.7598 12.0527 13.8536 12.1464C13.9473 12.2402 14 12.3674 14 12.5C14 12.6326 13.9473 12.7598 13.8536 12.8536C13.7598 12.9473 13.6326 13 13.5 13H2.5C2.36739 13 2.24021 12.9473 2.14645 12.8536C2.05268 12.7598 2 12.6326 2 12.5Z"
          fill="#7F7F7F"
          stroke-width="1.25"
        />
      </svg>
    );
  };

  const DecreaseIndentSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <mask id="path-1-inside-1_2581_1252" fill="white">
          <path
            className="fill-hover"
            d="M2 3.5C2 3.36739 2.05268 3.24021 2.14645 3.14645C2.24021 3.05268 2.36739 3 2.5 3H13.5C13.6326 3 13.7598 3.05268 13.8536 3.14645C13.9473 3.24021 14 3.36739 14 3.5C14 3.63261 13.9473 3.75979 13.8536 3.85355C13.7598 3.94732 13.6326 4 13.5 4H2.5C2.36739 4 2.24021 3.94732 2.14645 3.85355C2.05268 3.75979 2 3.63261 2 3.5ZM12.646 5.646C12.7399 5.55211 12.8672 5.49937 13 5.49937C13.1328 5.49937 13.2601 5.55211 13.354 5.646C13.4479 5.73989 13.5006 5.86722 13.5006 6C13.5006 6.13278 13.4479 6.26011 13.354 6.354L11.707 8L13.354 9.646C13.4479 9.73989 13.5006 9.86722 13.5006 10C13.5006 10.1328 13.4479 10.2601 13.354 10.354C13.2601 10.4479 13.1328 10.5006 13 10.5006C12.8672 10.5006 12.7399 10.4479 12.646 10.354L10.646 8.354C10.5994 8.30755 10.5625 8.25238 10.5373 8.19163C10.5121 8.13089 10.4991 8.06577 10.4991 8C10.4991 7.93423 10.5121 7.86911 10.5373 7.80837C10.5625 7.74762 10.5994 7.69245 10.646 7.646L12.646 5.646ZM2 6.5C2 6.36739 2.05268 6.24021 2.14645 6.14645C2.24021 6.05268 2.36739 6 2.5 6H8.5C8.63261 6 8.75979 6.05268 8.85355 6.14645C8.94732 6.24021 9 6.36739 9 6.5C9 6.63261 8.94732 6.75979 8.85355 6.85355C8.75979 6.94732 8.63261 7 8.5 7H2.5C2.36739 7 2.24021 6.94732 2.14645 6.85355C2.05268 6.75979 2 6.63261 2 6.5ZM2 9.5C2 9.36739 2.05268 9.24021 2.14645 9.14645C2.24021 9.05268 2.36739 9 2.5 9H8.5C8.63261 9 8.75979 9.05268 8.85355 9.14645C8.94732 9.24021 9 9.36739 9 9.5C9 9.63261 8.94732 9.75979 8.85355 9.85355C8.75979 9.94732 8.63261 10 8.5 10H2.5C2.36739 10 2.24021 9.94732 2.14645 9.85355C2.05268 9.75979 2 9.63261 2 9.5ZM2 12.5C2 12.3674 2.05268 12.2402 2.14645 12.1464C2.24021 12.0527 2.36739 12 2.5 12H13.5C13.6326 12 13.7598 12.0527 13.8536 12.1464C13.9473 12.2402 14 12.3674 14 12.5C14 12.6326 13.9473 12.7598 13.8536 12.8536C13.7598 12.9473 13.6326 13 13.5 13H2.5C2.36739 13 2.24021 12.9473 2.14645 12.8536C2.05268 12.7598 2 12.6326 2 12.5Z"
          />
        </mask>
        <path
          className="fill-hover"
          d="M2 3.5C2 3.36739 2.05268 3.24021 2.14645 3.14645C2.24021 3.05268 2.36739 3 2.5 3H13.5C13.6326 3 13.7598 3.05268 13.8536 3.14645C13.9473 3.24021 14 3.36739 14 3.5C14 3.63261 13.9473 3.75979 13.8536 3.85355C13.7598 3.94732 13.6326 4 13.5 4H2.5C2.36739 4 2.24021 3.94732 2.14645 3.85355C2.05268 3.75979 2 3.63261 2 3.5ZM12.646 5.646C12.7399 5.55211 12.8672 5.49937 13 5.49937C13.1328 5.49937 13.2601 5.55211 13.354 5.646C13.4479 5.73989 13.5006 5.86722 13.5006 6C13.5006 6.13278 13.4479 6.26011 13.354 6.354L11.707 8L13.354 9.646C13.4479 9.73989 13.5006 9.86722 13.5006 10C13.5006 10.1328 13.4479 10.2601 13.354 10.354C13.2601 10.4479 13.1328 10.5006 13 10.5006C12.8672 10.5006 12.7399 10.4479 12.646 10.354L10.646 8.354C10.5994 8.30755 10.5625 8.25238 10.5373 8.19163C10.5121 8.13089 10.4991 8.06577 10.4991 8C10.4991 7.93423 10.5121 7.86911 10.5373 7.80837C10.5625 7.74762 10.5994 7.69245 10.646 7.646L12.646 5.646ZM2 6.5C2 6.36739 2.05268 6.24021 2.14645 6.14645C2.24021 6.05268 2.36739 6 2.5 6H8.5C8.63261 6 8.75979 6.05268 8.85355 6.14645C8.94732 6.24021 9 6.36739 9 6.5C9 6.63261 8.94732 6.75979 8.85355 6.85355C8.75979 6.94732 8.63261 7 8.5 7H2.5C2.36739 7 2.24021 6.94732 2.14645 6.85355C2.05268 6.75979 2 6.63261 2 6.5ZM2 9.5C2 9.36739 2.05268 9.24021 2.14645 9.14645C2.24021 9.05268 2.36739 9 2.5 9H8.5C8.63261 9 8.75979 9.05268 8.85355 9.14645C8.94732 9.24021 9 9.36739 9 9.5C9 9.63261 8.94732 9.75979 8.85355 9.85355C8.75979 9.94732 8.63261 10 8.5 10H2.5C2.36739 10 2.24021 9.94732 2.14645 9.85355C2.05268 9.75979 2 9.63261 2 9.5ZM2 12.5C2 12.3674 2.05268 12.2402 2.14645 12.1464C2.24021 12.0527 2.36739 12 2.5 12H13.5C13.6326 12 13.7598 12.0527 13.8536 12.1464C13.9473 12.2402 14 12.3674 14 12.5C14 12.6326 13.9473 12.7598 13.8536 12.8536C13.7598 12.9473 13.6326 13 13.5 13H2.5C2.36739 13 2.24021 12.9473 2.14645 12.8536C2.05268 12.7598 2 12.6326 2 12.5Z"
          fill="#7F7F7F"
        />
        <path
          className="fill-hover"
          d="M2.5 3V4.25V3ZM13 5.49937V6.74937V5.49937ZM13.354 6.354L14.2376 7.23815L14.2379 7.23788L13.354 6.354ZM11.707 8L10.8234 7.11585L9.9387 8L10.8234 8.88415L11.707 8ZM13.354 9.646L14.2379 8.76212L14.2376 8.76185L13.354 9.646ZM13 10.5006V11.7506V10.5006ZM12.646 10.354L11.7621 11.2379L12.646 10.354ZM10.646 8.354L11.5299 7.47012L11.5288 7.469L10.646 8.354ZM10.646 7.646L11.5288 8.531L11.5299 8.52988L10.646 7.646ZM3.25 3.5C3.25 3.69891 3.17098 3.88968 3.03033 4.03033L1.26256 2.26256C0.934375 2.59075 0.75 3.03587 0.75 3.5H3.25ZM3.03033 4.03033C2.88968 4.17098 2.69891 4.25 2.5 4.25V1.75C2.03587 1.75 1.59075 1.93438 1.26256 2.26256L3.03033 4.03033ZM2.5 4.25H13.5V1.75H2.5V4.25ZM13.5 4.25C13.3011 4.25 13.1103 4.17098 12.9697 4.03033L14.7374 2.26256C14.4092 1.93437 13.9641 1.75 13.5 1.75V4.25ZM12.9697 4.03033C12.829 3.88968 12.75 3.69891 12.75 3.5H15.25C15.25 3.03587 15.0656 2.59075 14.7374 2.26256L12.9697 4.03033ZM12.75 3.5C12.75 3.30109 12.829 3.11032 12.9697 2.96967L14.7374 4.73744C15.0656 4.40925 15.25 3.96413 15.25 3.5H12.75ZM12.9697 2.96967C13.1103 2.82902 13.3011 2.75 13.5 2.75V5.25C13.9641 5.25 14.4092 5.06563 14.7374 4.73744L12.9697 2.96967ZM13.5 2.75H2.5V5.25H13.5V2.75ZM2.5 2.75C2.69891 2.75 2.88968 2.82902 3.03033 2.96967L1.26256 4.73744C1.59075 5.06562 2.03587 5.25 2.5 5.25V2.75ZM3.03033 2.96967C3.17098 3.11032 3.25 3.30109 3.25 3.5H0.75C0.75 3.96413 0.934375 4.40925 1.26256 4.73744L3.03033 2.96967ZM13.5299 6.52988C13.3893 6.67042 13.1987 6.74937 13 6.74937V4.24937C12.5357 4.24937 12.0904 4.43381 11.7621 4.76212L13.5299 6.52988ZM13 6.74937C12.8013 6.74937 12.6107 6.67042 12.4701 6.52988L14.2379 4.76212C13.9096 4.43381 13.4643 4.24937 13 4.24937V6.74937ZM12.4701 6.52988C12.3296 6.38935 12.2506 6.19874 12.2506 6H14.7506C14.7506 5.53571 14.5662 5.09043 14.2379 4.76212L12.4701 6.52988ZM12.2506 6C12.2506 5.80126 12.3296 5.61065 12.4701 5.47012L14.2379 7.23788C14.5662 6.90957 14.7506 6.46429 14.7506 6H12.2506ZM12.4704 5.46985L10.8234 7.11585L12.5906 8.88415L14.2376 7.23815L12.4704 5.46985ZM10.8234 8.88415L12.4704 10.5302L14.2376 8.76185L12.5906 7.11585L10.8234 8.88415ZM12.4701 10.5299C12.3296 10.3893 12.2506 10.1987 12.2506 10H14.7506C14.7506 9.53571 14.5662 9.09043 14.2379 8.76212L12.4701 10.5299ZM12.2506 10C12.2506 9.80126 12.3296 9.61065 12.4701 9.47012L14.2379 11.2379C14.5662 10.9096 14.7506 10.4643 14.7506 10H12.2506ZM12.4701 9.47012C12.6107 9.32958 12.8013 9.25063 13 9.25063V11.7506C13.4643 11.7506 13.9096 11.5662 14.2379 11.2379L12.4701 9.47012ZM13 9.25063C13.1987 9.25063 13.3893 9.32958 13.5299 9.47012L11.7621 11.2379C12.0904 11.5662 12.5357 11.7506 13 11.7506V9.25063ZM13.5299 9.47012L11.5299 7.47012L9.76212 9.23788L11.7621 11.2379L13.5299 9.47012ZM11.5288 7.469C11.5986 7.53867 11.654 7.62144 11.6918 7.71255L9.38274 8.67072C9.47096 8.88332 9.60026 9.07644 9.76323 9.239L11.5288 7.469ZM11.6918 7.71255C11.7296 7.80367 11.7491 7.90135 11.7491 8H9.24911C9.24911 8.23019 9.29452 8.45811 9.38274 8.67072L11.6918 7.71255ZM11.7491 8C11.7491 8.09865 11.7296 8.19633 11.6918 8.28745L9.38274 7.32928C9.29452 7.54189 9.24911 7.76981 9.24911 8H11.7491ZM11.6918 8.28745C11.654 8.37856 11.5986 8.46133 11.5288 8.531L9.76323 6.761C9.60026 6.92356 9.47096 7.11668 9.38274 7.32928L11.6918 8.28745ZM11.5299 8.52988L13.5299 6.52988L11.7621 4.76212L9.76212 6.76212L11.5299 8.52988ZM3.25 6.5C3.25 6.69891 3.17098 6.88968 3.03033 7.03033L1.26256 5.26256C0.934375 5.59075 0.75 6.03587 0.75 6.5H3.25ZM3.03033 7.03033C2.88968 7.17098 2.69891 7.25 2.5 7.25V4.75C2.03587 4.75 1.59075 4.93438 1.26256 5.26256L3.03033 7.03033ZM2.5 7.25H8.5V4.75H2.5V7.25ZM8.5 7.25C8.30109 7.25 8.11032 7.17098 7.96967 7.03033L9.73744 5.26256C9.40925 4.93437 8.96413 4.75 8.5 4.75V7.25ZM7.96967 7.03033C7.82902 6.88968 7.75 6.69891 7.75 6.5H10.25C10.25 6.03587 10.0656 5.59075 9.73744 5.26256L7.96967 7.03033ZM7.75 6.5C7.75 6.30109 7.82902 6.11032 7.96967 5.96967L9.73744 7.73744C10.0656 7.40925 10.25 6.96413 10.25 6.5H7.75ZM7.96967 5.96967C8.11032 5.82902 8.30109 5.75 8.5 5.75V8.25C8.96413 8.25 9.40925 8.06563 9.73744 7.73744L7.96967 5.96967ZM8.5 5.75H2.5V8.25H8.5V5.75ZM2.5 5.75C2.69891 5.75 2.88968 5.82902 3.03033 5.96967L1.26256 7.73744C1.59075 8.06562 2.03587 8.25 2.5 8.25V5.75ZM3.03033 5.96967C3.17098 6.11032 3.25 6.30109 3.25 6.5H0.75C0.75 6.96413 0.934375 7.40925 1.26256 7.73744L3.03033 5.96967ZM3.25 9.5C3.25 9.69891 3.17098 9.88968 3.03033 10.0303L1.26256 8.26256C0.934374 8.59075 0.75 9.03587 0.75 9.5H3.25ZM3.03033 10.0303C2.88968 10.171 2.69891 10.25 2.5 10.25V7.75C2.03587 7.75 1.59075 7.93437 1.26256 8.26256L3.03033 10.0303ZM2.5 10.25H8.5V7.75H2.5V10.25ZM8.5 10.25C8.30109 10.25 8.11032 10.171 7.96967 10.0303L9.73744 8.26256C9.40925 7.93437 8.96413 7.75 8.5 7.75V10.25ZM7.96967 10.0303C7.82902 9.88968 7.75 9.69891 7.75 9.5H10.25C10.25 9.03587 10.0656 8.59075 9.73744 8.26256L7.96967 10.0303ZM7.75 9.5C7.75 9.30109 7.82902 9.11032 7.96967 8.96967L9.73744 10.7374C10.0656 10.4092 10.25 9.96413 10.25 9.5H7.75ZM7.96967 8.96967C8.11032 8.82902 8.30109 8.75 8.5 8.75V11.25C8.96413 11.25 9.40925 11.0656 9.73744 10.7374L7.96967 8.96967ZM8.5 8.75H2.5V11.25H8.5V8.75ZM2.5 8.75C2.69891 8.75 2.88968 8.82902 3.03033 8.96967L1.26256 10.7374C1.59075 11.0656 2.03587 11.25 2.5 11.25V8.75ZM3.03033 8.96967C3.17098 9.11032 3.25 9.30109 3.25 9.5H0.75C0.75 9.96413 0.934374 10.4092 1.26256 10.7374L3.03033 8.96967ZM3.25 12.5C3.25 12.6989 3.17098 12.8897 3.03033 13.0303L1.26256 11.2626C0.934374 11.5908 0.75 12.0359 0.75 12.5H3.25ZM3.03033 13.0303C2.88968 13.171 2.69891 13.25 2.5 13.25V10.75C2.03587 10.75 1.59075 10.9344 1.26256 11.2626L3.03033 13.0303ZM2.5 13.25H13.5V10.75H2.5V13.25ZM13.5 13.25C13.3011 13.25 13.1103 13.171 12.9697 13.0303L14.7374 11.2626C14.4092 10.9344 13.9641 10.75 13.5 10.75V13.25ZM12.9697 13.0303C12.829 12.8897 12.75 12.6989 12.75 12.5H15.25C15.25 12.0359 15.0656 11.5908 14.7374 11.2626L12.9697 13.0303ZM12.75 12.5C12.75 12.3011 12.829 12.1103 12.9697 11.9697L14.7374 13.7374C15.0656 13.4092 15.25 12.9641 15.25 12.5H12.75ZM12.9697 11.9697C13.1103 11.829 13.3011 11.75 13.5 11.75V14.25C13.9641 14.25 14.4092 14.0656 14.7374 13.7374L12.9697 11.9697ZM13.5 11.75H2.5V14.25H13.5V11.75ZM2.5 11.75C2.69891 11.75 2.88968 11.829 3.03033 11.9697L1.26256 13.7374C1.59075 14.0656 2.03587 14.25 2.5 14.25V11.75ZM3.03033 11.9697C3.17098 12.1103 3.25 12.3011 3.25 12.5H0.75C0.75 12.9641 0.934374 13.4092 1.26256 13.7374L3.03033 11.9697Z"
          fill="#7F7F7F"
          mask="url(#path-1-inside-1_2581_1252)"
        />
      </svg>
    );
  };

  const PageBreakSvg = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g clip-path="url(#clip0_2376_7709)">
      <path d="M14 4.5V9H13V4.5H11C10.6022 4.5 10.2206 4.34196 9.93934 4.06066C9.65804 3.77936 9.5 3.39782 9.5 3V1H4C3.73478 1 3.48043 1.10536 3.29289 1.29289C3.10536 1.48043 3 1.73478 3 2V9H2V2C2 1.46957 2.21071 0.960859 2.58579 0.585786C2.96086 0.210714 3.46957 0 4 0L9.5 0L14 4.5ZM13 12H14V14C14 14.5304 13.7893 15.0391 13.4142 15.4142C13.0391 15.7893 12.5304 16 12 16H4C3.46957 16 2.96086 15.7893 2.58579 15.4142C2.21071 15.0391 2 14.5304 2 14V12H3V14C3 14.2652 3.10536 14.5196 3.29289 14.7071C3.48043 14.8946 3.73478 15 4 15H12C12.2652 15 12.5196 14.8946 12.7071 14.7071C12.8946 14.5196 13 14.2652 13 14V12ZM0.5 10C0.367392 10 0.240215 10.0527 0.146447 10.1464C0.0526784 10.2402 0 10.3674 0 10.5C0 10.6326 0.0526784 10.7598 0.146447 10.8536C0.240215 10.9473 0.367392 11 0.5 11H15.5C15.6326 11 15.7598 10.9473 15.8536 10.8536C15.9473 10.7598 16 10.6326 16 10.5C16 10.3674 15.9473 10.2402 15.8536 10.1464C15.7598 10.0527 15.6326 10 15.5 10H0.5Z" fill="#7F7F7F"/>
      </g>
      <defs>
      <clipPath id="clip0_2376_7709">
      <rect width="16" height="16" fill="white"/>
      </clipPath>
      </defs>
      </svg>
    )
  }

  const MarginSvg = () => {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M3.90909 1V17M14.0909 1V17M1 3.90909H17M1 14.0909H17M1.66667 17H16.3333C16.7015 17 17 16.6744 17 16.2727V1.72727C17 1.32561 16.7015 1 16.3333 1H1.66667C1.29848 1 1 1.32561 1 1.72727V16.2727C1 16.6744 1.29848 17 1.66667 17Z"
          stroke="#7F7F7F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const OrientationSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M16 10.4444V14.8889C16 15.1836 15.8703 15.4662 15.6395 15.6746C15.4087 15.8829 15.0957 16 14.7692 16H4.92308C4.59666 16 4.28361 15.8829 4.05279 15.6746C3.82198 15.4662 3.69231 15.1836 3.69231 14.8889V8.22222C3.69231 7.92754 3.82198 7.64492 4.05279 7.43655C4.28361 7.22817 4.59666 7.11111 4.92308 7.11111H12.3077L16 10.4444ZM4.92308 8.22222V14.8889H14.7692V11H11.6923V8.22222H4.92308Z"
          fill="#7F7F7F"
        />
        <path
          className="stroke-highlighter"
          d="M6.15385 1.18519L1.23077 1.18519C0.904349 1.18519 0.591298 1.31005 0.360484 1.53232C0.12967 1.75458 0 2.05604 0 2.37037V11.8519C0 12.1662 0.12967 12.4676 0.360484 12.6899C0.591298 12.9122 0.904349 13.037 1.23077 13.037H8.61539C8.9418 13.037 9.25486 12.9122 9.48567 12.6899C9.71648 12.4676 9.84615 12.1662 9.84615 11.8519V4.74074L6.15385 1.18519ZM8.61539 11.8519H1.23077V2.37037H5.53846V5.33333H8.61539V11.8519Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const PageSizeSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.8609 0H3.33913C3.26261 0 3.2 0.0631579 3.2 0.140351V1.19298C3.2 1.27018 3.26261 1.33333 3.33913 1.33333H15.8609C15.9374 1.33333 16 1.27018 16 1.19298V0.140351C16 0.0631579 15.9374 0 15.8609 0ZM0 2.81159V15.8551C0 15.9348 0.0757895 16 0.168421 16H1.43158C1.52421 16 1.6 15.9348 1.6 15.8551V2.81159C1.6 2.73188 1.52421 2.66667 1.43158 2.66667H0.168421C0.0757895 2.66667 0 2.73188 0 2.81159ZM14.4 7.22L10.536 4H4.8V14.6667H14.4V7.22ZM4.8 2.66667H11.2L16 6.66667V14.6667C16 15.4 15.28 16 14.4 16H4.8C3.92 16 3.2 15.4 3.2 14.6667V4C3.2 3.26667 3.92 2.66667 4.8 2.66667Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const TrackChangeSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M13.3332 7.66665V4.66665L10.3332 1.33331H3.33317C2.96498 1.33331 2.6665 1.63179 2.6665 1.99998V14C2.6665 14.3682 2.96498 14.6666 3.33317 14.6666H7.33317"
          stroke="#7F7F7F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          d="M10.6668 14.6667L14.0002 11.3333L12.6668 10L9.3335 13.3333V14.6667H10.6668Z"
          stroke="#7F7F7F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10 1.33331V4.66665H13.3333"
          stroke="#7F7F7F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const TableSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <mask id="path-1-inside-1_2581_1385" fill="white">
          <path d="M1.75 14.75H14.25C14.3826 14.75 14.5098 14.6973 14.6036 14.6036C14.6973 14.5098 14.75 14.3826 14.75 14.25V1.75C14.75 1.61739 14.6973 1.49021 14.6036 1.39645C14.5098 1.30268 14.3826 1.25 14.25 1.25H1.75C1.61739 1.25 1.49021 1.30268 1.39645 1.39645C1.30268 1.49021 1.25 1.61739 1.25 1.75V14.25C1.25 14.3826 1.30268 14.5098 1.39645 14.6036C1.49021 14.6973 1.61739 14.75 1.75 14.75ZM8.5 2.25H13.75V7.5H8.5V2.25ZM8.5 8.5H13.75V13.75H8.5V8.5ZM2.25 2.25H7.5V7.5H2.25V2.25ZM2.25 8.5H7.5V13.75H2.25V8.5Z" />
        </mask>
        <path
          className="stroke-highlighter"
          d="M1.75 14.75H14.25C14.3826 14.75 14.5098 14.6973 14.6036 14.6036C14.6973 14.5098 14.75 14.3826 14.75 14.25V1.75C14.75 1.61739 14.6973 1.49021 14.6036 1.39645C14.5098 1.30268 14.3826 1.25 14.25 1.25H1.75C1.61739 1.25 1.49021 1.30268 1.39645 1.39645C1.30268 1.49021 1.25 1.61739 1.25 1.75V14.25C1.25 14.3826 1.30268 14.5098 1.39645 14.6036C1.49021 14.6973 1.61739 14.75 1.75 14.75ZM8.5 2.25H13.75V7.5H8.5V2.25ZM8.5 8.5H13.75V13.75H8.5V8.5ZM2.25 2.25H7.5V7.5H2.25V2.25ZM2.25 8.5H7.5V13.75H2.25V8.5Z"
          fill="#7F7F7F"
        />
        <path
          className="stroke-highlighter"
          d="M14.25 1.25V0V1.25ZM1.75 1.25V0V1.25ZM1.25 1.75H0H1.25ZM1.25 14.25H0H1.25ZM8.5 2.25V1H7.25V2.25H8.5ZM13.75 2.25H15V1H13.75V2.25ZM13.75 7.5V8.75H15V7.5H13.75ZM8.5 7.5H7.25V8.75H8.5V7.5ZM8.5 8.5V7.25H7.25V8.5H8.5ZM13.75 8.5H15V7.25H13.75V8.5ZM13.75 13.75V15H15V13.75H13.75ZM8.5 13.75H7.25V15H8.5V13.75ZM2.25 2.25V1H1V2.25H2.25ZM7.5 2.25H8.75V1H7.5V2.25ZM7.5 7.5V8.75H8.75V7.5H7.5ZM2.25 7.5H1V8.75H2.25V7.5ZM2.25 8.5V7.25H1V8.5H2.25ZM7.5 8.5H8.75V7.25H7.5V8.5ZM7.5 13.75V15H8.75V13.75H7.5ZM2.25 13.75H1V15H2.25V13.75ZM1.75 16H14.25V13.5H1.75V16ZM14.25 16C14.7141 16 15.1592 15.8156 15.4874 15.4874L13.7197 13.7197C13.8603 13.579 14.0511 13.5 14.25 13.5V16ZM15.4874 15.4874C15.8156 15.1592 16 14.7141 16 14.25H13.5C13.5 14.0511 13.579 13.8603 13.7197 13.7197L15.4874 15.4874ZM16 14.25V1.75H13.5V14.25H16ZM16 1.75C16 1.28587 15.8156 0.840754 15.4874 0.512563L13.7197 2.28033C13.579 2.13968 13.5 1.94891 13.5 1.75H16ZM15.4874 0.512563C15.1592 0.184374 14.7141 0 14.25 0V2.5C14.0511 2.5 13.8603 2.42098 13.7197 2.28033L15.4874 0.512563ZM14.25 0H1.75V2.5H14.25V0ZM1.75 0C1.28587 0 0.840752 0.184374 0.512563 0.512563L2.28033 2.28033C2.13968 2.42098 1.94891 2.5 1.75 2.5V0ZM0.512563 0.512563C0.184374 0.840752 0 1.28587 0 1.75H2.5C2.5 1.94891 2.42098 2.13968 2.28033 2.28033L0.512563 0.512563ZM0 1.75V14.25H2.5V1.75H0ZM0 14.25C0 14.7141 0.184374 15.1592 0.512563 15.4874L2.28033 13.7197C2.42098 13.8603 2.5 14.0511 2.5 14.25H0ZM0.512563 15.4874C0.840754 15.8156 1.28587 16 1.75 16V13.5C1.94891 13.5 2.13968 13.579 2.28033 13.7197L0.512563 15.4874ZM8.5 3.5H13.75V1H8.5V3.5ZM12.5 2.25V7.5H15V2.25H12.5ZM13.75 6.25H8.5V8.75H13.75V6.25ZM9.75 7.5V2.25H7.25V7.5H9.75ZM8.5 9.75H13.75V7.25H8.5V9.75ZM12.5 8.5V13.75H15V8.5H12.5ZM13.75 12.5H8.5V15H13.75V12.5ZM9.75 13.75V8.5H7.25V13.75H9.75ZM2.25 3.5H7.5V1H2.25V3.5ZM6.25 2.25V7.5H8.75V2.25H6.25ZM7.5 6.25H2.25V8.75H7.5V6.25ZM3.5 7.5V2.25H1V7.5H3.5ZM2.25 9.75H7.5V7.25H2.25V9.75ZM6.25 8.5V13.75H8.75V8.5H6.25ZM7.5 12.5H2.25V15H7.5V12.5ZM3.5 13.75V8.5H1V13.75H3.5Z"
          fill="#7F7F7F"
          mask="url(#path-1-inside-1_2581_1385)"
        />
      </svg>
    );
  };

  const LinkSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_2510_956)">
          <mask id="path-1-inside-1_2510_956" fill="white">
            <path d="M14.2959 1.74481C12.6388 0.0877485 9.94252 0.0877485 8.28549 1.74481L5.28027 4.75003L5.98743 5.45712L8.99259 2.4519C9.60208 1.84241 10.4287 1.5 11.2907 1.50001C12.1526 1.50001 12.9793 1.84242 13.5888 2.45192C14.1983 3.06142 14.5407 3.88807 14.5407 4.75002C14.5407 5.61198 14.1983 6.43863 13.5888 7.04812L10.5836 10.0533L11.2906 10.7604L14.2958 7.75522C15.9531 6.09816 15.9531 3.4019 14.2959 1.74481Z" />
          </mask>
          <path
            className="fill-hover"
            d="M14.2959 1.74481C12.6388 0.0877485 9.94252 0.0877485 8.28549 1.74481L5.28027 4.75003L5.98743 5.45712L8.99259 2.4519C9.60208 1.84241 10.4287 1.5 11.2907 1.50001C12.1526 1.50001 12.9793 1.84242 13.5888 2.45192C14.1983 3.06142 14.5407 3.88807 14.5407 4.75002C14.5407 5.61198 14.1983 6.43863 13.5888 7.04812L10.5836 10.0533L11.2906 10.7604L14.2958 7.75522C15.9531 6.09816 15.9531 3.4019 14.2959 1.74481Z"
            fill="#7F7F7F"
          />
          <path
            className="fill-hover"
            d="M14.2959 1.74481L13.412 2.62869L13.412 2.62872L14.2959 1.74481ZM8.28549 1.74481L9.16938 2.62869L9.16938 2.62869L8.28549 1.74481ZM5.28027 4.75003L4.39639 3.86615L3.51247 4.75007L4.39643 5.63395L5.28027 4.75003ZM5.98743 5.45712L5.10359 6.34105L5.98748 7.22486L6.87132 6.341L5.98743 5.45712ZM8.99259 2.4519L8.10871 1.56802L8.10869 1.56803L8.99259 2.4519ZM13.5888 7.04812L12.7049 6.16424L12.7049 6.16424L13.5888 7.04812ZM10.5836 10.0533L9.69967 9.16946L8.81585 10.0533L9.69961 10.9372L10.5836 10.0533ZM11.2906 10.7604L10.4066 11.6443L11.2905 12.5283L12.1744 11.6443L11.2906 10.7604ZM14.2958 7.75522L13.4119 6.87128L13.4119 6.87133L14.2958 7.75522ZM15.1798 0.860928C13.0345 -1.28429 9.54679 -1.2843 7.4016 0.860936L9.16938 2.62869C10.3383 1.45979 12.2431 1.45978 13.412 2.62869L15.1798 0.860928ZM7.40161 0.860928L4.39639 3.86615L6.16416 5.63391L9.16938 2.62869L7.40161 0.860928ZM4.39643 5.63395L5.10359 6.34105L6.87127 4.5732L6.16412 3.86611L4.39643 5.63395ZM6.87132 6.341L9.87648 3.33578L8.10869 1.56803L5.10354 4.57325L6.87132 6.341ZM9.87647 3.33579C10.2515 2.96072 10.7603 2.75001 11.2907 2.75001L11.2907 0.250008C10.0972 0.250004 8.95262 0.724106 8.10871 1.56802L9.87647 3.33579ZM11.2907 2.75001C11.8211 2.75001 12.3298 2.96073 12.7049 3.3358L14.4727 1.56804C13.6288 0.724122 12.4842 0.250012 11.2907 0.250008L11.2907 2.75001ZM12.7049 3.3358C13.08 3.71088 13.2907 4.21959 13.2907 4.75002L15.7907 4.75003C15.7907 3.55655 15.3166 2.41196 14.4727 1.56804L12.7049 3.3358ZM13.2907 4.75002C13.2907 5.28046 13.08 5.78916 12.7049 6.16424L14.4727 7.93201C15.3166 7.0881 15.7907 5.9435 15.7907 4.75003L13.2907 4.75002ZM12.7049 6.16424L9.69967 9.16946L11.4674 10.9372L14.4727 7.93201L12.7049 6.16424ZM9.69961 10.9372L10.4066 11.6443L12.1745 9.87661L11.4675 9.16952L9.69961 10.9372ZM12.1744 11.6443L15.1797 8.6391L13.4119 6.87133L10.4067 9.87655L12.1744 11.6443ZM15.1796 8.63916C17.3251 6.49393 17.3251 3.00616 15.1797 0.860903L13.412 2.62872C14.581 3.79765 14.581 5.70238 13.4119 6.87128L15.1796 8.63916Z"
            fill="#7F7F7F"
            mask="url(#path-1-inside-1_2510_956)"
          />
          <mask id="path-3-inside-2_2510_956" fill="white">
            <path d="M7.04794 13.5889C6.43844 14.1984 5.61179 14.5408 4.74984 14.5408C3.88789 14.5408 3.06124 14.1984 2.45175 13.5889C1.84226 12.9794 1.49985 12.1528 1.49985 11.2908C1.49985 10.4289 1.84226 9.60221 2.45175 8.99272L5.28022 6.16425L4.57312 5.45715L1.74462 8.28562C1.34843 8.67993 1.03392 9.14852 0.819092 9.66456C0.604264 10.1806 0.493342 10.7339 0.492679 11.2929C0.492015 11.8519 0.601623 12.4055 0.815225 12.922C1.02883 13.4386 1.34223 13.9079 1.73748 14.3032C2.13273 14.6984 2.60207 15.0118 3.11862 15.2254C3.63517 15.439 4.18877 15.5486 4.74774 15.548C5.30671 15.5473 5.86006 15.4364 6.3761 15.2215C6.89213 15.0067 7.36072 14.6922 7.75503 14.296L10.5835 11.4676L9.87637 10.7605L7.04794 13.5889Z" />
          </mask>
          <path
            className="fill-hover"
            d="M7.04794 13.5889C6.43844 14.1984 5.61179 14.5408 4.74984 14.5408C3.88789 14.5408 3.06124 14.1984 2.45175 13.5889C1.84226 12.9794 1.49985 12.1528 1.49985 11.2908C1.49985 10.4289 1.84226 9.60221 2.45175 8.99272L5.28022 6.16425L4.57312 5.45715L1.74462 8.28562C1.34843 8.67993 1.03392 9.14852 0.819092 9.66456C0.604264 10.1806 0.493342 10.7339 0.492679 11.2929C0.492015 11.8519 0.601623 12.4055 0.815225 12.922C1.02883 13.4386 1.34223 13.9079 1.73748 14.3032C2.13273 14.6984 2.60207 15.0118 3.11862 15.2254C3.63517 15.439 4.18877 15.5486 4.74774 15.548C5.30671 15.5473 5.86006 15.4364 6.3761 15.2215C6.89213 15.0067 7.36072 14.6922 7.75503 14.296L10.5835 11.4676L9.87637 10.7605L7.04794 13.5889Z"
            fill="#7F7F7F"
          />
          <path
            className="fill-hover"
            d="M7.04794 13.5889L7.93182 14.4728L7.93182 14.4728L7.04794 13.5889ZM4.74984 14.5408V13.2908V14.5408ZM2.45175 8.99272L1.56786 8.10883L1.56786 8.10883L2.45175 8.99272ZM5.28022 6.16425L6.1641 7.04813L7.04798 6.16425L6.1641 5.28036L5.28022 6.16425ZM4.57312 5.45715L5.45701 4.57327L4.57313 3.68939L3.68924 4.57327L4.57312 5.45715ZM1.74462 8.28562L2.62641 9.17161L2.6285 9.16951L1.74462 8.28562ZM7.75503 14.296L6.87114 13.4121L6.86904 13.4142L7.75503 14.296ZM10.5835 11.4676L11.4674 12.3514L12.3512 11.4676L11.4674 10.5837L10.5835 11.4676ZM9.87637 10.7605L10.7603 9.87658L9.87637 8.9927L8.99249 9.87658L9.87637 10.7605ZM6.16405 12.705C5.78898 13.0801 5.28027 13.2908 4.74984 13.2908V15.7908C5.94332 15.7908 7.08791 15.3167 7.93182 14.4728L6.16405 12.705ZM4.74984 13.2908C4.21941 13.2908 3.7107 13.0801 3.33563 12.705L1.56787 14.4728C2.41178 15.3167 3.55637 15.7908 4.74984 15.7908V13.2908ZM3.33563 12.705C2.96056 12.3299 2.74985 11.8212 2.74985 11.2908H0.249849C0.249849 12.4843 0.723952 13.6289 1.56786 14.4728L3.33563 12.705ZM2.74985 11.2908C2.74985 10.7604 2.96056 10.2517 3.33563 9.8766L1.56786 8.10883C0.723953 8.95275 0.249849 10.0973 0.249849 11.2908H2.74985ZM3.33563 9.8766L6.1641 7.04813L4.39633 5.28036L1.56786 8.10883L3.33563 9.8766ZM6.1641 5.28036L5.45701 4.57327L3.68924 6.34104L4.39633 7.04813L6.1641 5.28036ZM3.68924 4.57327L0.860745 7.40173L2.6285 9.16951L5.457 6.34104L3.68924 4.57327ZM0.862843 7.39964C0.350128 7.90992 -0.0568902 8.51634 -0.334903 9.18415L1.97309 10.145C2.12473 9.78071 2.34674 9.44994 2.6264 9.1716L0.862843 7.39964ZM-0.334903 9.18415C-0.612916 9.85196 -0.756462 10.5681 -0.75732 11.2914L1.74268 11.2944C1.74315 10.8998 1.82144 10.5092 1.97309 10.145L-0.334903 9.18415ZM-0.75732 11.2914C-0.758179 12.0148 -0.616334 12.7312 -0.339907 13.3997L1.97036 12.4444C1.81958 12.0797 1.74221 11.689 1.74268 11.2944L-0.75732 11.2914ZM-0.339907 13.3997C-0.0634806 14.0682 0.342097 14.6756 0.853599 15.1871L2.62136 13.4193C2.34236 13.1403 2.12114 12.809 1.97036 12.4444L-0.339907 13.3997ZM0.853599 15.1871C1.3651 15.6986 1.97248 16.1041 2.64095 16.3806L3.59628 14.0703C3.23166 13.9195 2.90036 13.6983 2.62136 13.4193L0.853599 15.1871ZM2.64095 16.3806C3.30943 16.657 4.02586 16.7988 4.74923 16.798L4.74625 14.298C4.35168 14.2984 3.9609 14.2211 3.59628 14.0703L2.64095 16.3806ZM4.74923 16.798C5.4726 16.7971 6.1887 16.6535 6.85651 16.3755L5.89568 14.0675C5.53142 14.2192 5.14082 14.2975 4.74625 14.298L4.74923 16.798ZM6.85651 16.3755C7.52432 16.0975 8.13073 15.6905 8.64102 15.1778L6.86904 13.4142C6.59071 13.6939 6.25994 13.9159 5.89568 14.0675L6.85651 16.3755ZM8.63891 15.1799L11.4674 12.3514L9.69958 10.5837L6.87115 13.4121L8.63891 15.1799ZM11.4674 10.5837L10.7603 9.87658L8.99249 11.6444L9.69958 12.3514L11.4674 10.5837ZM8.99249 9.87658L6.16405 12.705L7.93182 14.4728L10.7603 11.6444L8.99249 9.87658Z"
            fill="#7F7F7F"
            mask="url(#path-3-inside-2_2510_956)"
          />
          <mask id="path-5-inside-3_2510_956" fill="white">
            <path d="M11.114 4.21959L4.04297 11.2906L4.75008 11.9978L11.8212 4.9267L11.114 4.21959Z" />
          </mask>
          <path
            className="fill-hover"
            d="M11.114 4.21959L4.04297 11.2906L4.75008 11.9978L11.8212 4.9267L11.114 4.21959Z"
            fill="#7F7F7F"
          />
          <path
            className="fill-hover"
            d="M4.04297 11.2906L3.15908 10.4068L2.2752 11.2906L3.15908 12.1745L4.04297 11.2906ZM11.114 4.21959L11.9979 3.33571L11.114 2.45183L10.2302 3.33571L11.114 4.21959ZM11.8212 4.9267L12.705 5.81058L13.5889 4.9267L12.705 4.04282L11.8212 4.9267ZM4.75008 11.9978L3.86619 12.8816L4.75008 13.7655L5.63396 12.8816L4.75008 11.9978ZM4.92685 12.1745L11.9979 5.10347L10.2302 3.33571L3.15908 10.4068L4.92685 12.1745ZM10.2302 5.10347L10.9373 5.81058L12.705 4.04282L11.9979 3.33571L10.2302 5.10347ZM10.9373 4.04282L3.86619 11.1139L5.63396 12.8816L12.705 5.81058L10.9373 4.04282ZM5.63396 11.1139L4.92685 10.4068L3.15908 12.1745L3.86619 12.8816L5.63396 11.1139Z"
            fill="#7F7F7F"
            mask="url(#path-5-inside-3_2510_956)"
          />
        </g>
        <defs>
          <clipPath id="clip0_2510_956">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const PictureSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <mask id="path-1-inside-1_2581_1395" fill="white">
          <path d="M1.25 14.75H14.75V1.25H1.25V14.75ZM13.75 10.8794L10.2696 7.39903L11.7259 5.94278L13.75 7.96672V10.8794ZM2.25 2.25H13.75V6.5525L11.726 4.52844L9.5625 6.69194L6.4375 3.56694L2.25 7.75444V2.25ZM2.25 9.16875L6.4375 4.98125L13.75 12.2937V13.75H2.25V9.16875Z" />
        </mask>
        <path
          className="stroke-highlighter"
          d="M1.25 14.75H14.75V1.25H1.25V14.75ZM13.75 10.8794L10.2696 7.39903L11.7259 5.94278L13.75 7.96672V10.8794ZM2.25 2.25H13.75V6.5525L11.726 4.52844L9.5625 6.69194L6.4375 3.56694L2.25 7.75444V2.25ZM2.25 9.16875L6.4375 4.98125L13.75 12.2937V13.75H2.25V9.16875Z"
          fill="#7F7F7F"
        />
        <path
          className="stroke-highlighter"
          d="M1.25 14.75H0V16H1.25V14.75ZM14.75 14.75V16H16V14.75H14.75ZM14.75 1.25H16V0H14.75V1.25ZM1.25 1.25V0H0V1.25H1.25ZM13.75 10.8794L12.8661 11.7633L15 13.8972V10.8794H13.75ZM10.2696 7.39903L9.38574 6.51515L8.50186 7.39903L9.38574 8.28291L10.2696 7.39903ZM11.7259 5.94278L12.6097 5.05886L11.7258 4.17506L10.842 5.0589L11.7259 5.94278ZM13.75 7.96672H15V7.44892L14.6338 7.08279L13.75 7.96672ZM2.25 2.25V1H1V2.25H2.25ZM13.75 2.25H15V1H13.75V2.25ZM13.75 6.5525L12.8661 7.43638L15 9.5703V6.5525H13.75ZM11.726 4.52844L12.6099 3.64456L11.726 2.76066L10.8421 3.64456L11.726 4.52844ZM9.5625 6.69194L8.67862 7.57582L9.56251 8.45971L10.4464 7.57581L9.5625 6.69194ZM6.4375 3.56694L7.32138 2.68305L6.4375 1.79917L5.55362 2.68305L6.4375 3.56694ZM2.25 7.75444H1V10.7722L3.13388 8.63832L2.25 7.75444ZM2.25 9.16875L1.36612 8.28487L1 8.65098V9.16875H2.25ZM6.4375 4.98125L7.32138 4.09737L6.4375 3.21348L5.55362 4.09737L6.4375 4.98125ZM13.75 12.2937H15V11.776L14.6339 11.4099L13.75 12.2937ZM13.75 13.75V15H15V13.75H13.75ZM2.25 13.75H1V15H2.25V13.75ZM1.25 16H14.75V13.5H1.25V16ZM16 14.75V1.25H13.5V14.75H16ZM14.75 0H1.25V2.5H14.75V0ZM0 1.25V14.75H2.5V1.25H0ZM14.6339 9.99556L11.1535 6.51515L9.38574 8.28291L12.8661 11.7633L14.6339 9.99556ZM11.1535 8.28291L12.6098 6.82666L10.842 5.0589L9.38574 6.51515L11.1535 8.28291ZM10.842 6.82671L12.8662 8.85064L14.6338 7.08279L12.6097 5.05886L10.842 6.82671ZM12.5 7.96672V10.8794H15V7.96672H12.5ZM2.25 3.5H13.75V1H2.25V3.5ZM12.5 2.25V6.5525H15V2.25H12.5ZM14.6339 5.66862L12.6099 3.64456L10.8421 5.41231L12.8661 7.43638L14.6339 5.66862ZM10.8421 3.64456L8.67861 5.80806L10.4464 7.57581L12.6099 5.41231L10.8421 3.64456ZM10.4464 5.80805L7.32138 2.68305L5.55362 4.45082L8.67862 7.57582L10.4464 5.80805ZM5.55362 2.68305L1.36612 6.87055L3.13388 8.63832L7.32138 4.45082L5.55362 2.68305ZM3.5 7.75444V2.25H1V7.75444H3.5ZM3.13388 10.0526L7.32138 5.86513L5.55362 4.09737L1.36612 8.28487L3.13388 10.0526ZM5.55362 5.86513L12.8661 13.1776L14.6339 11.4099L7.32138 4.09737L5.55362 5.86513ZM12.5 12.2937V13.75H15V12.2937H12.5ZM13.75 12.5H2.25V15H13.75V12.5ZM3.5 13.75V9.16875H1V13.75H3.5Z"
          fill="#7F7F7F"
          mask="url(#path-1-inside-1_2581_1395)"
        />
      </svg>
    );
  };

  const MediaSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_2581_1400)">
          <path
            className="stroke-highlighter"
            d="M0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0L15 0C15.2652 0 15.5196 0.105357 15.7071 0.292893C15.8946 0.48043 16 0.734784 16 1V15C16 15.2652 15.8946 15.5196 15.7071 15.7071C15.5196 15.8946 15.2652 16 15 16H1C0.734784 16 0.48043 15.8946 0.292893 15.7071C0.105357 15.5196 0 15.2652 0 15V1ZM4 1V7H12V1H4ZM12 9H4V15H12V9ZM1 1V3H3V1H1ZM3 4H1V6H3V4ZM1 7V9H3V7H1ZM3 10H1V12H3V10ZM1 13V15H3V13H1ZM15 1H13V3H15V1ZM13 4V6H15V4H13ZM15 7H13V9H15V7ZM13 10V12H15V10H13ZM15 13H13V15H15V13Z"
            fill="#7F7F7F"
          />
        </g>
        <defs>
          <clipPath id="clip0_2581_1400">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const FormulaSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <mask id="path-1-inside-1_2581_1405" fill="white">
          <path d="M12.5636 6.45147L10.4533 8.49141L10.3581 8.04669L10.3568 8.04044C10.2601 7.6167 10.0269 7.23645 9.69308 6.95819C9.35922 6.67993 8.94318 6.51908 8.50897 6.50037L8.49869 6.49994H6.39919L6.98813 3.75969C7.03616 3.55221 7.15029 3.36595 7.31333 3.22894C7.47638 3.09193 7.67951 3.01159 7.89216 3H9.38081V2H7.88081L7.86022 2.00044C7.42601 2.01918 7.00998 2.18007 6.67614 2.45835C6.34229 2.73663 6.10913 3.11689 6.0125 3.54063L5.37638 6.5H2.75V7.5H5.16144L4.14269 12.2402C4.09466 12.4477 3.98054 12.634 3.8175 12.771C3.65445 12.9081 3.45131 12.9884 3.23866 13H1.75V14H3.26028L3.27056 13.9996C3.70477 13.9808 4.12081 13.82 4.45467 13.5417C4.78853 13.2635 5.02172 12.8832 5.11838 12.4595L6.18438 7.5H8.47716C8.68974 7.51161 8.89281 7.59192 9.05582 7.72887C9.21882 7.86581 9.33296 8.05198 9.38106 8.25937L9.60606 9.31059L6.04784 12.75H7.48666L9.85263 10.4629L10.0111 11.2033L10.0124 11.2096C10.109 11.6333 10.3422 12.0135 10.6761 12.2918C11.01 12.5701 11.426 12.7309 11.8602 12.7496L13.5 12.75V11.75H11.8922C11.6796 11.7384 11.4765 11.6581 11.3135 11.5212C11.1504 11.3842 11.0363 11.198 10.9882 10.9906L10.7 9.64375L14.0024 6.45147H12.5636Z" />
        </mask>
        <path
          className="fill-hover"
          d="M12.5636 6.45147L10.4533 8.49141L10.3581 8.04669L10.3568 8.04044C10.2601 7.6167 10.0269 7.23645 9.69308 6.95819C9.35922 6.67993 8.94318 6.51908 8.50897 6.50037L8.49869 6.49994H6.39919L6.98813 3.75969C7.03616 3.55221 7.15029 3.36595 7.31333 3.22894C7.47638 3.09193 7.67951 3.01159 7.89216 3H9.38081V2H7.88081L7.86022 2.00044C7.42601 2.01918 7.00998 2.18007 6.67614 2.45835C6.34229 2.73663 6.10913 3.11689 6.0125 3.54063L5.37638 6.5H2.75V7.5H5.16144L4.14269 12.2402C4.09466 12.4477 3.98054 12.634 3.8175 12.771C3.65445 12.9081 3.45131 12.9884 3.23866 13H1.75V14H3.26028L3.27056 13.9996C3.70477 13.9808 4.12081 13.82 4.45467 13.5417C4.78853 13.2635 5.02172 12.8832 5.11838 12.4595L6.18438 7.5H8.47716C8.68974 7.51161 8.89281 7.59192 9.05582 7.72887C9.21882 7.86581 9.33296 8.05198 9.38106 8.25937L9.60606 9.31059L6.04784 12.75H7.48666L9.85263 10.4629L10.0111 11.2033L10.0124 11.2096C10.109 11.6333 10.3422 12.0135 10.6761 12.2918C11.01 12.5701 11.426 12.7309 11.8602 12.7496L13.5 12.75V11.75H11.8922C11.6796 11.7384 11.4765 11.6581 11.3135 11.5212C11.1504 11.3842 11.0363 11.198 10.9882 10.9906L10.7 9.64375L14.0024 6.45147H12.5636Z"
          fill="#7F7F7F"
        />
        <path
          className="fill-hover"
          d="M12.5636 6.45147V5.20147H12.0582L11.6948 5.55274L12.5636 6.45147ZM10.4533 8.49141L9.231 8.75303L9.70248 10.9558L11.3221 9.39014L10.4533 8.49141ZM10.3581 8.04669L11.5805 7.78506L11.5789 7.77805L10.3581 8.04669ZM10.3568 8.04044L11.5776 7.77179L11.5755 7.76252L10.3568 8.04044ZM8.50897 6.50037L8.56275 5.25153L8.56209 5.2515L8.50897 6.50037ZM8.49869 6.49994L8.55181 5.25107L8.52526 5.24994H8.49869V6.49994ZM6.39919 6.49994L5.17709 6.23728L4.85199 7.74994H6.39919V6.49994ZM6.98813 3.75969L5.77034 3.47772L5.76811 3.48736L5.76603 3.49703L6.98813 3.75969ZM7.89216 3V1.75H7.85812L7.82414 1.75185L7.89216 3ZM9.38081 3V4.25H10.6308V3H9.38081ZM9.38081 2H10.6308V0.75H9.38081V2ZM7.88081 2V0.75H7.86754L7.85426 0.750282L7.88081 2ZM7.86022 2.00044L7.83367 0.750719L7.81998 0.75101L7.8063 0.751601L7.86022 2.00044ZM6.0125 3.54063L4.79378 3.26272L4.79205 3.27032L4.79041 3.27793L6.0125 3.54063ZM5.37638 6.5V7.75H6.38624L6.59846 6.76269L5.37638 6.5ZM2.75 6.5V5.25H1.5V6.5H2.75ZM2.75 7.5H1.5V8.75H2.75V7.5ZM5.16144 7.5L6.38353 7.76265L6.70862 6.25H5.16144V7.5ZM4.14269 12.2402L5.36049 12.5221L5.36271 12.5125L5.36478 12.5029L4.14269 12.2402ZM3.23866 13V14.25H3.2727L3.30669 14.2481L3.23866 13ZM1.75 13V11.75H0.5V13H1.75ZM1.75 14H0.5V15.25H1.75V14ZM3.26028 14V15.25H3.28688L3.31345 15.2489L3.26028 14ZM3.27056 13.9996L3.32374 15.2484L3.3244 15.2484L3.27056 13.9996ZM5.11838 12.4595L6.33707 12.7375L6.33882 12.7298L6.34046 12.7222L5.11838 12.4595ZM6.18438 7.5V6.25H5.1745L4.96229 7.23732L6.18438 7.5ZM8.47716 7.5L8.5453 6.25186L8.51126 6.25H8.47716V7.5ZM9.38106 8.25937L10.6034 7.99775L10.6011 7.98734L10.5987 7.97696L9.38106 8.25937ZM9.60606 9.31059L10.4748 10.2094L10.9736 9.72726L10.8284 9.04897L9.60606 9.31059ZM6.04784 12.75L5.17909 11.8512L2.9561 14H6.04784V12.75ZM7.48666 12.75V14H7.99206L8.35543 13.6487L7.48666 12.75ZM9.85263 10.4629L11.075 10.2013L10.6036 7.99845L8.98385 9.56417L9.85263 10.4629ZM10.0111 11.2033L8.78874 11.4649L8.78899 11.4661L10.0111 11.2033ZM10.0124 11.2096L8.79034 11.4723L8.79197 11.4799L8.7937 11.4875L10.0124 11.2096ZM11.8602 12.7496L11.8064 13.9985L11.8332 13.9996L11.8599 13.9996L11.8602 12.7496ZM13.5 12.75L13.4997 14L14.75 14.0003V12.75H13.5ZM13.5 11.75H14.75V10.5H13.5V11.75ZM11.8922 11.75L11.8241 12.9981L11.8581 13H11.8922V11.75ZM10.9882 10.9906L9.76586 11.2522L9.76809 11.2626L9.7705 11.273L10.9882 10.9906ZM10.7 9.64375L9.83123 8.74501L9.33255 9.22706L9.47767 9.90529L10.7 9.64375ZM14.0024 6.45147L14.8712 7.35021L17.094 5.20147H14.0024V6.45147ZM11.6948 5.55274L9.58453 7.59268L11.3221 9.39014L13.4323 7.3502L11.6948 5.55274ZM11.6756 8.22978L11.5804 7.78506L9.13581 8.30831L9.231 8.75303L11.6756 8.22978ZM11.5789 7.77805L11.5775 7.7718L9.13596 8.30908L9.13733 8.31532L11.5789 7.77805ZM11.5755 7.76252C11.4179 7.07164 11.0377 6.45166 10.4934 5.99798L8.89278 7.9184C9.01615 8.02123 9.10233 8.16176 9.13804 8.31835L11.5755 7.76252ZM10.4934 5.99798C9.94905 5.54429 9.27072 5.28202 8.56275 5.25153L8.45518 7.74922C8.61565 7.75613 8.7694 7.81557 8.89278 7.9184L10.4934 5.99798ZM8.56209 5.2515L8.55181 5.25107L8.44557 7.74881L8.45585 7.74925L8.56209 5.2515ZM8.49869 5.24994H6.39919V7.74994H8.49869V5.24994ZM7.62128 6.76259L8.21022 4.02234L5.76603 3.49703L5.17709 6.23728L7.62128 6.76259ZM8.20591 4.04165C8.19285 4.09805 8.16183 4.14868 8.11751 4.18592L6.50916 2.27197C6.13876 2.58323 5.87948 3.00638 5.77034 3.47772L8.20591 4.04165ZM8.11751 4.18592C8.07319 4.22316 8.01798 4.245 7.96018 4.24815L7.82414 1.75185C7.34104 1.77818 6.87956 1.96071 6.50916 2.27197L8.11751 4.18592ZM7.89216 4.25H9.38081V1.75H7.89216V4.25ZM10.6308 3V2H8.13081V3H10.6308ZM9.38081 0.75H7.88081V3.25H9.38081V0.75ZM7.85426 0.750282L7.83367 0.750719L7.88677 3.25016L7.90736 3.24972L7.85426 0.750282ZM7.8063 0.751601C7.09836 0.782166 6.42008 1.04448 5.87578 1.49818L7.4765 3.41852C7.59989 3.31567 7.75365 3.2562 7.91414 3.24927L7.8063 0.751601ZM5.87578 1.49818C5.33148 1.95189 4.95132 2.57186 4.79378 3.26272L7.23122 3.81853C7.26693 3.66192 7.35311 3.52137 7.4765 3.41852L5.87578 1.49818ZM4.79041 3.27793L4.15429 6.23731L6.59846 6.76269L7.23459 3.80332L4.79041 3.27793ZM5.37638 5.25H2.75V7.75H5.37638V5.25ZM1.5 6.5V7.5H4V6.5H1.5ZM2.75 8.75H5.16144V6.25H2.75V8.75ZM3.93934 7.23735L2.92059 11.9776L5.36478 12.5029L6.38353 7.76265L3.93934 7.23735ZM2.92489 11.9584C2.93794 11.902 2.96896 11.8513 3.01328 11.8141L4.62171 13.728C4.99212 13.4167 5.25138 12.9935 5.36049 12.5221L2.92489 11.9584ZM3.01328 11.8141C3.0576 11.7768 3.11281 11.755 3.17062 11.7519L3.30669 14.2481C3.78981 14.2218 4.25131 14.0393 4.62171 13.728L3.01328 11.8141ZM3.23866 11.75H1.75V14.25H3.23866V11.75ZM0.5 13V14H3V13H0.5ZM1.75 15.25H3.26028V12.75H1.75V15.25ZM3.31345 15.2489L3.32374 15.2484L3.21739 12.7507L3.20711 12.7511L3.31345 15.2489ZM3.3244 15.2484C4.03234 15.2179 4.71064 14.9556 5.25497 14.5019L3.65437 12.5815C3.53098 12.6843 3.37721 12.7438 3.21672 12.7507L3.3244 15.2484ZM5.25497 14.5019C5.79929 14.0483 6.17949 13.4283 6.33707 12.7375L3.89968 12.1815C3.86395 12.3381 3.77777 12.4787 3.65437 12.5815L5.25497 14.5019ZM6.34046 12.7222L7.40646 7.76268L4.96229 7.23732L3.89629 12.1968L6.34046 12.7222ZM6.18438 8.75H8.47716V6.25H6.18438V8.75ZM8.40901 8.74814C8.35124 8.74499 8.29606 8.72316 8.25177 8.68595L9.85986 6.77178C9.48955 6.46068 9.02824 6.27823 8.5453 6.25186L8.40901 8.74814ZM8.25177 8.68595C8.20747 8.64874 8.17646 8.59815 8.16338 8.54179L10.5987 7.97696C10.4895 7.50582 10.2302 7.08289 9.85986 6.77178L8.25177 8.68595ZM8.15875 8.521L8.38375 9.57222L10.8284 9.04897L10.6034 7.99775L8.15875 8.521ZM8.73731 8.41183L5.17909 11.8512L6.91659 13.6488L10.4748 10.2094L8.73731 8.41183ZM6.04784 14H7.48666V11.5H6.04784V14ZM8.35543 13.6487L10.7214 11.3616L8.98385 9.56417L6.61788 11.8513L8.35543 13.6487ZM8.6303 10.7245L8.78874 11.4649L11.2334 10.9418L11.075 10.2013L8.6303 10.7245ZM8.78899 11.4661L8.79034 11.4723L11.2345 10.9468L11.2331 10.9405L8.78899 11.4661ZM8.7937 11.4875C8.95126 12.1784 9.33146 12.7983 9.8758 13.252L11.4764 11.3316C11.353 11.2288 11.2668 11.0882 11.2311 10.9316L8.7937 11.4875ZM9.8758 13.252C10.4201 13.7057 11.0985 13.968 11.8064 13.9985L11.914 11.5008C11.7535 11.4939 11.5998 11.4344 11.4764 11.3316L9.8758 13.252ZM11.8599 13.9996L13.4997 14L13.5003 11.5L11.8605 11.4996L11.8599 13.9996ZM14.75 12.75V11.75H12.25V12.75H14.75ZM13.5 10.5H11.8922V13H13.5V10.5ZM11.9602 10.5019C12.018 10.505 12.0732 10.5268 12.1175 10.564L10.5094 12.4783C10.8798 12.7894 11.3412 12.9718 11.8241 12.9981L11.9602 10.5019ZM12.1175 10.564C12.1618 10.6013 12.1928 10.6519 12.2059 10.7082L9.7705 11.273C9.87977 11.7442 10.1391 12.1672 10.5094 12.4783L12.1175 10.564ZM12.2105 10.7291L11.9223 9.38221L9.47767 9.90529L9.76586 11.2522L12.2105 10.7291ZM11.5688 10.5425L14.8712 7.35021L13.1336 5.55273L9.83123 8.74501L11.5688 10.5425ZM14.0024 5.20147H12.5636V7.70147H14.0024V5.20147Z"
          fill="#7F7F7F"
          mask="url(#path-1-inside-1_2581_1405)"
        />
      </svg>
    );
  };

  const SourceCodeSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M5.85392 4.85402C5.90041 4.80753 5.93728 4.75234 5.96244 4.6916C5.9876 4.63087 6.00055 4.56577 6.00055 4.50002C6.00055 4.43428 5.9876 4.36918 5.96244 4.30844C5.93728 4.2477 5.90041 4.19251 5.85392 4.14602C5.80743 4.09953 5.75224 4.06266 5.6915 4.0375C5.63076 4.01234 5.56566 3.99939 5.49992 3.99939C5.43417 3.99939 5.36907 4.01234 5.30833 4.0375C5.24759 4.06266 5.19241 4.09953 5.14592 4.14602L1.64592 7.64602C1.59935 7.69247 1.56241 7.74764 1.5372 7.80839C1.512 7.86913 1.49902 7.93425 1.49902 8.00002C1.49902 8.06579 1.512 8.13091 1.5372 8.19165C1.56241 8.2524 1.59935 8.30758 1.64592 8.35402L5.14592 11.854C5.2398 11.9479 5.36714 12.0007 5.49992 12.0007C5.63269 12.0007 5.76003 11.9479 5.85392 11.854C5.9478 11.7601 6.00055 11.6328 6.00055 11.5C6.00055 11.3672 5.9478 11.2399 5.85392 11.146L2.70692 8.00002L5.85392 4.85402ZM10.1459 4.85402C10.052 4.76013 9.99929 4.6328 9.99929 4.50002C9.99929 4.36725 10.052 4.23991 10.1459 4.14602C10.2398 4.05213 10.3671 3.99939 10.4999 3.99939C10.6327 3.99939 10.76 4.05213 10.8539 4.14602L14.3539 7.64602C14.4005 7.69247 14.4374 7.74764 14.4626 7.80839C14.4878 7.86913 14.5008 7.93425 14.5008 8.00002C14.5008 8.06579 14.4878 8.13091 14.4626 8.19165C14.4374 8.2524 14.4005 8.30758 14.3539 8.35402L10.8539 11.854C10.76 11.9479 10.6327 12.0007 10.4999 12.0007C10.3671 12.0007 10.2398 11.9479 10.1459 11.854C10.052 11.7601 9.99929 11.6328 9.99929 11.5C9.99929 11.3672 10.052 11.2399 10.1459 11.146L13.2929 8.00002L10.1459 4.85402Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const ClearFormattingSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M8.4343 9.37693L7.73663 13.3333H6.38275L7.28329 8.226L2.34326 3.28595L3.28607 2.34314L13.657 12.7141L12.7142 13.6569L8.4343 9.37693ZM7.84863 5.02006L8.02849 3.99999H6.82856L5.49521 2.66666H13.3334V3.99999H9.38236L8.99956 6.17101L7.84863 5.02006Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const DropdownImage = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="8"
        viewBox="0 0 11 8"
        fill="none"
      >
        <path
          className="hover-dropdown"
          d="M10 1.5L5.5 6.5L1 1.5"
          stroke="#7F7F7F"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const handleBold = () => {
    const editor = editorRefContext.getEditor();
    const isBold = editor.getFormat().bold;
    setIsBoldActive(isBold == undefined ? true : false);
    editor.format("bold", isBold == undefined ? true : false);
    editor.focus();
  };

  const handleItalic = () => {
    const editor = editorRefContext.getEditor();
    const isItalic = editor.getFormat().italic;
    setIsItalicActive(isItalic == undefined ? true : false);
    editor.format("italic", isItalic == undefined ? true : false);
    editor.focus();
  };

  const handleUnderline = () => {
    const editor = editorRefContext.getEditor();
    const isUnderline = editor.getFormat().underline;
    setIsUnderlineActive(isUnderline == undefined ? true : false);
    editor.format("underline", isUnderline == undefined ? true : false);
    editor.focus();
  };

  const handleStrikethrough = () => {
    const editor = editorRefContext.getEditor();
    const isStrike = editor.getFormat().strike;
    setIsStrikeActive(isStrike == undefined ? true : false);
    editor.format("strike", isStrike == undefined ? true : false);
    editor.focus();
  };

  const handleSuperscript = () => {
    const editor = editorRefContext.getEditor();
    const isSuperscript = editor.getFormat().script === "super";
    setIsScriptActive(isSuperscript? "" :"super")
    editor.format("script", isSuperscript ? false : "super");
    editor.focus();
  };

  const handleSubscript = () => {
    const editor = editorRefContext.getEditor();
    const isSubscript = editor.getFormat().script === "sub";
    setIsScriptActive(isSubscript? "" :"sub")
    editor.format("script", isSubscript ? false : "sub");
    editor.focus();
  };

  const handleIncreaseIndent = () => {
    if (editorRefContext) {
      const editor = editorRefContext.getEditor();
      const currentIndent = editor.getFormat().indent || 0;
      editor.format("indent", currentIndent + 1);
    }
  };

  const handleDecreaseIndent = () => {
    if (editorRefContext) {
      const editor = editorRefContext.getEditor();
      const currentIndent = editor.getFormat().indent || 0;
      if (currentIndent > 0) {
        editor.format("indent", currentIndent - 1);
      }
    }
  };

  const handleInsertFormula = () => {
    if (editorRefContext) {
      const editor = editorRefContext.getEditor();
      const range = editor.getSelection();

      if (range) {
        editor.format("formula", true);
      }
    }
  };

  const handleInsertCodeBlock = () => {
    if (editorRefContext) {
      const editor = editorRefContext.getEditor();
      const range = editor.getSelection();

      if (range) {
        const currentFormat = editor.getFormat(range);

        if (currentFormat["code-block"]) {
          editor.format("code-block", false);
        } else {
          editor.format("code-block", true);
        }
      }
    }
  };

  return (
    <div className="d-flex">
      <button onClick={scrollLeft} className="scroll-left">
        <ScrollLeftSvg />
      </button>
      <div
        id="toolbar"
        ref={toolbarRef}
        className="toolbar mx-1"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          overflowY: "hidden",
          height: 53,
          pointerEvents: editMode ? "all" : "none",
          // opacity: editMode ? "1" : "0.7",
          border: "none",
        }}
      >
        <span className="ql-formats ">
          <Tooltip title="Undo" placement="bottom">
            <button
              className="btn-undo"
              style={{
                cursor: canUndo ? "pointer" : "default",
              }}
              onClick={() => {
                handleUndo();
              }}
            >
              <UndoSvg />
            </button>
          </Tooltip>
          <Tooltip title="Redo" placement="bottom">
            <button
              className="btn-undo ml-2"
              style={{
                cursor: canRedo ? "pointer" : "default",
              }}
              onClick={() => {
                handleRedo();
              }}
            >
              <RedoSvg />
            </button>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip title="Font" placement="bottom" open={tooltipOpen}>
            <span
              className="ql-formats"
              onMouseLeave={() => {
                setTooltipOpen(false);
              }}
              onMouseEnter={() => {
                setTooltipOpen(true);
              }}
              style={{
                height: 33,
                // width: 147,
              }}
            >
              <Select
                className="ql-font b-r fonts"
                defaultValue="arial"
                style={{
                  height: 33,
                  // width: 104,
                  borderColor: "#D9D9D9",
                  borderRadius: 5,
                  color: "#626469",
                }}
                onOpen={() => {
                  setTooltipOpen(false);
                }}
                onClose={() => {
                  setTooltipOpen(false);
                }}
                onChange={(e) => {
                  handleFontChange(e);
                  setTooltipOpen(false);
                }}
                onFocus={() => {
                  setTooltipOpen(false);
                }}
                value={selectedFontValue}
              >
                {Font.whitelist.map((font: any) => (
                  <MenuItem
                    className={`ql-font-${font}`}
                    key={font}
                    value={font}
                  >
                    {font.charAt(0).toUpperCase() +
                      font.slice(1).replace("-", " ")}
                  </MenuItem>
                ))}
              </Select>
            </span>
          </Tooltip>

          <Tooltip title="Font Size" placement="bottom" open={tooltipOpenSize}>
            <span className="ql-formats">
              <Select
                style={{
                  width: 82,
                  height: 33,
                  borderColor: "#D9D9D9",
                  borderRadius: 5,
                  color: "#626469",
                }}
                className="ql-size fonts"
                defaultValue="10px"
                onMouseLeave={() => {
                  setTooltipOpenSize(false);
                }}
                onOpen={() => {
                  setTooltipOpenSize(false);
                }}
                onMouseEnter={() => {
                  setTooltipOpenSize(true);
                }}
                onChange={(e) => {
                  handleFontSizeChange(e);
                  setTooltipOpenSize(false);
                }}
                onFocus={() => {
                  setTooltipOpenSize(false);
                }}
                value={selectedFontSizeValue}
              >
                {SizeStyle.whitelist.map((size: any) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </span>
          </Tooltip>
          <Tooltip title="Headers" placement="bottom" open={tooltipOpenHeader}>
            <span className="">
              <Select
                className="text-center fonts"
                style={{
                  height: 33,
                  // width: 130,
                  borderColor: "#D9D9D9",
                  borderRadius: 5,
                  color: "#626469",
                }}
                defaultValue="0"
                onMouseLeave={() => {
                  setTooltipOpenHeader(false);
                }}
                onOpen={() => {
                  setTooltipOpenHeader(false);
                }}
                onMouseEnter={() => {
                  setTooltipOpenHeader(true);
                }}
                onChange={(e) => {
                  handleHeaderChange(e);
                  setTooltipOpenHeader(false);
                }}
                onFocus={() => {
                  setTooltipOpenHeader(false);
                }}
                value={selectedHeadersValue}
              >
                <MenuItem value={0} style={{ fontSize: "14px" }}>
                  Paragraph
                </MenuItem>
                <MenuItem
                  value={1}
                  style={{ fontSize: "18px", fontWeight: "bold" }}
                >
                  Heading 1
                </MenuItem>
                <MenuItem
                  value={2}
                  style={{ fontSize: "16px", fontWeight: "bold" }}
                >
                  Heading 2
                </MenuItem>
                <MenuItem
                  value={3}
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  Heading 3
                </MenuItem>
                <MenuItem
                  value={4}
                  style={{ fontSize: "12px", fontWeight: "bold" }}
                >
                  Heading 4
                </MenuItem>
              </Select>
            </span>
          </Tooltip>
        </span>

        <span className="ql-formats ql-text-highlight">
          <Tooltip
            title="Text Highlight Color"
            placement="bottom"
            open={tooltipOpenHighlight}
          >
            <span
              className="d-flex fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={() => setTooltipOpenHighlight(true)}
              onMouseLeave={() => setTooltipOpenHighlight(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32, cursor: "pointer" }}
                onClick={handleTextHighlight}
              >
                <TextHighlightSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                id="openTextColor-button"
                aria-controls={openTextColor ? "openTextColor-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openTextColor ? "true" : undefined}
                onClick={(e) => {
                  handleOpenTextColor(e);
                  setTooltipOpenHighlight(false);
                }}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openTextColor-menu" // Updated ID to avoid conflict
                anchorEl={anchorElTextColr}
                open={openTextColor}
                onClose={handleCloseTextColor}
                MenuListProps={{
                  "aria-labelledby": "openTextColor-button", // Updated aria-labelledby
                }}
                className="text-center"
              >
                <Sketch
                  color="#9b9b9b"
                  onChange={handleTextHighlightColorChange}
                />
              </Menu>
            </span>
          </Tooltip>
        </span>

        <span className="ql-formats ql-text-highlight">
          <Tooltip
            title="Font Color"
            placement="bottom"
            open={tooltipOpenColor}
          >
            <span
              className="d-flex fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={() => setTooltipOpenColor(true)}
              onMouseLeave={() => setTooltipOpenColor(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32, cursor: "pointer" }}
                onClick={handleFontColor}
              >
                <FontColorSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                id="openFontColor-button"
                aria-controls={openFontColor ? "openFontColor-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openFontColor ? "true" : undefined}
                onClick={(e) => {
                  handleOpenFontColor(e);
                  setTooltipOpenColor(false);
                }}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openTextColor-menu" // Updated ID to avoid conflict
                anchorEl={anchorElFontColor}
                open={openFontColor}
                onClose={handleCloseFontColor}
                MenuListProps={{
                  "aria-labelledby": "openFontColor-button", // Updated aria-labelledby
                }}
                className="text-center"
              >
                <Sketch
                  color="#9b9b9b"
                  onChange={handleFontColorChange}
                  id="menu-color"
                />
                <div className="d-flex justify-content-between pt-2">
                  <button
                    className="btn btn-sm btn-color-platte btn-outline-primary mx-2"
                    onClick={() => handleSaveFontColor()}
                  >
                    Apply
                  </button>
                  <button
                    className="btn btn-sm btn-color-platte btn-outline-danger mx-2"
                    onClick={() => {
                      handleCancelFontColor();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Shading" placement="bottom" open={tooltipOpenShading}>
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={() => setTooltipOpenShading(true)}
              onMouseLeave={() => setTooltipOpenShading(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32, cursor: "pointer" }}
                onClick={handleBgColor}
              >
                <ShadeColorSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                id="openBgColor-button"
                aria-controls={openBgColor ? "openBgColor-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openBgColor ? "true" : undefined}
                onClick={(e) => {
                  handleOpenBgColor(e);
                  setTooltipOpenShading(false);
                }}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openTextColor-menu" // Updated ID to avoid conflict
                anchorEl={anchorElBgColor}
                open={openBgColor}
                onClose={handleCloseBgColor}
                MenuListProps={{
                  "aria-labelledby": "openBgColor-button", // Updated aria-labelledby
                }}
                className="text-center"
              >
                <Sketch color="#9b9b9b" onChange={handleBgColorChange} />
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip
            title="Change Case"
            placement="bottom"
            open={tooltipOpenCase}
          >
            <span
              className="d-flex fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseOver={() => {
                setTooltipOpenCase(!openCase);
              }}
              onMouseLeave={() => setTooltipOpenCase(false)}
              onFocus={() => setTooltipOpenCase(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
              >
                <ChangeCaseSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenCase(e);
                  setTooltipOpenCase(false);
                }}
                id="openCase-button"
                aria-controls={openCase ? "openCase-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openCase ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openCase-menu"
                anchorEl={anchorElCase}
                open={openCase}
                onClose={handleCloseCase}
                MenuListProps={{
                  "aria-labelledby": "openCase-button",
                }}
                onMouseMove={() => setTooltipOpenCase(false)}
                onChange={() => setTooltipOpenCase(false)}
              >
                <MenuItem
                  onClick={() => handleTextTransformation(toSentenceCase)}
                >
                  Sentence case
                </MenuItem>
                <MenuItem onClick={() => handleTextTransformation(toLowerCase)}>
                  lowercase
                </MenuItem>
                <MenuItem onClick={() => handleTextTransformation(toUpperCase)}>
                  UPPERCASE
                </MenuItem>
                <MenuItem
                  onClick={() => handleTextTransformation(toCapitalizeEachWord)}
                >
                  Capitalize Each Word
                </MenuItem>
                <MenuItem
                  onClick={() => handleTextTransformation(toToggleCase)}
                >
                  tOGGLE cASE
                </MenuItem>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip title="Bold" placement="bottom">
            <button className="btn-undo" onClick={handleBold}>
              <BoldSvg />
            </button>
          </Tooltip>
          <Tooltip title="Italic" placement="bottom">
            <button className="btn-undo ml-2 " onClick={handleItalic}>
              <ItalicSvg />
            </button>
          </Tooltip>
          <Tooltip title="Underline" placement="bottom">
            <button className="btn-undo mx-2 " onClick={handleUnderline}>
              <UnderlineSvg />
            </button>
          </Tooltip>
          <Tooltip title="Strikethrough" placement="bottom">
            <button className="btn-undo " onClick={handleStrikethrough}>
              <StrikeThroughSvg />
            </button>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip title="Superscript">
            <button className="btn-undo " onClick={handleSuperscript}>
              <SuperScriptSvg />
            </button>
          </Tooltip>
          <Tooltip title="Subscript" onClick={handleSubscript}>
            <button className="btn-undo ql-script mx-2">
              <SubScriptSvg />
            </button>
          </Tooltip>
          <Tooltip title="Show/Hide formatting marks">
            <button className="btn-undo" onClick={toggleFormattingMarks}>
              <FormattingSvg />
            </button>
          </Tooltip>
        </span>

        <span className="ql-formats ">
          <Tooltip
            title="Numbering"
            placement="bottom"
            open={tooltipOpenNumbering}
          >
            <span
              className="d-flex fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
                cursor: "pointer",
              }}
              onMouseEnter={() => setTooltipOpenNumbering(!open1)}
              onMouseLeave={() => setTooltipOpenNumbering(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
                onClick={()=>handleListClick('default')}
              >
                <NumberingSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(e) => {
                  handleClick(e);
                  setTooltipOpenNumbering(false);
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open1}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                onMouseMove={() => setTooltipOpenNumbering(false)}
              >
                <div className="d-flex">
                  <MenuItem
                    value="none"
                    sx={{
                      ":hover":{
                        border:"1px solid #7771E8 !important"
                      }
                    }}
                    className="mx-1 list-items"
                    style={{ height: 50, width: 60, padding: 4,border:isListActive == "" ? "1px solid #7771E8":'1px solid #cccccc' }}
                    onClick={() => {
                      handleListClick("none");
                    }}
                  >
                    <div
                      className="e-de-list-header-presetmenu"
                      style={{
                        position: "relative",
                        left: 11,
                        color: isListActive == "" ? "#7771E8":'' ,
                      }}
                    
                    >
                      <div>
                        <span className="e-de-bullets">None</span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 list-items"
                    sx={{
                      ":hover":{
                        border:"1px solid rgb(119, 113, 232) !important"
                      }
                    }}
                    style={{ height: 50, width: 60, padding: 4,border:isListActive == "default" ? "1px solid #7771E8":'1px solid #cccccc' }}
                    onClick={() => {
                      handleListClick("default");
                    }}
                  >
                    <div className={isListActive == "default"? "e-de-list-header-presetmenu-selected" :"e-de-list-header-presetmenu"} >
                      <div>
                        1.<span className={isListActive == "default"? "e-de-list-line-selected" :"e-de-list-line"}></span>
                      </div>
                      <div>
                        2.<span className={isListActive == "default"? "e-de-list-line-selected" :"e-de-list-line"}></span>
                      </div>
                      <div>
                        3.<span className={isListActive == "default"? "e-de-list-line-selected" :"e-de-list-line"}> </span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="lower-alpha"
                    className="mx-1 list-items"
                    style={{ height: 50, width: 60, padding: 4,border:isListActive == "lower-alpha" ? "1px solid #7771E8":'1px solid #cccccc' }}
                    sx={{
                      ":hover":{
                        border:"1px solid rgb(119, 113, 232) !important"
                      }
                    }}
                    onClick={() => handleListClick("lower-alpha")}
                  >
                    <div className={isListActive == "lower-alpha"? "e-de-list-header-presetmenu-selected" :"e-de-list-header-presetmenu"}>
                      <div>
                        a.<span className={isListActive == "lower-alpha"? "e-de-list-line-selected" :"e-de-list-line"}></span>
                      </div>
                      <div>
                        b.<span className={isListActive == "lower-alpha"? "e-de-list-line-selected" :"e-de-list-line"}></span>
                      </div>
                      <div>
                        c.<span className={isListActive == "lower-alpha"? "e-de-list-line-selected" :"e-de-list-line"}> </span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
                <div className="d-flex py-2">
                  <MenuItem
                    value="upper-alpha"
                    className="mx-1 list-items"
                    style={{ height: 50, width: 60, padding: 4,border:isListActive == "upper-alpha" ? "1px solid #7771E8":'1px solid #cccccc' }}
                    sx={{
                      ":hover":{
                        border:"1px solid rgb(119, 113, 232) !important"
                      }
                    }}
                    onClick={() => handleListClick("upper-alpha")}
                  >
                    <div className={isListActive == "upper-alpha"? "e-de-list-header-presetmenu-selected" :"e-de-list-header-presetmenu"}>
                      <div>
                        A.<span className={isListActive == "upper-alpha"? "e-de-list-line-selected" :"e-de-list-line"}></span>
                      </div>
                      <div>
                        B.<span className={isListActive == "upper-alpha"? "e-de-list-line-selected" :"e-de-list-line"}></span>
                      </div>
                      <div>
                        C.<span className={isListActive == "upper-alpha"? "e-de-list-line-selected" :"e-de-list-line"}> </span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="lower-roman"
                    className="mx-1 list-items"
                    style={{ height: 50, width: 60, padding: 4,border:isListActive == "lower-roman" ? "1px solid #7771E8":'1px solid #cccccc' }}
                    sx={{
                      ":hover":{
                        border:"1px solid rgb(119, 113, 232) !important"
                      }
                    }}
                    onClick={() => handleListClick("lower-roman")}
                  >
                  <div className={isListActive == "lower-roman"? "e-de-list-header-presetmenu-selected" :"e-de-list-header-presetmenu"}>
                      <div>
                        i.<span className={isListActive == "lower-roman"? "e-de-list-line-selected" :"e-de-list-line"}></span>
                      </div>
                      <div>
                        ii.<span className={isListActive == "lower-roman"? "e-de-list-line-selected" :"e-de-list-line"}></span>
                      </div>
                      <div>
                        iii.<span className={isListActive == "lower-roman"? "e-de-list-line-selected" :"e-de-list-line"}> </span>
                      </div>
                    </div>{" "}
                  </MenuItem>

                  <MenuItem
                    value="upper-roman"
                    className="mx-1 list-items"
                    style={{ height: 50, width: 60, padding: 4,border:isListActive == "upper-roman" ? "1px solid #7771E8":'1px solid #cccccc' }}
                    sx={{
                      ":hover":{
                        border:"1px solid rgb(119, 113, 232) !important"
                      }
                    }}
                    onClick={() => handleListClick("upper-roman")}
                  >
                    <div className={isListActive == "upper-roman"? "e-de-list-header-presetmenu-selected" :"e-de-list-header-presetmenu"}>
                      <div>
                        I.<span className={isListActive == "upper-roman"? "e-de-list-line-selected" :"e-de-list-line"}></span>
                      </div>
                      <div>
                        II.<span className={isListActive == "upper-roman"? "e-de-list-line-selected" :"e-de-list-line"}></span>
                      </div>
                      <div>
                        III.<span className={isListActive == "upper-roman"? "e-de-list-line-selected" :"e-de-list-line"}> </span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats ">
          <Tooltip title="Bullets" placement="bottom" open={tooltipOpenBullets}>
            <span
              className="d-flex fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={() => setTooltipOpenBullets(!open)}
              onMouseLeave={() => setTooltipOpenBullets(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32, cursor: "pointer" }}
              >
                <BulletSvg />
              </span>

              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(e) => {
                  handleClick2(e);
                  setTooltipOpenBullets(false);
                }}
              >
                <DropdownImage />
              </span>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl2}
                open={open}
                onClose={handleClose2}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                onMouseMove={() => setTooltipOpenBullets(false)}
              >
                <div className="d-flex">
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    style={{ height: 38, width: 38 ,border:isListActive == "" ? "1px solid #7771E8":'1px solid #cccccc'}}
                    sx={{
                      ":hover":{
                        border:"1px solid #7771E8 !important"
                      }
                    }}
                    onClick={() => handleListClick("none")}
                  >
                    <div
                      className="e-de-list-header-presetmenu"
                      style={{
                        position: "relative",
                        left: "-0.6rem",
                        color: isListActive === ""  ? "#7771e8":"black",
                      }}
                    >
                      <div>
                        <span className="e-de-bullets hover-color-none">None</span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover":{
                        border:"1px solid #7771E8 !important"
                      }
                    }}
                    style={{ height: 38, width: 38 ,border:isListActive == "bullet-dot-large" ? "1px solid #7771E8":'1px solid #cccccc'}}
                    onClick={() => handleListClick("bullet-dot-large")}
                  >
                    <div className={"e-de-bullet-list-header-presetmenu"}>
                      <div>
                        <span className={isListActive==="bullet-dot-large" ? "e-de-ctnr-bullet-dot-selected e-icons e-de-ctnr-list":"e-de-ctnr-bullet-dot e-icons e-de-ctnr-list"}></span>
                      </div>
                    </div>{" "}
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover":{
                        border:"1px solid #7771E8 !important"
                      }
                    }}
                    style={{ height: 38, width: 38 ,border:isListActive == "bullet-circle" ? "1px solid #7771E8":'1px solid #cccccc'}}
                    onClick={() => handleListClick("bullet-circle")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className={isListActive === "bullet-circle"? "e-de-ctnr-bullet-circle-selected e-icons e-de-ctnr-list":"e-de-ctnr-bullet-circle e-icons e-de-ctnr-list"}></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover":{
                        border:"1px solid #7771E8 !important"
                      }
                    }}
                    style={{ height: 38, width: 38 ,border:isListActive == "bullet-square" ? "1px solid #7771E8":'1px solid #cccccc'}}
                    onClick={() => handleListClick("bullet-square")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className={isListActive === "bullet-square"?"e-de-ctnr-bullet-square-selected e-icons e-de-ctnr-list":"e-de-ctnr-bullet-square e-icons e-de-ctnr-list"}></span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
                <div className="d-flex py-2">
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover":{
                        border:"1px solid #7771E8 !important"
                      }
                    }}
                    style={{ height: 38, width: 38 ,border:isListActive == "bullet-flower" ? "1px solid #7771E8":'1px solid #cccccc'}}
                    onClick={() => handleListClick("bullet-flower")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className={isListActive === "bullet-flower" ?"e-de-ctnr-bullet-flower-selected e-icons e-de-ctnr-list":"e-de-ctnr-bullet-flower e-icons e-de-ctnr-list"}></span>
                      </div>
                    </div>
                  </MenuItem>

                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover":{
                        border:"1px solid #7771E8 !important"
                      }
                    }}
                    style={{ height: 38, width: 38 ,border:isListActive == "bullet-arrow" ? "1px solid #7771E8":'1px solid #cccccc'}}
                    onClick={() => handleListClick("bullet-arrow")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className={isListActive === "bullet-arrow"? "e-de-ctnr-bullet-arrow-selected e-icons e-de-ctnr-list":"e-de-ctnr-bullet-arrow e-icons e-de-ctnr-list"}></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover":{
                        border:"1px solid #7771E8 !important"
                      }
                    }}
                    style={{ height: 38, width: 38 ,border:isListActive == "bullet-tick" ? "1px solid #7771E8":'1px solid #cccccc'}}
                    onClick={() => handleListClick("bullet-tick")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className={isListActive === "bullet-tick"? "e-de-ctnr-bullet-tick-selected e-icons e-de-ctnr-list":"e-de-ctnr-bullet-tick e-icons e-de-ctnr-list"}></span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip
            title="Line Spacing"
            placement="bottom"
            open={tooltipOpenSpacing}
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={() => setTooltipOpenSpacing(true)}
              onMouseLeave={() => setTooltipOpenSpacing(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
              >
                <LineSpacingSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenSpacing(e);
                  setTooltipOpenSpacing(false);
                }}
                id="openSpacing-button"
                aria-controls={openSpacing ? "openSpacing-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openSpacing ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openSpacing-menu"
                anchorEl={anchorElSpacing}
                open={openSpacing}
                onClose={handleCloseSpacing}
                MenuListProps={{
                  "aria-labelledby": "openSize-button",
                }}
                onMouseMove={() => setTooltipOpenSpacing(false)}
              >
                {lineSpacing.map((size, index) => {
                  return (
                    <MenuItem
                      key={index}
                      onClick={() => handleSelectSpacing(size.value)}
                      style={{
                        color: spacing == size.value ? "#7771E8" : "",
                      }}
                    >
                      <div className="container">
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 550,
                          }}
                        >
                          {size.value == "1.5"
                            ? "1"
                            : size.value == "1.7"
                            ? "1.15"
                            : size.value == "2"
                            ? "1.5"
                            : size.value == "2.5"
                            ? "2"
                            : size.value == "3"
                            ? "2.5"
                            : size.value == "3.5"
                            ? "3"
                            : ""}
                        </div>
                      </div>
                    </MenuItem>
                  );
                })}
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip
            title="Alignment"
            placement="bottom"
            open={tooltipOpenAlignment}
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={() => {
                setTooltipOpenAlignment(!openAlignment);
              }}
              onMouseLeave={() => {
                setTooltipOpenAlignment(false);
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
              >
                <AlignmentSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenAlignment(e);
                  setTooltipOpenAlignment(false);
                }}
                id="openAlignment-button"
                aria-controls={openAlignment ? "openSpacing-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openAlignment ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openSpacing-menu"
                anchorEl={anchorElAlignment}
                open={openAlignment}
                onClose={handleCloseAlignment}
                MenuListProps={{
                  "aria-labelledby": "openSize-button",
                }}
                onMouseMove={() => setTooltipOpenAlignment(false)}
              >
                <div className="d-flex">
                  <Tooltip title="Align to Left">
                    <MenuItem
                      onClick={() => handleAlignment("left")}
                      style={{
                        background: selectedAlign == "left" ? "#edf4fb" : "",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0H10V1.11111H0V0ZM0 2.22222H6.66667V3.33333H0V2.22222ZM0 4.44444H10V5.55556H0V4.44444ZM0 6.66667H6.66667V7.77778H0V6.66667ZM0 8.88889H10V10H0V8.88889Z"
                          fill="black"
                        />
                      </svg>
                    </MenuItem>
                  </Tooltip>
                  <Tooltip title="Center Text">
                    <MenuItem
                      onClick={() => handleAlignment("center")}
                      style={{
                        background: selectedAlign == "center" ? "#edf4fb" : "",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0H10V1.11111H0V0ZM2.22222 2.22222H7.77778V3.33333H2.22222V2.22222ZM0 4.44444H10V5.55556H0V4.44444ZM2.22222 6.66667H7.77778V7.77778H2.22222V6.66667ZM0 8.88889H10V10H0V8.88889Z"
                          fill="black"
                        />
                      </svg>
                    </MenuItem>
                  </Tooltip>
                  <Tooltip title="Align to Right">
                    <MenuItem
                      onClick={() => handleAlignment("right")}
                      style={{
                        background: selectedAlign == "right" ? "#edf4fb" : "",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0H10V1.11111H0V0ZM3.33333 2.22222H10V3.33333H3.33333V2.22222ZM0 4.44444H10V5.55556H0V4.44444ZM3.33333 6.66667H10V7.77778H3.33333V6.66667ZM0 8.88889H10V10H0V8.88889Z"
                          fill="black"
                        />
                      </svg>
                    </MenuItem>
                  </Tooltip>
                  <Tooltip
                    title="Justify Text"
                    style={{
                      background: selectedAlign == "justify" ? "#edf4fb" : "",
                    }}
                  >
                    <MenuItem onClick={() => handleAlignment("justify")}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0H10V1.11111H0V0ZM0 2.22222H10V3.33333H0V2.22222ZM0 4.44444H10V5.55556H0V4.44444ZM0 6.66667H10V7.77778H0V6.66667ZM0 8.88889H10V10H0V8.88889Z"
                          fill="black"
                        />
                      </svg>
                    </MenuItem>
                  </Tooltip>
                </div>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Increase indent">
            <button className="btn-undo mr-2" onClick={handleIncreaseIndent}>
              <IncreaseIndentSvg />
            </button>
          </Tooltip>
          <Tooltip title="Decrease indent">
            <button className="btn-undo " onClick={handleDecreaseIndent}>
              <DecreaseIndentSvg />
            </button>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Page Break" placement="bottom">
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 34, height: 33 }}
                onClick={() => {
                  setPages((prevPages: any) => {
                    let updatedPages = [...prevPages, { content: "" }];
                    let newIndex = updatedPages.length - 1;
                    setCurrentPage(newIndex);
                    return updatedPages;
                  });
                }}
              >
                <PageBreakSvg />
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Margins" placement="bottom" open={tooltipOpenMargins}>
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseOver={() => setTooltipOpenMargins(!openMargins)}
              onMouseLeave={() => setTooltipOpenMargins(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
              >
                <MarginSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                id="margins-button" // Changed ID to avoid conflict
                aria-controls={openMargins ? "margins-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMargins ? "true" : undefined}
                onClick={(e) => {
                  handleOpenMargins(e);
                  setTooltipOpenMargins(false);
                }}
              >
                <DropdownImage />
              </span>
              <Menu
                id="margins-menu"
                anchorEl={anchorElMargins}
                open={openMargins}
                onClose={handleCloseMargins}
                MenuListProps={{
                  "aria-labelledby": "margins-button", // Updated aria-labelledby
                }}
                onMouseMove={() => {
                  setTooltipOpenMargins(false);
                }}
              >
                <MenuItem
                  style={{
                    background:
                      documentPageMargins.title == "Standard" ? "#edf4fb" : "",
                  }}
                  onClick={() =>
                    handleSelectMargins({
                      title: "Standard",
                      top: "2.54cm",
                      bottom: "2.54cm",
                      left: "2.54cm",
                      right: "2.54cm",
                    })
                  }
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        width="37"
                        height="37"
                        viewBox="0 0 26 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.36364 1V23M20.6364 1V23M1 5H25M1 19H25M2 23H24C24.5523 23 25 22.5523 25 22V2C25 1.44772 24.5523 1 24 1H2C1.44772 1 1 1.44772 1 2V22C1 22.5523 1.44772 23 2 23Z"
                          stroke="black"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className=" ml-2"
                      style={{
                        alignSelf: "center",
                        fontSize: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 550,
                          fontSize: 14,
                          position: "relative",
                          top: 2,
                        }}
                      >
                        Standard
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#00000080",
                          position: "relative",
                          bottom: 2,
                        }}
                      >
                        Top: 2.54 cm, Bottom: 2.54 cm, Left: 2.54 cm, Right:
                        2.54 cm
                      </div>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleSelectMargins({
                      title: "Narrow",
                      top: "1.27cm",
                      bottom: "1.27cm",
                      left: "1.27cm",
                      right: "1.27cm",
                    })
                  }
                  style={{
                    background:
                      documentPageMargins.title == "Narrow" ? "#edf4fb" : "",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        width="37"
                        height="37"
                        viewBox="0 0 26 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.5 1V23M22.5 1V23M1 3.5H25M1 20.5H25M2 23H24C24.5523 23 25 22.5523 25 22V2C25 1.44772 24.5523 1 24 1H2C1.44772 1 1 1.44772 1 2V22C1 22.5523 1.44772 23 2 23Z"
                          stroke="black"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className=" ml-2"
                      style={{
                        alignSelf: "center",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "550",
                          fontSize: 14,
                          position: "relative",
                          top: 2,
                        }}
                      >
                        Narrow
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#00000080",
                          position: "relative",
                          bottom: 2,
                        }}
                      >
                        Top: 1.27 cm, Bottom: 1.27 cm, Left: 1.27 cm, Right:
                        1.27 cm{" "}
                      </div>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleSelectMargins({
                      title: "Moderate",
                      top: "2.54cm",
                      bottom: "2.54cm",
                      left: "1.91cm",
                      right: "1.91cm",
                    })
                  }
                  style={{
                    background:
                      documentPageMargins.title == "Moderate" ? "#edf4fb" : "",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        width="37"
                        height="37"
                        viewBox="0 0 26 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 1V23M22 1V23M1 5H25M1 19H25M2 23H24C24.5523 23 25 22.5523 25 22V2C25 1.44772 24.5523 1 24 1H2C1.44772 1 1 1.44772 1 2V22C1 22.5523 1.44772 23 2 23Z"
                          stroke="black"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className=" ml-2"
                      style={{
                        alignSelf: "center",
                        fontSize: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "550",
                          fontSize: 14,
                          position: "relative",
                          top: 2,
                        }}
                      >
                        Moderate
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#00000080",
                          position: "relative",
                          bottom: 2,
                        }}
                      >
                        Top: 2.54 cm, Bottom: 2.54 cm, Left: 1.91 cm, Right:
                        1.91 cm
                      </div>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleSelectMargins({
                      title: "Wide",
                      top: "2.54cm",
                      bottom: "2.54cm",
                      left: "5.08cm",
                      right: "5.08cm",
                    })
                  }
                  style={{
                    background:
                      documentPageMargins.title == "Wide" ? "#edf4fb" : "",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        width="37"
                        height="37"
                        viewBox="0 0 26 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.5 1V23M18.5 1V23M1 5H25M1 19H25M2 23H24C24.5523 23 25 22.5523 25 22V2C25 1.44772 24.5523 1 24 1H2C1.44772 1 1 1.44772 1 2V22C1 22.5523 1.44772 23 2 23Z"
                          stroke="black"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className=" ml-2"
                      style={{
                        alignSelf: "center",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "550",
                          fontSize: 14,
                          position: "relative",
                          top: 2,
                        }}
                      >
                        Wide
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#00000080",
                          position: "relative",
                          bottom: 2,
                        }}
                      >
                        Top: 2.54 cm, Bottom: 2.54 cm, Left: 5.08 cm, Right:
                        5.08 cm
                      </div>
                    </div>
                  </div>
                </MenuItem>
              </Menu>
            </span>
          </Tooltip>
        </span>

        <span className="ql-formats">
          <Tooltip
            title="Orientation"
            placement="bottom"
            open={tooltipOpenOrientation}
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseOver={() => setTooltipOpenOrientation(!openOrientation)}
              onMouseLeave={() => setTooltipOpenOrientation(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
              >
                <OrientationSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                id="orientation-button"
                aria-controls={openOrientation ? "orientation-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openOrientation ? "true" : undefined}
                onClick={(e) => {
                  handleOpenOrientation(e);
                  setTooltipOpenOrientation(false);
                }}
              >
                <DropdownImage />
              </span>
              <Menu
                id="orientation-menu" // Updated ID to avoid conflict
                anchorEl={anchorElOrientation}
                open={openOrientation}
                onClose={handleCloseOrientation}
                MenuListProps={{
                  "aria-labelledby": "orientation-button", // Updated aria-labelledby
                }}
                onMouseMove={() => setTooltipOpenOrientation(false)}
              >
                <MenuItem
                  style={{
                    background:
                      documentPageSize.title !== "Landscape" ? "#edf4fb" : "",
                  }}
                  onClick={() => handleSelectOrientation("potrait")}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 0C0.89 0 0 1.15156 0 2.58778V20.7022C0 22.1255 0.89 21.9961 2 21.9961H16C17.11 21.9961 18 22.1384 18 20.7022V7.76333L12 0H2ZM17 21H1V1H10V10.3511H17V21ZM11 9.05722V1L14 5.17555L17 9.05722H11Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div
                      className="ml-2"
                      style={{
                        alignSelf: "center",
                        fontSize: "14px",
                      }}
                    >
                      Portrait
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  style={{
                    background:
                      documentPageSize.title == "Landscape" ? "#edf4fb" : "",
                  }}
                  onClick={() => handleSelectOrientation("landscape")}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        width="18"
                        height="22"
                        viewBox="0 0 22 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22 2C22 0.89 20.8484 0 19.4122 0L1.29778 0C-0.125494 0 0.00389481 0.89 0.00389481 2V16C0.00389481 17.11 -0.138433 18 1.29778 18H14.2367L22 12V2ZM1 17V1L21 1V10H11.6489L11.6489 17H1ZM12.9428 11H21L16.8244 14L12.9428 17L12.9428 11Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div
                      className="ml-2"
                      style={{
                        alignSelf: "center",
                        fontSize: "14px",
                      }}
                    >
                      Landscape
                    </div>
                  </div>
                </MenuItem>
              </Menu>
            </span>
          </Tooltip>
        </span>

        <span className="ql-formats">
          <Tooltip title="Size" placement="bottom" open={tooltipOpenSize}>
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={() => setTooltipOpenSize(!openSize)}
              onMouseLeave={() => setTooltipOpenSize(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
              >
                <PageSizeSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenSize(e);
                  setTooltipOpenSize(false);
                }}
                id="openSize-button"
                aria-controls={openSize ? "openSize-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openSize ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openSize-menu"
                anchorEl={anchorElSize}
                open={openSize}
                onClose={handleCloseSize}
                MenuListProps={{
                  "aria-labelledby": "openSize-button",
                }}
                onMouseMove={() => setTooltipOpenSize(false)}
              >
                {pageSizes.map((size, index) => {
                  return (
                    <MenuItem
                      key={index}
                      onClick={() => handleSelectSize(size)}
                      style={{
                        background:
                          documentPageSize.title == size.title ? "#edf4fb" : "",
                      }}
                    >
                      <div className="container">
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 550,
                          }}
                        >
                          {size.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#00000080",
                          }}
                        >
                          {size.desc}
                        </div>
                      </div>
                    </MenuItem>
                  );
                })}
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Columns" placement="bottom" open={tooltipOpenColumns}>
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={() => setTooltipOpenColumns(!openColumns)}
              onMouseLeave={() => setTooltipOpenColumns(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
              >
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 26 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="fill-hover"
                    d="M5 6H10M16 6H21M5 10H10M16 10H21M5 14H10M16 14H21M5 18H10M16 18H21M2.09091 23H23.9091C24.5116 23 25 22.5116 25 21.9091V2.09091C25 1.48842 24.5116 1 23.9091 1H2.09091C1.48842 1 1 1.48842 1 2.09091V21.9091C1 22.5116 1.48842 23 2.09091 23Z"
                    stroke="#7F7F7F"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 19,
                  height: 33,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenColumns(e);
                  setTooltipOpenColumns(false);
                }}
                id="openColumns-button"
                aria-controls={openColumns ? "openColumns-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openColumns ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openColumns-menu"
                anchorEl={anchorElColumns}
                open={openColumns}
                onClose={handleCloseColumns}
                MenuListProps={{
                  "aria-labelledby": "openColumns-button",
                }}
                onMouseMove={() => setTooltipOpenColumns(false)}
              >
                <MenuItem
                  style={{
                    width: 136,
                    background: selectedColumn === "one" ? "#edf4fb" : "",
                  }}
                  onClick={() => handleClickColumns("one")}
                >
                  <div className="d-flex">
                    <div>
                      <svg
                        width="24"
                        height="28"
                        viewBox="0 0 26 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 5.5H21.5M4.5 8.5H21.5M4.5 11.5H21.5M4.5 14.5H21.5M4.5 17.5H21.5M4.5 20.5H21.5M4.5 23.5H21.5M2.09091 29H23.9091C24.5116 29 25 28.3784 25 27.6116V2.38843C25 1.62162 24.5116 1 23.9091 1H2.09091C1.48842 1 1 1.62162 1 2.38843V27.6116C1 28.3784 1.48842 29 2.09091 29Z"
                          stroke="black"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className="mx-2"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      One
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  style={{
                    width: 136,
                    background: selectedColumn === "two" ? "#edf4fb" : "",
                  }}
                  onClick={() => handleClickColumns("two")}
                >
                  <div className="d-flex">
                    <div>
                      <svg
                        width="24"
                        height="28"
                        viewBox="0 0 26 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 5.5H11.5M14.5 5.5H21.5M4.5 8.5H11.5M14.5 8.5H21.5M4.5 11.5H11.5M14.5 11.5H21.5M4.5 14.5H11.5M14.5 14.5H21.5M4.5 17.5H11.5M4.5 20.5H11.5M4.5 23.5H11.5M14.5 17.5H21.5M14.5 20.5H21.5M14.5 23.5H21.5M2.09091 29H23.9091C24.5116 29 25 28.3784 25 27.6116V2.38843C25 1.62162 24.5116 1 23.9091 1H2.09091C1.48842 1 1 1.62162 1 2.38843V27.6116C1 28.3784 1.48842 29 2.09091 29Z"
                          stroke="black"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className="mx-2"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      Two
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  style={{
                    width: 136,
                    background: selectedColumn === "three" ? "#edf4fb" : "",
                  }}
                  onClick={() => handleClickColumns("three")}
                >
                  <div className="d-flex">
                    <div>
                      <svg
                        width="24"
                        height="28"
                        viewBox="0 0 26 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 5.5H15M17.5 5.5H21.5M4.5 5.5H8.5M4.5 8.5H8.5M4.5 11.5H8.5M4.5 14.5H8.5M4.5 17.5H8.5M4.5 20.5H8.5M4.5 23.5H8.5M11 8.5H15M17.5 8.5H21.5M17.5 11.5H21.5M11 11.5H15M11 14.5H15M11 17.5H15M11 20.5H15M11 23.5H15M17.5 14.5H21.5M17.5 17.5H21.5M17.5 20.5H21.5M17.5 23.5H21.5M2.09091 29H23.9091C24.5116 29 25 28.3784 25 27.6116V2.38843C25 1.62162 24.5116 1 23.9091 1H2.09091C1.48842 1 1 1.62162 1 2.38843V27.6116C1 28.3784 1.48842 29 2.09091 29Z"
                          stroke="black"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className="mx-2"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      Three
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  style={{
                    width: 136,
                    background: selectedColumn === "left" ? "#edf4fb" : "",
                  }}
                  onClick={() => handleClickColumns("left")}
                >
                  <div className="d-flex">
                    <div>
                      <svg
                        width="24"
                        height="28"
                        viewBox="0 0 26 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 5.5H9M11.5 5.5H21.5M4.5 8.5H9M11.5 8.5H21.5M4.5 11.5H9M11.5 11.5H21.5M4.5 14.5H9M11.5 14.5H21.5M4.5 17.5H9M4.5 20.5H9M4.5 23.5H9M11.5 17.5H21.5M11.5 20.5H21.5M11.5 23.5H21.5M2.09091 29H23.9091C24.5116 29 25 28.3784 25 27.6116V2.38843C25 1.62162 24.5116 1 23.9091 1H2.09091C1.48842 1 1 1.62162 1 2.38843V27.6116C1 28.3784 1.48842 29 2.09091 29Z"
                          stroke="black"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className="mx-2"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      Left
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  style={{
                    width: 136,
                  }}
                  onClick={() => handleClickColumns("right")}
                >
                  <div className="d-flex">
                    <div>
                      <svg
                        width="24"
                        height="28"
                        viewBox="0 0 26 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 5.5H14M16.5 5.5H21.5M4.5 8.5H14M16.5 11.5H21.5M4.5 11.5H14M16.5 14.5H21.5M4.5 14.5H14M16.5 17.5455H21.5M4.5 17.5455H14M4.5 20.5H14M4.5 23.5H14M16.5 8.5H21.5M16.5 20.5H21.5M16.5 23.5H21.5M2.09091 29H23.9091C24.5116 29 25 28.3784 25 27.6116V2.38843C25 1.62162 24.5116 1 23.9091 1H2.09091C1.48842 1 1 1.62162 1 2.38843V27.6116C1 28.3784 1.48842 29 2.09091 29Z"
                          stroke="black"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className="mx-2"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      Right
                    </div>
                  </div>
                </MenuItem>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip title="Track Changes" placement="bottom">
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 34, height: 33 }}
              >
                <TrackChangeSvg />
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Table" placement="bottom">
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
              >
                <TableSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                }}
              >
                <DropdownImage />
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Add a Link" placement="bottom" open={tooltipOpenLink}>
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
                cursor: "pointer",
              }}
              onMouseOver={() => setTooltipOpenLink(!openLink)}
              onMouseLeave={() => setTooltipOpenLink(false)}
              id="openLink-button"
              aria-controls={openLink ? "openLink-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openLink ? "true" : undefined}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 34, height: 33 }}
                onClick={handleOpenLink}
              >
                <LinkSvg />
              </span>
              <Menu
                id="openLink-menu"
                anchorEl={anchorElLink}
                open={openLink}
                closeAfterTransition
                onClose={handleCloseLink}
                MenuListProps={{
                  "aria-labelledby": "openLink-button",
                }}
                onMouseMove={() => setTooltipOpenLink(false)}
              >
                <div
                  style={{
                    width: 300,
                    color: "#000000",
                  }}
                >
                  <div
                    className="text-center py-1"
                    style={{
                      borderBottom: "0.5px solid #00000080",
                      fontSize: 14,
                      fontWeight: 550,
                    }}
                  >
                    Insert/Edit Link
                  </div>
                  <div className="d-flex container py-1 align-items-center">
                    <label style={{ fontSize: 14, fontWeight: 550 }}>
                      Text to Display:
                    </label>
                    <input
                      type="text"
                      onChange={handleDisplayTextChange}
                      defaultValue={displayText}
                      style={{
                        width: 168,
                        border: "0.5px solid #00000080",
                        height: 16,
                        fontSize: 12,
                        marginLeft: 4,
                        padding: "0 3px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div className="container" style={{ fontSize: 12 }}>
                    Link to an existing file or web page.
                  </div>
                  <div className="d-flex container py-1 align-items-center">
                    <label style={{ fontSize: 14, fontWeight: 550 }}>
                      Address:
                    </label>
                    <input
                      value={linkUrl}
                      onChange={handleLinkUrlChange}
                      type="text"
                      style={{
                        width: 211,
                        border: "0.5px solid #00000080",
                        height: 16,
                        fontSize: 12,
                        marginLeft: 4,
                        padding: "0 3px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div className="d-flex container py-1 align-items-center justify-content-end">
                    <div>
                      <button
                        className=""
                        style={{
                          width: 60,
                          height: 24,
                          border: "1px solid #00000080",
                          fontSize: 12,
                          borderRadius: 5,
                          fontWeight: 550,
                        }}
                        onClick={handleCloseLink}
                      >
                        Cancel
                      </button>
                    </div>
                    <div>
                      <button
                        className="ml-2"
                        style={{
                          width: 60,
                          height: 24,
                          border: "1px solid #00000080",
                          fontSize: 12,
                          borderRadius: 5,
                          background: "#174B8B",
                          color: "#fefefe",
                          fontWeight: 550,
                        }}
                        onClick={handleAddLink}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip
            title="Insert Picture"
            placement="bottom"
            open={tooltipOpenPicture}
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={() => setTooltipOpenPicture(!openPicutre)}
              onMouseLeave={() => setTooltipOpenPicture(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
              >
                <PictureSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenPicture(e);
                  setTooltipOpenPicture(false);
                }}
                id="openPicutre-button"
                aria-controls={openPicutre ? "openPicutre-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openPicutre ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openPicutre-menu"
                anchorEl={anchorElPicture}
                open={openPicutre}
                onClose={handleClosePicture}
                MenuListProps={{
                  "aria-labelledby": "openPicutre-button",
                }}
                onMouseMove={() => setTooltipOpenPicture(false)}
              >
                <MenuItem onClick={handlePictureFromFile}>
                  <div className="d-flex align-items-center">
                    <div className="mr-2">
                      <svg
                        width="24"
                        height="22"
                        viewBox="0 0 16 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 0H0.5H12.3421H12.8421V0.5V4.83333H11.8421V1H1V5.80312L4.09596 2.74432L4.43412 2.41022L4.78486 2.73108L7.15328 4.89775L6.4783 5.63558L4.46062 3.78978L1 7.20888V9.96667H6.81579V10.9667H0.5H0V10.4667V7V0.5V0ZM10.7632 3.1C10.7632 3.57865 10.4097 3.96667 9.97368 3.96667C9.53767 3.96667 9.18421 3.57865 9.18421 3.1C9.18421 2.62135 9.53767 2.23333 9.97368 2.23333C10.4097 2.23333 10.7632 2.62135 10.7632 3.1ZM8.10526 6.40909C8.10526 6.25767 8.21058 6.2 8.26316 6.2H14.8421C14.8947 6.2 15 6.25767 15 6.40909V10.6636C15 10.8151 14.8947 10.8727 14.8421 10.8727H11.5526H8.26316C8.21058 10.8727 8.10526 10.8151 8.10526 10.6636V6.40909ZM14.8421 11.8727H12.0526V13H13.5263C13.8025 13 14.0263 13.2239 14.0263 13.5C14.0263 13.7761 13.8025 14 13.5263 14H11.5526H9.57895C9.3028 14 9.07895 13.7761 9.07895 13.5C9.07895 13.2239 9.3028 13 9.57895 13H11.0526V11.8727H8.26316C7.58905 11.8727 7.10526 11.2955 7.10526 10.6636V6.40909C7.10526 5.77727 7.58905 5.2 8.26316 5.2H14.8421C15.5162 5.2 16 5.77727 16 6.40909V10.6636C16 11.2955 15.5162 11.8727 14.8421 11.8727Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div
                      style={{ position: "relative", bottom: 2, fontSize: 14 }}
                    >
                      Picture from File
                    </div>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleOpenLinkPicture}>
                  <div className="d-flex align-items-center">
                    <div className="mr-2">
                      <svg
                        width="24"
                        height="22"
                        viewBox="0 0 15 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 0H0.5H11.7836H12.2836V0.5V3.88869H11.2836V1H1V5.02434L3.92651 2.38766L4.24356 2.10201L4.57547 2.37025L7.14847 4.44968L6.5199 5.22743L4.27882 3.41625L1 6.37034V8.65999H5.50067V9.65999H0.5H0V9.15999V6.14782V0.5V0ZM6.00081 8.50964C6.00081 6.0222 8.01526 4.00482 10.5013 4.00482C12.9874 4.00482 15.0019 6.0222 15.0019 8.50964C15.0019 10.9971 12.9874 13.0145 10.5013 13.0145C8.01526 13.0145 6.00081 10.9971 6.00081 8.50964ZM7.03615 8.00964H8.30763C8.32686 7.77471 8.35952 7.53453 8.40598 7.29329H7.21735C7.13289 7.52179 7.07155 7.76152 7.03615 8.00964ZM7.78945 6.29329H8.68036C8.80982 5.93575 8.97211 5.5891 9.16849 5.26785C8.62738 5.49111 8.15438 5.84623 7.78945 6.29329ZM10.5013 5.1685C10.2001 5.47476 9.9508 5.86318 9.75812 6.29329H11.2446C11.0519 5.86318 10.8026 5.47476 10.5013 5.1685ZM9.4268 7.29329C9.3727 7.53076 9.33393 7.77129 9.31111 8.00964H11.6916C11.6688 7.77129 11.63 7.53076 11.5759 7.29329H9.4268ZM12.6951 8.00964C12.6758 7.77471 12.6432 7.53453 12.5967 7.29329H13.7853C13.8698 7.52179 13.9311 7.76152 13.9665 8.00964H12.6951ZM9.31111 9.00964C9.33393 9.24799 9.3727 9.48852 9.4268 9.72599H11.5759C11.63 9.48852 11.6688 9.24799 11.6916 9.00964H9.31111ZM12.5967 9.72599C12.6432 9.48475 12.6758 9.24457 12.6951 9.00964H13.9665C13.9311 9.25776 13.8698 9.49749 13.7853 9.72599H12.5967ZM9.75812 10.726C9.9508 11.1561 10.2001 11.5445 10.5013 11.8508C10.8026 11.5445 11.0519 11.1561 11.2446 10.726H9.75812ZM9.16849 11.7514C8.97211 11.4302 8.80982 11.0835 8.68036 10.726H7.78945C8.15438 11.173 8.62739 11.5282 9.16849 11.7514ZM7.21735 9.72599H8.40598C8.35952 9.48475 8.32686 9.24457 8.30763 9.00964H7.03615C7.07155 9.25776 7.13289 9.49749 7.21735 9.72599ZM11.8342 11.7514C12.0306 11.4302 12.1929 11.0835 12.3223 10.726H13.2132C12.8483 11.173 12.3753 11.5282 11.8342 11.7514ZM13.2132 6.29329H12.3223C12.1929 5.93575 12.0306 5.58909 11.8342 5.26784C12.3753 5.49111 12.8483 5.84623 13.2132 6.29329ZM9.90297 3.88869C10.3184 3.88869 10.6552 3.55154 10.6552 3.13565C10.6552 2.71976 10.3184 2.38261 9.90297 2.38261C9.48752 2.38261 9.15073 2.71976 9.15073 3.13565C9.15073 3.55154 9.48752 3.88869 9.90297 3.88869Z"
                          fill="black"
                        />
                      </svg>
                    </div>

                    <div
                      style={{ position: "relative", bottom: 2, fontSize: 14 }}
                    >
                      Online Pictures
                    </div>
                  </div>
                </MenuItem>
              </Menu>
              <Menu
                id="openLinkPicture-menu"
                anchorEl={anchorElLinkPicture}
                open={openLinkPicture}
                onClose={handleCloseLinkPicture}
                MenuListProps={{
                  "aria-labelledby": "openLinkPicture-button",
                }}
                onMouseMove={() => setTooltipOpenPicture(false)}
              >
                <div className="d-flex container py-1 align-items-center">
                  <label style={{ fontSize: 14, fontWeight: 550 }}>
                    Address:
                  </label>
                  <input
                    value={linkUrlImage}
                    onChange={(e) => setLinkUrlImage(e.target.value)}
                    type="text"
                    style={{
                      width: 211,
                      border: "0.5px solid #00000080",
                      height: 16,
                      fontSize: 12,
                      marginLeft: 4,
                      padding: "0 3px",
                      outline: "none",
                    }}
                  />
                </div>
                <div className="d-flex container py-1 align-items-center justify-content-end">
                  <div>
                    <button
                      className=""
                      style={{
                        width: 60,
                        height: 24,
                        border: "1px solid #00000080",
                        fontSize: 12,
                        borderRadius: 5,
                        fontWeight: 550,
                      }}
                      onClick={handleCloseLinkPicture}
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      className="ml-2"
                      style={{
                        width: 60,
                        height: 24,
                        border: "1px solid #00000080",
                        fontSize: 12,
                        borderRadius: 5,
                        background: "#174B8B",
                        color: "#fefefe",
                        fontWeight: 550,
                      }}
                      onClick={handleAddLinkPicture}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip title="Media" placement="bottom" open={tooltipOpenMedia}>
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={() => setTooltipOpenMedia(!openMedia)}
              onMouseLeave={() => setTooltipOpenMedia(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, height: 32 }}
              >
                <MediaSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  height: 33,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenMedia(e);
                  setTooltipOpenPicture(false);
                }}
                id="openMedia-button"
                aria-controls={openMedia ? "openMedia-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMedia ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openPicutre-menu"
                anchorEl={anchorElMedia}
                open={openMedia}
                onClose={handleCloseMedia}
                MenuListProps={{
                  "aria-labelledby": "openMedia-button",
                }}
                onMouseMove={() => setTooltipOpenMedia(false)}
              >
                <MenuItem onClick={handleVideoFromFile}>
                  <div className="d-flex align-items-center">
                    <div className="mr-2">
                      <svg
                        width="24"
                        height="22"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.125 4.83333H13.625V4.33333V2.88889V2.38889H13.125H11.25H10.75V2.88889V4.33333V4.83333H11.25H13.125ZM13.125 7.72222H13.625V7.22222V5.77778V5.27778H13.125H11.25H10.75V5.77778V7.22222V7.72222H11.25H13.125ZM13.125 10.6111H13.625V10.1111V8.66667V8.16667H13.125H11.25H10.75V8.66667V10.1111V10.6111H11.25H13.125ZM3.75 4.83333H4.25V4.33333V2.88889V2.38889H3.75H1.875H1.375V2.88889V4.33333V4.83333H1.875H3.75ZM3.75 7.72222H4.25V7.22222V5.77778V5.27778H3.75H1.875H1.375V5.77778V7.22222V7.72222H1.875H3.75ZM3.75 10.6111H4.25V10.1111V8.66667V8.16667H3.75H1.875H1.375V8.66667V10.1111V10.6111H1.875H3.75ZM13.125 1.94444H13.625V1.44444V0.5H14.5V12.5H13.625V11.5556V11.0556H13.125H11.25H10.75V11.5556V12.5H4.25V11.5556V11.0556H3.75H1.875H1.375V11.5556V12.5H0.5V0.5H1.375V1.44444V1.94444H1.875H3.75H4.25V1.44444V0.5H10.75V1.44444V1.94444H11.25H13.125Z"
                          fill="white"
                          stroke="black"
                        />
                      </svg>
                    </div>
                    <div
                      style={{ position: "relative", bottom: 2, fontSize: 14 }}
                    >
                      Video from File
                    </div>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleAudioFromFile}>
                  <div className="d-flex align-items-center">
                    <div className="mr-2">
                      <svg
                        width="24"
                        height="22"
                        viewBox="0 0 15 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.66562 8.45632L3.52351 8.32993H3.33333H0.5V4.88296H3.33333H3.52351L3.66562 4.75657L7 1.79098V11.4219L3.66562 8.45632ZM13.8333 6.60645C13.8333 4.11703 12.0659 2.04479 9.66667 1.25987V0.742781C12.4999 1.55596 14.5 3.90318 14.5 6.60645C14.5 9.30971 12.4999 11.6569 9.66667 12.4701V11.9457C12.0651 11.1616 13.8333 9.09661 13.8333 6.60645ZM9.66667 4.49123C10.3474 5.01762 10.75 5.77685 10.75 6.60645C10.75 7.43262 10.3457 8.19377 9.66667 8.71069V4.49123Z"
                          fill="white"
                          stroke="black"
                        />
                      </svg>
                    </div>

                    <div
                      style={{ position: "relative", bottom: 2, fontSize: 14 }}
                    >
                      Audio from File
                    </div>
                  </div>
                </MenuItem>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Formula">
            <button className=" btn-undo mr-2" onClick={handleInsertFormula}>
              <FormulaSvg />
            </button>
          </Tooltip>
          <Tooltip title="Source code">
            <button className=" btn-undo mr-2" onClick={handleInsertCodeBlock}>
              <SourceCodeSvg />
            </button>
          </Tooltip>
          <Tooltip title="Clean">
            <button className="btn-undo" onClick={handleClean}>
              <ClearFormattingSvg />
            </button>
          </Tooltip>
        </span>
      </div>
      <button onClick={scrollRight} className="scroll-left">
        <ScrollRightSvg />
      </button>
    </div>
  );
}
