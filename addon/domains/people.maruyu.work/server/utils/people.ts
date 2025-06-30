import { RawPeopleType } from "../process/activity";

export function getNameSummary(peopleName:RawPeopleType["name"]):string{
  if(peopleName.family?.original && peopleName.given?.original){
    return `${peopleName.family.original}${peopleName.given.original}`
  }
  if(peopleName.given?.original){
    return `${peopleName.given.original}`;
  }
  if(peopleName.family?.alphabet && peopleName.given?.alphabet){
    return `${peopleName.given.original} ${peopleName.family.original}`
  }
  if(peopleName.nick){
    return peopleName.nick;
  }
  return "NoName";
}