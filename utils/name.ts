export function getShortName(fullName:string){
  if (fullName === ''){
    return fullName
  }

  fullName = fullName.trim()
  const words = fullName.split(' ')
  return words[words.length - 1]
}