let body = $response.body

console.log(body)

Date.prototype.format = function (fmt) {
  var o = {
    'y+': this.getFullYear(),
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S+': this.getMilliseconds(),
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      if (k == 'y+') {
        fmt = fmt.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length))
      } else if (k == 'S+') {
        var lens = RegExp.$1.length
        lens = lens == 1 ? 3 : lens
        fmt = fmt.replace(RegExp.$1, ('00' + o[k]).substr(('' + o[k]).length - 1, lens))
      } else {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
  }
  return fmt
}

function getDay(offest = 0) {
  const _day = new Date()
  _day.setDate(_day.getDate() + offest)
  return _day.format('yyyy-MM-dd')
}

try {
  console.log('try >>>')

  let jsonBody = JSON.parse(body)
  let results = jsonBody?.msg?.data

  if (results && Array.isArray(results)) {
    if (!results.length) {
      console.log('[Error] length = 0')
      const temp = { result: '阴性', name: '人民医院', queryTime: '2022-11-11 20:10:17', time: '2022-11-11 18:19:19', sampleTime: '2022-11-11 10:05:57' }
      results = [temp]
    }

    jsonBody.msg.data = results.map((item, index) => {
      const offest = getDay(-(index + 1))
      const replace = JSON.stringify(item).replace(/202.-..-.. ../g, `${offest} 23`)
      return JSON.parse(replace)
    })
  } else {
    console.log('[Error] results != Array')
    body = body
  }

  body = JSON.stringify(jsonBody)
} catch (error) {
  console.log('catch >>>')

  body = body.replace(/202.-..-../g, getDay(-1))
}

console.log(body)

$done({ body })
