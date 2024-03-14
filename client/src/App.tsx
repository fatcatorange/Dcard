import './App.css';
import React from 'react';
import Content from './Content';
import { CLIENT_ID,REPO,OWNER} from './Information';

const { Octokit } = require("@octokit/rest");

/*
The data fetched by the getUserData function.
 */
type Data = {
  login:string;
}



function App() {
  const [rerender,setRerender] = React.useState(false); //use for rerender component
  const [userData,setUserData] = React.useState<Data>({login:""});
  React.useEffect(()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    /*
    Using the API to request an AccessToken for the user from the server,token will store in localStorage
     */
    async function getAccessToken(){
      await fetch("https://2c07-2001-288-7001-270c-740d-e72a-37b7-80df.ngrok-free.app/getAccessToken/?code=" + codeParam,{
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

    /*
    If the codeParam is not an empty string, it indicates that the page has been redirected from the GitHub login page.
    If localStorage does not contain an accessToken, it means this is the first login attempt, so retrieve the accessToken.
    Otherwise, if there is an accessToken available, retrieve the user data.
     */
    if(codeParam && (localStorage.getItem("accessToken") === null)){
      getAccessToken().then(getUserData);
    }
    else{
      getUserData()
    }

  },[])


  async function getUserData(){
    await fetch("https://2c07-2001-288-7001-270c-740d-e72a-37b7-80df.ngrok-free.app/getUserData", {
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

  /*
  If the user has logged in before, GitHub will quickly return the paramCode without requiring user agreement.
  */
  function loginWithGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID + "&scope=user repo");
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
      {(userData.login === "" || !localStorage.getItem("accessToken")) ? <></>:<Content userData = {userData.login}/>}
    </div>
    
  );
}

export default App;
