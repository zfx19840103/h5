import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function stockList(data) { // 工区列表
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/stock-list`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}
