import request from '@/utils/request'

export function fetchList(query) {
  const params = {
    id: query.id,
    book_name: query.book_name,
    page: query.page - 1,
    num_page: query.limit,
    sort: query.sort.substr(1),
    order: query.sort[0]==='+'?'ascending':'descending'
  }
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: params
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
