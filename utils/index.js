// 2018-03-15
const myBase = {
  // 日期相关
  aboutDate: {
    /**
     * 获取每月多少天
     * @param {*} param eg: '2023-2'， 3
     * @returns 
     */
    getDaysOfMonth: (param) => {
      if(!param) return 0
      const m = param + ''
      let year = ''
      let month = ''
      if(m.length>2 && m.includes('-') && m.split('-')[0].length===4) {
        year = Number(m.split('-')[0])
        month = Number(m.split('-')[1])
      }else {
        year = 2023 // 没传年的话，2月份用28天，防止出错
        month = Number(m)
      }
      // 能够被4整除且不能整除100的为闰年
      const daysMap = {1: 31, 2: (year%4===0 && year%100!==0) ? 29 : 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}
      return daysMap[month]
    },

    /**
     * 一个日期的前多少天或后多少天是什么日期
     * @param {Number} count 加减的天数
     * @param {String} fromDate 基于哪个日期开始计算，非必填。eg：2022-04-05
     * @returns 
     */
    timeForMat: (count, fromDate) => {
      const time1 = fromDate ? new Date(fromDate) : new Date();
      time1.setTime(time1.getTime());
      const Y1 = time1.getFullYear();
      const M1 = ((time1.getMonth() + 1) >= 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1));
      const D1 = (time1.getDate() >= 10 ? time1.getDate() : '0' + time1.getDate())
      const dateFrom = Y1 + '-' + M1 + '-' + D1;// 当前时间

      const time2 = fromDate ? new Date(fromDate) : new Date();
      time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count));
      const Y2 = time2.getFullYear();
      const M2 = ((time2.getMonth() + 1) >= 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1));
      const D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate());
      const dateTo = Y2 + '-' + M2 + '-' + D2;// 之前的7天或者30天
      return {
          dateFrom: dateFrom,
          dateTo: dateTo
      }
    },


  },

  // 获取url参数
  getUrlParams: (url) => {
    if(!url.includes('=')) return {}
    const u = url.includes('?') ? url.split('?')[1] : url
    const arr = u.split('&')
    const obj = {}
    arr.forEach(item => {
      obj[item.split('=')[0]] = item.split('=')[1]
    })
    return obj
  },

  // 判断字段是否为空
  isEmpty: (fieldVal) => {
    return fieldVal===undefined || fieldVal===null || fieldVal===''
  },

  // 字段为空时格式化
  formatEmpty: (fieldVal, target = '-') => {
    const isEmpty = fieldVal===undefined || fieldVal===null || fieldVal===''
    if(isEmpty) return target
    else return fieldVal
  },

  // 判断字段类型
  getType: (param) => {
    // Object.prototype.toString.call(2); // "[object Number]"
    // Object.prototype.toString.call(""); // "[object String]"
    // Object.prototype.toString.call(true); // "[object Boolean]"
    // Object.prototype.toString.call(undefined); // "[object Undefined]"
    // Object.prototype.toString.call(null); // "[object Null]"
    // Object.prototype.toString.call(Math); // "[object Math]"
    // Object.prototype.toString.call({}); // "[object Object]"
    // Object.prototype.toString.call([]); // "[object Array]"
    // Object.prototype.toString.call(function () {}); // "[object Function]"
    const map = {
      "[object Number]": 'number',
      "[object String]": 'string',
      "[object Boolean]": 'boolean',
      "[object Undefined]": 'undefined',
      "[object Null]": 'null',
      "[object Math]": 'math',
      "[object Object]": 'object',
      "[object Array]": 'array',
      "[object Function]": 'function',
    }
    const type = Object.prototype.toString.call(param)
    return map[type]
  },

  //滚动到底部, el为选择器 eg :'#scrollDom'
  scrollToEnd: (el) => {
    document.querySelector(el).scrollTo(0, 9999999999);
  },

  // 去除字符串中的所有空格
  trimAll: (str) => {
    if(myBase.getType(str) === 'string') {
      // replaceAll有兼容性
      return str.replace( new RegExp( " ", "gm" ),  "" )
    }else {
      return str
    }
  },

  // 获取随机数
  getRandom: (range) => {
    var str = "", arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    for(var i = 0; i < range; i++) {
      str += arr[Math.round(Math.random() * (arr.length - 1))];
    }
    return str;
  },

  // 防抖
  debounce: (fn, wait, immediate) => {
    return function () {
      if(timer) clearTimeout(timer)
      if(immediate) {
        let callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, wait)
        if(callNow) fn.call(this, arguments)
      }else {
        timer = setTimeout(() => {
          fn.call(this, arguments)
        }, wait)
      }
    }
  },

  // 节流
  throttle: (fn, wait) => {
    let timer = null
    return function () {
      if(!timer) {
        timer = setTimeout(() => {
          fn()
          clearTimeout(timer)
          timer = null
        }, wait);
      }
    }
  },

  // 深拷贝
  deepClone: (obj) => {
  	if(obj === null) return obj
    if(typeof obj !== 'object') return obj
    let result = obj instanceof Array ? [] : {}
    for(let key in obj) {
      if(obj.hasOwnProperty(key)) result[key] = myBase.deepClone(obj[key])
    }
    return result
  },

  // 

}