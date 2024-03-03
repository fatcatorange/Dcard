import React from "react";
import './Issue.css'
import Markdown from "react-markdown";

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

  function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>){
    setTitle(event.target.value);
  }

  function handleChangeBody(event: React.ChangeEvent<HTMLTextAreaElement>){
    setBody(event.target.value);
  }

  return (
    <div className="issue-container">
      <div>{props.id}</div>
      <button onClick={()=>{setBrowse(prev=>(!prev)); setUpdating(false) }} className = "issue-button">{browse === true ? "hide": "show"}</button>
      {props.userData != undefined && props.userData === "fatcatorange" && 
      <button onClick = {()=>setUpdating(prev=>(!prev))} className = "issue-button">{updating === true ? "cancel" : "update"}</button>}
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
        <Markdown>{props.title}</Markdown>
        {browse === true && <Markdown>{props.body}</Markdown>}
      </div>
      }
      
      
    </div>
  )
}

export default Issue;