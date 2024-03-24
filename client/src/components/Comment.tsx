import React from "react";
import Markdown from "react-markdown";
import '../css/Comment.css';

type CommentProps = {
  id:number,
  body:string
}

const Comment:React.FC<CommentProps> = (props) =>{
  return (
    <div className="comments-container">
      <Markdown>{props.body}</Markdown>
    </div>
  )
}

export default Comment;