import ReactQuill from "react-quill";
import styled from "styled-components";

const StyledQuillEditor = styled(ReactQuill)<{
  editorBackgroundColor?: string;
  toolbarBackgroundColor?: string;
  textColor?: string;
  toolbarButtonIconColor?: string;
  toolbarButtonIconColorOnHover?: string;
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
    border: 0px;
    background-color: ${(props) => props.editorBackgroundColor};
  }

  .ql-toolbar {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border: 0px;
    background-color: ${(props) => props.toolbarBackgroundColor};
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
    color: ${(props) => props.toolbarButtonIconColor};
  }

  .ql-toolbar .ql-stroke {
    fill: none;
    stroke: #c4c7c6;
  }

  .ql-toolbar .ql-fill {
    fill: #c4c7c6;
    stroke: none;
  }

  .ql-toolbar .ql-picker {
    color: #c4c7c6;
  }

  button:hover .ql-stroke,
  .ql-picker-label:hover .ql-stroke {
    fill: none;
    stroke: #3cdccf !important;
  }

  .ql-active .ql-stroke {
    fill: none;
    stroke: #3cdccf !important;
  }

  button:hover .ql-fill,
  .ql-picker-label:hover .ql-fill {
    fill: #3cdccf !important;
    stroke: none;
  }

  .ql-active .ql-fill {
    fill: #3cdccf !important;
    stroke: none;
  }
`;

export default StyledQuillEditor;
