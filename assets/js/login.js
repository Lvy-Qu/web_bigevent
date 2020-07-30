$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击去登录的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })


    // 从layui中获取form对象
    var form = layui.form;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码中的内容
            // 还需要拿到密码框中的内容
            // 进行一次等于的判断
            // 如果判断失败，则return一个提示消息
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    var layer = layui.layer;
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认的提交行为
        e.preventDefault();
        // 发送ajax的post请求
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status != 0) {
                    // console.log(res);
                    return layer.msg(res.message);
                }
                // 注册成功
                layer.msg('注册成功,请登录！');
                // 模拟人的点击行为
                $('#link_login').click();
                // 清空表单
                $('#form_reg')[0].reset();
            }
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('登陆失败！')
                }
                layer.msg('登陆成功')
                // console.log(res);
                // 讲登录成功得到token字符串保存到res的里面
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        })
    })
})