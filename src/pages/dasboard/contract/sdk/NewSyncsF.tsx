import React, { useEffect, useRef, useState } from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";

DocumentEditorContainerComponent.Inject(Toolbar);

function NewSyncsF() {
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const editorRef = useRef(null);

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
