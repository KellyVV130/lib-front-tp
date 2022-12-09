import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  console.log('are you shit')
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = permissionRoles.includes(roles)
    console.log(permissionRoles, roles, 'check')
    return hasPermission
  } else {
    console.log('???')
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
