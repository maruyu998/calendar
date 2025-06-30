import { RiFileCopy2Line } from "@remixicon/react";

export default function DuplicateButton({
  duplicateHandler,
}:{
  duplicateHandler: ()=>void,
}){
  return (
    <button
      className="text-gray-400 hover:text-indigo-500 transition"
      onClick={()=>{
        if(window.confirm("Are you really want to DUPLICATE?")){
          duplicateHandler();
        }
      }}
    ><RiFileCopy2Line size={18}/></button>
  )
}