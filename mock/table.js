const Mock = require('mockjs')

const data = Mock.mock({
  'items|10': [{
    id: '@id',
    username: '@sentence(1)',
    'role|1': ['user', 'staff'],
    password: '@sentence(1)',
    createTime: '@datetime'

    // pageviews: '@integer(300, 5000)'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
