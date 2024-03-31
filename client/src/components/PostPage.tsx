import React from "react";
import { createPortal } from 'react-dom';
import Comment from "./Comment";
import Warning from "./Warning";
import Markdown from "react-markdown";
import Modal from "./Modal";
import { REPO,OWNER, HomePage} from '../Information';

const { Octokit } = require("@octokit/rest");


type PostPageProps = {
    title:string,
    body:string,
    id:string | number, // the issue index (not id)
    userData:string | undefined, // username
    number:number, // the issue number (not id)
    mostReaction: string, // the most used emoji
    reactionCount: number,  
    backToContent:()=>void // back to browse all issue
}

const PostPage:React.FC<PostPageProps> = (props) => {
    const [comments,setComments] = React.useState<JSX.Element[] | undefined>(undefined); //all comemts
    const [displayComments,setDisplayComments] = React.useState(false); //display comments or not
    const [updating,setUpdating] = React.useState(false); // the user is updating the issue or not
    const [title,setTitle] = React.useState(props.title);
    const [body,setBody] = React.useState(props.body);
    const [warning,setWarning] = React.useState(" ");
    const [error,setError] = React.useState("");

    /*
    Retrieve the comments for the issue and store each comment component in an array.
    */

    async function getIssueComments(){
        const octokit = new Octokit({
          auth: localStorage.getItem('accessToken')
        })
        
        try{
          const res = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
            owner: OWNER,
            repo: REPO,
            issue_number: props.number,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
          let temp:JSX.Element[] = [];
          for(let i=0;i<res.data.length;i++){
            temp.push(<Comment key = {props.id + "comment" + i} id = {res.data[i].id}  body = {res.data[i].body}/>);
          }
          setComments(temp);
        }
        catch(error){
          setError("something wrong, please try it later!");
          console.log(error);
        }
        
      }

    async function updateIssue(issueID:number|string ,changeTitle:string ,changeBody:string){
        const octokit = new Octokit({
        auth: localStorage.getItem("accessToken")
        })
        try{
        let issue = await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
            owner: OWNER,
            repo: REPO,
            body: changeBody,
            title: changeTitle,
            issue_number: issueID,
            headers: {
            'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        window.location.assign(HomePage);
        return issue
        }
        catch(error:any){
          console.log(error.status);
          setError("something wrong, please try again later");
          return undefined;
        }
    }

    /*
    closed the post
     */

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
          window.location.assign(HomePage);
    
        }
        catch(error){
          setError("something wrong, please try again later");
          console.log(error);
        }
      }
      
    async function handleCommentsDisplay(){
        if(comments === undefined){  //If the comments are undefined, it means they haven't been loaded yet.
          await getIssueComments();
        }
        setDisplayComments(prev=>!prev);
    }

    function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>){
        setTitle(event.target.value);
      }
    
    function handleChangeBody(event: React.ChangeEvent<HTMLTextAreaElement>){
      setBody(event.target.value);
    }
    /*
    If the user is not the owner, they cannot update the issue.
    Therefore, we hide the update and delete buttons. However, 
    even if a normal user clicks the button, they cannot delete 
    or update the issue due to GitHub's permissions.

    The two textareas are used for inputting the title and body,
    while the button is used to update the issue.
    */
    
    return (
        <div className="PostPage-container" id="pt" >
            {error !== "" && <Modal warningContent={error} setWarningContent={()=>setError("")}/>}
            <div className="tool-bar">
                <button onClick={props.backToContent} className="submit-button">back</button>
                {props.userData != undefined && props.userData === OWNER? 
                <div>
                    <button className="tool-button" onClick={()=>setUpdating(prev => !prev)}>{updating === false ? "update":"cancel"}</button>
                    <button className="tool-button" onClick={handleClosedPost}>delete</button>
                </div>
                :
                <></>}
            </div>
            
            {updating === false ? 
            <div>
            <h1>{props.title}</h1>
            <Markdown>{props.body}</Markdown>
            <span>{props.mostReaction} {props.reactionCount}</span>
            {<div className="rightLine"></div> &&
            <div className="comment-display-button" onClick = {handleCommentsDisplay}>comment</div> }
            {displayComments === true && comments}
            {displayComments === true && comments != undefined && comments.length === 0 &&
            <h6>There are no comments</h6>}
        </div>
        :
        <div>
          <div>
            <h3>title:</h3>
            <textarea 
                id = {"issue change title" + props.id}
                value = {title}
                onChange = {handleChangeTitle}
                className="input-field"
                style={{width:'50%'}}
            />

            <h3>body:</h3>
            <textarea  
                id = {"issue change body" + props.id}
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
              updateIssue(props.id,title,body)
            }} className="issue-button">submit</button>
            <Warning warningContent = {warning}/>
        </div>
      }
            
      </div>
    )
}

export default PostPage;
