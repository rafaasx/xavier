import { MediaType } from '../enums/media-type.enum';

export type MediaAspectRatio = '16:9' | '9:16';

export type Media = Readonly<{
  id: string;
  url: string;
  type: MediaType;
  aspectRatio: MediaAspectRatio;
  alt?: string;
  thumbnail?: string;
}>;

