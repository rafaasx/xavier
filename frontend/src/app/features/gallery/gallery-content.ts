import { MediaType } from '../../shared/enums/media-type.enum';
import { Media } from '../../shared/models/media.model';

const youtubeLinks = [
  'https://www.youtube.com/watch?v=TdmLme2IfN8&t=2s',
  'https://www.youtube.com/watch?v=6sYzS4LdiSY&t=2s',
  'https://www.youtube.com/watch?v=LTNlRztvg3k',
  'https://www.youtube.com/watch?v=vNKB4bl7JPc&t=303s',
  'https://www.youtube.com/watch?v=kC6skYsseZ4',
  'https://www.youtube.com/watch?v=4SpXvRqjd1o',
] as const;

const instagramLinks = [
  'https://www.instagram.com/reel/DUeNI9FAWH2/?igsh=MXBrNWd1eDhzd2dkYw==',
  'https://www.instagram.com/reel/DHYkqRuMd7Z/?igsh=YjhlOHNmanZsemFs',
  'https://www.instagram.com/reel/CbKw5ZqFfRm/?igsh=eWdhMzFsZnN0anpo',
  'https://www.instagram.com/reel/ChlOJVWlaoW/?igsh=aDVodTM3djBldThz',
  'https://www.instagram.com/reel/C_ocQtLPMu_/?igsh=MXNiOG5jbDQxYWdydA==',
  'https://www.instagram.com/reel/C6ReqaprgEF/?igsh=YW5sY28xODQ4cHlx',
  'https://www.instagram.com/reel/CidkxVqpR96/?igsh=M2s5cDIzbmFheW9u',
  'https://www.instagram.com/reel/CkGaVKHuBpI/?igsh=NmJyNWVpNmllanF2',
  'https://www.instagram.com/reel/ChMsTmnFGbq/?igsh=MW8xYnRoYWd3eHA2dg==',
  'https://www.instagram.com/reel/C7wtV2JuLlO/?igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/reel/DNmM31iPDo4/?igsh=MTRldHdsajk1eGN4bw==',
  'https://www.instagram.com/aventurasobrerodasoficial/p/DWH4DWjD6g0/',
  'https://www.instagram.com/aventurasobrerodasoficial/p/DV8sLCuDqOv/',
  'https://www.instagram.com/aventurasobrerodasoficial/p/DVOjAQ6EVpZ/',
  'https://www.instagram.com/aventurasobrerodasoficial/p/C7iSsKWIujU/',
] as const;

const youtubeMedia: readonly Media[] = youtubeLinks.map((url, index) => ({
  id: `gallery-youtube-${index + 1}`,
  url,
  type: MediaType.YOUTUBE,
  aspectRatio: '16:9',
  alt: `Vídeo do YouTube ${index + 1}`,
}));

const instagramMedia: readonly Media[] = instagramLinks.map((url, index) => ({
  id: `gallery-instagram-${index + 1}`,
  url,
  type: MediaType.INSTAGRAM,
  aspectRatio: url.includes('/reel/') ? '9:16' : '16:9',
  alt: `Conteúdo do Instagram ${index + 1}`,
}));

export const galleryMediaContent: readonly Media[] = [...youtubeMedia, ...instagramMedia];

