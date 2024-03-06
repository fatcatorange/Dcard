import React from "react";
import Issue from "./Issue";
import Comment from "./Comment";
import Markdown from "react-markdown";
import { REPO,OWNER} from './Information';

const { Octokit } = require("@octokit/rest");


type CreateProps = {
}

const Create:React.FC<CreateProps> = (props) => {

    const [title,setTitle] = React.useState("");
    const [body,setBody] = React.useState("");
    const [warning,setWarning] = React.useState("");

    function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>){
        setTitle(event.target.value);
      }
    
      function handleChangeBody(event: React.ChangeEvent<HTMLTextAreaElement>){
        setBody(event.target.value);
      }
      async function createIssue(){
        if(body.length < 30 || title.trim() === ""){
          setWarning("Your body field is not long enough or the title is empty!");
          return;
        }
        const octokit = new Octokit({
          auth: localStorage.getItem("accessToken")
        })
        
        await octokit.request('POST /repos/{owner}/{repo}/issues', {
          owner: OWNER,
          repo: REPO,
          title: title,
          body: body,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })
        window.location.assign("http://localhost:3000/");
      }

    return (
      <div>
          <div>
            <h3>title:</h3>
            <textarea 
                id = {"create issue change title"}
                value = {title}
                onChange = {handleChangeTitle}
                className="input-field"
                style={{width:'50%'}}
            />

            <h3>body:</h3>
            <textarea  
                id = {"create issue change body"}
                value = {body}
                onChange = {handleChangeBody}
                className="input-field"
                style={{width:'80%', height:'300px'}}
            />
          </div>
            {warning !== "" && <h5 className="warning">{warning}</h5>}
            <button onClick = {()=>{
            if(body.length < 30 || title.trim() === ""){
                setWarning("Your body field is not long enough or the title is empty!");
                return;
            }
            createIssue()
            }} className="issue-button">submit</button>
          
        </div>
    )
}

export default Create;