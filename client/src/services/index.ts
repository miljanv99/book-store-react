import axios from 'axios';

const domain = 'http://localhost:8000';

const URL = axios.create({
  baseURL: domain,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  URL,
  domain
}

