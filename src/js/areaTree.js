(function (win, doc, $) {
    $('.mdb-select').material_select();
    //TODO: 模拟自定义数据
    //store.set("ms",data);'http://192.168.0.49:8080/beach_tz/analysis/testCtrlUnit'
    function getData(){
        $.ajax({
            url:"http://192.168.0.253:8080/beach_tz/analysis/testCtrlUnit",
            data:{},
            type:"GET",
            dataType:'json',
            success:function(data){
                $('#showView').treeview({
                    color: "#428bca",
                    levels:2,
                    searchResultColor:'#c70505',
                    data: data||{},
                    onNodeSelected: function (event, node) {
                        if (node) {
                            var clickTarget = node.text;
                            var nodeId=node.nodeId;
                            var parentArr=$('#showView').treeview('getExpanded',node.nodeId);
                            var parentCity="";
                            parentArr.forEach(function(v){
                                parentCity+=v.text;
                            });
                            parentCity+=clickTarget;
                            console.log(parentCity);
                        }
                    },
                    onNodeExpanded: function (event, node) {
                    },
                    onNodeCollapsed: function (event, node) {

                    }
                });
                 MSConfig.Gdt("#showView");
                var $searchableTree = $('#showView').treeview({
                    data: data
                });
                $('#chk-reveal-results').attr("checked",true);
                var searchCity = function (e) {

                    if(!$('#chk-reveal-results').is(':checked')){
                        $('#chk-reveal-results').attr("checked",false);
                    }
                    var pattern = $('#input-search').val();
                    var options = {
                        exactMatch: $('#chk-exact-match').is(':checked'),
                        revealResults: $('#chk-reveal-results').is(':checked')
                    };
                    var results = $searchableTree.treeview('search', [pattern, options]);
                    var output = '<p>发现 ' + results.length + ' 项匹配结果</p>';
                    console.log(options);
                    if (pattern == "") {
                        $('#search-output').hide();
                        $('#showView').treeview('collapseAll', { silent: true });
                    } else {
                        $.each(results, function (index, result) {
                            output += '<p>- ' + result.text + '</p>';
                        });
                        $('#outputArea').html(output);
                        $('#search-output').show();
                        MSConfig.Gdt("#search-output");
                    }
                };
                $('#btn-search').on('click', searchCity);
                //$('#input-search').on('keyup', searchCity);
                $('#btn-clear-search').on('click', function (e) {
                    $searchableTree.treeview('clearSearch');
                    $('#showView').treeview('collapseAll', { silent: true });
                    $('#input-search').val('');
                    $('#search-output').html('').hide();
                });
                $('#showView').on('nodeSelected', function(event, data) {
                    // 事件代码...
                    MSConfig.Gdt("#showView");
                    var clickTarget = data.text;
                    var nodeId=data.nodeId;
                    var parentArr=$('#showView').treeview('getExpanded',data.nodeId);
                    var parentCity="";
                    parentArr.forEach(function(v){
                        parentCity+=v.text;
                    });
                    parentCity+=clickTarget;
                });
                $("#showView").on("nodeExpanded ",function(){
                    MSConfig.Gdt("#showView");
                });
                $("#showView").on("nodeCollapsed ",function(){
                    MSConfig.Gdt("#showView");
                })
            }
        })
    }
    getData();
    //TODO: 初始化树形插件
    //datatable 配置
    $(doc).ready( function() {
        aa=$('.dataTables-show').DataTable( {
         "aoColumnDefs": [
                { "bSortable": false, "aTargets": [0,8] }
            ] });
        console.log(aa.data());
    } );

    // 全选按钮
    $(".table").on("click","INPUT[name='checkbox_name[]']",function () {

        var flag=true;
        $("INPUT[name='checkbox_name[]']").each(function (i,v) {
            if(false == $(v).is(':checked')){
                $(".userList_check_control").prop("checked",false);
                flag=false;
            }
        })
        if(flag){
            $(".userList_check_control").prop("checked",true);
        }
    })

    $(".userList_check_control").bind("click", function () {
        if($('.userList_check_control').is(':checked') == true){
            $("INPUT[name='checkbox_name[]']").each( function() {
                if(false == $(this).is(':checked')){
                    $(this).prop("checked", true);
                }
            });
        }
        if($('.userList_check_control').is(':checked') == false){
            $("INPUT[name='checkbox_name[]']").each( function() {
                if(true == $(this).is(':checked')){
                    $(this).prop("checked", false);
                }
            });
        }
    });
    //  批量删除
    $(".batch").on("click", function(e) {
        e.preventDefault();
        0 == $(".table tbody :checkbox:checked").length
            ? ms.msg("请选择需要删除的数据！",0,2000) :
            ms.confirm("警告","确定要删除吗?",0,"确定","取消",function() {
                $(".table tbody :checkbox:checked").parents("tr").remove(),
                    ms.msg("已删除",1,600);
            })
    })
    //    添加用户
    $("#add_user").on("click", function() {
        var e = $(this).html();
        var t="add_user.html";
        ms.open(e, t, "1000", "600")
    }),
        //    删除一行
        $(".table ").on("click",".ding_control div a.del",function (e) {
            e.preventDefault();
            var t=$(this);
            ms.confirm("警告","确定要删除吗?",0,"确定","取消",function() {
                t.parent().parent().parent().parent().remove();
                ms.msg("已删除",1,600);
            })
        })
    //    重新启用或停用
    $(".table ").on("click",".ding_control div a.go",function (e) {
        e.preventDefault();
        var t=$(this);
        if(t.text()=="启用"){
            ms.confirm("警告","确定要启用吗?",0,"确定","取消",function(){
                t.html("停用");
                t.parent().parent().parent().prev().html('<button class="btn btn-info btn-xs" style="margin-bottom: 0px;">已启用</button>');
                ms.msg("已启用",5,600);
            })
        }else{
            ms.confirm("警告","确认要停用吗?",0,"确定","取消",function(){
                t.html("启用");
                t.parent().parent().parent().prev().html('<button class="btn btn-default btn-xs" style="margin-bottom: 0px;background:#E6E6E6;">已停用</button>');
                ms.msg("已停用",5,600);
            })
        }
    })
    //    编辑
    $(".table ").on("click",".ding_control div a.edit",function (e) {
        e.preventDefault();
        var data=aa.row().data();
        var e = $(this).html();
        var t="add_user.html";
        ms.open(e, t,"1000", "600");
    })
})(window, document, jQuery);
