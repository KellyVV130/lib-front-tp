import request from '@/utils/request'

// 查借阅列表
export function getBorrowList(data) {
  return request({
    url: '/record/get',
    method: 'post',
    data
  })
}

// 延期
export function postpone(data) {
  return request({
    url: '/user/postpone',
    method: 'post',
    data
  })
}
