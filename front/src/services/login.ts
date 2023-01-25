import axios, { AxiosResponse } from 'axios';

const baseUrl = 'http://192.168.0.104:8080/api/login';

interface LoginResponse {
  username: string;
  name: string;
  token: string;
}
const login = async (username: string, password: string):
Promise<AxiosResponse<LoginResponse>> => {
  try {
    const response = await axios.post(`${baseUrl}`, { username, password });
    return response;
  } catch (e) {
    throw new Error(`Getting posts failed ${e}`);
  }
};

export default { login };
