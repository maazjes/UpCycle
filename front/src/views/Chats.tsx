import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import useChats from 'hooks/useChats';
import Container from 'components/Container';
import Text from 'components/Text';
import { dpw, formatDate } from 'util/helpers';
import Line from 'components/Line';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Button from 'components/Button';
import MenuModal from 'components/MenuModal';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { updateChatInfo } from 'services/chatInfo';
import { editChat } from 'reducers/chats';
import { MenuModalItems, UserScreen } from '../types';
import Loading from '../components/Loading';
import UserBar from '../components/UserBar';
import theme from '../styles/theme';

const styles = StyleSheet.create({
  noFavorites: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  noChatsText: {
    marginVertical: dpw(0.03),
    textAlign: 'center'
  },
  displayNameStyle: {
    fontFamily: theme.fonts.bold,
    marginBottom: dpw(0.01)
  },
  archivedText: {
    alignSelf: 'flex-end'
  }
});

const ItemSeparator = (): JSX.Element => <Line style={{ marginVertical: 11 }} />;

const Chats = ({ navigation }: UserScreen<'StackChats'>): JSX.Element => {
  const [chats, fetchChats] = useChats();
  const [archived, setArchived] = useState(false);
  const [modalItems, setModalItems] = useState<MenuModalItems | undefined>();
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state): string => state.currentUserId!);

  if (!chats) {
    return <Loading />;
  }

  if (chats.data.length === 0) {
    return (
      <Container style={styles.noFavorites}>
        <FontAwesome5 name="sad-cry" size={dpw(0.15)} color="black" />
        <Text style={styles.noChatsText} weight="bold" size="subheading">
          No chats to show
        </Text>
        <Button
          text="Find new items"
          onPress={(): void => {
            navigation.navigate('Search', { screen: 'StackSearch', initial: false });
          }}
        />
      </Container>
    );
  }

  const archiveOrUnarchive = async (chatInfoId: number): Promise<void> => {
    try {
      const found = chats.data.find((chat): boolean => chat.info.id === chatInfoId)!;
      await updateChatInfo(chatInfoId, { archived: !archived });
      const newChat = { ...found, info: { ...found.info, archived: !archived } };
      dispatch(editChat(newChat));
      setModalItems(undefined);
    } catch {}
  };

  return (
    <Container>
      <FlatList
        keyExtractor={(item): string => String(item.id)}
        data={chats.data.filter((chat): boolean =>
          archived ? chat.info.archived : !chat.info.archived
        )}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }): JSX.Element => {
          const otherUser = item.user.id === currentUserId ? item.creator : item.user;
          return (
            <UserBar
              onLongPress={(): void =>
                setModalItems(
                  archived
                    ? {
                        'Unarchive chat': (): Promise<void> => archiveOrUnarchive(item.info.id)
                      }
                    : { 'Archive chat': (): Promise<void> => archiveOrUnarchive(item.info.id) }
                )
              }
              onPress={(): void => {
                navigation.navigate('SingleChat', {
                  userId: otherUser.id,
                  username: otherUser.username
                });
              }}
              displayNameStyle={styles.displayNameStyle}
              profilePhotoSize={dpw(0.128)}
              user={otherUser}
              extra={
                <Text>{item.lastMessage.images?.length > 0 ? 'Photo' : item.lastMessage.text}</Text>
              }
              itemRight={
                <Text style={{ alignSelf: 'flex-start', marginTop: 1 }} color="grey">
                  {formatDate(item.lastMessage.createdAt)}
                </Text>
              }
            />
          );
        }}
        onEndReached={fetchChats}
        onEndReachedThreshold={0.2}
      />
      {modalItems && (
        <MenuModal
          visible={!!modalItems}
          items={modalItems}
          onDismiss={(): void => setModalItems(undefined)}
        />
      )}
      <TouchableOpacity
        style={{ alignSelf: 'flex-end' }}
        onPress={(): void => setArchived(!archived)}
      >
        <View style={{ flexDirection: 'row' }}>
          {!archived && (
            <>
              <Text size="subheading">Archived</Text>
              <Ionicons name="md-chevron-forward-sharp" size={24} color="black" />
            </>
          )}
          {archived && (
            <>
              <Ionicons name="md-chevron-back-sharp" size={24} color="black" />
              <Text size="subheading">Unarchived</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Container>
  );
};

export default Chats;
