import { PostPage } from '@shared/types';
import { addPostPage } from 'reducers/profilePosts';
import { GlobalState } from 'types';
import { getPosts } from '../services/posts';
import { useAppDispatch, useAppSelector } from './redux';

const useProfilePosts = (): [PostPage | null, typeof fetchPosts] => {
  const globalState = useAppSelector(
    ({ profilePosts, currentUserId }): Pick<GlobalState, 'currentUserId' | 'profilePosts'> => ({
      profilePosts,
      currentUserId
    })
  );
  const dispatch = useAppDispatch();
  const postPage = globalState.profilePosts;
  const currentUserId = globalState.currentUserId!;

  const fetchPosts = async (): Promise<void> => {
    const res = await getPosts({
      limit: 6,
      offset: postPage?.offset || 0,
      userId: currentUserId
    });
    dispatch(addPostPage(res.data));
  };

  return [postPage, fetchPosts];
};

export default useProfilePosts;
