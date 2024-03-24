import React from "react";
import Issue from "./Issue";
import PostPage from "./PostPage";
import Create from "./Create";
import { OWNER, REPO } from "../Information";

const { Octokit } = require("@octokit/rest");

/*
IssueData get by listTenIssue function
*/

type IssueData = { 
  title:string,
  body:string,
  id:string|number,
  number: number
}

type ContentProps = {
  userData: string | undefined; // userName (login)
}

const Content:React.FC<ContentProps> = (props) => {
  const [nowDisplay, setNowDisplay] = React.useState<JSX.Element[]>([]); // The issue currently displayed. (As the user scrolls down, it adds 10 more questions.)
  /*
  Check whether the user is currently browsing some issues. If not, the browsing value is 0. 
  Otherwise, it represents the index of the current issue (either by ID or number).
   */
  const [browsing,setBrowsing] = React.useState(0); 
  const [content,setContent] = React.useState<IssueData[]>([]); //all issueData.
  const [bottom,setBottom] = React.useState(false); // if bottom is true,there are no more issues.
  const [rerender,setRerender] = React.useState(false); // use for rerender page.
  const containerRef = React.useRef<HTMLInputElement>(null); // using a ref to the component to detect whether the user has scrolled down to the bottom.
  const [creating,setCreating] = React.useState(false); // Check whether the user is currently creating a new issue.
  const nowRef = React.useRef(1); // The page intends to get now.
  const lockRef = React.useRef(false); // prevent users from scrolling down too fast and making multiple API calls.


  /*
  Get ten issues from GitHub,
  and add the issue data to the 'content' state.
   */
  async function listTenIssue(){
    try{
      const octokit = new Octokit({
        auth: localStorage.getItem("accessToken")
      })
      
      const res = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: OWNER,
        repo: REPO,
        state: 'open',
        per_page: 10,
        page: nowRef.current,
        sort: 'created',
        direction: 'asc',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'accept': 'application/vnd.github.raw+json'
        }
      })
      let retArr:IssueData[] = [];
      for(let i=0;i<res.data.length;i++){
        const issueData:IssueData = {
          title:res.data[i].title,
          body:res.data[i].body,
          id:res.data[i].id,
          number:res.data[i].number,
        }
        retArr.push(issueData);
      }

      return retArr;
    }
    catch(error){
      console.log(error);
      return undefined;
    }
  }

  /*
  Use the 'listTenIssue' function to retrieve issues. If the returned data is not undefined,
  indicating valid data, add the 'Issue' component based on this data. Additionally,
  if the returned data is smaller than ten, indicating that there are no more data, set the bottom state to true.
  if the bottom is true, it means there are no more issues, just return.
   */
  async function getTenIssue(){
    if(bottom === true || lockRef.current === true) 
      return;

    let res:any = await listTenIssue();
    if(res === undefined){
      return;
    }

    lockRef.current = true;

    let tmpIssuePage:JSX.Element[] = [];
    for(let i=0; i<res.length ;i++){
      let nowID = nowRef.current;
      const index = i + ((nowID - 1) * 10); //calculate the index of the issue
      const content = <Issue id = {index + 1} title = {res[i].title} body = {res[i].body} key = {"issue" + index} 
      setBrowse = {()=>{setBrowsing(index + 1)}} userData = {props.userData}/>
      tmpIssuePage.push(content);
      res[i].id = index + 1;
    }
    setNowDisplay((prev)=>[...prev,...tmpIssuePage]);
    setContent((prev)=>[...prev,...res]);
    setRerender((prev)=>!prev);
    if(res.length < 10){
      setBottom(true);
    }
    nowRef.current = nowRef.current+1; //change page
    lockRef.current = false; //open lock
  }


  /*
  If the user scrolls down to the bottom, call the 'getTenIssue' function to retrieve 10 new issues.
   */
  const handleScroll = () =>{
    const container = containerRef.current;

    if(container){
      if(container.scrollHeight - container.clientHeight <= container.scrollTop + 1){
        getTenIssue();
      }
    }

  }

  React.useEffect(function(){
    getTenIssue();
  },[])


  return (
    <div className="content" ref = {containerRef} onScroll={handleScroll}>
      {browsing === 0? // Check if the user is currently browsing a issue now
        <div className="all-issue-container">
          {props.userData === OWNER && <button className="create-button" onClick={()=>setCreating(prev=>!prev)}>{creating === false ? "create" : "cancel"}</button>}
          {creating === false ? // Check if the user is currently creating a new post.
          <div>
            {nowDisplay}
            {bottom === true && <h4 style={{textAlign:"center"}}>~~~There are no more posts~~~</h4>}
          </div>
          :
          <Create></Create>
          }
          
        </div>
        :
        <PostPage title = {content[browsing - 1].title} id = {content[browsing - 1].id} number = {content[browsing - 1].number}
          body= {content[browsing - 1].body} backToContent = {()=>setBrowsing(0)} userData = {props.userData} />
      }
      
    </div>
  )
}

export default Content;