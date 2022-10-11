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
var remained = false;
var domain_split; var domain;
if (document.domain.endsWith(".com.cn")){
    domain_split = document.domain.split('.').slice(-3);
    domain = domain_split.join(".");
} else {
    domain_split = document.domain.split('.').slice(-2);
    domain = domain_split.join(".");
}

/* if (domain == "zhihu.com"){
    var r = confirm("刷知乎不如去看书");
    if (r == true) {
        window.close();
        window.close();
        window.close();
        window.close();
        window.open("https://weread.qq.com/");
    }
} */

/*
if (domain == "zhihu.com" && document.location.pathname == "/"){
    var query = prompt("你要搜什么？");
    if (query == null || query == ""){
        window.close();
        window.close();
        window.close();
        window.close();
        window.open("Reeder://1");
    } else {
        window.close();
        window.close();
        window.close();
        window.close();
        window.open(`https://www.zhihu.com/search?q=${query}&type=content`);
    }
}
*/

var domain_time = GM_getValue('domain_time');
var domain_extended = GM_getValue('domain_extended');
if (domain_time == undefined) {
    domain_time = {};
    GM_setValue('domain_time', domain_time);
}
if (domain_extended == undefined) {
    domain_extended = {};
    GM_setValue('domain_extended', domain_extended);
}
var domain_exists = domain_time.hasOwnProperty(domain) && domain_time[domain] > 0;
console.log("domain:", domain, "domain_extended", domain_extended, "domain_time", domain_time);
(function () {
    'use strict';
    if (!domain_exists){
        time = prompt("你为什么要打开网站？\n你要看多长时间？\n你还能去做什么？\n\n请设置浏览时间(分钟)", "");
        if (time == null) {
            window.close();
        }
        time = time * 60 * 1000;
        domain_time[domain] = time;
        GM_setValue('domain_time', domain_time);
        domain_extended[domain] = false;
        GM_setValue('domain_extended', domain_extended);
    }
    setInterval(tick, 1000)
    // Your code here...
})();


function tick() {
    domain_time = GM_getValue('domain_time');
    domain_extended = GM_getValue('domain_extended');
    if (time == domain_time[domain]){
        time = domain_time[domain] - 1000;
        domain_time[domain] = time;
        GM_setValue('domain_time', domain_time);
    } else {
        time = domain_time[domain];
    }
    console.log("time:", time, "domain:", domain);
    if (time == 0){
        if (!domain_extended[domain]){
            var r = confirm("时间结束，是否退出：" + document.title);
            if (r == true) {
                time = 0;
                window.close();
            } else {
                time = prompt("设置继续浏览时长", "");
                if (time <= 1) {
                    remained = true;
                } else {
                    remained = false;
                }
                time = time * 60 * 1000;
                domain_time[domain] = time;
                GM_setValue('domain_time', domain_time);
                domain_extended[domain] = true;
                GM_setValue('domain_extended', domain_extended);
            }
        } else {
            window.close();
        }
    }
    if (time < -2000) {
        window.close();
        alert("时间已到");
    }
    if (time <= 60 * 1000 && remained == false) {
        alert("还剩1分钟");
        remained = true;
    }

}