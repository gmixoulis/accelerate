export const trimText = (text) => {
  if (!text) {
    return ''
  }
  
  if (text.length <= 60) {
    return text // return the text as is if it's short enough
  }

  let firstPart = text.substring(0, 20)
  let lastPart = text.substring(text.length - 20)

  return `${firstPart}...${lastPart}`
}
