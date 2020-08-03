// 拦截过滤每一次ajax请求，配置每次请求需要的参数

$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // console.log(options.url);
    // 统一为有权限的接口，设置 请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 全局同意挂载 complete 回调函数
    options.complete = function (res) {
        // var data = res.responseJSON;
        // console.log(data);
        // 服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message == "身份认证失败!") {
            localStorage.removeItem('token');
            location.href = '/login.html'
        }

    }

})