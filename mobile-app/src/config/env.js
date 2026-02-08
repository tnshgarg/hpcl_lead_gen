// API Base URL Configuration
// using local IP from successful Expo session
const IP_ADDRESS = '172.20.10.2';

const API_BASE_URL = `http://${IP_ADDRESS}:5001/api`;
const WIL_API_URL = `http://${IP_ADDRESS}:3000`; // WIL typically runs on 3000

export default {
  API_BASE_URL,
  WIL_API_URL,
};
