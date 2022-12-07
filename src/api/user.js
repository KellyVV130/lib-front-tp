import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/auth/login',
    method: 'post',
    params: params
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function register(param) {
  return request({
    url: '/user/register',
    method: 'post',
    param
  })
}
