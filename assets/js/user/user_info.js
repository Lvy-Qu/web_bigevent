$(function () {
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.trim().length > 6) {
                return '昵称应该输入1~6位之间'
            }
        }
    })

    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // 获取用户信息校验
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败！")
                }
                // console.log(res);
                // 调用form.val() 快速位表单赋值
                // 展示用户信息
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 调用函数
    initUserInfo()


    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认行为
        e.preventDefault()
        // 调用函数
        initUserInfo()
    })

    // 监听表单的提交时间
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法，重新渲染用户的头像和信息
                window.parent.getUserInfo()
            }
        })
    })
})