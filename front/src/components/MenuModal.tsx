import { Searchbar } from 'react-native-paper';
import { TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { MenuModalProps } from 'types';
import Modal from './Modal';
import Text from './Text';
import Line from './Line';

const MenuModal = ({ items, searchbar = false, ...props }: MenuModalProps): JSX.Element | null => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredItems = Object.keys(items).filter((key): boolean =>
    key.toLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  const renderItem = ({ item, index }: { item: string; index: number }): JSX.Element =>
    filteredItems.length > 0 ? (
      <TouchableOpacity key={item} style={{ flex: 1 }} onPress={items[item]}>
        {index > 0 ? <Line style={{ borderColor: '#161716' }} /> : null}
        <Text style={{ padding: 15 }} align="center" size="subheading">
          {item}
        </Text>
      </TouchableOpacity>
    ) : (
      <Text style={{ padding: 15 }} align="center" size="subheading">
        Ei hakutuloksia
      </Text>
    );

  return (
    <Modal {...props}>
      {searchbar && (
        <>
          <Searchbar
            style={[
              {
                borderRadius: 0,
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                elevation: 0,
                shadowOpacity: 0,
                borderWidth: 0,
                shadowColor: 'transparent'
              }
            ]}
            inputStyle={{
              borderRadius: 0,
              borderTopStartRadius: 10,
              borderTopEndRadius: 10,
              elevation: 0,
              shadowOpacity: 0,
              borderWidth: 0,
              shadowColor: 'transparent'
            }}
            placeholder="Hakusana"
            onChangeText={(query: string): void => setSearchQuery(query)}
            value={searchQuery}
          />
          <Line style={{ borderColor: '#161716' }} />
        </>
      )}

      <FlatList data={searchbar ? filteredItems : Object.keys(items)} renderItem={renderItem} />
    </Modal>
  );
};

export default MenuModal;
