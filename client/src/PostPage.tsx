import React from "react";
import Issue from "./Issue";
import Comment from "./Comment";
import Markdown from "react-markdown";
import { REPO,OWNER} from './Information';

const { Octokit } = require("@octokit/rest");


type PostPageProps = {
    title:string,
    body:string,
    id:string | number,
    userData:string | undefined,
    number:number,
    backToContent:()=>void
}

const PostPage:React.FC<PostPageProps> = (props) => {
    const [comments,setComments] = React.useState<JSX.Element[] | undefined>(undefined);
    const [displayComments,setDisplayComments] = React.useState(false);
    const [updating,setUpdating] = React.useState(false);
    const [title,setTitle] = React.useState(props.title);
    const [body,setBody] = React.useState(props.body);
    const [warning,setWarning] = React.useState("");


    async function getIssueCommit(){
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
          console.log(temp);
        }
        catch(error){
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
        console.log(issue)
        window.location.assign("https://fatcatorange.github.io/Dcard/");
        return issue
        }
        catch(error:any){
        console.log(error.status);
        if(error.status == 404){
            return null;
        }
        return undefined;
        }
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
          window.location.assign("https://fatcatorange.github.io/Dcard/");
    
        }
        catch(error){
          console.log(error);
        }
      }
      
    async function handleCommentsDisplay(){
        if(comments === undefined){
          await getIssueCommit();
        }
        setDisplayComments(prev=>!prev);
    }

    function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>){
        setTitle(event.target.value);
      }
    
    function handleChangeBody(event: React.ChangeEvent<HTMLTextAreaElement>){
      setBody(event.target.value);
    }

    return (
        <div className="PostPage-container" >
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
            {warning !== "" && <h5 className="warning">{warning}</h5>}
            <button onClick = {()=>{
              if(body.length < 30 || title.trim() === ""){
                  setWarning("Your body field is not long enough or the title is empty!");
                  return;
              }
              updateIssue(props.id,title,body)
            }} className="issue-button">submit</button>
          
        </div>
      }
            
      </div>
    )
}

export default PostPage;
