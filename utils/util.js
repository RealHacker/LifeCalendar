function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getCurrentMonthIndexSince(d){
   var birthDate = new Date(d);
   var now = new Date();
   var yearDelta = now.getFullYear()-birthDate.getFullYear();
   return (yearDelta-1)*12 + now.getMonth()+1 + (12-birthDate.getMonth())
}

module.exports = {
  formatTime: formatTime,
  getCurrentMonthIndexSince: getCurrentMonthIndexSince
}
