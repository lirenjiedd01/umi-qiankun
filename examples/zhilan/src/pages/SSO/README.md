### SSO 链接测试生成

打开 [runkit](https://npm.runkit.com/jsonwebtoken)

```js
var jwt = require("jsonwebtoken")
// 需要跳转的链接
var service_addr = 'http://localhost:8001' // 请替换成目标服务器地址
var pathname = '/sso' // sso地址
var back_url = '/' // sso 授权访问的前端页面 url
var app_id = 'cbbb433ccf494486830e901e0f9640c5' // app_id
var sercret_key = 'b192ac78a02f490593bf12ca20836413' // 秘钥

// 生成 token 的 payload
var payload = {
  "sub": "1234567890",
  "name": "scrm",
  "iat": parseInt(Date.now() / 1000, 10),
  "account": "kuco",
  "phone": ""
}
var token = jwt.sign(payload, sercret_key, {
  "algorithm": "HS256"
})
const query = `token=${encodeURIComponent(token)}&back_url=${encodeURIComponent(back_url)}&app_id=${app_id}`

var url = `${service_addr}${pathname}?${query}`

console.log(url)

```
