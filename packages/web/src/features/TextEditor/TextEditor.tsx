import { useState } from "react";
import ReactQuill from "react-quill";

const TextEditor = () => {
  const [value, setValue] = useState("");
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      style={{ height: "100%", width: "100%" }}
    />
  );
};

export default TextEditor;
