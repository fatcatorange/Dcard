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
  return (
    <div className="issue-container" onClick = {props.setBrowse}>
      {
      <div>
        <h2>{props.id + ". " + props.title}</h2>
      </div>
      }
      
      
    </div>
  )
}

export default Issue;