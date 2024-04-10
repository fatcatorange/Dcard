import './css/App.css';
import React from 'react';
import Content from './components/Content';
import { CLIENT_ID, SERVER_URL} from './Information';
import Modal from './components/Modal';
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
  const [error, setError] = React.useState("");
  const [login,setLogin] = React.useState(()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    return codeParam !== null;
  });
  React.useEffect(()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    /*
    Using the API to request an AccessToken for the user from the server,token will store in localStorage
     */
    async function getAccessToken(){
      try{
          await fetch( SERVER_URL + "/getAccessToken/?code=" + codeParam,{
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
      catch(error){
        setError("something wrong, please try again later");
      }
      
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
    try {
      await fetch(SERVER_URL + "/getUserData", {
        method: "GET",
        headers: {
          "Authorization" : "Bearer " + localStorage.getItem("accessToken"),
          'ngrok-skip-browser-warning': 'true'
        }
      }).then((response) => {
        return response.json();
      }).then((data) => {
        setUserData({login:data.login});
      })
    } catch (error) {
      setError("something wrong, please try again later");
    }
  }

  /*
  If the user has logged in before, GitHub will quickly return the paramCode without requiring user agreement.
  */
  function loginWithGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID + "&scope=user repo");
  }
  
  React.useEffect(function(){

  },[])

  return (
    <div className="app-container">
      {error !== "" && <Modal warningContent={error} setWarningContent={()=>setError("")}/>}
      <div className="header">
        <div></div>
        <h2 className='header-item'>Daniel's blog</h2>
        {localStorage.getItem("accessToken")?
        <>
        <button className='login-button' onClick = {()=>{localStorage.removeItem("accessToken"); setRerender(prev=>(!prev)); setLogin(false)}}>logout</button>
        </>
        :
        <>
        <button className='login-button' onClick = {loginWithGithub}>login</button>
        </>
        }
      </div>
      {(!localStorage.getItem("accessToken") ) ? 
      <>
      {(login === false) && 
      <div className="jimmy">
        <div className='introduction-display'>
          <h2>Welcome to Daniel's blog!</h2>
          <h3>Please log in using your GitHub account.</h3>
        </div>
        
        <div className='arrow-up'></div>
      </div>}  
      </>
      :
      <Content userData = {userData.login}/>}
    </div>
    
  );
}

export default App;
