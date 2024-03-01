/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { SignatureComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
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

const OpenDrawSignature = () => {
  const [disable, setDisable] = useState(true);
  const signatureObj = useRef<any>(null);

  const saveBtnClick = () => {
    if (disable) return;
    signatureObj.current.save();
    setDisable(true);
  };

  const clrBtnClick = () => {
    signatureObj.current.clear();
    if (signatureObj.current.isEmpty()) {
      setDisable(true);
    }
  };

  const change = () => {
    if (!signatureObj.current.isEmpty()) {
      setDisable(false);
    }
  };

  return (
    <div className="control-pane">
      <div className="col-lg-12 control-section">
        <div id="signature-control">
          <div className="e-sign-heading">
            <span id="signdescription">Sign below</span>
            <span className="e-btn-options">
              <ButtonComponent
                id="signsave"
                cssClass="e-primary e-sign-save"
                onClick={saveBtnClick}
                disabled={disable}
              >
                SAVE
              </ButtonComponent>
              <ButtonComponent
                id="signclear"
                cssClass="e-primary e-sign-clear"
                onClick={clrBtnClick}
                disabled={disable}
              >
                CLEAR
              </ButtonComponent>
            </span>
          </div>
          <SignatureComponent
            id="signature"
            ref={signatureObj}
            change={change}
          ></SignatureComponent>
        </div>
      </div>
    </div>
  );
};
export default OpenDrawSignature;
