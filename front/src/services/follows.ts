import { AxiosResponse } from 'axios';
import { Follow, FollowPage, NewFollowBody } from '@shared/types';
import { PaginationQuery } from 'types';
import { addQuery } from 'util/helpers';
import api from '../util/axiosInstance';

const createFollow = (body: NewFollowBody): Promise<AxiosResponse<Follow>> =>
  api.post<Follow>('follows', body);

const removeFollow = (followId: number): Promise<AxiosResponse<undefined>> =>
  api.delete<undefined>(`follows/${followId}`);

function getFollowers(userId: string, query: PaginationQuery): Promise<AxiosResponse<FollowPage>> {
  const finalQuery = addQuery(`users/${userId}/followers`, query);
  return api.get<FollowPage>(finalQuery);
}

function getFollowing(userId: string, query: PaginationQuery): Promise<AxiosResponse<FollowPage>> {
  const finalQuery = addQuery(`users/${userId}/following`, query);
  return api.get<FollowPage>(finalQuery);
}

export { createFollow, removeFollow, getFollowers, getFollowing };
