import { ContractContext } from "@/context/ContractContext";
import useStore from "@/context/ZustandStore";
import { MenuItem, Select, Tooltip } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { Quill } from "react-quill";

const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

// Undo and redo functions for Custom Toolbar
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
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
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
  "alphabet-list-item", // Include custom format
];

const ListItem = Quill.import("formats/list/item");

class AlphabetListItem extends ListItem {
  static create(value: any) {
    let node = super.create();
    if (
      value === "upper-alpha" ||
      value === "lower-alpha" ||
      value === undefined ||
      value === "upper-roman" ||
      value === "lower-roman" ||
      value === "lower-greek" ||
      value === "default" ||
      value === "bullet"
    ) {
      const valueFromStorage = localStorage.getItem("list")
      node.setAttribute("data-list", valueFromStorage);
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
    if (
      name === "list" &&
      (value === "upper-alpha" || value === "lower-alpha" || value === "lower-greek"
        || value === "upper-roman" || value === "default" || value === "lower-roman"
        || value === "bullet"
      )
    ) {
      this.domNode.setAttribute("data-list", localStorage.getItem("list"));
    } else {
      super.format(name, value);
    }
  }
}

// Register custom format
Quill.register({
  "formats/alphabet-list-item": AlphabetListItem,
});
// Quill Toolbar component
export default function QuillToolbar() {
  const { editorRefContext } = useContext(ContractContext);
  const [show, setShow] = useState<boolean>(false);

  const [width, setWidth] = useState(window.innerWidth);
  const [componentWidth, setComponentWidth] = useState(0); // State to hold component width
  const toolbarRef: any = useRef(null);

  useEffect(() => {
    const updateComponentWidth = () => {
      if (toolbarRef.current) {
        const width = toolbarRef.current.offsetWidth;
        setComponentWidth(width);
      }
    };

    // Initial width update
    updateComponentWidth();

    // Event listener for window resize
    const handleResize = () => {
      updateComponentWidth();
    };

    window.addEventListener("resize", handleResize);

    // Use MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(updateComponentWidth);

    // Start observing the document or a higher-level container for changes
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    // Cleanup function to remove event listener and disconnect observer
    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  const DefaultList = () => {
    return (
      <svg width="30" height="50" focusable="false">
        <g fill-rule="evenodd">
          <path
            opacity=".2"
            d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"
          ></path>
          <path d="M10 17v-4.8l-1.5 1v-1.1l1.6-1h1.2V17h-1.2Zm3.6.1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .7.3.7.7 0 .4-.2.7-.7.7Zm-5 5.7c0-1.2.8-2 2.1-2s2.1.8 2.1 1.8c0 .7-.3 1.2-1.4 2.2l-1.1 1v.2h2.6v1H8.6v-.9l2-1.9c.8-.8 1-1.1 1-1.5 0-.5-.4-.8-1-.8-.5 0-.9.3-.9.9H8.5Zm6.3 4.3c-.5 0-.7-.3-.7-.7 0-.4.2-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7ZM10 34.4v-1h.7c.6 0 1-.3 1-.8 0-.4-.4-.7-1-.7s-1 .3-1 .8H8.6c0-1.1 1-1.8 2.2-1.8 1.3 0 2.1.6 2.1 1.6 0 .7-.4 1.2-1 1.3v.1c.8.1 1.3.7 1.3 1.4 0 1-1 1.9-2.4 1.9-1.3 0-2.2-.8-2.3-2h1.2c0 .6.5 1 1.1 1 .7 0 1-.4 1-1 0-.5-.3-.8-1-.8h-.7Zm4.7 2.7c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .8.3.8.7 0 .4-.3.7-.8.7Z"></path>
        </g>
      </svg>
    );
  };

  const LowerAlpha = () => {
    return (
      <svg width="30" height="48" focusable="false">
        <g fill-rule="evenodd">
          <path
            opacity=".2"
            d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"
          ></path>
          <path d="M10.3 15.2c.5 0 1-.4 1-.9V14h-1c-.5.1-.8.3-.8.6 0 .4.3.6.8.6Zm-.4.9c-1 0-1.5-.6-1.5-1.4 0-.8.6-1.3 1.7-1.4h1.1v-.4c0-.4-.2-.6-.7-.6-.5 0-.8.1-.9.4h-1c0-.8.8-1.4 2-1.4 1.1 0 1.8.6 1.8 1.6V16h-1.1v-.6h-.1c-.2.4-.7.7-1.3.7Zm4.6 0c-.5 0-.7-.3-.7-.7 0-.4.2-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Zm-3.2 10c-.6 0-1.2-.3-1.4-.8v.7H8.5v-6.3H10v2.5c.3-.5.8-.9 1.4-.9 1.2 0 1.9 1 1.9 2.4 0 1.5-.7 2.4-1.9 2.4Zm-.4-3.7c-.7 0-1 .5-1 1.3s.3 1.4 1 1.4c.6 0 1-.6 1-1.4 0-.8-.4-1.3-1-1.3Zm4 3.7c-.5 0-.7-.3-.7-.7 0-.4.2-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Zm-2.2 7h-1.2c0-.5-.4-.8-.9-.8-.6 0-1 .5-1 1.4 0 1 .4 1.4 1 1.4.5 0 .8-.2 1-.7h1c0 1-.8 1.7-2 1.7-1.4 0-2.2-.9-2.2-2.4s.8-2.4 2.2-2.4c1.2 0 2 .7 2 1.7Zm1.8 3c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Z"></path>
        </g>
      </svg>
    );
  };

  const LowerGreek = () => {
    return (
      <svg width="30" height="48" focusable="false">
        <g fill-rule="evenodd">
          <path
            opacity=".2"
            d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"
          ></path>
          <path d="M10.5 15c.7 0 1-.5 1-1.3s-.3-1.3-1-1.3c-.5 0-.9.5-.9 1.3s.4 1.4 1 1.4Zm-.3 1c-1.1 0-1.8-.8-1.8-2.3 0-1.5.7-2.4 1.8-2.4.7 0 1.1.4 1.3 1h.1v-.9h1.2v3.2c0 .4.1.5.4.5h.2v.9h-.6c-.6 0-1-.2-1.1-.7h-.1c-.2.4-.7.8-1.4.8Zm5 .1c-.5 0-.8-.3-.8-.7 0-.4.3-.7.7-.7.5 0 .8.3.8.7 0 .4-.3.7-.8.7Zm-4.9 7v-1h.3c.6 0 1-.2 1-.7 0-.5-.4-.8-1-.8-.5 0-.8.3-.8 1v2.2c0 .8.4 1.3 1.1 1.3.6 0 1-.4 1-1s-.5-1-1.3-1h-.3ZM8.6 22c0-1.5.7-2.3 2-2.3 1.2 0 2 .6 2 1.6 0 .6-.3 1-.8 1.3.8.3 1.3.8 1.3 1.7 0 1.2-.8 1.9-1.9 1.9-.6 0-1.1-.3-1.3-.8v2.2H8.5V22Zm6.2 4.2c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .7.3.7.7 0 .4-.2.7-.7.7Zm-4.5 8.5L8 30h1.4l1.7 3.5 1.7-3.5h1.1l-2.2 4.6v.1c.5.8.7 1.4.7 1.8 0 .4-.1.8-.4 1-.2.2-.6.3-1 .3-.9 0-1.3-.4-1.3-1.2 0-.5.2-1 .5-1.7l.1-.2Zm.7 1a2 2 0 0 0-.4.9c0 .3.1.4.4.4.3 0 .4-.1.4-.4 0-.2-.1-.6-.4-1Zm4.5.5c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Z"></path>
        </g>
      </svg>
    );
  };

  const LowerRoman = () => {
    return (
      <svg width="30" height="48" focusable="false">
        <g fill-rule="evenodd">
          <path
            opacity=".2"
            d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"
          ></path>
          <path d="M15.1 16v-1.2h1.3V16H15Zm0 10v-1.2h1.3V26H15Zm0 10v-1.2h1.3V36H15Z"></path>
          <path
            fill-rule="nonzero"
            d="M12 21h1.5v5H12zM12 31h1.5v5H12zM9 21h1.5v5H9zM9 31h1.5v5H9zM6 31h1.5v5H6zM12 11h1.5v5H12zM12 19h1.5v1H12zM12 29h1.5v1H12zM9 19h1.5v1H9zM9 29h1.5v1H9zM6 29h1.5v1H6zM12 9h1.5v1H12z"
          ></path>
        </g>
      </svg>
    );
  };

  const UpperAlpha = () => {
    return (
      <svg width="30" height="48" focusable="false">
        <g fill-rule="evenodd">
          <path
            opacity=".2"
            d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"
          ></path>
          <path d="m12.6 17-.5-1.4h-2L9.5 17H8.3l2-6H12l2 6h-1.3ZM11 12.3l-.7 2.3h1.6l-.8-2.3Zm4.7 4.8c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .7.3.7.7 0 .4-.2.7-.7.7ZM11.4 27H8.7v-6h2.6c1.2 0 1.9.6 1.9 1.5 0 .6-.5 1.2-1 1.3.7.1 1.3.7 1.3 1.5 0 1-.8 1.7-2 1.7ZM10 22v1.5h1c.6 0 1-.3 1-.8 0-.4-.4-.7-1-.7h-1Zm0 4H11c.7 0 1.1-.3 1.1-.8 0-.6-.4-.9-1.1-.9H10V26Zm5.4 1.1c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Zm-4.1 10c-1.8 0-2.8-1.1-2.8-3.1s1-3.1 2.8-3.1c1.4 0 2.5.9 2.6 2.2h-1.3c0-.7-.6-1.1-1.3-1.1-1 0-1.6.7-1.6 2s.6 2 1.6 2c.7 0 1.2-.4 1.4-1h1.2c-.1 1.3-1.2 2.2-2.6 2.2Zm4.5 0c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Z"></path>
        </g>
      </svg>
    );
  };

  const UpperRoman = () => {
    return (
      <svg width="30" height="48" focusable="false">
        <g fill-rule="evenodd">
          <path
            opacity=".2"
            d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"
          ></path>
          <path d="M15.1 17v-1.2h1.3V17H15Zm0 10v-1.2h1.3V27H15Zm0 10v-1.2h1.3V37H15Z"></path>
          <path
            fill-rule="nonzero"
            d="M12 20h1.5v7H12zM12 30h1.5v7H12zM9 20h1.5v7H9zM9 30h1.5v7H9zM6 30h1.5v7H6zM12 10h1.5v7H12z"
          ></path>
        </g>
      </svg>
    );
  };

  const ListSlectImage = () => {
    return (
      <div
        style={{
          position: "relative",
          bottom: "1rem",
        }}
      >
        <svg width="20" height="48" focusable="false">
          <path d="M2.1748 12.75H3.6748V13.125H2.9248V13.875H3.6748V14.25H2.1748V15H4.4248V12H2.1748V12.75ZM2.9248 6H3.6748V3H2.1748V3.75H2.9248V6ZM2.1748 8.25H3.5248L2.1748 9.825V10.5H4.4248V9.75H3.0748L4.4248 8.175V7.5H2.1748V8.25ZM5.9248 3.75V5.25H16.4248V3.75H5.9248ZM5.9248 14.25H16.4248V12.75H5.9248V14.25ZM5.9248 9.75H16.4248V8.25H5.9248V9.75Z"></path>
        </svg>
      </div>
    );
  };
  const [open, setOpen] = useState(false);


  const handleListClick = (value: string) => {
    localStorage.setItem("list", value)
    if (editorRefContext) {
      if (value === "default") {
        editorRefContext.getEditor()?.format("list", "ordered");
      } else {
        editorRefContext.getEditor()?.format("list", value);
      }
    }
    setOpen(false)

  }
  const selectRef: any = useRef(null);

  const handleMouseEnter = () => {
    if (selectRef.current) {
      selectRef.current.size = selectRef.current.options;
      selectRef.current.className = "ql-lineHeight"
      console.log(selectRef.current.className)
    }
  };

  const handleMouseLeave = () => {
    if (selectRef.current) {
      selectRef.current.size = 1;
    }
  };
  return (
    <div id="toolbar" ref={toolbarRef}>
      <span className="ql-formats b-r">
        <Tooltip title="Undo" placement="bottom">
          <button className="ql-undo">
            <CustomUndo />
          </button>
        </Tooltip>
        <Tooltip title="Redo" placement="bottom">
          <button className="ql-redo">
            <CustomRedo />
          </button>
        </Tooltip>
      </span>
      <span className="ql-formats b-r">
        <Tooltip title="Select Font" placement="top">
          <span className="ql-formats">
            <select className="ql-font b-r" defaultValue="arial">
              <option value="arial">Arial</option>
              <option value="comic-sans">Comic Sans</option>
              <option value="courier-new">Courier New</option>
              <option value="georgia">Georgia</option>
              <option value="helvetica">Helvetica</option>
              <option value="lucida">Lucida</option>
            </select>
          </span>
        </Tooltip>
        <Tooltip title="Select Headers" placement="top">
          <span className="ql-formats">
            <select
              className="ql-header"
              style={{ borderRight: "1px solid #cccccc" }}
              defaultValue="0"
            >
              <option value="0">Paragraph</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
            </select>
          </span>
        </Tooltip>
        <Tooltip title="Select Font Size" placement="top">
          <span className="ql-formats">
            <select className="ql-size" defaultValue="14px"
              ref={selectRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <option value="8px">8px</option>
              <option value="10px">10px</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="28px">28px</option>
              <option value="32px">32px</option>
              <option value="36px">36px</option>
              <option value="40px">40px</option>
              <option value="44px">44px</option>
              <option value="48px">48px</option>
              <option value="54px">54px</option>
              <option value="60px">60px</option>
              <option value="72px">72px</option>
            </select>
          </span>
        </Tooltip>
      </span>
      <span className="ql-formats b-r">
        <Tooltip title="Bold" placement="bottom">
          <button className="ql-bold" />
        </Tooltip>
        <Tooltip title="Italic" placement="bottom">
          <button className="ql-italic" />
        </Tooltip>
        <Tooltip title="Underline" placement="bottom">
          <button className="ql-underline" />
        </Tooltip>
        <Tooltip title="Strike through" placement="bottom">
          <button className="ql-strike" />
        </Tooltip>
      </span>
      <span
        className="ql-formats b-r"
        style={{
          display: width <= 855 ? "none" : "",
        }}
      >

        <Select
          className="ql-formats select-list"
          renderValue={() => <ListSlectImage />}
          ref={selectRef}
          onMouseEnter={() => {
            setOpen(true)
          }}
          onBlur={()=>setOpen(false)}
          value="default"
          style={{
            height: 20,
            border: "none",
            outline: "none",
          }}
          onMouseLeave={()=>setOpen(false)}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
        >
          <div className="d-flex">
            <MenuItem
              value="default"
              className="mx-1 border-menu"
              style={{ height: 32 }}
              onClick={() => handleListClick("default")}
            >
              <DefaultList />
            </MenuItem>
            <MenuItem
              value="lower-alpha"
              className="mx-1 border-menu"
              style={{ height: 32 }}
              onClick={() => handleListClick("lower-alpha")}
            >
              <LowerAlpha />
            </MenuItem>
            <MenuItem
              value="lower-greek"
              className="mx-1 border-menu"
              style={{ height: 32 }}
              onClick={() => handleListClick("lower-greek")}
            >
              <LowerGreek />
            </MenuItem>
          </div>
          <div className="d-flex py-2" >
            <MenuItem
              value="lower-roman"
              className="mx-1 border-menu"
              style={{ height: 32 }}
              onClick={() => handleListClick("lower-roman")}
            >
              <LowerRoman />
            </MenuItem>
            <MenuItem
              value="upper-alpha"
              className="mx-1 border-menu"
              style={{ height: 32 }}
              onClick={() => handleListClick("upper-alpha")}
            >
              <UpperAlpha />
            </MenuItem>
            <MenuItem
              value="upper-roman"
              className="mx-1 border-menu"
              onClick={() => handleListClick("upper-roman")}
              style={{ height: 32 }}
            >
              <UpperRoman />
            </MenuItem>
          </div>
        </Select>

        <button className="ql-list" value="bullet" onClick={() => localStorage.setItem("list", "bullet")}></button>
        <Tooltip title="Increase indent">
          <button className="ql-indent" value="-1" />
        </Tooltip>
        <Tooltip title="Decrease indent">
          <button className="ql-indent" value="+1" />
        </Tooltip>
      </span>
      <span
        className="ql-formats b-r"
        style={{
          display: componentWidth <= 992 ? "none" : "",
        }}
      >
        <Tooltip title="Superscript">
          <button className="ql-script" value="super" />
        </Tooltip>
        <Tooltip title="Subscript">
          <button className="ql-script" value="sub" />
        </Tooltip>
        <Tooltip title="Blockquote">
          <button className="ql-blockquote" />
        </Tooltip>
      </span>
      <span
        className="ql-formats b-r"
        style={{
          display: componentWidth <= 1106 ? "none" : "",
        }}
      >
        <Tooltip title="Alignment" placement="bottom">
          <span className="ql-formats" style={{ margin: 0 }}>
            <select className="ql-align" />
          </span>
        </Tooltip>
        <Tooltip title="Text Color" placement="bottom">
          <span className="ql-formats" style={{ margin: 0 }}>
            <select className="ql-color" />
          </span>
        </Tooltip>
        <Tooltip title="Bg color" placement="bottom">
          <span className="ql-formats" style={{ margin: 0 }}>
            <select className="ql-background" />
          </span>
        </Tooltip>
      </span>
      <span
        className="ql-formats b-r"
        style={{
          display: componentWidth <= 1106 ? "none" : "",
        }}
      >
        <Tooltip title="Insert Image">
          <button className="ql-image" />
        </Tooltip>
        <Tooltip title="Insert Video">
          <button className="ql-video" />
        </Tooltip>
      </span>

      <span className="ql-formats">
        <button onMouseEnter={() => setShow(true)} onClick={() => setShow(!show)}>⋮</button>
        <span
          className="dropdown-menu-toolbar"
          style={{ display: show ? "block" : "none" }}
          onMouseLeave={()=>setShow(false)}
        >
          <span className="ql-formats d-flex" style={{ display: "flex" }}>
            <span
              className="b-r"
              style={{
                display: "flex",
              }}
            >
              <Tooltip title="Formula">
                <button className="ql-formula" />
              </Tooltip>
              <Tooltip title="Source code">
                <button className="ql-code-block" />
              </Tooltip>
              <Tooltip title="Clean">
                <button className="ql-clean" />
              </Tooltip>
            </span>
            <span
              className="b-r"
              style={{ display: componentWidth <= 1106 ? "" : "none" }}
            >
              <span style={{ display: "flex" }}>
                <Tooltip title="Insert Image">
                  <button className="ql-image" />
                </Tooltip>
                <Tooltip title="Insert Video">
                  <button className="ql-video" />
                </Tooltip>
              </span>
            </span>
            <span style={{ display: componentWidth <= 1106 ? "" : "none" }}>
              <span className="b-r" style={{ display: "flex" }}>
                <Tooltip title="Alignment" placement="bottom-end">
                  <span className="ql-">
                    <select className="ql-align" />
                  </span>
                </Tooltip>
                <Tooltip title="Text Color">
                  <span className="ql-">
                    <select className="ql-color" />
                  </span>
                </Tooltip>
                <Tooltip title="Bg color">
                  <span className="ql-">
                    <select className="ql-background" />
                  </span>
                </Tooltip>
              </span>
            </span>
            <span style={{ display: componentWidth <= 992 ? "" : "none" }}>
              <span style={{ display: "flex" }}>
                <Tooltip title="Superscript">
                  <button className="ql-script" value="super" />
                </Tooltip>
                <Tooltip title="Subscript">
                  <button className="ql-script" value="sub" />
                </Tooltip>
                <Tooltip title="Blockquote">
                  <button className="ql-blockquote" />
                </Tooltip>
              </span>
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}
