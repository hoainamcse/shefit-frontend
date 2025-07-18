/**
 * YouTube thumbnail quality options
 */
export type ThumbnailQuality =
  | 'default' // 120x90
  | 'mqdefault' // 320x180
  | 'hqdefault' // 480x360
  | 'sddefault' // 640x480
  | 'maxresdefault' // 1280x720

/**
 * YouTube thumbnail information
 */
export interface YouTubeThumbnail {
  url: string
  width: number
  height: number
  quality: ThumbnailQuality
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
function getYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  url = url.trim()

  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*[&?]v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/attribution_link\?.*[&?]v=([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }

  return null
}

/**
 * Gets YouTube thumbnail URL for a specific quality
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality
 * @returns Thumbnail information object
 */
function getThumbnailInfo(videoId: string, quality: ThumbnailQuality): YouTubeThumbnail {
  const dimensions = {
    default: { width: 120, height: 90 },
    mqdefault: { width: 320, height: 180 },
    hqdefault: { width: 480, height: 360 },
    sddefault: { width: 640, height: 480 },
    maxresdefault: { width: 1280, height: 720 },
  }

  return {
    url: `https://img.youtube.com/vi/${videoId}/${quality}.jpg`,
    width: dimensions[quality].width,
    height: dimensions[quality].height,
    quality,
  }
}

/**
 * Gets YouTube thumbnail URL from video URL
 * @param url - YouTube video URL or video ID
 * @param quality - Thumbnail quality (default: 'hqdefault')
 * @returns Thumbnail URL or null if invalid
 */
export function getYouTubeThumbnail(url: string, quality: ThumbnailQuality = 'hqdefault'): string | null {
  const videoId = getYouTubeVideoId(url)

  if (!videoId) {
    return null
  }

  return getThumbnailInfo(videoId, quality).url
}

/**
 * Gets YouTube thumbnail information object from video URL
 * @param url - YouTube video URL or video ID
 * @param quality - Thumbnail quality (default: 'hqdefault')
 * @returns Thumbnail information object or null if invalid
 */
export function getYouTubeThumbnailInfo(url: string, quality: ThumbnailQuality = 'hqdefault'): YouTubeThumbnail | null {
  const videoId = getYouTubeVideoId(url)

  if (!videoId) {
    return null
  }

  return getThumbnailInfo(videoId, quality)
}

/**
 * Gets all available YouTube thumbnail qualities for a video
 * @param url - YouTube video URL or video ID
 * @returns Array of all thumbnail information objects or null if invalid
 */
export function getAllYouTubeThumbnails(url: string): YouTubeThumbnail[] | null {
  const videoId = getYouTubeVideoId(url)

  if (!videoId) {
    return null
  }

  const qualities: ThumbnailQuality[] = ['default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault']

  return qualities.map((quality) => getThumbnailInfo(videoId, quality))
}
