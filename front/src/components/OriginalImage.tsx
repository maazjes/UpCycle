import {
  ActivityIndicator, Image, ImageStyle
} from 'react-native';
import { useState, useEffect } from 'react';

interface ImageURI {
  uri: string;
}

interface OriginalImageProps {
  source: ImageURI;
  style: ImageStyle;
}

const OriginalImage = ({ source, style }: OriginalImageProps): JSX.Element => {
  const [ratio, setRatio] = useState(1);

  useEffect((): void => {
    Image.getSize(source.uri, (width, height): void => setRatio(width / height));
  }, [source]);

  if (!source) {
    return <ActivityIndicator />;
  }

  return (
    <Image
      source={source}
      style={[style, { aspectRatio: ratio }]}
    />
  );
};

export default OriginalImage;
