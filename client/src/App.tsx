import './App.css';
import React from 'react';
import Content from './Content';

const { Octokit } = require("@octokit/rest");

const CLIENT_ID = "f0c153b47154dbb6cf50"

type Data = {
  login:string;
}

type IssueData = {
  title:string;
  body:string;
  closed_at:string;
}



function App() {
  const [rerender,setRerender] = React.useState(false);
  const [userData,setUserData] = React.useState<Data>({login:""});
  const [createContent,setCreateContent] = React.useState({title:"",body:""});
  const [creating,setCreating] = React.useState(false);
  const [warning,setWarning] = React.useState("");
  const [nowDisplayID,setNowDisplayID] = React.useState(1);
  const containerRef = React.useRef<HTMLInputElement>(null);


  React.useEffect(()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    async function getAccessToken(){
      await fetch("http://localhost:4000/getAccessToken?code=" + codeParam,{
        method:"GET"
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
    await fetch("http://localhost:4000/getUserData", {
      method: "GET",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("accessToken")
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

  async function createIssue(){
    if(createContent.body.length < 30 || createContent.title.trim() === ""){
      setWarning("Your body field is not long enough or the title is empty!");
      return;
    }
    const octokit = new Octokit({
      auth: localStorage.getItem("accessToken")
    })
    
    await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner: 'fatcatorange',
      repo: 'OAuth-issue',
      title: createContent.title,
      body: createContent.body,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    window.location.assign("http://localhost:3000/");
  }

  async function getIssue(issueID:number){
    const octokit = new Octokit({
      auth: localStorage.getItem("accessToken")
    })
    
    try{
      let issue = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
        owner: 'fatcatorange',
        repo: 'OAuth-issue',
        issue_number: issueID,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      const issueData:IssueData = {
        title:issue.data.title,
        body:issue.data.body,
        closed_at:issue.data.closed_at
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
        owner: 'fatcatorange',
        repo: 'OAuth-issue',
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



  function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>){
    setCreateContent(prev=>{
      return ({
        ...prev,
        title:event.target.value
      })
    });
  }

  function handleChangeBody(event: React.ChangeEvent<HTMLTextAreaElement>){
    setCreateContent(prev=>{
      return ({
        ...prev,
        body:event.target.value
      })
    });
  }

  const handleScroll = () =>{
    const container = containerRef.current;

    if(container){
      if(container.scrollHeight - container.clientHeight <= container.scrollTop + 1){
        setNowDisplayID(prev=>prev+10);
      }
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
      {localStorage.getItem("accessToken")?
        <>
          <div className="content" ref={containerRef} onScroll={handleScroll}>
            { userData.login === "fatcatorange" &&<button onClick = {()=>setCreating(prev=>!prev)}
             className='create-button'>{creating === true ? "cancel":"create new issue"}</button>}
            {creating === true && 
              <div>
                <div>
                  <h3>title:</h3>
                  <textarea 
                    id="create title"
                    value = {createContent.title}
                    onChange = {handleChangeTitle}
                    cols={20}
                    rows={2}
                    className="input-field"
                  />
        
                  <h3>body:</h3>
                  <textarea  
                  id="create body"
                  value = {createContent.body}
                  onChange = {handleChangeBody}
                  cols={80}
                  rows={10}
                  className="input-field"
                  />
                  
                </div>
                {warning !== "" && <h5 className='warning'>{warning}</h5>}
                <button className='submit-button' onClick = {createIssue}>submit</button>
              </div>
            }

            {userData.login != "" && <Content getIssue = {(issueID)=>getIssue(issueID) } nowDisplayID = {nowDisplayID}
            updateIssue = {(issueID,changeTitle,changeBody):any=>{updateIssue(issueID,changeTitle,changeBody)}} userData = {userData.login}/>}
          </div>
        </>
        :
        <>

        </>
        }
     
    </div>
    
  );
}

export default App;
