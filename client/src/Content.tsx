import React from "react";
import Issue from "./Issue";

type IssueData = {
  title:string;
  body:string;
  closed_at:null|string;
  
}

type ContentProps = {
  getIssue: (issueID: number)=>Promise<IssueData | null | undefined>;
  updateIssue: (issueID: number,changeTitle: string,changeBody: string)=>Promise<IssueData | null | undefined>;
  nowDisplayID: number;
  userData: string | undefined;
}

const Content:React.FC<ContentProps> = (props) => {
  const [nowDisplay, setNowDisplay] = React.useState<JSX.Element[]>([]);
  const [bottom,setBottom] = React.useState(false);
  const [rerender,setRerender] = React.useState(false);
  const closeRef = React.useRef(0);

  async function getTenIssue(){
    if(bottom === true) 
      return;
    let tmp:JSX.Element[] = [];
    for(let i:number = props.nowDisplayID + closeRef.current;i< (props.nowDisplayID + 10 + closeRef.current);i++){
      const res:IssueData|undefined|null = await props.getIssue(i);
      if(res != null){
        if(res.closed_at != null){
          closeRef.current++;
          continue;
        }
        const content = <Issue id = {i} title = {res.title} body = {res.body} key = {"issue" + i} 
                        updateIssue = {(issueID,changeTitle,changeBody)=>{props.updateIssue(issueID,changeTitle,changeBody);}} userData = {props.userData}/>
        tmp.push(content);
      }
      else if(res === null)
      {
        setBottom(true);
        break;
      }
    }
    setNowDisplay(prev=>[...prev, ...tmp]);
    setRerender(prev=>(!prev));
  }

  React.useEffect(function(){
    getTenIssue();
  },[props.nowDisplayID])




  return (
    
    <div>
      {nowDisplay}
    </div>
  )
}

export default Content;