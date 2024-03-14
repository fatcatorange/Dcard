import React, { ReactElement } from "react";
import './Issue.css'

type IssueProps = {
  id: number;
  title: string;
  body: string;
  userData: undefined | string;
  setBrowse: ()=>void;
};


const Issue: React.FC<IssueProps> = (props) =>{
  return (
    <div className="issue-container" onClick = {props.setBrowse}>
        <h2>{props.id + ". " + props.title}</h2> 
    </div>
  )
}

export default Issue;