import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./textEditor.css";

const TextEditor = () => {
  const [value, setValue] = useState("");
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      className="react-quill"
      modules={{
        toolbar: [
          [{ header: "1" }, { header: "2" }],
          ["bold", "italic", "underline"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["image"],
          ["clean"],
        ],
      }}
    />
  );
};

export default TextEditor;
