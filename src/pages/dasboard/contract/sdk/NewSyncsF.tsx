import React, { useEffect, useRef, useState } from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";

DocumentEditorContainerComponent.Inject(Toolbar);

function NewSyncsF() {
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const editorRef = useRef(null);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const toolbar =
            editorRef.current?.container.querySelector(".e-de-ctnr-toolbar");
          if (toolbar) {
            toolbar.style.display = toolbarVisible ? "flex" : "none";
            observer.disconnect(); // Stop observing once we have successfully applied styles
          }
        }
      });
    });

    if (editorRef.current) {
      observer.observe(editorRef.current.container, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, [toolbarVisible]);

  const toggleToolbarVisibility = () => {
    setToolbarVisible(!toolbarVisible);
  };

  return (
    <div>
      <button onClick={toggleToolbarVisibility}>Toggle Toolbar</button>
      <DocumentEditorContainerComponent
        ref={editorRef}
        id="default-container"
        height="620px"
        enableToolbar={true}
        showPropertiesPane={false}
      />
    </div>
  );
}

export default NewSyncsF;
