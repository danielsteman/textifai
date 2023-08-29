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
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default TextEditor;
