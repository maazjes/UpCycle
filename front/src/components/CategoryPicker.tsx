import { View, TouchableOpacity, ViewProps, StyleSheet } from 'react-native';
import { Category } from '@shared/types';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { getCategories } from 'services/categories';
import { conditionalUseField, dpw } from 'util/helpers';
import { arrayMoveImmutable } from 'array-move';
import Modal from './Modal';
import Line from './Line';
import Text from './Text';

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pickerText: {
    marginRight: dpw(0.03)
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center'
  },
  categoryText: {
    marginVertical: dpw(0.04)
  },
  hidden: {
    height: 0
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: dpw(0.04)
  },
  caretRight: {
    marginRight: dpw(0.06),
    position: 'absolute',
    right: 0
  },
  hitSlop: {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10
  }
});

interface CategoryPickerProps extends ViewProps {
  search?: boolean;
  createPost?: boolean;
  setCategory?: React.Dispatch<React.SetStateAction<number | undefined>>;
  initialCategory?: string;
}

const CategoryPicker = ({
  search = false,
  createPost = false,
  setCategory = undefined,
  initialCategory = undefined,
  ...props
}: CategoryPickerProps): JSX.Element => {
  const [activeCategories, setActiveCategories] = useState<Category[][] | null>(null);
  const [visible, setVisible] = useState(false);
  const selectedCategories = useRef<Category['id'][]>([]);
  const [, , helpers] = conditionalUseField<number[]>(createPost, 'categories');
  const finalSelection = useRef<string | undefined>(initialCategory);

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      try {
        const res = await getCategories();
        const allCategory = { name: `All`, id: -1, subcategories: [], depth: 0 };
        const miscIndex = res.data.findIndex((c): boolean => c.name.startsWith('Misc'));
        const categories = arrayMoveImmutable(res.data, miscIndex, res.data.length);
        if (search) {
          setActiveCategories([[allCategory, ...categories]]);
        } else {
          setActiveCategories([[...categories]]);
        }
      } catch {}
    };
    initialize();
  }, []);

  const closeModal = (): void => {
    setVisible(false);
  };

  const onCategoryPress = (category: Category): void => {
    selectedCategories.current.push(category.id);
    const miscIndex = category.subcategories.findIndex((c): boolean => c.name.startsWith('Misc'));
    const subCategories = arrayMoveImmutable(
      category.subcategories,
      miscIndex,
      category.subcategories.length
    );
    if (category.subcategories.length > 0) {
      if (search) {
        const allCategory = {
          name: `All ${category.name}`,
          id: category.id,
          subcategories: [],
          depth: category.depth + 1
        };
        setActiveCategories([...activeCategories!, [allCategory, ...subCategories]]);
      } else {
        setActiveCategories([...activeCategories!, subCategories]);
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
      <TouchableOpacity style={styles.pickerContainer} onPress={openModal}>
        <Text style={styles.pickerText} size="heading">
          {finalSelection.current ?? 'Category'}
        </Text>
        <AntDesign name="caretdown" size={dpw(0.045)} color="black" />
      </TouchableOpacity>
      <Modal onDismiss={closeModal} visible={visible}>
        <View style={styles.modalHeader}>
          <TouchableOpacity hitSlop={styles.hitSlop} onPress={onBackPress}>
            <Ionicons name="md-chevron-back-sharp" size={dpw(0.065)} color="black" />
          </TouchableOpacity>
          <Text size="subheading" weight="bold">
            Select category
          </Text>
          <Ionicons name="md-chevron-back-sharp" size={dpw(0.065)} style={styles.hidden} />
        </View>
        <View>
          {activeCategories
            ? activeCategories[activeCategories.length - 1].map(
                (category): JSX.Element => (
                  <View key={category.id}>
                    <Line />
                    <TouchableOpacity
                      key={category.name}
                      style={styles.category}
                      onPress={(): void => onCategoryPress(category)}
                    >
                      <View style={styles.category}>
                        <Text style={styles.categoryText} align="center" size="subheading">
                          {category.name}
                        </Text>
                        {category.subcategories.length > 0 && (
                          <AntDesign
                            style={styles.caretRight}
                            name="caretright"
                            size={16}
                            color="black"
                          />
                        )}
                      </View>
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
