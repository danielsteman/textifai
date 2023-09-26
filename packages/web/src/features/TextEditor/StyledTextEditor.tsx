import ReactQuill from "react-quill";
import styled from "styled-components";

const StyledQuillEditor = styled(ReactQuill)<{
  backgroundColor?: string;
  textColor?: string;
}>`
  .react-quill {
    height: calc(100% - 42px);
  }

  .ql-container {
    height: calc(100% - 42px);
    padding: 12px 24px;
    font-size: 15px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .ql-toolbar {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .ql-toolbar.ql-snow {
    border-color: grey;
  }

  .ql-container.ql-snow {
    color: white;
    border-color: grey;
  }

  .ql-editor {
    max-height: 100%;
    overflow: auto;
    color: ${(props) => props.textColor};
  }
`;

export default StyledQuillEditor;
