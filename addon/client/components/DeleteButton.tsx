import { RiDeleteBinLine } from "@remixicon/react";

export default function DeleteButton({
  deleteHandler,
}:{
  deleteHandler: ()=>void,
}){
  return (
    <button
      className="text-gray-400 hover:text-red-500 transition"
      onClick={()=>{
        if(window.confirm("Are you really want to DELETE?")){
          deleteHandler();
        }
      }}
    ><RiDeleteBinLine size={18}/></button>
  )
}