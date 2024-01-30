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
import { TextField, Button, Grid, Typography, Paper, Box } from "@mui/material";
function SyncFesion() {
  let editorObj: DocumentEditorContainerComponent | null;
  const onSave = () => {
    if (editorObj && editorObj.documentEditor) {
      // Export the document as a Blob
      editorObj.documentEditor.saveAsBlob("Sfdt").then((blob) => {
        // Read the blob content as text
        const reader = new FileReader();
        reader.onload = function () {
          const text = reader.result;
          console.log(text);
        };
        reader.readAsText(blob);
      });

      // Continue with saving the document
      editorObj.documentEditor.save("sample", "Docx");
    }
  };

  return (
    <div>
      <Box sx={{ width: "100%", px: 2.6, py: 1 }}>
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

      <DocumentEditorContainerComponent
        ref={(ins) => (editorObj = ins)}
        height="600"
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
