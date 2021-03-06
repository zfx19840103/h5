import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function gqtraisingapi() {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/bytemoon_self/config`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}
export function loginPost(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/login`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}

