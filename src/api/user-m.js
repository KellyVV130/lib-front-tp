import request from '@/utils/request'

// 增
export function createUser(params) {
  return request({
    url: '/api/user/createUser',
    method: 'post',
    params
  })
}

// 删
export function deleteUser(params) {
  return request({
    url: '/api/user/deleteUserById',
    method: 'get',
    params
  })
}

// 改
export function updateUser(params) {
  return request({
    url: '/api/user/updateUser',
    method: 'post',
    params
  })
}

// 查
// 查询第几页用户列表
export function getUsers(params) {
  return request({
    url: '/user/all',
    method: 'get',
    params
  })
}

// 查询某用户信息
export function getUserInfo(params) {
  return request({
    urls: '/user/get',
    method: 'get',
    params
  })
}

