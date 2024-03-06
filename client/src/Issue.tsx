import React, { ReactElement } from "react";
import './Issue.css'
import Markdown from "react-markdown";
import Comment from "./Comment";
import { REPO,OWNER} from './Information';

const { Octokit } = require("@octokit/rest");

type IssueProps = {
  id: number;
  title: string;
  body: string;
  userData: undefined | string;
  updateIssue: (id:number,title:string,body:string)=>void;
  setBrowse: ()=>void;
};


const Issue: React.FC<IssueProps> = (props) =>{
  
  const [updating,setUpdating] = React.useState(false);
  const [title,setTitle] = React.useState(props.title);
  const [body,setBody] = React.useState(props.body);










  return (
    <div className="issue-container" onClick = {props.setBrowse}>
      {
      <div>
        <h2>{props.title}</h2>
        <Markdown>{props.body + "..."}</Markdown>
        
      </div>
      }
      
      
    </div>
  )
}

export default Issue;