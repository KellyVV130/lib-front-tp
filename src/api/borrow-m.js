import request from '@/utils/request'

export function fetchRecordList(query) {
  const data = {
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
    userId: form.user_id,
    resourceId: form.book_id,
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

export function deleteRecord(id) {
  return request({
    url: '/record/delete',
    method: 'get',
    params: {recordId: id}
  })
}

export function borrowAPI(id) {
  let data = {recordId: id}
  return request({
    url: '/record/borrow',
    method: 'post',
    data
  })
}

export function returnAPI(id) {
  let data = {recordId: id}
  return request({
    url: '/record/return',
    method: 'post',
    data
  })
}
