import request from '@/utils/request'

// 增
export function createUser(data) {
  return request({
    url: 'user/register',
    method: 'post',
    data
  })
}

// 删
export function deleteUser(data) {
  return request({
    url: 'user/delete',
    method: 'post',
    data
  })
}

// 改
export function updateUser(data) {
  return request({
    url: 'user/update',
    method: 'post',
    data
  })
}

// 查
// 查询第几页用户列表
export function getUsers(data) {
  return request({
    url: '/user/all',
    method: 'post',
    data
  })
}

// 查询某用户信息
export function getUserInfo(data) {
  return request({
    urls: '/user/get',
    method: 'post',
    data
  })
}

