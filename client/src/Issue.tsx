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
};


const Issue: React.FC<IssueProps> = (props) =>{
  
  const [browse, setBrowse] = React.useState(false);
  const [updating,setUpdating] = React.useState(false);
  const [title,setTitle] = React.useState(props.title);
  const [body,setBody] = React.useState(props.body);
  const [warning,setWarning] = React.useState("");
  const [comments,setComments] = React.useState<JSX.Element[] | undefined>(undefined);
  const [displayComments,setDisplayComments] = React.useState(false);

  async function getIssueCommit(){
    const octokit = new Octokit({
      auth: localStorage.getItem('accessToken')
    })
    
    try{
      const res = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
        owner: OWNER,
        repo: REPO,
        issue_number: props.id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      let temp:JSX.Element[] = [];
      for(let i=0;i<res.data.length;i++){
        temp.push(<Comment key = {props.id + "comment" + i} id = {res.data[i].id}  body = {res.data[i].body}/>);
      }
      setComments(temp);
      console.log(temp);
    }
    catch(error){
      console.log(error);
    }
    
  }

  function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>){
    setTitle(event.target.value);
  }

  function handleChangeBody(event: React.ChangeEvent<HTMLTextAreaElement>){
    setBody(event.target.value);
  }

  async function handleCommentsDisplay(){
    if(comments === undefined){
      await getIssueCommit();
      console.log(comments)
    }
    setDisplayComments(prev=>!prev);
  }

  async function handleClosedPost(){
    try{
      const octokit = new Octokit({
        auth: localStorage.getItem('accessToken')
      })
      
      let tmp = await octokit.request('Patch /repos/{owner}/{repo}/issues/{issue_number}', {
        owner: OWNER,
        repo: REPO,
        issue_number: props.id,
        state:"closed",
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      console.log(tmp);
      window.location.assign("http://localhost:3000/");

    }
    catch(error){
      console.log(error);
    }
  }

  return (
    <div className="issue-container">
      <div>{props.id}</div>
      <button onClick={()=>{setBrowse(prev=>(!prev)); setUpdating(false) }} className = "issue-button">{browse === true ? "hide": "show"}</button>
      {props.userData != undefined && props.userData === "fatcatorange" && 
      <button onClick = {()=>setUpdating(prev=>(!prev))} className = "issue-button">{updating === true ? "cancel" : "update"}</button>}
      {props.userData != undefined && props.userData === "fatcatorange" && 
      <button onClick = {handleClosedPost} className = "issue-button">{updating === true ? "cancel" : "delete"}</button>}
      {updating === true ? 
      <div>
        <div>
          <h3>title:</h3>
          <textarea 
            id = {"issue change title" + props.id}
            value = {title}
            onChange = {handleChangeTitle}
            cols= {40}
            rows= {2}
            className="input-field"
          />

          <h3>body:</h3>
          <textarea  
            id = {"issue change body" + props.id}
            value = {body}
            onChange = {handleChangeBody}
            cols={80}
            rows={10}
            className="input-field"
          />
        </div>
        
        {warning !== "" && <h5 className="warning">{warning}</h5>}
        <button onClick = {()=>{
          if(body.length < 30 || title.trim() === ""){
            setWarning("Your body field is not long enough or the title is empty!");
            return;
          }
          props.updateIssue(props.id,title,body)
        }} className="issue-button">submit</button>

      </div>
      :
      <div>
        <h2>{props.title}</h2>
        {browse === true && <Markdown>{props.body}</Markdown>}
        {browse === true && <div className="rightLine"></div> &&
         <div className="comment-display-button" onClick = {handleCommentsDisplay}>comment</div> }
        {browse === true && displayComments === true && comments}
        {browse === true && displayComments === true && comments != undefined && comments.length === 0 &&
        <h6>There are no comments</h6>}
      </div>
      }
      
      
    </div>
  )
}

export default Issue;