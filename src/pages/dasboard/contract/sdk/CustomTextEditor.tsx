import React, { useEffect, useRef } from "react";
import ClassicEditorBase from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Image from "@ckeditor/ckeditor5-image/src/image";
import List from "@ckeditor/ckeditor5-list/src/list";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import Comments from "@ckeditor/ckeditor5-comments/src/comments";

// Define a custom editor which extends ClassicEditorBase
class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build
ClassicEditor.builtinPlugins = [
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Image,
  Comments,
  List,
  Autoformat,
];

// Editor configuration
ClassicEditor.defaultConfig = {
  language: "en",
  comments: {
    editorConfig: {
      extraPlugins: [Bold, Italic, List, Autoformat],
    },
  },
};

function MyCKEditorComponent() {
  const editorContainerRef = useRef(null);

  useEffect(() => {
    let editorInstance;

    if (editorContainerRef.current) {
      ClassicEditor.create(editorContainerRef.current, {
        licenseKey:
          "TE5vOVg0YUlLSzYzREpYakZnN1VhNGJqSXpkSUtQMEpWS21SWWlCUmFnbGFtWkdVWGduM2NnUUErWGpNLU1qQXlOREF4TWpjPQ==",
        // ... other configuration options
      })
        .then((editor) => {
          editorInstance = editor;
        })
        .catch((error) => {
          console.error("Error initializing the CKEditor:", error);
        });
    }

    // Cleanup on component unmount
    return () => {
      if (editorInstance) {
        editorInstance.destroy().catch((error) => {
          console.error("Error destroying editor:", error);
        });
      }
    };
  }, []);

  return (
    <div ref={editorContainerRef}>
      <h1> fffffffffff</h1>
    </div>
  );
}

export default MyCKEditorComponent;
