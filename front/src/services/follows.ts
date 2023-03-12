import { AxiosResponse } from 'axios';
import { FollowingPage, FollowerPage, Follow } from '@shared/types';
import { PaginationQuery } from 'types';
import { addQuery } from 'util/helpers';
import api from '../util/axiosInstance';

const createFollow = (body: { userId: string }): Promise<AxiosResponse<Follow>> => api.post<Follow>('follows', body);

const removeFollow = (followId: number):
Promise<AxiosResponse<undefined>> => api.delete<undefined>(`follows/${followId}`);

function getFollowers(userId: string, query: PaginationQuery):
Promise<AxiosResponse<FollowerPage>> {
  const finalQuery = addQuery(`users/${userId}/followers`, query);
  return api.get<FollowerPage>(finalQuery);
}

function getFollowing(userId: string, query: PaginationQuery):
Promise<AxiosResponse<FollowingPage>> {
  const finalQuery = addQuery(`users/${userId}/following`, query);
  return api.get<FollowingPage>(finalQuery);
}

export {
  createFollow, removeFollow, getFollowers, getFollowing
};
