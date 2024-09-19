import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class TextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  // Simulating an image upload callback
  uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ data: { link: e.target.result } });
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  };

  render() {
    const { editorState } = this.state;

    return (
      <div className="text-editor">
        <div className="editor">
          <Editor
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
            placeholder="Enter your text here..."
            toolbar={{
              options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'link', 'image', 'history'],
              inline: { options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'] },
              blockType: { options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote'] },
              fontSize: { options: [8, 10, 12, 14, 16, 18, 24, 30, 36] }, // Font size options
              fontFamily: { options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'] },
              image: {
                uploadCallback: this.uploadImageCallBack,
                alt: { present: true, mandatory: false },
                previewImage: true,
                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              },
            }}
          />
        </div>

        <h3 className="text">Drafts to HTML</h3>
        <textarea
          className="text-area"
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        ></textarea>
      </div>
    );
  }
}
