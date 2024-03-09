import React from "react";
import Issue from "./Issue";
import PostPage from "./PostPage";
import Create from "./Create";
import { OWNER, REPO } from "./Information";

const { Octokit } = require("@octokit/rest");

type IssueData = {
  title:string,
  body:string,
  id:string|number,
  number: number
}

type ContentProps = {
  updateIssue: (issueID: number,changeTitle: string,changeBody: string)=>Promise<IssueData | null | undefined>;
  userData: string | undefined;
}

const Content:React.FC<ContentProps> = (props) => {
  const [nowDisplay, setNowDisplay] = React.useState<JSX.Element[]>([]);
  const [browsing,setBrowsing] = React.useState(0);
  const [content,setContent] = React.useState<IssueData[]>([]);
  const [bottom,setBottom] = React.useState(false); // no more issues
  const [rerender,setRerender] = React.useState(false);
  const nowRef = React.useRef(1);
  const containerRef = React.useRef<HTMLInputElement>(null);
  const [creating,setCreating] = React.useState(false);

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

      console.log(res);
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

  async function getTenIssue(){
    if(bottom === true) 
      return;
    let res:any = await listTenIssue();
    if(res === undefined){
      return;
    }
    let tmpIssuePage:JSX.Element[] = [];
    for(let i=0; i<res.length ;i++){
      let nowID = nowRef.current;
      const id = i + ((nowID - 1) * 10);
      const content = <Issue id = {id + 1} title = {res[i].title} body = {res[i].body} key = {"issue" + id} setBrowse = {()=>{setBrowsing(id + 1)}}
                        updateIssue = {(issueID,changeTitle,changeBody)=>{props.updateIssue(issueID,changeTitle,changeBody);}} userData = {props.userData}/>
      tmpIssuePage.push(content);
      res[i].id = id + 1;
    }
    setNowDisplay((prev)=>[...prev,...tmpIssuePage]);
    setContent((prev)=>[...prev,...res]);
    setRerender((prev)=>!prev);
    if(res.length < 10){
      setBottom(true);
    }
    nowRef.current = nowRef.current+1;
  }

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
      {browsing === 0?
        <div className="all-issue-container">
          {props.userData === OWNER && <button className="create-button" onClick={()=>setCreating(prev=>!prev)}>{creating === false ? "create" : "cancel"}</button>}
          {creating === false ? 
          <div>
            {nowDisplay}
            {bottom === true && <h4 style={{textAlign:"center"}}>~~~There are no more posts~~~</h4>}
          </div>
          :
            <Create></Create>
          }
          
        </div>
        :
        <PostPage title = {content[browsing - 1].title} id = {content[browsing - 1].id} number = {content[browsing - 1].number} body= {content[browsing - 1].body} backToContent = {()=>setBrowsing(0)}
          userData = {props.userData} />
      }
      
    </div>
  )
}

export default Content;