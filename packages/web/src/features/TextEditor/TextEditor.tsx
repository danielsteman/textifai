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
      }}
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
