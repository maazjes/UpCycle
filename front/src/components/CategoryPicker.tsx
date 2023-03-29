import { View, Pressable, TouchableOpacity, ViewProps } from 'react-native';
import { Category } from '@shared/types';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { getCategories } from 'services/categories';
import { conditionalUseField } from 'util/helpers';
import Modal from './Modal';
import Line from './Line';
import Text from './Text';

interface Props extends ViewProps {
  search?: boolean;
  createPost?: boolean;
  setCategory?: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const CategoryPicker = ({
  search = false,
  createPost = false,
  setCategory = undefined,
  ...props
}: Props): JSX.Element => {
  const [activeCategories, setActiveCategories] = useState<Category[][] | null>(null);
  const [visible, setVisible] = useState(false);
  const selectedCategories = useRef<Category['id'][]>([]);
  const [, , helpers] = conditionalUseField(createPost, 'categories');
  const finalSelection = useRef<string>();

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      const res = await getCategories();
      setActiveCategories([[...res.data]]);
    };
    initialize();
  }, []);

  const closeModal = (): void => {
    setVisible(false);
  };

  console.log(activeCategories);

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
      } else {
        setCategory!(selectedCategories.current[selectedCategories.current.length - 1]);
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
    <View {...props}>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}
        onPress={openModal}
      >
        <Text style={{ marginRight: 15 }} size="heading">
          {finalSelection.current ?? 'Valitse kategoria'}
        </Text>
        <AntDesign name="caretdown" size={15} color="black" />
      </Pressable>
      <Modal onDismiss={closeModal} visible={visible}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            paddingVertical: 12
          }}
        >
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="md-chevron-back-sharp" size={24} color="black" />
          </TouchableOpacity>
          <Text size="subheading" weight="bold">
            Valitse kategoria
          </Text>
          <Ionicons name="md-chevron-back-sharp" size={24} color="black" style={{ height: 0 }} />
        </View>
        <View>
          {activeCategories
            ? activeCategories[activeCategories.length - 1].map(
                (category): JSX.Element => (
                  <View key={category.id}>
                    <Line />
                    <TouchableOpacity
                      key={category.name}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly'
                      }}
                      onPress={(): void => onCategoryPress(category)}
                    >
                      <AntDesign style={{ height: 0 }} name="caretright" size={16} color="black" />
                      <Text style={{ marginVertical: 12 }} align="center" size="subheading">
                        {category.name}
                      </Text>
                      <AntDesign
                        style={category.subcategories.length === 0 ? { height: 0 } : null}
                        name="caretright"
                        size={16}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                )
              )
            : null}
        </View>
      </Modal>
    </View>
  );
};

export default CategoryPicker;
