import request from '@/utils/request'

export function fetchList(query) {
  const data = {
    id: query.id,
    resourceName: query.resourceName,
    author: query.author,
    pageNum: query.page,
    pageSize: query.limit,
    sort: query.sort.substr(1),
    order: query.sort[0]==='+'?'asc':'desc'
  }
  return request({
    url: '/resource/public/list',
    method: 'post',
    data
  })
}

// 预约借书
export function borrowBook(data) {
  return request({
    url: '/user/borrow',
    method: 'post',
    data
  })
}
