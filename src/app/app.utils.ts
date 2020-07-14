export function getHour(mseconds: number): string {
  let hour = new Date(mseconds).getHours();
  hour == 0 ? 23 : hour - 1;
  let shour = hour > 9 ? '' + hour : '0' + hour;
  return shour;
}
export function getMinute(mseconds: number): string {
  let minute = new Date(mseconds).getMinutes();
  let sminute = minute > 9 ? '' + minute : '0' + minute;
  return sminute;
}
