import { cosmic } from "./client";

export interface CosmicMediaSchema {
  name: string;
  original_name: string;
  metadata?: {
    id: string;
    caption: string;
  };
  url: string;
}

export interface CosmicMedia {
  media: CosmicMediaSchema,
}

export interface CosmicMedias {
  media: CosmicMediaSchema[],
  total: number,
}

export interface CosmicMediaInsert {
  media: {
    originalname: string,
    buffer: Buffer,
  },
  metadata: {
    id: string;
    caption: string;
  },
  folder: "tag" | "image",
}

export const getMedia = async (id: string) => {
  const media: CosmicMedia = await cosmic.media.findOne({
    metadata: {
      id: id,
    }
  }).props([
    "url",
    "metadata",
    "original_name",
  ]);
  return media;
}


export const getMediaAll = async () => {
  const medias: CosmicMedias = await cosmic.media.find().props([
    "url",
    "metadata",
    "original_name",
  ]);
  return medias;
}

export const createMedia = async (payload: CosmicMediaInsert) => {
  const { media, metadata, folder = "image" } = payload;
  await cosmic.media.insertOne({
    media: media,
    folder: folder,
    metadata: metadata,
  });
}