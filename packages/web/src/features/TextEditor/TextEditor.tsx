import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = () => {
  const [value, setValue] = useState("");
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      style={{ height: "100%", width: "100%", flex: 1, overflowY: "auto" }}
    />
  );
};

export default TextEditor;
