import * as React from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";

DocumentEditorContainerComponent.Inject(Toolbar);
function Default() {
  return (
    <DocumentEditorContainerComponent
      id="container"
      height={"750px"}
      serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
      enableToolbar={true}
    />
  );
}
export default Default;
