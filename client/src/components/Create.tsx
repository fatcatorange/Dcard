import React from "react";
import { REPO,OWNER, HomePage} from '../Information';
import Warning from "./Warning";
import Modal from "./Modal";

const { Octokit } = require("@octokit/rest");


const Create:React.FC = () => {

    const [title,setTitle] = React.useState("");
    const [body,setBody] = React.useState("");
    const [warning,setWarning] = React.useState(""); 
    const [error,setError] = React.useState("");

    function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>){
        setTitle(event.target.value);
      }
    
    function handleChangeBody(event: React.ChangeEvent<HTMLTextAreaElement>){
      setBody(event.target.value);
    }

    /*
      If the body has less than 30 characters or the title is empty,
      set a warning and do not create; otherwise, create the post an redirect to the content page
     */
    async function createIssue(){
      if(body.length < 30 || title.trim() === ""){
        setWarning("Your body field is not long enough or the title is empty!");
        return;
      }

      const octokit = new Octokit({
          auth: localStorage.getItem("accessToken")
      })
        try {
          await octokit.request('POST /repos/{owner}/{repo}/issues', {
            owner: OWNER,
            repo: REPO,
            title: title,
            body: body,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
          window.location.assign(HomePage);
        } catch (error) {
          setError("something wrong, please try it later!");
        }
        
      }
    /*
      The two textareas are used for inputting the title and body,
      while the button is used to create the issue.
     */
    return (
      <div>
          {error !== "" && <Modal warningContent="something wrong please try again later" setWarningContent={()=>setError("")}/>}
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
            <br></br>
            <button onClick = {()=>{
              if(body.length < 30 || title.trim() === ""){
                  setWarning("Your body field is not long enough or the title is empty!");
                  return;
              }
              createIssue()
            }} className="issue-button">submit</button>
            <Warning warningContent={warning}/>
        </div>
    )
}

export default Create;