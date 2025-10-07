import axios from 'axios';
class ApiService {
  constructor() {
    this.defaultConfig = {
      method: 'GET',
      url: '',
      headers: {
        'Content-Type': 'application/json',
      },
      data: undefined,
      params: null,
    };
    this.config = { ...this.defaultConfig };
  }

  resetConfig() {
    this.config = { ...this.defaultConfig };
  }

  setUrl(url) {
    this.config.url = url;
    return this;
  }

  setMethod(method) {
    this.config.method = method;
    return this;
  }

  setHeaders(headers) {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  setData(data) {
    if (data !== null) {
      this.config.data = data;
    }
    return this;
  }

  setParams(params) {
    this.config.params = params;
    return this;
  }

  async send(token = '') {
    try {
      if (token) {
        this.config.headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await axios({
        ...this.config,
        params: this.config.params,
      });
      return response.data;
    } catch (error) {
    //   if (error.response?.status === 403) {
    //     window.location.reload();
    //     localStorage.setItem('logout', true);
    //   } else {
        throw error.response?.data || 'Error desconocido';
    //   }
    } finally {
      this.resetConfig();
    }
  }
}

export const apiService = new ApiService();
