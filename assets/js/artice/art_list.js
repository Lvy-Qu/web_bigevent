$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 定义一个查询的参数对象将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值，默认请求第一页的数据
        pagesize: 2,//每页显示几条数据，默认每页显示2条
        cata_id: '',//文章分类的 Id
        state: ''//文章的状态
    }

    // 调用函数
    initTable()
    // 调用函数
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    // 发送ajax请求
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 通过layui重新渲染
                form.render()
            }
        })
    }

    //位筛选表单绑定submit时间
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name="cate_id"]').val()
        var state = $('[name="state"]').val()
        // 未查询参数对象q 对用的属性
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用laypage的render方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',  //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，出发jump回调
            // 出发jump回调的方式有两种：
            // 1.点击页码的时候，会触发jump回调
            // 2.只要调用laypage.render（）方法就会出发jump回调
            jump: function (obj, first) {
                // console.log(obj.curr);
                // console.log(first);
                // 把最新的页码值，赋值给当前页码值
                q.pagenum = obj.curr;
                // 吧最新的条目数，赋值到q这个pagesize属性
                q.pagesize = obj.limit;
                // 重新渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 当数据完成后，需要判断当前这一页中，是否还有剩余数据
                    // 如果没有剩余的数据了，则让页码值-1之后，
                    // 在重新调用方法
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完毕之后，页面上就没有任何数了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})