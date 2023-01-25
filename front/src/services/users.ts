import axios, { AxiosResponse } from 'axios';

const baseUrl = 'http://192.168.0.104:8080/api/users';

interface RegistrationResponse {
  username: string;
  name: string;
}
const register = async (username: string, name: string, password: string):
Promise<AxiosResponse<RegistrationResponse>> => {
  try {
    const response = await axios.post(`${baseUrl}`, { username, name, password });
    return response;
  } catch (e) {
    throw new Error(`Getting posts failed ${e}`);
  }
};

export default { register };
