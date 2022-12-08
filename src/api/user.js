import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export function getInfo(userId) {
  const data = { userId: userId}
  return request({
    url: '/user/get',
    method: 'post',
    data
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
