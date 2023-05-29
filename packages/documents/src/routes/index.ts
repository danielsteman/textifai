import express, { Request, Response } from "express";
import { pdf } from "pdf-parse";
import { Readable } from "stream";

const router = express.Router();

async function extractTextFromPDFStream(pdfStream: Readable): Promise<string> {
  const options = {}; // You can customize the parsing options here
  const pdf = await PDFParser.pdfBufferToBuffer(pdfStream);
  const data: PDFData = await PDFParser(pdf, options);
  const text = data.text;
  return text;
}

router.post("/upload", (req: Request, res: Response) => {
  const newpath = __dirname + "/files/";
  // console.log(req.files?.file);
  const file = req.files?.file;

  let filename: string | undefined;

  if (Array.isArray(file)) {
    console.log(
      "Array of files found and is not supported by the documents service"
    );
  } else {
    filename = file?.name;

    console.log(filename);

    console.log(file);

    // file?.mv(`${newpath}${filename}`, (err) => {
    //   if (err) {
    //     console.log(err);
    //     // res.status(500).send({ message: "File upload failed", code: 500 });
    //   }
    //   res.status(200).send({ message: "File Uploaded", code: 200 });
    // });
  }
});

export default router;
