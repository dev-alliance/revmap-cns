/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CustomTextEditor: React.FC = () => {
  const [editorData, setEditorData] = useState<string>("");

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
  };

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={handleEditorChange}
      />
      {/* Other components */}
    </div>
  );
};

export default CustomTextEditor;
