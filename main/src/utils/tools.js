import crypto from 'crypto'
const os = require('os')
export function encryptVal(val) {
    // 加密
    if (!val) return
    const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8')
    const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8')
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
    var crypted = cipher.update(val, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}
export function decryptVal(val) {
    // 解密
    const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8')
    const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8')
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    var str = decipher.update(val, 'hex', 'utf8')
    str += decipher.final('utf8')
    return str
}
export function deepClone(target) {
    // 定义一个变量
    let result
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
        // 如果是一个数组的话
        if (Array.isArray(target)) {
            result = [] // 将result赋值为一个数组，并且执行遍历
            for (let i in target) {
                // 递归克隆数组中的每一项
                result.push(deepClone(target[i]))
            }
            // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
            result = null
            // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if (target.constructor === RegExp) {
            result = target
        } else {
            // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {}
            for (let i in target) {
                result[i] = deepClone(target[i])
            }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
        result = target
    }
    // 返回最终结果
    return result
}
export function randomString(e) {
    // 随机字符串
    e = e || 32
    var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        a = t.length,
        n = ''
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
    return n
}
export function getLabel(value, dist) {
    let res = dist.filter(item => item.value === value)[0]
    if (res) {
        return res.label
    } else {
        return ''
    }
}
// 将时间戳处理为字符串
export function handleDateToString(time, showHMS) {
    if (!time) {
        return '--'
    }
    let date
    if (time instanceof Date) {
        date = time
    } else {
        date = new Date(time)
    }
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    hour = hour === 0 ? '00' : hour < 10 ? '0' + hour : hour
    minute = minute === 0 ? '00' : minute < 10 ? '0' + minute : minute
    second = second === 0 ? '00' : second < 10 ? '0' + second : second
    return year + '-' + month + '-' + day + (showHMS ? ' ' + hour + ':' + minute + ':' + second : '')
}
// 将时间戳处理为字符串
export function handleDateTimeToString(time) {
    if (!time) {
        return '--'
    }
    let date
    if (time instanceof Date) {
        date = time
    } else {
        date = new Date(time)
    }
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    hour = hour === 0 ? '00' : hour < 10 ? '0' + hour : hour
    minute = minute === 0 ? '00' : minute < 10 ? '0' + minute : minute
    second = second === 0 ? '00' : second < 10 ? '0' + second : second
    return hour + ':' + minute + ':' + second
}
export function resolveTime(time) {
    let str = handleDateToString(time, true)
    return str.split(' ')[0] + ' ' + str.split(' ')[1]
}
export function getCurrentIp() {
    let localhost = ''
    try {
        const network = os.networkInterfaces()
        network[Object.keys(network)[0]].forEach(function(details) {
            if (localhost === '' && details.family === 'IPv4' && !details.internal) {
                localhost = details.address
                return
            }
        })
    } catch (e) {
        localhost = '127.0.0.1'
    }
    return localhost
}
export function isIframe(path) {
    // let reg = new RegExp(`${window.globalDataTemp.microApp5100}/`)
    return path.startsWith('http')
}
