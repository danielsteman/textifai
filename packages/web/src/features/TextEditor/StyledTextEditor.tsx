import ReactQuill from "react-quill";
import styled from "styled-components";

const StyledQuillEditor = styled(ReactQuill)<{
  editorBackgroundColor?: string;
  toolbarBackgroundColor?: string;
  toolbarButtonIconColor?: string;
  textColor?: string;
}>`
  .ql-container {
    height: calc(100% - 42px);
    padding: 60px 72px;
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
    color: ${(props) => props.textColor} !important;
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

  .thick-scrollbar::-webkit-scrollbar {
    width: 20px; /* Width of the scrollbar */
  }

  .thick-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1; /* Track color */
  }

  .thick-scrollbar::-webkit-scrollbar-thumb {
    background: #888; /* Handle color */
  }

  .thick-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555; /* Handle color on hover */
  }
`;

export default StyledQuillEditor;
