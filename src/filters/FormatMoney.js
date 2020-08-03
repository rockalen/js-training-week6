// money，千分號轉換
var FormatMoney = function (num) {
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return '$' + parts.join('.')
}

export default FormatMoney
