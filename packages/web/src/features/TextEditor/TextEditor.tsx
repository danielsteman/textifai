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
      style={{
        height: "100%",
        display: "absolute",
        right: 0,
        top: 0,
      }}
    />
  );
};

export default TextEditor;
