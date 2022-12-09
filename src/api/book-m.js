import request from '@/utils/request'

export function fetchList(query) {
  let data = {}
  if (JSON.stringify(query)!=='{}') {
      data = {
      id: query.id,
      resourceName: query.resourceName,
      author: query.author,
      pageNum: query.page,
      pageSize: query.limit,
      sort: query.sort.substr(1),
      order: query.sort[0]==='+'?'asc':'desc'
    }
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
  data.publishDate = data.publishDate.split('T', 1)[0]
  delete data.category
  return request({
    url: '/resource/add',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  data.publishDate = data.publishDate.split('T', 1)[0]
  return request({
    url: '/resource/update',
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

