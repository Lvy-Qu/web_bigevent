$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 调用函数
    initArtCateList();
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 添加点击事件，添加分类
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })


    // 通过代理的形式，位form-add表单绑定 submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        // console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg(res.message);
                layer.close(indexAdd);
            }
        })
    })


    // 通过代理的形式，位btn-edit表单绑定 click事件
    // 编辑
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // console.log('ok');
        // 弹出修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        // 发送ajax 请求
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,

            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data);

            }
        })
    })

    // 通过代理的形式，位修改分类的表单绑定 submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    // 通过代理的形式，位删除分类的表单绑定 click事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    layer.close(index)
                    initArtCateList();
                }
            })
        });
    })
})