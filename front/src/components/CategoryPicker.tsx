import {
  View, Pre, Pressablessable, Pressable, Animated
} from 'react-native';
import { Category } from '@shared/types';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { getCategories } from 'services/categories';
import { conditionalUseField } from 'util/helpers';
import Modal from './Modal';
import Line from './Line';
import Text from './Text';

const animated = new Animated.Value(0);

const CategoryPicker = ({ search = false, createPost = false }:
{ search?: boolean; createPost?: boolean }): JSX.Element => {
  const [activeCategories, setActiveCategories] = useState<Category[][] | null>(null);
  const [visible, setVisible] = useState(false);
  const selectedCategories = useRef<Category['id'][]>([]);
  const [, , helpers] = conditionalUseField(createPost, 'categories');
  const finalSelection = useRef<string>();

  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const bgStyle = {
    backgroundColor: animated.interpolate({
      inputRange: [0, 300],
      outputRange: ['rgba(255, 0, 0, 0)', 'rgba(0, 255, 0, 1)']
    })
  };

  useEffect(():void => {
    const initialize = async (): Promise<void> => {
      const res = await getCategories();
      setActiveCategories([[...res.data]]);
    };
    initialize();
  }, []);

  const closeModal = (): void => {
    setVisible(false);
  };

  const onDismiss = (): void => {
    finalSelection.current = undefined;
    closeModal();
  };

  const onCategoryPress = (category: Category): void => {
    selectedCategories.current.push(category.id);
    if (category.subcategories.length > 0) {
      if (search) {
        const allCategory = { name: `Kaikki ${category.name}`, id: category.id, subcategories: [] };
        setActiveCategories([...activeCategories!, [allCategory, ...category.subcategories]]);
      } else {
        setActiveCategories([...activeCategories!, category.subcategories]);
      }
    } else {
      finalSelection.current = category.name;
      if (createPost) {
        helpers!.setValue(selectedCategories.current);
      }
      closeModal();
    }
  };

  const openModal = (): void => {
    if (!activeCategories) {
      return;
    }
    if (selectedCategories) {
      selectedCategories.current = [];
      setActiveCategories([[...activeCategories[0]]]);
    }
    setVisible(true);
  };

  const onBackPress = (): void => {
    if (activeCategories!.length > 1) {
      setActiveCategories([...activeCategories!.slice(0, -1)]);
      selectedCategories.current.pop();
    } else {
      closeModal();
    }
  };

  return (
    <View>
      <Pressable
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20
        }}
        onPress={openModal}
      >
        <Text style={{ marginRight: 15 }} size="subheading">
          {finalSelection.current ?? 'valitse kategoria'}
        </Text>
        <AntDesign name="caretdown" size={15} color="black" />
      </Pressable>
      <Modal
        onDismiss={onDismiss}
        visible={visible}
      >
        <Pressable
          style={{
            paddingVertical: 7,
            paddingLeft: 5
          }}
          onPress={onBackPress}
        >
          <Ionicons name="md-chevron-back-sharp" size={26} color="black" />
        </Pressable>
        {activeCategories
          ? activeCategories[activeCategories.length - 1].map((category): JSX.Element => (
            <Animated.View style={bgStyle}>
              <Line style={{ borderColor: '#161716' }} />
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                onPressIn={fadeIn}
                onPressOut={fadeOut}
                onPress={(): void => onCategoryPress(category)}
              >
                <Text style={{ marginVertical: 13 }} align="center" size="subheading">{category.name}</Text>
                {category.subcategories.length > 0 ? <AntDesign style={{ position: 'absolute', right: 10 }} name="caretright" size={16} color="black" /> : null}
              </Pressable>

            </Animated.View>
          )) : null}
      </Modal>
    </View>
  );
};

export default CategoryPicker;
