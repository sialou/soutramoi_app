import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

import { environment } from 'src/environments/environment';

export type HttpOptions = AxiosRequestConfig;

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private client: AxiosInstance;

  constructor() {
    const instance = axios.create();

    instance.defaults.baseURL = environment.apiUrl.trim();
    instance.defaults.headers.common.Accept = 'application/json';
    // instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // instance.defaults.headers.common['Authorization'] = `Bearer ${CONFIG.AUTHORIZATION_TOKEN}`;

    this.client = instance;
  }

  get(url: string, options?: HttpOptions) {
    const req = this.client.get(url, options);
    return this.parseRequest(req);
  }

  post(url: string, params?, options?: HttpOptions) {
    params = params ? this.parse(params) : {};
    const req = this.client.post(url, params, options);

    return this.parseRequest(req);
  }

  put(url: string, params?, options?: HttpOptions) {
    params = params ? this.parse(params) : {};
    const req = this.client.put(url, params, options);

    return this.parseRequest(req);
  }

  delete(url: string, options?: HttpOptions) {
    const req = this.client.delete(url, options);
    return this.parseRequest(req);
  }

  private parseRequest(req: Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      req.then(res => resolve(res.data)).catch(error => {
        if (error.response) {
          reject(error.response.data);
        } else if (error.request) {
          reject(error.request);
        } else {
          reject(error);
        }
      });
    });
  }

  private parse(object: { [key: string]: any }) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));

    return formData;
  }
}
