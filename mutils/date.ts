export default {}

// const JapaneseLongDOWs = ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"]
// const JapaneseMediumDOWs = ["日曜","月曜","火曜","水曜","木曜","金曜","土曜"]
// const JapaneseShortDOWs = ["日","月","火","水","木","金","土"]
// const LongDOWs = ["Sunday", "Monday", "Tueday", "Wedday", "Thuday", "Friday", "Satday"]
// const MediumDOWs = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
// const ShortDOWs = ["S", "M", "T", "W", "T", "F", "S"]

// type Unit = "year"|"month"|"day"|"hour"|"minute"|"second"|"millisecond";

// function zeroFill(num:number, digits:number): string{
//     return ( Array(digits).join('0') + num ).slice( -digits );
// }
// export function getJapaneseShortDOW(date:Date):string{
//     return JapaneseShortDOWs[date.getDay()]
// }
// export function getJapaneseMediumDOW(date:Date):string{
//     return JapaneseMediumDOWs[date.getDay()]
// }
// export function getJapaneseLongDOW(date:Date):string{
//     return JapaneseLongDOWs[date.getDay()]
// }
// export function getShortDOW(date:Date):string{
//     return ShortDOWs[date.getDay()]
// }
// export function getMediumDOW(date:Date):string{
//     return MediumDOWs[date.getDay()]
// }
// export function getLongDOW(date:Date):string{
//     return LongDOWs[date.getDay()]
// }

// export function add(date:Date, diff:number, unit:Unit): Date{
//     const n_date = clone(date)
//     if(unit === "day"){
//         n_date.setDate(date.getDate() + diff)
//         return n_date
//     }
//     return date
// }

// export function set(date:Date, num:number, unit:Unit): Date{
//     const n_date = clone(date)
//     if(unit === "year"){
//         n_date.setFullYear(num)
//         return n_date
//     }
//     if(unit === "month"){
//         n_date.setMonth(num)
//         return n_date
//     }
//     if(unit === "day"){
//         n_date.setDate(num)
//         return n_date
//     }
//     if(unit === "hour"){
//         n_date.setHours(num)
//         return n_date
//     }
//     if(unit === "minute"){
//         n_date.setMinutes(num)
//         return n_date
//     }
//     if(unit === "second"){
//         n_date.setSeconds(num)
//         return n_date
//     }
//     if(unit === "millisecond"){
//         n_date.setMilliseconds(num)
//         return n_date
//     }
//     throw Error(`unit(${unit}) is unknown`)
// }

// export function clone(date:Date): Date{
//     return new Date(date.getTime())
// }

// export function format(date:Date, str:string): string{
//     function _replace_all(source:string,a:string,b:string){
//         while(source.includes(a)) source = source.replace(a, b)
//         return source
//     }
//     str = _replace_all(str, "YYYY", zeroFill(date.getFullYear(), 4))
//     str = _replace_all(str, "MM", zeroFill(date.getMonth() + 1, 2))
//     str = _replace_all(str, "M", String(date.getMonth() + 1))
//     str = _replace_all(str, "DD", zeroFill(date.getDate(), 2))
//     str = _replace_all(str, "D", String(date.getDate()))
//     str = _replace_all(str, "hh", zeroFill(date.getHours(), 2))
//     str = _replace_all(str, "h", String(date.getHours()))
//     str = _replace_all(str, "mm", zeroFill(date.getMinutes(), 2))
//     str = _replace_all(str, "m", String(date.getMinutes()))
//     str = _replace_all(str, "mm", zeroFill(date.getSeconds(), 2))
//     str = _replace_all(str, "m", String(date.getSeconds()))
//     str = _replace_all(str, "WWW", getJapaneseLongDOW(date))
//     str = _replace_all(str, "WW", getJapaneseMediumDOW(date))
//     str = _replace_all(str, "W", getJapaneseShortDOW(date))
//     str = _replace_all(str, "www", getLongDOW(date))
//     str = _replace_all(str, "ww", getMediumDOW(date))
//     str = _replace_all(str, "w", getShortDOW(date))
//     return str
// }

// export function parseWithFormat(datestr:string, formatstr:string): Date{
//     let date = getTimeReset(new Date())
//     function _find_and_replace(date:Date, formatstr:string, partstr:string, unit:Unit){
//         const index = formatstr.indexOf(partstr)
//         let number = index < 0 ? 0 : ((unit === "month") ? -1 : 0) + Number(datestr.slice(index, index+partstr.length))
//         return set(date, number, unit)
//     }
//     date = _find_and_replace(date, formatstr, "YYYY", "year")
//     date = _find_and_replace(date, formatstr, "MM", "month")
//     date = _find_and_replace(date, formatstr, "DD", "day")
//     date = _find_and_replace(date, formatstr, "hh", "hour")
//     date = _find_and_replace(date, formatstr, "mm", "minute")
//     date = _find_and_replace(date, formatstr, "ss", "second")
//     return date
// }

// export function getTimeReset(date:Date): Date{
//     date = clone(date)
//     date = set(date, 0, "hour")
//     date = set(date, 0, "minute")
//     date = set(date, 0, "second")
//     date = set(date, 0, "millisecond")
//     return date
// }

// export function getDaySecond(date:Date): number{
//     return date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()
// }

// export function getStringDate(date): string{
//     return format(date, "YYYY-MM-DD")
// }

// export function yesterday(date){
//     return add(date, -1, 'day')
// }

// export function tomorrow(date){
//     return add(date, 1, 'day')
// }

// export function isToday(date:Date):boolean{
//     return getTimeReset(date).getTime() === getTimeReset(new Date()).getTime()
// }

// export function parse(string:string):Date{
//     return new Date(Date.parse(string))
// }