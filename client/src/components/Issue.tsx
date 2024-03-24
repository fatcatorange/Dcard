import React, { ReactElement } from "react";
import '../css/Issue.css'

type IssueProps = {
  id: number; //the index for this issue (now issue id)
  title: string;
  body: string;
  userData: undefined | string; // user name
  commentsAmount: number;
  reactionAmount: number;
  mostReaction: string;
  setBrowse: ()=>void; // change to browse this issue
};

/*
the svg tag is copy by Dcard, i don't know about why it works currently...
*/

const Issue: React.FC<IssueProps> = (props) =>{
  return (
    <div className="issue-container" onClick = {props.setBrowse}>
        <h2>{props.id + ". " + props.title}</h2> 
        <span style={{ position: "relative", top: "-5px"}}>{props.mostReaction}</span>
        <span style={{ position: "relative", left: "5px", top: "-5px", marginRight: "20px"}}>{props.reactionAmount}</span>
        <svg viewBox="0 0 24 24" focusable="false" role="img" aria-hidden="true" style = {{width:"20px", height: "20px", fill: "#3397cf"}}><path fillRule="evenodd"
         d="M1.333 12a10.667 10.667 0 1 0 21.334 0 10.667 10.667 0 1 0-21.334 0zM15.5 6.5h-7A3.5 3.5 0 0 0 5 10v3.5A3.5 3.5 0 0 0 8.5 17H9v1.369a.75.75
          0 0 0 1.238.57L12.5 17h3a3.5 3.5 0 0 0 3.5-3.5V10a3.5 3.5 0 0 0-3.5-3.5Z"></path>
        </svg>
        <span style={{left: "5px", position: "relative", top: "-5px"}}>{props.commentsAmount}</span>
    </div>
  )
}

export default Issue;