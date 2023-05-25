import axios from "axios";
import { useState } from "react";

const UploadForm = () => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const saveFile = (e: any) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const uploadFile = async (e: any) => {
    const formData = new FormData();
    if (file && fileName) {
      formData.append("file", file);
      formData.append("fileName", fileName);
    } else {
      throw new Error("No file was found");
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/api/documents/upload",
        formData
      );
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div className="App">
      <input type="file" onChange={saveFile} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
};

export default UploadForm;
