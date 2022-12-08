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

export function fetchArticle(id) {
  const data = { resourceId: id }
  return request({
    url: '/resource/public',
    method: 'post',
    data
  })
}

export function createArticle(data) {
  delete data.category
  return request({
    url: '/resource/add',
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

export function deleteArticle(id) {
  const data = { resourceId: id }
  return request({
    url: '/resource/delete',
    method: 'post',
    data
  })
}

