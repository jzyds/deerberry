/**
 * @name deerberry.js
 * @author xqLi 
 */

(function (global, Func) {
	'use strict';
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = new Func() : (global.db = new Func());
}(this, function () {
	 
	/**
	 * xmlHttpRequest
	 * @param {Object} __params
	 */
	this.Ajax = function (__params) {
    	var params = __params || {};
        
        //默认GET
        params.type = (params.type || 'GET').toUpperCase();

        params.data = params.data || {};

        params.headers = params.headers || null;

        var json = params.jsonp ? jsonp(params) : json(params);

        // ajax请求
        function json(params) {
            params.data = formatParams(params.data);

            var xhr = null;

            // 实例化XMLHttpRequest对象
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                // IE6及其以下版本
                xhr = new ActiveXObjcet('Microsoft.XMLHTTP');
            };

            // 监听事件
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var status = xhr.status;
                    if (status >= 200 && status < 300) {
                        var response = '';
                        var type = xhr.getResponseHeader('Content-type');
                        if (type.indexOf('xml') !== -1 && xhr.responseXML) {
                            response = xhr.responseXML; //Document对象响应
                        } else if (type.indexOf('application/json') !== -1) {
                            response = JSON.parse(xhr.responseText); //JSON响应
                        } else {
                            response = xhr.responseText; //字符串响应
                        };

                        // callBack success
                        params.success && params.success(response);

                    } else {

                        //callback error
                        params.error && params.error(status);
                    }
                }
            };

            // 连接和传输数据
            if (params.type == 'GET') {
                xhr.open(params.type, params.url + '?' + params.data, true);
                __setRequestHeader();
                xhr.send(null);
            } else if (params.type == 'POST') {
                xhr.open(params.type, params.url, true);
                __setRequestHeader();
                xhr.send(params.data);
            }

            // set headers
            function __setRequestHeader() {
                if(params.headers === null || params.headers === void 0){
                    //default
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');                    
                }else{
                    for (var i in params.headers) {
                        xhr.setRequestHeader(i, params.headers[i])
                    }
                }
            }
        }
        // JSONP请求  
        function jsonp(params) {
            //创建script标签并加入到页面中  
            var callbackName = params.jsonp;
            var head = document.getElementsByTagName('head')[0];
            // 设置传递给后台的回调参数名  
            params.data['callback'] = callbackName;
            var data = formatParams(params.data);
            var script = document.createElement('script');
            head.appendChild(script);
            //创建jsonp回调函数  
            window[callbackName] = function (json) {
                head.removeChild(script);
                clearTimeout(script.timer);
                window[callbackName] = null;
                params.success && params.success(json);
            };　　
            //发送请求  
            script.src = params.url + '?' + data;
            //为了得知此次请求是否成功，设置超时处理  
            if (params.time) {
                script.timer = setTimeout(function () {
                    window[callbackName] = null;
                    head.removeChild(script);
                    params.error && params.error({
                        message: '超时'
                    });
                }, time);
            }
        };
        //格式化参数  
        function formatParams(data) {
            var arr = [];
            for (var name in data) {
                arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
            };
            // 添加一个随机数，防止缓存  
            arr.push('v=' + random());
            return arr.join('&');
        }
        // 获取随机数  
        function random() {
            return Math.floor(Math.random() * 10000 + 500);
        }
    }


	/**
	 * 动态加载JS
	 * @param {String} url
	 * @param {Function} callback
	 */
	this.requireJs = function(url,callback){
		var newScript = document.createElement("script");
		newScript.type = "text/javascript";
		newScript.src = url;
		document.body.appendChild(newScript);
		if(typeof(callback) != "undefined"){
			if (newScript.readyState) {
				newScript.onreadystatechange = function () {
					if (newScript.readyState == "loaded" || newScript.readyState == "complete") {
						newScript.onreadystatechange = null;
						callback();
					}
				};
			} else {
				newScript.onload = function () {
					callback();
				};
			}
		}
	}

	/**
	 * 获取本地IP地址
	 * @param {String} ip
	 * @param {Function} callback
	 * @return {Object} remote_ip_info
	 */
	this.getLocalIpInfo = function(ip, callback){
		if(ip === void 0){			
			console.log('ip is null');
			return;
		}
		// 调用sina api
		this.requireJs('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=' + ip ,function(){
			callback(remote_ip_info)
		});
	}


	/**
	 * 下拉刷新
	 * @param {object} option 
	 */
	this.pullRefresh = function(option) {
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
	this.scrolltobottom = function (callback) {

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
	this.historyLength = function () {
		return window.history.length
	}

	/**
	 *导航到当前网页的超链接所在网页的URL
	 */
	this.docReferrer = function () {
		return document.referrer;
	};

	/**
	 *返回上一页
	 *返回后刷新
	 */
	this.historyBackRefresh = function () {
		window.location.href = docReferrer();
	};

	/**
	 *重载页面
	 *不添加新的历史记录
	 */
	this.redirectHtml = function (url) {
		window.location.replace(url);
	};

	/**
	 *返回历史记录
	 *返回后不刷新
	 */
	this.historyGo = function (num) {
		window.history.go(num);
	};
}))