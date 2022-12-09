import request from '@/utils/request'
import {parseTime} from "@/utils";

export function fetchList(query) {
  let data = {}
  data = {
      id: query.id,
      resourceName: query.resourceName,
      author: query.author,
      pageNum: query.page,
      pageSize: query.limit,
      sort: query.sort && query.sort.substr(1),
      order: query.sort && query.sort[0]==='+'?'asc':'desc'
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
  data.publishDate = parseTime(data.publishDate, '{y}-{m}-{d}')
  data.access = data.access+''
  return request({
    url: '/resource/add',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  data.publishDate = parseTime(data.publishDate, '{y}-{m}-{d}')
  data.access = data.access+''
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

