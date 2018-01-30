(function (win, doc, $) {
    $('.mdb-select').material_select();
    var parentTreeArr=[];
    //TODO: 模拟自定义数据
    function findPar(name){
        if(name){
            var obj=$('#showView').treeview('getParent',name);
            if(parentTreeArr.indexOf(obj.text)==-1){
                parentTreeArr.push(obj.text)
            }
            findPar(obj.nodeId)
        }
    }
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
                    if (pattern == "") {
                        $('#search-output').hide();
                        $('#showView').treeview('collapseAll', { silent: true });
                    } else {
                        $.each(results, function (index, result) {
                          output += '<p data-node="'+result.nodeId+'" data-id="'+result.id+'" data-pid="'+result.pid+'" data-text="'+result.text+'">- ' + result.text + '</p>';
                        });
                        $('#outputArea').html(output);
                        MSConfig.Gdt("#search-output");
                        $('#search-output').show();
                    }
                };
                $('#btn-search').on('click', searchCity);
                //$('#input-search').on('keyup', searchCity);
                $('#btn-clear-search').on('click', function (e) {
                    $searchableTree.treeview('clearSearch');
                    $('#showView').treeview('collapseAll', { silent: true });
                    $('#input-search').val('');
                    $('#outputArea').html("");
                    $('#search-output').hide();
                });
                $('#showView').on('nodeSelected', function(event, data) {
                    // 事件代码...
                    MSConfig.Gdt("#showView");
                    var clickTarget = data.text;
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
                });
                $("#outputArea").on("click","p",function(e){
                    e.stopPropagation();
                    $(this).addClass("activeShow").siblings("p").removeClass("activeShow");
                    var nodeId=$(this).data("node");
                    var id=$(this).data("id");
                    var pid=$(this).data("pid");
                    var text=$(this).data("text");
                    findPar(nodeId);
                    var parentArea="当前所在位置是:"+parentTreeArr.reverse().join('')+text;
                    MSConfig.Toastr("info",parentArea,'4000','toast-top-left');
                    parentTreeArr=[];
                })
            }
        })
    }
    getData();

    // 添加移入动效
    $(function(){
     $(".ding-control-container").hover(function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).find(".control-btn-container").show();
            $(this).find(".control-btn").removeClass("fadeOutRight").addClass("animated fadeInRight");;
        },function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).find(".control-btn").removeClass("fadeInRight").addClass("fadeOutRight");
        });
        $('.dataTables-show').DataTable( {
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [0,8] }
            ] });
    });

    var singleSelect=function () {
        var flag=true;
        $("input[name='checkbox_name[]']").each(function (i,v) {
            if(false == $(v).is(':checked')){
                $(".userList_check_control").prop("checked",false);
                flag=false;
            }
        });
        if(flag){
            $(".userList_check_control").prop("checked",true);
        }
    };
    var allSelect=function () {
        if($('.userList_check_control').is(':checked') == true){
            $("input[name='checkbox_name[]']").each( function() {
                if(false == $(this).is(':checked')){
                    $(this).prop("checked", true);
                }
            });
        }
        if($('.userList_check_control').is(':checked') == false){
            $("input[name='checkbox_name[]']").each( function() {
                if(true == $(this).is(':checked')){
                    $(this).prop("checked", false);
                }
            });
        }
    };
    var delOneLine=function(e){
        e.preventDefault();
        var line=$(this);
        var delinfo=function(){
            var url="../test/json/1.json";
            MSConfig.Ajax(url,{},"POST")
                .done(function(data){
                    line.parents("tr").remove();
                    MSConfig.SwalAlert("success","成功","删除成功!",1000);
                })
                .fail(function(error){
                    MSConfig.SwalAlert("error","OMG", "删除操作失败了!");
                });
        };
        MSConfig.SwalConfirm("error","删除","您确定要删除本行数据吗?",delinfo);
    };
    $(".dataTables-show").on("click","input[name='checkbox_name[]']",singleSelect);
    $(".dataTables-show").on("click",".userList_check_control",allSelect);
    $(".dataTables-show ").on("click",".control-btn .btn.tab-del",delOneLine);
})(window, document, jQuery);