import React from "react";
import '../css/Issue.css'

type WarningProps = {
  warningContent:string //warning message
};


const Warning: React.FC<WarningProps> = (props) =>{
  return (
    <h5 className="warning">{props.warningContent}</h5>
  )
}

export default Warning;