export function getDivRefWidth(ref:React.RefObject<HTMLDivElement>){
  return ref.current ? ref.current!.getBoundingClientRect().width : 0
}
export function getDivRefHeight(ref:React.RefObject<HTMLDivElement>){
  return ref.current ? ref.current!.getBoundingClientRect().height : 0
}