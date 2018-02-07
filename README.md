# deerberry.js

## Usage

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
pullRefresh({
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
scrolltobottom(callback)
```

### historyLength

>历史列表元素数量

```js
/**
 * @return {Int}
*/
historyLength()
```

### redirectHtml

>重定向页面，不添加新的浏览器历史记录

```js
/**
 * @param {String} url
*/
redirectHtml(url)
```

[⬆ Back to top](#Usage)