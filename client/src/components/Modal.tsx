import React from "react";
import {createPortal} from "react-dom";

type ModalProps = {
  warningContent:string //warning message
  setWarningContent:()=>void
};
const Modal: React.FC<ModalProps> = (props) =>{
  const dialog = React.useRef<any>();

  React.useEffect(function(){
    if(props.warningContent == ""){
      dialog.current.close();
    }
    else{
      dialog.current.showModal();
    }
  },[props.warningContent])
  return createPortal (
    <dialog className = "modal" ref = {dialog}>
      <h4>{props.warningContent}</h4>
      <button onClick = {props.setWarningContent} className="submit-button">back</button>
    </dialog>, document.body
  )
}

export default Modal;