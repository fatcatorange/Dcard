import React from "react";
import Issue from "./Issue";
import PostPage from "./PostPage";
import Create from "./Create";
import { OWNER } from "./Information";

type IssueData = {
  title:string,
  body:string,
  id:string|number,
  closed_at:null|string;
}

type ContentProps = {
  getIssue: (issueID: number)=>Promise<IssueData | null | undefined>;
  updateIssue: (issueID: number,changeTitle: string,changeBody: string)=>Promise<IssueData | null | undefined>;
  userData: string | undefined;
}

const Content:React.FC<ContentProps> = (props) => {
  const [nowDisplay, setNowDisplay] = React.useState<JSX.Element[]>([]);
  const [browsing,setBrowsing] = React.useState(0);
  const [content,setContent] = React.useState<IssueData[]>([]);
  const [bottom,setBottom] = React.useState(false); // no more issues
  const [rerender,setRerender] = React.useState(false);
  const [nowDisplayID,setNowDisplayID] = React.useState(1);
  const closeRef = React.useRef(0);
  const containerRef = React.useRef<HTMLInputElement>(null);
  const [creating,setCreating] = React.useState(false);

  async function getTenIssue(){
    if(bottom === true) 
      return;
    let tmpIssueData:IssueData[] = [];
    let check = false;
    for(let i:number = nowDisplayID + closeRef.current;i< (nowDisplayID + 10 + closeRef.current);i++){
      const res:IssueData|undefined|null = await props.getIssue(i);
      if(res != null){
        if(res.closed_at != null){
          closeRef.current++;
          continue;
        }
        const content = <Issue id = {i} title = {res.title} body = {res.body} key = {"issue" + i} setBrowse = {()=>setBrowsing(i - closeRef.current)}
                        updateIssue = {(issueID,changeTitle,changeBody)=>{props.updateIssue(issueID,changeTitle,changeBody);}} userData = {props.userData}/>
        setNowDisplay(prev=>[...prev, content]);
        res.id = i;
        tmpIssueData.push(res);
      }
      else if(res === null)
      {
        check = true;
        break;
      }
    }
    setContent(prev=>[...prev,...tmpIssueData]);
    setRerender(prev=>(!prev));
    if(check === true){
      setBottom(true);
    }
  }


  React.useEffect(function(){
    getTenIssue();
  },[nowDisplayID])

  const handleScroll = () =>{
    const container = containerRef.current;

    if(container){
      if(container.scrollHeight - container.clientHeight <= container.scrollTop + 1){
        setNowDisplayID(prev=>prev+10);
      }
    }

  }


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
        <PostPage title = {content[browsing - 1].title} id = {content[browsing - 1].id} body= {content[browsing - 1].body} backToContent = {()=>setBrowsing(0)}
          userData = {props.userData} />
      }
      
    </div>
  )
}

export default Content;