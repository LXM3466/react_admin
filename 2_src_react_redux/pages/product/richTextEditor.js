import React, {Component} from 'react' 
import PropTypes from 'prop-types' 
import {Editor} from 'react-draft-wysiwyg' 
import {EditorState, convertToRaw, ContentState} from 'draft-js' 
import draftToHtml from 'draftjs-to-html' 
import htmlToDraft from 'html-to-draftjs' 
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {
  //告诉外部哦通过form获取数据
  static propTtpes ={
      detail:PropTypes.string
  }
  constructor(props){
      super(props)
      const detail = this.props.detail
      if(detail)
      { 
        const contentBlock = htmlToDraft(detail);
        if (contentBlock) 
        {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          this.state = {
            editorState,
          };
        }
      }
      else{
        this.state = { editorState: EditorState.createEmpty() };
      }
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  getHtmlText = ()=>{
      return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}         
          editorStyle={{height: 250, border: '1px solid #000', padding: '0 30px'}}
          onEditorStateChange={this.onEditorStateChange}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}