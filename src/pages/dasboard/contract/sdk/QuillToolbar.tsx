import { ContractContext } from "@/context/ContractContext";
import useStore from "@/context/ZustandStore";
import { Menu, MenuItem, Select, Tooltip } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
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

class CheckboxContainerBlot extends BlockEmbed {
  static create(value: any) {
    const store: any = useStore.getState();
    const checkboxes = store.checkboxes;

    let node = super.create();
    node.setAttribute("contenteditable", "false");
    node.innerHTML = `<input type="checkbox" id="${value.id}" name="${value.name
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
      child.innerHTML = ` <div style="background-color: ${bubbleColors[index % bubbleColors.length]
        }; height: 28px; width: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; text-align: center; margin-left:50%">${initials.toUpperCase()}</div>    <div style="margin-left:15%;"><label style="color:#aaa;font-size:14px;">Full Name</label> <input type="text" value=${recipient.label || recipient.email
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
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
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
    delay: 500,
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
  "alphabet-list-item",
  "underlineHighlight",
];

const ListItem = Quill.import("formats/list/item");

class AlphabetListItem extends ListItem {
  static create(value: any) {
    let node = super.create();
    if (value || value === undefined) {
      const valueFromStorage = localStorage.getItem("list");
      if (valueFromStorage) {
        node.setAttribute("data-list", valueFromStorage);
      }
    }
    return node;
  }

  static formats(domNode: any) {
    if (domNode.hasAttribute("data-list")) {
      return domNode.getAttribute("data-list");
    }
    return super.formats(domNode);
  }

  format(name: any, value: any) {
    if (name === "list") {
      if (value) {
        this.domNode.setAttribute("data-list", localStorage.getItem("list"));
      } else {
        this.domNode.removeAttribute("data-list");
        super.format(name, false); // Remove the list formatting
      }
    } else {
      super.format(name, value);
    }
  }
}

const CustomUnderline = Quill.import("blots/inline");

class UnderlineBlot extends CustomUnderline {
  static create(value: any) {
    let node = super.create();
    node.setAttribute(
      "style",
      `text-decoration: underline; text-decoration-color: ${value}`
    );
    return node;
  }

  static formats(node: any) {
    return node.style.textDecorationColor;
  }
}

UnderlineBlot.blotName = "underlineHighlight";
UnderlineBlot.tagName = "span";
Quill.register(UnderlineBlot);

// Register custom format
Quill.register({
  "formats/alphabet-list-item": AlphabetListItem,
});

export default function QuillToolbar() {
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
    bgColor,shadeColor
  } = useContext(ContractContext);

  const toolbarRef: any = useRef(null);

  const handleListClick = (value: string) => {
    if (value === "none") {
      localStorage.removeItem("list");
      if (editorRefContext) {
        editorRefContext.getEditor()?.format("list", false);
      }
    } else {
      localStorage.setItem("list", value);
      if (editorRefContext) {
        if (value === "default") {
          editorRefContext.getEditor()?.format("list", "ordered");
        } else {
          editorRefContext.getEditor()?.format("list", value);
        }
      }
    }
    setAnchorEl2(null);
    setAnchorEl(null);
  };

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const [tooltipOpenSize, setTooltipOpenSize] = useState(false);
  const [tooltipOpenColumns, setTooltipOpenColumns] = useState(false);


  const [tooltipOpenHeader, setTooltipOpenHeader] = useState(false);
  const [tooltipOpenHighlight, setTooltipOpenHighlight] = useState(false);

  const [tooltipOpenColor, setTooltipOpenColor] = useState(false);
  const [tooltipOpenShading, setTooltipOpenShading] = useState(false);

  const [tooltipOpenCase, setTooltipOpenCase] = useState(false);

  const [tooltipOpenMargins, setTooltipOpenMargins] = useState(false);

  const [tooltipOpenOrientation, setTooltipOpenOrientation] = useState(false);

  

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

  const [anchorElColumns, setAnchorElColumns] = React.useState(null);
  const openColumns = Boolean(anchorElColumns);


  const [anchorElCase, setAnchorElCase] = React.useState(null);
  const openCase = Boolean(anchorElCase);

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleClick = (event: any) => {
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
    setAnchorElTextColor(event.currentTarget);
  };
  const handleCloseTextColor = () => {
    setAnchorElTextColor(null);
  };

  const handleOpenFontColor = (event: any) => {
    setAnchorElFontColor(event.currentTarget);
  };
  const handleCloseFontColor = () => {
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

  const handleOpenColumns = (event: any) => {
    setAnchorElColumns(event.currentTarget);
  };

  const handleCloseColumns = () => {
    setAnchorElColumns(null);
  };

  const handleOpenCase = (event: any) => {
    const editor = editorRefContext.getEditor();
    const savedSelection = editor.getSelection();
    setAnchorElCase(event.currentTarget);
    editor.focus();
    if (savedSelection) {
      editor.setSelection(savedSelection);
    }
    setTooltipOpenCase(false)
  };

  const handleCloseCase = () => {
    setAnchorElCase(null);
    setTooltipOpenCase(false)
  };
  


  const scrollLeft = () => {
    toolbarRef.current.scrollBy({ left: -1000, behavior: "smooth" });
  };

  const scrollRight = () => {
    toolbarRef.current.scrollBy({ left: 1000, behavior: "smooth" });
  };

  const handleFontChange = (event: any) => {
    const font = event.target.value;
    const quill = editorRefContext.getEditor();
    if (quill) {
      const selection = quill.getSelection();
      if (selection) {
        // Apply the font to the selected text
        quill.formatText(selection.index, selection.length, "font", font);
      }
      quill.format("font", false);

      // Apply the font to the entire text or future text
      quill.format("font", font);

      setTimeout(() => {
        quill.focus(); // Focus the editor
      }, 0);
    } else {
      console.error("Quill editor instance not found");
    }
  };

  const handleFontSizeChange = (event: any) => {
    const fontSize = event.target.value;
    const quill = editorRefContext.getEditor();

    if (quill) {
      const selection = quill.getSelection();

      if (selection) {
        quill.formatText(
          selection.index,
          selection.length,
          { size: fontSize },
          "user"
        );
      }
      quill.format("size", fontSize);

      setTimeout(() => {
        quill.focus();
      }, 0);
    } else {
      console.error("Quill editor instance not found");
    }
  };

  const handleHeaderChange = (event: any) => {
    const headerLevel = event.target.value;
    const quill = editorRefContext.getEditor(); // Get the Quill editor instance

    if (quill) {
      const selection = quill.getSelection();
      if (selection) {
        quill.format("header", headerLevel);
      } else {
        // Apply the header format to the entire text or future text
        quill.format("header", headerLevel);
      }

      setTimeout(() => {
        quill.focus();
      }, 0);
    } else {
      console.error("Quill editor instance not found");
    }
  };

  const [tooltipOpenNumbering, setTooltipOpenNumbering] = useState(false);
  const [tooltipOpenBullets, setTooltipOpenBullets] = useState(false);


  const handleSelectOrientation = (value: any) => {
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


  const handleTextHighlightColorChange = (color: any) => {
    setBgColor(color.hex);
  };

  const handleTextHighlight = () => {
    const editor = editorRefContext.getEditor();
    setBgColor(bgColor)

    setTimeout(() => {
        editor.focus();
      }, 0);
  
  };

  const handleFontColorChange = (color: any) => {
    setFontColor(color.hex);
  };


  const handleBgColorChange = (color: any) => {
    setBgColor(color.hex);
  };

  const handleFontColor = () => {
    const editor = editorRefContext.getEditor()
    setFontColor(fontColor)
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
    return text.replace(/\w\S*/g, (word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  };

  const toToggleCase = (text: any) => {
    return text
      .split('')
      .map((char: any) =>
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
  };


  const handleTextTransformation = (transformationFunction: Function) => {
    const editor = editorRefContext.getEditor();
    const selection = editor.getSelection();

    if (selection && selection.length > 0) {
      const selectedText = editor.getText(selection.index, selection.length);
      const transformedText = transformationFunction(selectedText);
      editor.deleteText(selection.index, selection.length);
      editor.insertText(selection.index, transformedText);
      editor.setSelection(selection.index, selection.length);
    }
    handleCloseCase()
  };

  const [selectedColumn, setSelectedColumn] = useState("one")

  const handleClickColumns = (value: string) => {
    const editorContainer = editorRefContext.editor?.root;

    if (!editorContainer) {
      console.error("Editor container not found");
      return;
    }

    setSelectedColumn(value)

    switch (value) {
      case 'one':
        editorContainer.style.columnCount = '1';
        editorContainer.style.columnGap = '0';
        break;
      case 'two':
        editorContainer.style.columnCount = '2';
        editorContainer.style.columnGap = '20px';
        break;
      case 'three':
        editorContainer.style.columnCount = '3';
        editorContainer.style.columnGap = '20px';
        break;
      case 'left':
        editorContainer.style.columnCount = '2';
        editorContainer.style.columnGap = '20px';
        editorContainer.style.columnWidth = '25%';
        break;
      case 'right':
        editorContainer.style.columnCount = '2';
        editorContainer.style.columnGap = '20px';
        editorContainer.style.columnWidth = '75%';
        break;
      default:
        editorContainer.style.columnCount = '1';
        editorContainer.style.columnGap = '0';
    }
    handleCloseColumns()
  };


  const [showFormattingMarks, setShowFormattingMarks] = useState(false);

  const toggleFormattingMarks = () => {
    setShowFormattingMarks(!showFormattingMarks);
  };

  useEffect(() => {
    if (!editorRefContext) return;
    const editor = editorRefContext.getEditor();
    const editorContainer = editor.root;

    const paragraphs = editorContainer.querySelectorAll('p');
    
    paragraphs.forEach((p:any) => {
      // Remove existing formatting marks
      p.querySelectorAll('.formatting-mark').forEach((mark:any) => mark.remove());

      const lineText = p.innerText.trim();
      if (lineText === '' || lineText.length < 95) { 
        if (showFormattingMarks) {
          const mark = document.createElement('span');
          mark.className = "formatting-mark";
          mark.innerHTML = "¶"; 
          p.appendChild(mark);
        }
      }
    });
  }, [showFormattingMarks]);

  return (
    <div className="d-flex">
      <button onClick={scrollLeft} className="btn-slider">
        {"<"}
      </button>
      <div
        id="toolbar"
        ref={toolbarRef}
        className="toolbar"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          overflowY: "hidden",
          height: 53,
        }}
      >
        <span className="ql-formats b-r">
          <Tooltip title="Undo" placement="bottom">
            <button
              className="ql-undo btn-undo"
              style={{
                cursor: canUndo ? "pointer" : "default",
              }}
            >
              <svg
                width="20.47"
                height="9"
                viewBox="0 0 21 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 1C7.85 1 5.45 2 3.6 3.6L0 0V9H9L5.38 5.38C6.77 4.22 8.54 3.5 10.5 3.5C14.04 3.5 17.05 5.81 18.1 9L20.47 8.22C19.08 4.03 15.15 1 10.5 1Z"
                  fill={canUndo ? "black" : "#b8b8b8"}
                />
              </svg>
            </button>
          </Tooltip>
          <Tooltip title="Redo" placement="bottom">
            <button
              className="ql-redo btn-undo ml-2"
              style={{
                cursor: canRedo ? "pointer" : "default",
              }}
            >
              <svg
                width="20.47"
                height="9"
                viewBox="0 0 21 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.86 3.6C15.01 2 12.61 1 9.96 1C5.31 1 1.38 4.03 0 8.22L2.36 9C3.41 5.81 6.41 3.5 9.96 3.5C11.91 3.5 13.69 4.22 15.08 5.38L11.46 9H20.46V0L16.86 3.6Z"
                  fill={canRedo ? "black" : "#b8b8b8"}
                />
              </svg>
            </button>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip title="Font" placement="bottom" open={tooltipOpen}>
            <span className="ql-formats">
              <Select
                className="ql-font b-r"
                defaultValue="arial"
                onMouseLeave={() => {
                  setTooltipOpen(false);
                }}
                onMouseEnter={() => {
                  setTooltipOpen(true);
                }}
                style={{
                  height: 33,
                  width: 147,
                  borderColor: "#D9D9D9",
                  borderRadius: 5,
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
                  width: 83,
                  height: 33,
                  borderColor: "#D9D9D9",
                  borderRadius: 5,
                }}
                className="ql-size"
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
                className="text-center"
                style={{
                  height: 33,
                  width: 147,
                  borderColor: "#D9D9D9",
                  borderRadius: 5,
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
              >
                <MenuItem value="0" style={{ fontSize: "14px" }}>
                  Paragraph
                </MenuItem>
                <MenuItem
                  value="1"
                  style={{ fontSize: "18px", fontWeight: "bold" }}
                >
                  Heading 1
                </MenuItem>
                <MenuItem
                  value="2"
                  style={{ fontSize: "16px", fontWeight: "bold" }}
                >
                  Heading 2
                </MenuItem>
                <MenuItem
                  value="3"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  Heading 3
                </MenuItem>
                <MenuItem
                  value="4"
                  style={{ fontSize: "12px", fontWeight: "bold" }}
                >
                  Heading 4
                </MenuItem>
              </Select>
            </span>
          </Tooltip>
        </span>

        <span className="ql-formats ">
          <Tooltip title="Text Highlight Color" placement="bottom" open={tooltipOpenHighlight}>
            <span
              className="d-flex"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={()=>setTooltipOpenHighlight(true)}
              onMouseLeave={()=>setTooltipOpenHighlight(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33, cursor: "pointer" }}
                onClick={handleTextHighlight}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 14L6.15426 11.3494L6.13076 11.3301C5.67641 10.7614 5.67641 9.84578 6.13076 9.28675L9.84393 4.71807L13.1654 8.80482L9.45224 13.3735C9.00572 13.9325 8.27719 13.9325 7.815 13.3928L7.32148 14H4ZM13.3299 0.419277C13.7921 -0.139759 14.5363 -0.139759 14.9907 0.419277L16.6592 2.46265C17.1136 3.03133 17.1136 3.94699 16.6592 4.51566L14.0741 7.68675L10.7526 3.6L13.3299 0.419277Z"
                    fill="black"
                  />
                  <line
                    y1="18.5"
                    x2="21"
                    y2="18.5"
                    stroke={bgColor}
                    stroke-width="5"
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
                id="openTextColor-button"
                aria-controls={openTextColor ? "openTextColor-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openTextColor ? "true" : undefined}
                onClick={(e)=>{
                  handleOpenTextColor(e)
                  setTooltipOpenHighlight(false)
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
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

        <span className="ql-formats">
          <Tooltip title="Font Color" placement="bottom" open={tooltipOpenColor}>
            <span
              className="d-flex "
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={()=>setTooltipOpenColor(true)}
              onMouseLeave={()=>setTooltipOpenColor(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33, cursor: "pointer" }}
                onClick={handleFontColor}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.12 9L10.5 2.67L12.87 9H8.12ZM9.5 0L4 14H6.25L7.37 11H13.62L14.75 14H17L11.5 0H9.5Z"
                    fill="black"
                  />
                  <line
                    y1="18.5"
                    x2="21"
                    y2="18.5"
                    stroke={fontColor}
                    stroke-width="5"
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
                id="openFontColor-button"
                aria-controls={openFontColor ? "openFontColor-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openFontColor ? "true" : undefined}
                onClick={(e)=>{
                  handleOpenFontColor(e)
                  setTooltipOpenColor(false)
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
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
                <Sketch color="#9b9b9b" onChange={handleFontColorChange} />
      
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Shading" placement="bottom" open={tooltipOpenShading}>
            <span
              className="d-flex ql-color"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={()=>setTooltipOpenShading(true)}
              onMouseLeave={()=>setTooltipOpenShading(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33, cursor: "pointer" }}
                onClick={handleBgColor}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5558 9.47059C15.5558 9.47059 14.1115 11.2576 14.1115 12.3529C14.1115 12.7898 14.2637 13.2087 14.5345 13.5176C14.8054 13.8265 15.1727 14 15.5558 14C15.9388 14 16.3061 13.8265 16.577 13.5176C16.8478 13.2087 17 12.7898 17 12.3529C17 11.2576 15.5558 9.47059 15.5558 9.47059ZM5.59769 8.23529L9.05666 4.29059L12.5156 8.23529H5.59769ZM13.7938 7.36235L7.33801 0L6.31982 1.16118L8.03847 3.12118L4.31954 7.36235C3.89349 7.82353 3.89349 8.62235 4.31954 9.10824L8.29121 13.6376C8.50062 13.8765 8.78225 14 9.05666 14C9.33106 14 9.61269 13.8765 9.82211 13.6376L13.7938 9.10824C14.2198 8.62235 14.2198 7.82353 13.7938 7.36235Z"
                    fill="black"
                  />
                  <line
                    y1="18.5"
                    x2="21"
                    y2="18.5"
                    stroke={bgColor}
                    stroke-width="5"
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
                id="openBgColor-button"
                aria-controls={openBgColor ? "openBgColor-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openBgColor ? "true" : undefined}
                onClick={(e)=>{
                  handleOpenBgColor(e)
                  setTooltipOpenShading(false)
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
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
          <Tooltip title="Change Case" placement="bottom" open={tooltipOpenCase}>
            <span
              className="d-flex "
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseOver={()=>{
                setTooltipOpenCase(!openCase)
                console.log(tooltipOpenCase)
                console.log("Mouse Moved")
              }}
              onMouseLeave={()=>setTooltipOpenCase(false)}
              onFocus={()=>setTooltipOpenCase(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.1435 21.7105C22.0702 21.403 21.9603 20.8783 21.8992 20.1003C21.0809 21.3668 20.0916 22 18.9557 22C17.942 22 17.0992 21.5658 16.4519 20.7155C15.8046 19.9013 15.4748 18.7977 15.4748 17.477C15.4748 15.8849 15.8779 14.6546 16.6962 13.7681C17.5145 12.8816 18.6626 12.4474 20.1527 12.4474H21.8626V11.2895C21.8626 10.403 21.6794 9.69737 21.313 9.1727C20.9466 8.64803 20.3969 8.39474 19.6885 8.39474C19.0534 8.39474 18.5282 8.61184 18.1008 9.04605C17.6733 9.49835 17.4656 10.023 17.4656 10.6563H15.6824C15.6824 9.87829 15.8656 9.13651 16.2321 8.41283C16.574 7.68914 17.0992 7.12829 17.7221 6.71217C18.345 6.33224 19.0168 6.07895 19.7863 6.07895C20.9832 6.07895 21.9114 6.51316 22.5832 7.39967C23.255 8.28618 23.6092 9.49835 23.6336 11.0543V18.0921C23.6336 19.5395 23.7557 20.6612 24 21.4934V21.7105H22.1435ZM19.2122 19.6842C19.7618 19.6842 20.287 19.4852 20.7878 19.1053C21.2763 18.7253 21.6427 18.2188 21.8626 17.6036V14.7632H20.4824C18.3206 14.7632 17.2336 15.6135 17.2336 17.3141C17.2336 18.0921 17.4168 18.6349 17.7954 19.051C18.1618 19.4671 18.626 19.6842 19.2122 19.6842ZM4.31145 13.949H9.28244L6.80305 4.14309L4.31145 13.949ZM5.75267 0H7.85344L13.6061 21.7105H11.2489L10.0641 17.0609H3.52977L2.35725 21.7105H0L5.75267 0Z"
                    fill="black"
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
                onClick={(e)=>{
                  handleOpenCase(e)
                  setTooltipOpenCase(false)
                }}
                id="openCase-button"
                aria-controls={openCase ? "openCase-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openCase ? "true" : undefined}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
              <Menu
                id="openCase-menu"
                anchorEl={anchorElCase}
                open={openCase}
                onClose={handleCloseCase}
                MenuListProps={{
                  "aria-labelledby": "openCase-button",
                }}
                onMouseMove={()=>setTooltipOpenCase(false)}
                onChange={()=>setTooltipOpenCase(false)}
              >
                <MenuItem onClick={() => handleTextTransformation(toSentenceCase)}>
                  Sentence case
                </MenuItem>
                <MenuItem onClick={() => handleTextTransformation(toLowerCase)}>
                  lowercase
                </MenuItem>
                <MenuItem onClick={() => handleTextTransformation(toUpperCase)}>
                  UPPERCASE
                </MenuItem>
                <MenuItem onClick={() => handleTextTransformation(toCapitalizeEachWord)}>
                  Capitalize Each Word
                </MenuItem>
                <MenuItem onClick={() => handleTextTransformation(toToggleCase)}>
                  tOGGLE cASE
                </MenuItem>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip title="Bold" placement="bottom">
            <button className="btn-undo ql-bold"></button>
          </Tooltip>
          <Tooltip title="Italic" placement="bottom">
            <button className="btn-undo ml-2 ql-italic"></button>
          </Tooltip>
          <Tooltip title="Underline" placement="bottom">
            <button className="btn-undo mx-2 ql-underline"></button>
          </Tooltip>
          <Tooltip title="Strikethrough" placement="bottom">
            <button className="btn-undo ql-strike"></button>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip title="Superscript">
            <button className="btn-undo ql-script" value="super"></button>
          </Tooltip>
          <Tooltip title="Subscript">
            <button className="btn-undo ql-script mx-2" value="sub" />
          </Tooltip>
          <Tooltip title="Show/Hide formatting marks">
            <button className="btn-undo" onClick={toggleFormattingMarks}>
              <svg width="16" height="28" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.33333 9.77778C3.91885 9.77778 2.56229 9.2627 1.5621 8.34586C0.561903 7.42901 0 6.1855 0 4.88889C0 3.59227 0.561903 2.34877 1.5621 1.43192C2.56229 0.515078 3.91885 0 5.33333 0H16V2.44444H13.3333V22H10.6667V2.44444H8V22H5.33333V9.77778Z" fill="black" />
              </svg>

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
              className="d-flex"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
                cursor:"pointer"
              }}
              onMouseEnter={() => setTooltipOpenNumbering(!open1)}
              onMouseLeave={() => setTooltipOpenNumbering(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  onClick={() => handleListClick("default")}
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.31579 12.375V9.625H24V12.375H6.31579ZM6.31579 20.625V17.875H24V20.625H6.31579ZM6.31579 4.125V1.375H24V4.125H6.31579ZM1.26316 5.5V1.375H0V0H2.52632V5.5H1.26316ZM0 17.875V16.5H3.78947V22H0V20.625H2.52632V19.9375H1.26316V18.5625H2.52632V17.875H0ZM2.84211 8.25C3.09336 8.25 3.33433 8.35865 3.512 8.55205C3.68966 8.74544 3.78947 9.00775 3.78947 9.28125C3.78947 9.55625 3.68842 9.8175 3.52421 9.99625L1.41474 12.375H3.78947V13.75H0V12.485L2.52632 9.625H0V8.25H2.84211Z"
                    fill="black"
                  />
                </svg>
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 19,
                  borderLeft: "1px solid #D9D9D9",
                  height: 33,
                  cursor: "pointer",
                }}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(e)=>{
                  handleClick(e)
                  setTooltipOpenNumbering(false)
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
            
                onMouseMove={()=>setTooltipOpenNumbering(false)}
              >
                <div className="d-flex">
                  <MenuItem
                    value="none"
                    className="mx-1 border-menu"
                    style={{ height: 50, width: 60, padding: 4 }}
                    onClick={() => {
                      handleListClick("none");
                    }}
                  >
                    <div
                      className="e-de-list-header-presetmenu"
                      style={{
                        position: "relative",
                        left: 11,
                        color: "black",
                      }}
                    >
                      <div>
                        <span className="e-de-bullets">None</span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 border-menu"
                    style={{ height: 50, width: 60, padding: 4 }}
                    onClick={() => {
                      handleListClick("default");
                    }}
                  >
                    <div className="e-de-list-header-presetmenu">
                      <div>
                        1.<span className="e-de-list-line"></span>
                      </div>
                      <div>
                        2.<span className="e-de-list-line"></span>
                      </div>
                      <div>
                        3.<span className="e-de-list-line"> </span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="lower-alpha"
                    className="mx-1 border-menu"
                    style={{
                      height: 50,
                      width: 60,
                      padding: 4,
                      color: "black",
                    }}
                    onClick={() => handleListClick("lower-alpha")}
                  >
                    <div className="e-de-list-header-presetmenu">
                      <div>
                        a.<span className="e-de-list-line"></span>
                      </div>
                      <div>
                        b.<span className="e-de-list-line"></span>
                      </div>
                      <div>
                        c.<span className="e-de-list-line"> </span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
                <div className="d-flex py-2">
                  <MenuItem
                    value="upper-alpha"
                    className="mx-1 border-menu"
                    style={{
                      height: 50,
                      width: 60,
                      padding: 4,
                      color: "black",
                    }}
                    onClick={() => handleListClick("upper-alpha")}
                  >
                    <div className="e-de-list-header-presetmenu">
                      <div>
                        A.<span className="e-de-list-line"></span>
                      </div>
                      <div>
                        B.<span className="e-de-list-line"></span>
                      </div>
                      <div>
                        C.<span className="e-de-list-line"> </span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="lower-roman"
                    className="mx-1 border-menu"
                    style={{ height: 50, width: 60, padding: 4 }}
                    onClick={() => handleListClick("lower-roman")}
                  >
                    <div className="e-de-list-header-presetmenu">
                      <div>
                        i.<span className="e-de-list-line"></span>
                      </div>
                      <div>
                        ii.<span className="e-de-list-line"></span>
                      </div>
                      <div>
                        iii.<span className="e-de-list-line"> </span>
                      </div>
                    </div>{" "}
                  </MenuItem>

                  <MenuItem
                    value="upper-roman"
                    className="mx-1 border-menu"
                    style={{ height: 50, width: 60, padding: 4 }}
                    onClick={() => handleListClick("upper-roman")}
                  >
                    <div className="e-de-list-header-presetmenu">
                      <div>
                        I.<span className="e-de-list-line"></span>
                      </div>
                      <div>
                        II.<span className="e-de-list-line"></span>
                      </div>
                      <div>
                        III.<span className="e-de-list-line"> </span>
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
              className="d-flex "
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
                style={{ width: 32, height: 33 ,cursor:"pointer"}}
              >
                <svg
                  onClick={() => handleListClick("bullet-dot")}
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.83784 0.733333H24V3.66667H5.83784V0.733333ZM5.83784 12.4667V9.53333H24V12.4667H5.83784ZM1.94595 0C2.46204 0 2.957 0.231785 3.32194 0.644365C3.68687 1.05694 3.89189 1.61652 3.89189 2.2C3.89189 2.78348 3.68687 3.34306 3.32194 3.75564C2.957 4.16822 2.46204 4.4 1.94595 4.4C1.42985 4.4 0.93489 4.16822 0.569954 3.75564C0.205019 3.34306 0 2.78348 0 2.2C0 1.61652 0.205019 1.05694 0.569954 0.644365C0.93489 0.231785 1.42985 0 1.94595 0ZM1.94595 8.8C2.46204 8.8 2.957 9.03179 3.32194 9.44436C3.68687 9.85695 3.89189 10.4165 3.89189 11C3.89189 11.5835 3.68687 12.1431 3.32194 12.5556C2.957 12.9682 2.46204 13.2 1.94595 13.2C1.42985 13.2 0.93489 12.9682 0.569954 12.5556C0.205019 12.1431 0 11.5835 0 11C0 10.4165 0.205019 9.85695 0.569954 9.44436C0.93489 9.03179 1.42985 8.8 1.94595 8.8ZM5.83784 21.2667V18.3333H24V21.2667H5.83784ZM1.94595 17.6C2.46204 17.6 2.957 17.8318 3.32194 18.2444C3.68687 18.6569 3.89189 19.2165 3.89189 19.8C3.89189 20.3835 3.68687 20.9431 3.32194 21.3556C2.957 21.7682 2.46204 22 1.94595 22C1.42985 22 0.93489 21.7682 0.569954 21.3556C0.205019 20.9431 0 20.3835 0 19.8C0 19.2165 0.205019 18.6569 0.569954 18.2444C0.93489 17.8318 1.42985 17.6 1.94595 17.6Z"
                    fill="black"
                  />
                </svg>
              </span>

              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 19,
                  borderLeft: "1px solid #D9D9D9",
                  height: 33,
                  cursor: "pointer",
                }}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(e)=>{
                  handleClick2(e)
                  setTooltipOpenBullets(false)
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl2}
                open={open}
                onClose={handleClose2}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                onMouseMove={()=>setTooltipOpenBullets(false)}
              >
                <div className="d-flex">
                  <MenuItem
                    value="default"
                    className="mx-1 border-menu"
                    style={{ height: 38, width: 38 }}
                    onClick={() => handleListClick("none")}
                  >
                    <div
                      className="e-de-list-header-presetmenu"
                      style={{
                        position: "relative",
                        left: "-0.6rem",
                        color: "black",
                      }}
                    >
                      <div>
                        <span className="e-de-bullets">None</span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 border-menu"
                    style={{ height: 38, width: 38 }}
                    onClick={() => handleListClick("bullet-dot-large")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className="e-de-ctnr-bullet-dot e-icons e-de-ctnr-list"></span>
                      </div>
                    </div>{" "}
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 border-menu"
                    style={{ height: 38, width: 38 }}
                    onClick={() => handleListClick("bullet-circle")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className="e-de-ctnr-bullet-circle e-icons e-de-ctnr-list"></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 border-menu"
                    style={{ height: 38, width: 38 }}
                    onClick={() => handleListClick("bullet-square")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className="e-de-ctnr-bullet-square e-icons e-de-ctnr-list"></span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
                <div className="d-flex py-2">
                  <MenuItem
                    value="default"
                    className="mx-1 border-menu"
                    style={{ height: 38, width: 38 }}
                    onClick={() => handleListClick("bullet-flower")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className="e-de-ctnr-bullet-flower e-icons e-de-ctnr-list"></span>
                      </div>
                    </div>
                  </MenuItem>

                  <MenuItem
                    value="default"
                    className="mx-1 border-menu"
                    style={{ height: 38, width: 38 }}
                    onClick={() => handleListClick("bullet-arrow")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className="e-de-ctnr-bullet-arrow e-icons e-de-ctnr-list"></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 border-menu"
                    style={{ height: 38, width: 38 }}
                    onClick={() => handleListClick("bullet-tick")}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span className="e-de-ctnr-bullet-tick e-icons e-de-ctnr-list"></span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
              </Menu>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Line Spacing" placement="bottom">
            <span
              className="d-flex ql-color"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.8 0L9.6 4.88889H6V17.1111H9.6L4.8 22L0 17.1111H3.6V4.88889H0L4.8 0ZM24 2.44444V4.88889H12V2.44444H24ZM24 9.77778V12.2222H12V9.77778H24ZM24 17.1111V19.5556H12V17.1111H24Z"
                    fill="black"
                  />
                </svg>
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 19,
                  height: 33,
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip title="Alignment" placement="bottom">
            <span
              className="d-flex ql-color"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0H24V2.44444H0V0ZM0 4.88889H16V7.33333H0V4.88889ZM0 9.77778H24V12.2222H0V9.77778ZM0 14.6667H16V17.1111H0V14.6667ZM0 19.5556H24V22H0V19.5556Z"
                    fill="black"
                  />
                </svg>
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 19,
                  height: 33,
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Increase indent">
            <button className="ql-indent btn-undo mr-2" value="-1" />
          </Tooltip>
          <Tooltip title="Decrease indent">
            <button className="ql-indent btn-undo" value="+1" />
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Page Break" placement="bottom">
            <span
              className="d-flex ql-color"
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
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.6667 14.1574H22L14.6667 10.2361V14.1574ZM2.66667 9.16669H16L24 13.4445V20.5741C24 20.9523 23.719 21.315 23.219 21.5824C22.7189 21.8498 22.0406 22 21.3333 22H2.66667C1.18667 22 0 21.3584 0 20.5741V10.5926C0 9.80122 1.18667 9.16669 2.66667 9.16669ZM2.66667 10.5926V20.5741H21.3333V15.5834H12V10.5926H2.66667Z"
                    fill="black"
                  />
                  <path
                    d="M0 0H2.4V4.58333H21.6V0H24V4.58333C24 5.06956 23.7471 5.53588 23.2971 5.87969C22.847 6.22351 22.2365 6.41667 21.6 6.41667H2.4C1.76348 6.41667 1.15303 6.22351 0.702944 5.87969C0.252856 5.53588 0 5.06956 0 4.58333V0Z"
                    fill="black"
                  />
                </svg>
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Margins" placement="bottom" open={tooltipOpenMargins}>
            <span
              className="d-flex ql-color"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseOver={()=>setTooltipOpenMargins(!openMargins)}
              onMouseLeave={()=>setTooltipOpenMargins(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 26 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.36364 1V23M20.6364 1V23M1 5H25M1 19H25M2 23H24C24.5523 23 25 22.5523 25 22V2C25 1.44772 24.5523 1 24 1H2C1.44772 1 1 1.44772 1 2V22C1 22.5523 1.44772 23 2 23Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                id="margins-button" // Changed ID to avoid conflict
                aria-controls={openMargins ? "margins-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMargins ? "true" : undefined}
                onClick={(e)=>{
                  handleOpenMargins(e)
                  setTooltipOpenMargins(false)
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
              <Menu
                id="margins-menu"
                anchorEl={anchorElMargins}
                open={openMargins}
                onClose={handleCloseMargins}
                MenuListProps={{
                  "aria-labelledby": "margins-button", // Updated aria-labelledby
                }}
                onMouseMove={()=>{
                  setTooltipOpenMargins(false)
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
                          fontSize:14,
                          position:"relative",
                          top:2
                        }}
                      >
                        Standard
                      </div>
                      <div style={{ fontSize: 12, color: "#00000080",position:"relative",bottom:2 }}>
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
                          fontSize:14,
                          position:"relative",
                          top:2
                        }}
                      >
                        Narrow
                      </div>
                      <div style={{ fontSize: 12, color: "#00000080" ,position:"relative",bottom:2}}>
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
                          fontSize:14,
                          position:"relative",
                          top:2
                        }}
                      >
                        Moderate
                      </div>
                      <div style={{ fontSize: 12, color: "#00000080",   position:"relative",
                          bottom:2 }}>
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
                          fontSize:14,
                          position:"relative",
                          top:2
                        }}
                      >
                        Wide
                      </div>
                      <div style={{ fontSize: 12, color: "#00000080",   position:"relative",
                          bottom:2 }}>
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
          <Tooltip title="Orientation" placement="bottom" open={tooltipOpenOrientation}> 
            <span
              className="d-flex ql-color"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseOver={()=>setTooltipOpenOrientation(!openOrientation)}
              onMouseLeave={()=>setTooltipOpenOrientation(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 13.3611V19.4722C24 19.8774 23.8055 20.266 23.4593 20.5525C23.1131 20.839 22.6435 21 22.1538 21H7.38462C6.89499 21 6.42541 20.839 6.07919 20.5525C5.73297 20.266 5.53846 19.8774 5.53846 19.4722V10.3056C5.53846 9.90036 5.73297 9.51177 6.07919 9.22525C6.42541 8.93874 6.89499 8.77778 7.38462 8.77778H18.4615L24 13.3611ZM7.38462 10.3056V19.4722H22.1538V14.125H17.5385V10.3056H7.38462Z"
                    fill="black"
                  />
                  <path
                    d="M9.23077 0.62963L1.84615 0.62963C1.35652 0.62963 0.886947 0.801322 0.540726 1.10694C0.194505 1.41255 0 1.82705 0 2.25926V15.2963C0 15.7285 0.194505 16.143 0.540726 16.4486C0.886947 16.7542 1.35652 16.9259 1.84615 16.9259H12.9231C13.4127 16.9259 13.8823 16.7542 14.2285 16.4486C14.5747 16.143 14.7692 15.7285 14.7692 15.2963V5.51852L9.23077 0.62963ZM12.9231 15.2963H1.84615V2.25926H8.30769V6.33333H12.9231V15.2963Z"
                    fill="black"
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
                id="orientation-button"
                aria-controls={openOrientation ? "orientation-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openOrientation ? "true" : undefined}
                onClick={(e)=>{
                  handleOpenOrientation(e)
                  setTooltipOpenOrientation(false)
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
              <Menu
                id="orientation-menu" // Updated ID to avoid conflict
                anchorEl={anchorElOrientation}
                open={openOrientation}
                onClose={handleCloseOrientation}
                MenuListProps={{
                  "aria-labelledby": "orientation-button", // Updated aria-labelledby
                }}
                onMouseMove={()=>setTooltipOpenOrientation(false)}
              >
                <MenuItem onClick={() => handleSelectOrientation("potrait")}>
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
                <MenuItem onClick={() => handleSelectOrientation("landscape")}>
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
              className="d-flex ql-color"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={()=>setTooltipOpenSize(!openSize)}
              onMouseLeave={()=>setTooltipOpenSize(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 2.04761H5.33332C4.62608 2.04761 3.9478 2.26836 3.4477 2.66129C2.94761 3.05422 2.66666 3.58715 2.66666 4.14285V20.9048C2.66666 21.4604 2.94761 21.9934 3.4477 22.3863C3.9478 22.7792 4.62608 23 5.33332 23H21.3333C22.0406 23 22.7188 22.7792 23.2189 22.3863C23.719 21.9934 24 21.4604 24 20.9048V8.33332L16 2.04761ZM21.3333 20.9048H5.33332V4.14285H14.6667V9.38094H21.3333V20.9048Z"
                    fill="black"
                  />
                  <line x1="2.66666" y1="0.5" x2="24" y2="0.5" stroke="black" />
                  <line
                    x1="0.5"
                    y1="4.14288"
                    x2="0.5"
                    y2="20.9048"
                    stroke="black"
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
                onClick={(e)=>{
                  handleOpenSize(e)
                  setTooltipOpenSize(false)
                }}
                id="openSize-button"
                aria-controls={openSize ? "openSize-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openSize ? "true" : undefined}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
              <Menu
                id="openSize-menu"
                anchorEl={anchorElSize}
                open={openSize}
                onClose={handleCloseSize}
                MenuListProps={{
                  "aria-labelledby": "openSize-button",
                }}
                onMouseMove={()=>setTooltipOpenSize(false)}
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
                            fontWeight:550
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
              className="d-flex ql-color"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseEnter={()=>setTooltipOpenColumns(!openColumns)}
              onMouseLeave={()=>setTooltipOpenColumns(false)}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 26 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 6H10M16 6H21M5 10H10M16 10H21M5 14H10M16 14H21M5 18H10M16 18H21M2.09091 23H23.9091C24.5116 23 25 22.5116 25 21.9091V2.09091C25 1.48842 24.5116 1 23.9091 1H2.09091C1.48842 1 1 1.48842 1 2.09091V21.9091C1 22.5116 1.48842 23 2.09091 23Z"
                    stroke="black"
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
                onClick={(e)=>{
                  handleOpenColumns(e)
                  setTooltipOpenColumns(false)
                }}
                id="openColumns-button"
                aria-controls={openColumns ? "openColumns-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openColumns ? "true" : undefined}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
              <Menu
                id="openColumns-menu"
                anchorEl={anchorElColumns}
                open={openColumns}
                onClose={handleCloseColumns}
                MenuListProps={{
                  "aria-labelledby": "openColumns-button",
                }}
                onMouseMove={()=>setTooltipOpenColumns(false)}
              >
                <MenuItem
                  style={{
                    width: 136,
                    background:
                      selectedColumn === "one" ? "#edf4fb" : "",
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
                    background:
                      selectedColumn === "two" ? "#edf4fb" : "",
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
                    background:
                      selectedColumn === "three" ? "#edf4fb" : "",
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
                    background:
                      selectedColumn === "left" ? "#edf4fb" : "",
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
              className="d-flex ql-color"
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
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.156 10.4211L19.668 8.9621C20.196 8.45263 20.868 8.17474 21.6 8.10526V6.94737L14.4 0H2.4C1.068 0 0 1.03053 0 2.31579V18.5263C0 19.8 1.068 20.8421 2.4 20.8421H9.6V18.6768L9.756 18.5263H2.4V2.31579H10.8V10.4211H18.156ZM13.2 1.73684L19.8 8.10526H13.2V1.73684ZM19.356 12.54L21.804 14.9021L14.448 22H12V19.6379L19.356 12.54ZM23.82 12.9568L22.644 14.0916L20.196 11.7295L21.372 10.5947C21.6 10.3632 21.996 10.3632 22.236 10.5947L23.82 12.1232C24.06 12.3547 24.06 12.7368 23.82 12.9568Z"
                    fill="black"
                  />
                </svg>
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Table" placement="bottom">
            <span
              className="d-flex ql-color"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.66667 0H21.3333C22.0406 0 22.7189 0.289731 23.219 0.805456C23.719 1.32118 24 2.02065 24 2.75V19.25C24 19.9793 23.719 20.6788 23.219 21.1945C22.7189 21.7103 22.0406 22 21.3333 22H2.66667C1.95942 22 1.28115 21.7103 0.781048 21.1945C0.280951 20.6788 0 19.9793 0 19.25V2.75C0 2.02065 0.280951 1.32118 0.781048 0.805456C1.28115 0.289731 1.95942 0 2.66667 0ZM2.66667 5.5V11H10.6667V5.5H2.66667ZM13.3333 5.5V11H21.3333V5.5H13.3333ZM2.66667 13.75V19.25H10.6667V13.75H2.66667ZM13.3333 13.75V19.25H21.3333V13.75H13.3333Z"
                    fill="black"
                  />
                </svg>
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 19,
                  height: 33,
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Add a Link" placement="bottom">
            <span
              className="d-flex ql-color"
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
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.1693 12.6781C10.7017 13.1423 10.7017 13.904 10.1693 14.3681C9.66297 14.8323 8.83203 14.8323 8.32567 14.3681C5.79389 12.0473 5.79389 8.27455 8.32567 5.95375L12.9218 1.7406C15.4536 -0.5802 19.5694 -0.5802 22.1012 1.7406C24.6329 4.0614 24.6329 7.83419 22.1012 10.155L20.1666 11.9283C20.1796 10.9524 20.0108 9.97647 19.6473 9.04815L20.2575 8.47687C21.7896 7.08439 21.7896 4.8231 20.2575 3.43062C18.7384 2.02624 16.2716 2.02624 14.7525 3.43062L10.1693 7.63186C8.63727 9.02434 8.63727 11.2856 10.1693 12.6781ZM13.8307 7.63186C14.337 7.1677 15.168 7.1677 15.6743 7.63186C18.2061 9.95267 18.2061 13.7255 15.6743 16.0463L11.0782 20.2594C8.54639 22.5802 4.43062 22.5802 1.89884 20.2594C-0.632946 17.9386 -0.632946 14.1658 1.89884 11.845L3.83338 10.0717C3.8204 11.0476 3.98918 12.0235 4.35272 12.9638L3.74249 13.5231C2.21044 14.9156 2.21044 17.1769 3.74249 18.5694C5.26156 19.9738 7.72843 19.9738 9.2475 18.5694L13.8307 14.3681C15.3627 12.9757 15.3627 10.7144 13.8307 9.32188C13.2983 8.85772 13.2983 8.09602 13.8307 7.63186Z"
                    fill="black"
                  />
                </svg>
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Insert Picture" placement="bottom">
            <span
              className="d-flex ql-color"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.3333 19.5556H2.66667V2.44444H21.3333V19.5556ZM21.3333 0H2.66667C1.95942 0 1.28115 0.257539 0.781048 0.715961C0.280951 1.17438 0 1.79614 0 2.44444V19.5556C0 20.2039 0.280951 20.8256 0.781048 21.284C1.28115 21.7425 1.95942 22 2.66667 22H21.3333C22.0406 22 22.7189 21.7425 23.219 21.284C23.719 20.8256 24 20.2039 24 19.5556V2.44444C24 1.79614 23.719 1.17438 23.219 0.715961C22.7189 0.257539 22.0406 0 21.3333 0ZM14.6133 11.3544L10.9467 15.6811L8.33333 12.7967L4.66667 17.1111H19.3333L14.6133 11.3544Z"
                    fill="black"
                  />
                </svg>
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 19,
                  height: 33,
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats b-r">
          <Tooltip title="Media" placement="bottom">
            <span
              className="d-flex ql-color"
              style={{
                height: 33,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 33 }}
              >
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 20 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 7.33333H15V4.88889H17.5V7.33333ZM17.5 12.2222H15V9.77778H17.5V12.2222ZM17.5 17.1111H15V14.6667H17.5V17.1111ZM5 7.33333H2.5V4.88889H5V7.33333ZM5 12.2222H2.5V9.77778H5V12.2222ZM5 17.1111H2.5V14.6667H5V17.1111ZM17.5 0V2.44444H15V0H5V2.44444H2.5V0H0V22H2.5V19.5556H5V22H15V19.5556H17.5V22H20V0H17.5Z"
                    fill="black"
                  />
                </svg>
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 19,
                  height: 33,
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
            </span>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Formula">
            <button className="ql-formula btn-undo mr-2" />
          </Tooltip>
          <Tooltip title="Source code">
            <button className="ql-code-block btn-undo mr-2" />
          </Tooltip>
          <Tooltip title="Clean">
            <button className="ql-clean btn-undo" />
          </Tooltip>
        </span>
      </div>
      <button className="btn-slider" onClick={scrollRight}>
        {">"}
      </button>
    </div>
  );
}
