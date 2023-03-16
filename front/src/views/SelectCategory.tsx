import { Category } from '@shared/types';
import Container from 'components/Container';
import Text from 'components/Text';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { getCategories } from 'services/categories';
import { UserStackScreen } from 'types';
import { useField } from 'formik';

const SelectCategory = ({ route, navigation }: UserStackScreen<'SelectCategory'>): JSX.Element => {
  const { selectedCategories } = route.params;
  const [activeCategories, setActiveCategories] = useState<Category[][]>([[]]);

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      const res = await getCategories();
      setActiveCategories([[...res.data]]);
    };
    initialize();
  }, []);

  const onCategoryPress = (category: Category): void => {
    if (selectedCategories.current.length < activeCategories.length) {
      selectedCategories.current.push(category.name);
    }
    if (category.subcategories.length > 0) {
      setActiveCategories([...activeCategories, category.subcategories]);
    } else {
      navigation.goBack();
    }
  };

  console.log('active', activeCategories);
  console.log('selected', selectedCategories);

  const onBackPress = (): void => {
    console.log('spliced', [...(activeCategories.splice(-1))]);
    setActiveCategories([...(activeCategories.splice(-1))]);
    selectedCategories.current.pop();
  };

  return (
    <Container>
      {selectedCategories.current.length > 0 ? (
        <Pressable onPress={onBackPress}>
          <AntDesign name="caretleft" size={24} color="black" />
        </Pressable>
      ) : null}
      {activeCategories[activeCategories.length - 1]
        .map((category, index): JSX.Element => (
          <View>
            <Pressable onPress={(): void => onCategoryPress(category)}>
              <Text>{category.name}</Text>
            </Pressable>
          </View>
        ))}
    </Container>
  );
};

export default SelectCategory;
