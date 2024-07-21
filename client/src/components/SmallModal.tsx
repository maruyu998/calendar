import React from "react";

export default function SmallModal({
  children,
  isOpen,
  onClose,
}:{
  children: React.ReactNode
  isOpen: boolean,
  onClose: ()=>void,
}){
  return (
    <div 
      className={`
        modal fixed flex items-center justify-center z-50 overscroll-contain 
        transition duration-300 ease-in-out transform
        w-full h-full top-0 left-0 max-w-full max-h-full
        ${(isOpen ? "" : " opacity-0 pointer-events-none")}
      `}
      onClick={e=>e.stopPropagation()}
    >
      <div className="modal-overlay w-full h-full bg-gray-600 opacity-50 fixed" onClick={onClose}/>
      <div className="
        modal-container 
        bg-white z-50 overflow-y-auto
        px-4
      ">
        <div className="modal-content py-4 text-left px-2 mt-2">
          <div className="h-6">
            <div className="modal-close cursor-pointer z-50 content-end w-fit ms-auto" onClick={onClose}>
              <svg className="fill-current text-black text-right" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          { isOpen && children }
        </div>
      </div>
    </div>
  )
}