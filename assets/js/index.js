$(function () {
    // 调用getUserInfo 获取用户基本信息
    getUserInfo()
    $('#btnLogout').on('click', function () {
        // alert('ok');
        // 提示用户是否确认退出
        layer.confirm('确认退出登录？', { icon: 3, title: '提示' },
            function (index) {
                // 清空本地存储中的token
                localStorage.removeItem('token')
                // 重新跳转到登录页
                location.href = '/login.html'
                // 
                layer.close(index)
            })
    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // header 请求头配置
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            // 判断用户获取信息是否成功
            if (res.status != 0) {
                return layui.layer.msg(res.message)
            }
            // 调用renderAvatar() 渲染用户的头像
            renderAvatar(res.data)
            // 不论成功还是失败，最终都会调用complete函数
        },
        // complete: function (res) {
        //     // 服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message == "身份认证失败!") {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户信息的头像
function renderAvatar(user) {
    // 获取用户的额名称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需求渲染用户头像
    if (user.user_pic != null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}