import axios from 'axios';

class ApiService {
  constructor() {
    this.defaultConfig = {
      method: 'GET',
      url: '',
      headers: {
      },
      data: null,
      params: null,
    };

    this.config = { ...this.defaultConfig };
  }

  resetConfig() {
    this.config = {
      ...this.defaultConfig,
      headers: { ...this.defaultConfig.headers },
    };
  }

  setUrl(url) {
    this.config.url = url;
    return this;
  }

  setMethod(method) {
    this.config.method = method.toUpperCase();
    return this;
  }

  setHeaders(headers) {
    this.config.headers = {
      ...this.config.headers,
      ...headers,
    };
    return this;
  }

  setData(data) {
    if (data !== undefined) {
      this.config.data = data;

      if (data instanceof FormData) {
        delete this.config.headers["Content-Type"];
      }
      else if (data instanceof Blob || data instanceof Uint8Array) {
        this.config.headers["Content-Type"] = "application/gzip";
      }
      else {
        this.config.headers["Content-Type"] =
          this.config.headers["Content-Type"] || "application/json";
      }
    }

    return this;
  }


  setParams(params) {
    this.config.params = params;
    return this;
  }

  async send(token = '') {
    try {
      const finalHeaders = {
        ...this.config.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await axios({
        ...this.config,
        headers: finalHeaders,
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        window.location.reload();
        localStorage.setItem('logout', true);
      }
      const errorData =
        error.response?.data ||
        error.message ||
        'Error desconocido en la solicitud';

      throw errorData;
    } finally {
      this.resetConfig();
    }
  }
}

export const apiService = new ApiService();