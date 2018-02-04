/**
 * @name deerberry.js
 * @author xqLi 
 */

(function (global, Fun) {
	'use strict';
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = Fun : (global.deerberry = Fun);
}(this, function () {
	
	/**
	 * 下拉刷新
	 * @param {object} option
	 * @function 
	 */
	function pullRefresh(option) {
		var defaults = {
			container: '',
			next: function () {}
		}
		var start,
			end,
			length,
			isLock = false, //是否锁定整个操作
			isCanDo = false, //是否移动滑块
			isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
			hasTouch = 'ontouchstart' in window && !isTouchPad;
		var obj = document.querySelector(option.container);
		var loading = obj.firstElementChild;
		var offset = loading.clientHeight;
		var objparent = obj.parentElement;
		/*操作方法*/
		var fn = {
			//移动容器
			translate: function (diff) {
				obj.style.webkitTransform = 'translate3d(0,' + diff + 'px,0)';
				obj.style.transform = 'translate3d(0,' + diff + 'px,0)';
			},
			//设置效果时间
			setTransition: function (time) {
				obj.style.webkitTransition = 'all ' + time + 's';
				obj.style.transition = 'all ' + time + 's';
			},
			//返回到初始位置
			back: function () {
				fn.translate(0 - offset);
				//标识操作完成
				isLock = false;
			},
			addEvent: function (element, event_name, event_fn) {
				if (element.addEventListener) {
					element.addEventListener(event_name, event_fn, false);
				} else if (element.attachEvent) {
					element.attachEvent('on' + event_name, event_fn);
				} else {
					element['on' + event_name] = event_fn;
				}
			}
		};

		fn.translate(0 - offset);
		fn.addEvent(obj, 'touchstart', start);
		fn.addEvent(obj, 'touchmove', move);
		fn.addEvent(obj, 'touchend', end);
		fn.addEvent(obj, 'mousedown', start)
		fn.addEvent(obj, 'mousemove', move)
		fn.addEvent(obj, 'mouseup', end)

		//滑动开始
		function start(e) {
			if (objparent.scrollTop <= 0 && !isLock) {
				var even = typeof event == "undefined" ? e : event;
				//标识操作进行中
				isLock = true;
				isCanDo = true;
				//保存当前鼠标Y坐标
				start = hasTouch ? even.touches[0].pageY : even.pageY;
				//消除滑块动画时间
				fn.setTransition(0);
				loading.innerHTML = '下拉可以刷新...';
			}
			return false;
		}

		//滑动中
		function move(e) {
			if (objparent.scrollTop <= 0 && isCanDo) {
				var even = typeof event == "undefined" ? e : event;
				//保存当前鼠标Y坐标
				end = hasTouch ? even.touches[0].pageY : even.pageY;
				if (start < end) {
					even.preventDefault();
					//消除滑块动画时间
					fn.setTransition(0);
					// loading.innerHTML = '加载中...';                
					//移动滑块
					if ((end - start - offset) / 2 <= 150) {
						length = (end - start - offset) / 2;
						fn.translate(length);
					} else {
						length += 0.3;
						fn.translate(length);
					}
				}
			}
		}
		//滑动结束
		function end(e) {
			if (isCanDo) {
				isCanDo = false;
				//判断滑动距离是否大于等于指定值
				if (end - start >= offset) {
					//设置滑块回弹时间
					fn.setTransition(1);
					//保留提示部分
					fn.translate(0);
					//执行回调函数
					loading.innerHTML = '加载完成!';
					if (typeof option.next == "function") {
						option.next.call(fn, e);
					}
				} else {
					//返回初始状态
					fn.back();
				}
			}
		}
	}


	/**
	 * 上拉加载更多
	 * @param {Function} callback
	 */
	function scrolltobottom(callback) {

		//获取滚动条当前的位置 
		function getScrollTop() {
			var scrollTop = 0;
			if (document.documentElement && document.documentElement.scrollTop) {
				scrollTop = document.documentElement.scrollTop;
			} else if (document.body) {
				scrollTop = document.body.scrollTop;
			}
			return scrollTop;
		}

		//获取当前可视范围的高度 
		function getClientHeight() {
			var clientHeight = 0;
			if (document.body.clientHeight && document.documentElement.clientHeight) {
				clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
			} else {
				clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
			}
			return clientHeight;
		}

		//获取文档完整的高度 
		function getScrollHeight() {
			return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
		}

		window.onscroll = function () {
			if (getScrollTop() + getClientHeight() == getScrollHeight()) {
				callback()
			}
		}
	}

	/**
	 *历史列表元素数量
	 */
	function historyLength() {
		return window.history.length
	}

	/**
	 *导航到当前网页的超链接所在网页的URL
	 */
	function docReferrer() {
		return document.referrer;
	};

	/**
	 *返回上一页
	 *返回后刷新
	 */
	function historyBackRefresh() {
		window.location.href = docReferrer();
	};

	/**
	 *重载页面
	 *不添加新的历史记录
	 */
	function locationReplace(url) {
		window.location.replace(url);
	};

	/**
	 *返回历史记录
	 *返回后不刷新
	 */
	function historyGo(num) {
		window.history.go(num);
	};

}))