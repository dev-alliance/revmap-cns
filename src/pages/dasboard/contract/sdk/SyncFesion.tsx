import {
  DocumentEditorContainerComponent,
  Toolbar,
  Inject,
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

function SyncFesion() {
  let editorObj: DocumentEditorContainerComponent | null;
  const onSave = () => {
    editorObj?.documentEditor.save("sample", "Docx");
  };
  return (
    <div>
      <button onClick={onSave}>save</button>
      <DocumentEditorContainerComponent
        ref={(ins) => (editorObj = ins)}
        height="720"
        enableToolbar={true}
        serviceUrl={
          "https://services.syncfusion.com/js/production/api/documenteditor/"
        }
      >
        {" "}
        <Inject services={[Toolbar]}></Inject>
      </DocumentEditorContainerComponent>
    </div>
  );
}

export default SyncFesion;
