import { useEffect, useState } from 'react';
import { Image, ImageStyle, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const FlexImage = ({
  source,
  style
}: {
  source: { uri: string };
  style?: ImageStyle;
}): JSX.Element => {
  const [aspectRatio, setAspectRatio] = useState<number>();

  useEffect((): void => {
    Image.getSize(source.uri, (width, height): void => {
      setAspectRatio(width / height);
    });
  }, []);

  if (!aspectRatio) {
    return null;
  }

  return (
    <Image style={[style, { aspectRatio, width: width * 0.8, maxHeight: '70%' }]} source={source} />
  );
};

export default FlexImage;
