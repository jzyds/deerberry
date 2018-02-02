/**
 * @name deerberry.js
 * @author xqLi 
 */

(function (global, Fun) {
    'use strict';
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = Fun : (global.deerberry = Fun);
}(this, function(){

	/*
	 *历史列表元素数量
	 */
	function historyLength(){
		return window.history.length
	}

	/*
	 *导航到当前网页的超链接所在网页的URL
	 */
	function docReferrer(){
		return document.referrer;
	};

	/*
	 *返回上一页
	 *返回后刷新
	 */
	function historyBackRefresh(){
		window.location.href = docReferrer();
	};

	/*
	 *重载页面
	 *不添加新的历史记录
	 */
	function locationReplace(url){
		window.location.replace(url);
	};

	/*
	 *返回历史记录
 	 *返回后不刷新
	 */
	function historyGo(num){
		window.history.go(num);
	};

}))