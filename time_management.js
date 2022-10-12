// ==UserScript==
// @name         时间锁
// @namespace    https://github.com/Jie-Qiao
// @version      0.4
// @description  根据何同学的时间锁设计的网页版，网页添加请修改下方'@match'项，可添加或减少你需要的match网站.
// @author       Jie Qiao
// @match        https://www.zhihu.com/*
// @match        https://*.taobao.com/*
// @match        https://www.amazon.com/*
// @match        https://*.bilibili.com/*
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @match        https://www.douban.com/*
// @match        https://www.bilibili.com/*
// @match        https://www.twitter.com/*
// @match        https://twitter.com/*
// @match        https://www.pornhub.com/*
// @match        https://www.sina.com.cn/*
// @match        https://www.youtube.com/*
// @grant        window.close
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==


var time = 0;
var domain_split; var domain;
if (document.domain.endsWith(".com.cn")){
    domain_split = document.domain.split('.').slice(-3);
    domain = domain_split.join(".");
} else {
    domain_split = document.domain.split('.').slice(-2);
    domain = domain_split.join(".");
}


var domain_left_time = GM_getValue('domain_left_time');
var domain_set_time = GM_getValue('domain_set_time');
if (domain_left_time == undefined) {
    domain_left_time = {};
    GM_setValue('domain_left_time', domain_left_time);
}
if (domain_set_time == undefined) {
    domain_set_time = {};
    GM_setValue('domain_set_time', domain_set_time);
}


var domain_exists = domain_left_time.hasOwnProperty(domain);
console.log("domain:", domain, "domain_set_time", domain_set_time, "domain_left_time", domain_left_time);
(function () {
    'use strict';
    if (!domain_exists){
        time = prompt("你为什么要打开网站？\n你要看多长时间？\n你还能去做什么？\n\n请设置浏览时间(分钟)，跟自己做一个约定", "");
        if (time == null) {
            window.close();
        }
        time = time * 60 * 1000;
        domain_left_time[domain] = time;
        domain_set_time[domain] = time;
        GM_setValue('domain_left_time', domain_left_time);
        GM_setValue('domain_set_time', domain_set_time);
    }
    setInterval(tick, 1000)
    // Your code here...
})();


function tick() {
    // update domain_left_time, do not update domain_set_time
    domain_left_time = GM_getValue('domain_left_time');
    if (time == domain_left_time[domain]){
        time = domain_left_time[domain] - 1000;
        domain_left_time[domain] = time;
        GM_setValue('domain_left_time', domain_left_time);
    } else {
        time = domain_left_time[domain];
    }
    if (time == 60 * 1000) {
        alert("还剩1分钟");
    }
    if (time == -1000) {
        var r = confirm("时间结束，是否退出：" + document.title);
        if (r == true) {
            window.close();
        } else {
            alert("请注意时间");
        }
    }
    if (time < 0 && time % (5 * 60 * 1000) == 0){
        console.log("time:", time);
        var a = ((GM_getValue('domain_set_time')[domain] - time)/60000).toString();
        var b = (-time/60000).toString();
        var c = prompt("已浏览" + a + "分钟（超时" + b + "分钟），是否退出？输入"+a+"继续浏览" + document.title);
        if (c != a) {
            window.close();
        }
    }


}