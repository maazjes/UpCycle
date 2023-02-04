import probe, { ProbeResult } from 'probe-image-size';
import { MulterFile } from '../types';
import { Image } from '../models';

export const saveImages = async (postId: number, files: MulterFile[]): Promise<Image[]> => {
  const dimensionPromises = files.filter(
    (file): file is typeof file & { location: string } => file.location !== undefined
  ).map((file): Promise<ProbeResult> => probe(file.location));
  const dimensions = await Promise.all(dimensionPromises);
  if (!dimensions) {
    throw new Error('getting image dimensions failed');
  }
  const imagePromises = dimensions.map((image): Promise<Image> => Image.create({
    uri: image.url,
    width: image.width,
    height: image.height,
    postId
  }));
  const images = await Promise.all(imagePromises);
  if (!images) {
    throw new Error('saving images failed');
  }
  return images;
};
