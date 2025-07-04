export function getDivRefWidth(ref:React.RefObject<HTMLDivElement | null>){
  return ref.current ? ref.current.getBoundingClientRect().width : 0
}
export function getDivRefHeight(ref:React.RefObject<HTMLDivElement | null>){
  return ref.current ? ref.current.getBoundingClientRect().height : 0
}