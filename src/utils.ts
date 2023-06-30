export function createId(): string {
  const postId = Date.now().toString().slice(-10) + Math.random().toString().slice(-10)
  return postId.length === 20 ? postId : createId()
}

const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const secondsIn = { minute: 60, hour: 3600, day: 86400 }

export function getTime(ms: number): string {
  const date = new Date(ms)
  const currentDate = new Date()
  const diffInSec = (currentDate.getTime() - date.getTime()) / 1000

  if (diffInSec <= secondsIn.day) {
    if (diffInSec >= secondsIn.hour) {
      return Math.floor(diffInSec / secondsIn.hour) + 'h'
    } else if (diffInSec >= secondsIn.minute) {
      return Math.floor(diffInSec / secondsIn.minute) + 'm'
    } else {
      return Math.floor(diffInSec) + 's'
    }
  } else {
    let res = months[date.getMonth()] + ' ' + date.getDate()
    if (date.getFullYear() !== currentDate.getFullYear()) {
      res += ' ' + date.getFullYear()
    }
    return res
  }
}

export function getLongTime(ms: number): string {
  const date = new Date(ms)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return hours + ':' + minutes + ' · ' + month + ' ' + day + ', ' + year
}

export const getMsgTime = (ms: number): string => {
  const date = new Date(ms)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  if ((year === new Date().getFullYear()) && (month === months[new Date().getMonth()]) && day === new Date().getDate()) {
    return hours + ':' + minutes 
  }
  return hours + ':' + minutes + ' · ' + month + ' ' + day + ', ' + year
}

export function getTextFromHTML(HTML: string) {
  return HTML.toString()
    .replaceAll('<br>', '')
    .replaceAll('</div>', '')
    .replaceAll('&nbsp;', ' ')
    .split('<div>')
    .filter((line: string) => line !== '')
}

export function checkEmailFormat(email: string) {
  // eslint-disable-next-line no-useless-escape
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}


export const getChatId = (members: (string|undefined)[]) => members.length > 2 ? null : members.sort().join('-')