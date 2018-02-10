# deerberry.js

## Usage

### Ajax

>XMLHttpRequest

<details>

<summary>Examples</summary>

```javascript
db.Ajax({

    //必填项
    url: "url",

    /**
     * 可选项
     * default value : "GET"
     * method
     */
    type: 'POST',

    /**
     * 可选项
     * default value : {}
     * post data
     */
    data: {
        key1: 'value1',
        key2: 'value2'
    },

    /**
     * 可选项
     * default value : 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
     */
    headers:{
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json'
    }

    /**
     * 可选项
     * default value : null
     * jsonp回调函数，回调函数名为"jsonpCallbak"
     * 可以设置为合法的字符串。添加此option会使用jsonp请求跨域数据
     */
    jsonp: 'jsonpCallbackFunctionName',

    success: function (res) {},
    error: function (error) {}
});
```

</details>

### requireJs

>动态加载JS文件

```js
/**
 * @param {String} url 文件路径
 * @param {Function} callback
 */
db.requireJs(url, function(){})
```

### getLocalIpInfo

>获取本地IP信息

```js
/**
 * @param {String} ip
 * @param {Function} callback
 */
db.getLocalIpInfo(ip, function(res){
    console.log(res)
})
```

### pullRefresh

>下拉刷新

<details>

<summary>Examples</summary>

```css
/* pull refresh module */
.pullRefresh__scroller .pullRefresh__loading {
  height: 80px;
  line-height: 80px;
  text-align: center;
  width: 100%;
  background-color: #fff;
  color: blue;
}

.pullRefresh__scroller {
  -webkit-overflow-scrolling: touch;
}
```

```html
<div id="scroll_container" class="pullRefresh__scroller">
    <!-- loading dom -->
    <div class="pullRefresh__loading"></div>

    <!-- list dom-->
    <ul></ul>
</div>
```

```js
/**
 * @param {Object}
*/
db.pullRefresh({
    container: "#scroll_container", //外层的容器
    next: function (e) {
        var that = this;

        // callback function could be code there

        that.back.call();
    }
});
```

</details>

### scrolltobottom

>上拉加载更多

```js
/**
 * @param {Function} callback
*/
db.scrolltobottom(callback)
```

### historyLength

>历史列表元素数量

```js
/**
 * @return {Int}
*/
db.historyLength()
```

### redirectHtml

>重定向页面，不添加新的浏览器历史记录

```js
/**
 * @param {String} url
*/
db.redirectHtml(url)
```

[⬆ Back to top](#usage)