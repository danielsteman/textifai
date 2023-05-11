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
      const res = await axios.post("http://localhost:3000/upload", formData);
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <form action="/stats" encType="multipart/form-data" method="post">
      <div className="form-group">
        <input type="file" className="form-control-file" name="uploaded_file" />
        <input
          type="submit"
          value="Get me the stats!"
          className="btn btn-default"
        />
      </div>
    </form>
  );
};

export default UploadForm;
