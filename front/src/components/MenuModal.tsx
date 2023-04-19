import { Searchbar } from 'react-native-paper';
import { TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';
import { MenuModalProps } from 'types';
import { dpw } from 'util/helpers';
import Modal from './Modal';
import Text from './Text';
import Line from './Line';

const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 0,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 0,
    shadowColor: 'transparent'
  },
  searchBarInput: {
    borderRadius: 0,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 0,
    shadowColor: 'transparent'
  }
});

const MenuModal = ({ items, searchbar = false, ...props }: MenuModalProps): JSX.Element | null => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredItems = Object.keys(items).filter((key): boolean =>
    key.toLowerCase().includes(searchQuery.toLocaleLowerCase())
  );
  const renderItem = ({ item, index }: { item: string; index: number }): JSX.Element => (
    <>
      {index > 0 ? <Line style={{ borderColor: '#161716' }} /> : null}
      <TouchableOpacity key={item} style={{ flex: 1 }} onPress={items[item]}>
        <Text style={{ padding: dpw(0.04) }} align="center" size="subheading">
          {item}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <Modal {...props}>
      {searchbar && (
        <>
          <Searchbar
            style={styles.searchBar}
            inputStyle={styles.searchBarInput}
            placeholder="Keyword"
            onChangeText={(query: string): void => setSearchQuery(query)}
            value={searchQuery}
          />
          <Line style={{ borderColor: '#161716' }} />
          {filteredItems.length === 0 && (
            <Text style={{ padding: dpw(0.04) }} align="center" size="subheading">
              Ei hakutuloksia
            </Text>
          )}
        </>
      )}
      <FlatList data={searchbar ? filteredItems : Object.keys(items)} renderItem={renderItem} />
    </Modal>
  );
};

export default MenuModal;
