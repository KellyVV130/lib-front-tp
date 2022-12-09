import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export function getInfo(userId) {
  const params = { userId: userId}
  return request({
    url: '/user/get',
    method: 'get',
    params
  })
}

export function logout(id) {
  const data = { userId: id}
  return request({
    url: '/auth/logout',
    method: 'post',
    data
  })
}

export function register(param) {
  return request({
    url: '/user/register',
    method: 'post',
    param
  })
}
