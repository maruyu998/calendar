import { MdateTz } from 'maruyu-webcommons/commons/utils/mdate';
import { CalendarType as RawCalendarType } from "@client/types/calendar";
import { DOMAIN } from '../../const';

export default function CaleventNew({
  clickedDate,
  calendar: rawCalendar,
  closeModal,
}:{
  clickedDate: MdateTz,
  calendar: RawCalendarType,
  closeModal: ()=>void,
}){
  return <p>{DOMAIN} is not allowed to write</p>;
}