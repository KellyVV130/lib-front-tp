import request from '@/utils/request'

export function fetchList(query) {
  const data = {
    id: query.id,
    resourceName: query.book_name,
    resourceId: query.book_id,
    userId: query.user_id,
    pageNum: query.page,
    pageSize: query.limit,
    sort: query.sort.substr(1),
    order: query.sort[0]==='+'?'asc':'desc'
  }
  return request({
    url: '/record/get',
    method: 'post',
    data
  })
}

export function createRecord(form) {
  let data = {
    userId: form.user.id,
    resourceId: form.resource.resourceId,
    startDate: form.startDate,
    duringTime: form.duringTime
  }
  return request({
    url: '/user/borrow',
    method: 'post',
    data
  })
}

export function updateRecord(form) {
  let data = {
    recordId: form.recordId,
    postponeTime: form.duringTime,
  }
  return request({
    url: '/user/postpone',
    method: 'post',
    data
  })
}
