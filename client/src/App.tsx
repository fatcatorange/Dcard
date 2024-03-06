import './App.css';
import React from 'react';
import Content from './Content';
import { CLIENT_ID,REPO,OWNER} from './Information';

const { Octokit } = require("@octokit/rest");


type Data = {
  login:string;
}

type IssueData = {
  title:string;
  body:string;
  id:string|number;
  closed_at:string;
}



function App() {
  const [rerender,setRerender] = React.useState(false);
  const [userData,setUserData] = React.useState<Data>({login:""});
  React.useEffect(()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    async function getAccessToken(){
      await fetch("https://b12c-2001-288-7001-270c-995c-d673-663a-35bb.ngrok-free.app/getAccessToken/?code=" + codeParam,{
        method:"GET",
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      }).then((response)=>{
        return response.json();
      }).then((data)=>{
        if(data.access_token){
          localStorage.setItem("accessToken",data.access_token);
          setRerender(!rerender);
        }
      })
    }

    if(codeParam && (localStorage.getItem("accessToken") === null)){
      getAccessToken().then(getUserData);
    }
    else{
      getUserData()
    }

  },[])

  async function getUserData(){
    await fetch("https://b12c-2001-288-7001-270c-995c-d673-663a-35bb.ngrok-free.app/getUserData", {
      method: "GET",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("accessToken"),
        'ngrok-skip-browser-warning': 'true'
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      setUserData({login:data.login});
      console.log(userData);
    })
  }

  function loginWithGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID + "&scope=user repo");
  }


  async function getIssue(issueID:number):Promise<IssueData|undefined|null>{
    const octokit = new Octokit({
      auth: localStorage.getItem("accessToken")
    })
    
    try{
      let issue = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
        owner: OWNER,
        repo: REPO,
        issue_number: issueID,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      const issueData:IssueData = {
        title:issue.data.title,
        body:issue.data.body,
        closed_at:issue.data.closed_at,
        id:issue.data.id,
        
      } 
      return issueData
    }
    catch(error: any){
      if(error.status == 404){
        return null;
      }
      return undefined;
    }
  
  }

  async function updateIssue(issueID:number ,changeTitle:string ,changeBody:string){
    const octokit = new Octokit({
      auth: localStorage.getItem("accessToken")
    })
    console.log(issueID,changeTitle,changeBody);
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
      window.location.assign("http://localhost:3000/");
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



  return (
    <div className="app-container">
      <div className="header">
        <div></div>
        <h2 className='header-item'>Daniel's blog</h2>
        {localStorage.getItem("accessToken")?
        <>
        <button className='login-button' onClick = {()=>{localStorage.removeItem("accessToken"); setRerender(prev=>(!prev))}}>logout</button>
        </>
        :
        <>
        <button className='login-button' onClick = {loginWithGithub}>login</button>
        </>
        }
      </div>
      {(userData.login === "" || !localStorage.getItem("accessToken")) ? <></>:<Content getIssue = {(issueID)=>getIssue(issueID) }
            updateIssue = {(issueID,changeTitle,changeBody):any=>{updateIssue(issueID,changeTitle,changeBody)}} userData = {userData.login}/>}
    </div>
    
  );
}

export default App;
