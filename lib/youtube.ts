export function getYoutubeId(url: string) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : null
}

export function getYoutubeThumbnail(url: string) {
  const id = getYoutubeId(url)
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
}
