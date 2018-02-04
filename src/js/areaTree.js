(function(win, doc, $) {
    // 定义查找节点数父级元素的数组
    var parentTreeArr = [];
    // 初始化datatable
    var table = $(".dataTables-show").DataTable({
        "aoColumnDefs": [{
            "bSortable": false,
            "aTargets": [0, 8]
        }]
    });
    // 定义鼠标的移入td(更多)的事件
    var hoverIn = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).find(".control-btn-container").show();
        var h = $(this).find(".control-btn").height();
        $(this).find(".control-btn").css("lineHeight", h + "px");
        $(this).find(".control-btn").removeClass("fadeOutRight").addClass("animated fadeInRight");
    };
    // 定义鼠标的移出td(更多)事件
    var hoverOut = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).find(".control-btn-container").show();
        var h = $(this).find(".control-btn").height();
        $(this).find(".control-btn").removeClass("fadeInRight").addClass("fadeOutRight");
        $(this).find(".control-btn-container").hide('500');
    };
    // 定义每行的单选事件函数
    var singleSelect = function() {
        var flag = true;
        $("input[name='checkbox_name[]']").each(function(i, v) {
            if (false == $(v).is(':checked')) {
                $(".userList_check_control").prop("checked", false);
                flag = false;
            }
        });
        if (flag) {
            $(".userList_check_control").prop("checked", true);
        }
    };
    // 定义表头的全选按钮函数
    var allSelect = function() {
        if ($('.userList_check_control').is(':checked') == true) {
            $("input[name='checkbox_name[]']").each(function() {
                if (false == $(this).is(':checked')) {
                    $(this).prop("checked", true);
                }
            });
        }
        if ($('.userList_check_control').is(':checked') == false) {
            $("input[name='checkbox_name[]']").each(function() {
                if (true == $(this).is(':checked')) {
                    $(this).prop("checked", false);
                }
            });
        }
    };
    // 定义删除一行的单价事件
    var delOneLine = function(e) {
        e.preventDefault();
        var line = $(this);
        // TODO 将要删除的函数提交到后台 并且动态给iframe 调整高度
        var delinfo = function() {
            var url = "../test/json/1.json";
            MSConfig.Ajax(url, {}, "POST")
                .done(function(data) {
                    line.parents("tr").remove();
                    MSConfig.SwalAlert("success", "成功", "删除成功!", 1000);
                     MSConfig.ResizeIframeHeight();
                })
                .fail(function(error) {
                    MSConfig.SwalAlert("error", "OMG", "删除操作失败了!");
                });
        };
        MSConfig.SwalConfirm("error", "删除", "您确定要删除本行数据吗?", delinfo);
    };
    // 点击条件搜索展开时调整当前iframe的高度
    var showSearchIfs = function(e) {
         MSConfig.ResizeIframeHeight();
    };
    // 点击条件搜索合闭时调整当前iframe的高度
    var hideSearchIfs = function(e) {
         MSConfig.ResizeIframeHeight();
    };
    // 当改变当前页展示数据的条数时，调整iframe 的高度
    var dataDraw = function(e, settings, len) {
        table.on('draw', function() {
             MSConfig.ResizeIframeHeight();
        });
    };
    // 点击条件按钮的搜索后，获取你搜索的属性值(user=>"姓名")
    var getSelDom = function(dom, name) {
        var text = $(dom).find("[name='" + name + "']").parents(".showLabel").find("label").text();
        return text;
    };
    // 点击条件按钮的搜索后，要执行的操作(TODO 方式列出)
    var refData = function(e) {
        e.preventDefault();
        $("#searchForm").ajaxSubmit(function(data) {
            if (data.status) {
                // TODO (收起折叠条件)
                $("#searchIfs").collapse("hide");
                // TODO (展示当前的查询项目)
                var allArray = $('#searchForm').serializeArray();
                var html = "<div class='hozShowResult'>";
                $.each(allArray, function() {
                    html += '<p><span class="nameT">' + getSelDom("#searchForm", this.name) + ':</span><span>' + (this.value == "" ? "没有数据" : this.value) + '</span></p>';
                });
                html += "</div>";
                MSConfig.Toastr("success", html, "50000", "toast-top-full-width");
                // TODO (更新dataTabel)
            }
        });
        return false;
    };
    // 定义查找节点数父级元素的函数
    function findPar(name) {
        if (name) {
            var obj = $('#showView').treeview('getParent', name);
            if (parentTreeArr.indexOf(obj.text) == -1) {
                parentTreeArr.push(obj.text)
            }
            findPar(obj.nodeId)
        }
    }
    // 初始化dataTable 的组装数据
    function getData() {
        $.ajax({
            url: "http://192.168.0.253:8080/beach_tz/analysis/testCtrlUnit",
            data: {},
            type: "GET",
            dataType: 'json',
            success: function(data) {
                $('#showView').treeview({
                    color: "#428bca",
                    levels: 2,
                    searchResultColor: '#c70505',
                    data: data || {},
                    onNodeSelected: function(event, node) {
                        if (node) {
                            var clickTarget = node.text;
                            var nodeId = node.nodeId;
                            var parentArr = $('#showView').treeview('getExpanded', node.nodeId);
                            var parentCity = "";
                            parentArr.forEach(function(v) {
                                parentCity += v.text;
                            });
                            parentCity += clickTarget;
                            console.log(parentCity);
                        }
                    }
                });
                // TODO 初始化地区树的滚动条
                MSConfig.Gdt("#showView");
                // TODO 定义变量缓存地区数的数据
                var $searchableTree = $('#showView').treeview({
                    data: data
                });
                // TODO 默认选中展开项
                $('#chk-reveal-results').attr("checked", true);
                // TODO 定义查询事件
                var searchCity = function(e) {

                    if (!$('#chk-reveal-results').is(':checked')) {
                        $('#chk-reveal-results').attr("checked", false);
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
                        $('#showView').treeview('collapseAll', {
                            silent: true
                        });
                    } else {
                        $.each(results, function(index, result) {
                            output += '<p data-node="' + result.nodeId + '" data-id="' + result.id + '" data-pid="' + result.pid + '" data-text="' + result.text + '">- ' + result.text + '</p>';
                        });
                        $('#outputArea').html(output);
                        // TODO 初始化 搜索结果的滚动条
                        MSConfig.Gdt("#search-output");
                        $('#search-output').show();
                        // TODO 高度变化后 再次调整iframe的高度
                         MSConfig.ResizeIframeHeight();
                    }
                };
                $('#btn-search').on('click', searchCity);
                // 点击清空按钮的事件
                $('#btn-clear-search').on('click', function(e) {
                    $searchableTree.treeview('clearSearch');
                    $('#showView').treeview('collapseAll', {
                        silent: true
                    });
                    $('#input-search').val('');
                    $('#outputArea').html("");
                    $('#search-output').hide();
                    // TODO 高度变化后 再次调整iframe的高度
                     MSConfig.ResizeIframeHeight();
                });
                // 地区树节点被选中的事件
                $('#showView').on('nodeSelected', function(event, data) {
                    // TODO 初始化地区树的滚动条
                    MSConfig.Gdt("#showView");
                    var clickTarget = data.text;
                    var parentArr = $('#showView').treeview('getExpanded', data.nodeId);
                    // TODO 拿到单机地区树所在的父级元素
                    var parentCity = "";
                    parentArr.forEach(function(v) {
                        parentCity += v.text;
                    });
                    parentCity += clickTarget;
                });
                // 地区树被展开的事件
                $("#showView").on("nodeExpanded ", function() {
                    // TODO 初始化地区树的滚动条
                    MSConfig.Gdt("#showView");
                });
                // 地区树被折叠起的事件
                $("#showView").on("nodeCollapsed ", function() {
                    // TODO 初始化地区树的滚动条
                    MSConfig.Gdt("#showView");
                });
                // 搜索结果绑定单机事件
                $("#outputArea").on("click", "p", function(e) {
                    if ($(this).index() == 0) {
                        return;
                    }
                    e.stopPropagation();
                    $(this).addClass("activeShow").siblings("p").removeClass("activeShow");
                    var nodeId = $(this).data("node");
                    var id = $(this).data("id");
                    var pid = $(this).data("pid");
                    var text = $(this).data("text");
                    findPar(nodeId);
                    var parentArea = "当前所在位置是:" + parentTreeArr.reverse().join('') + text;
                    MSConfig.Toastr("info", parentArea, '5000', 'toast-top-left');
                    parentTreeArr = [];
                    // TODO 更新dataTable
                })
            }
        })
    }
    // 页面加载完成后的事件操作
    $(function() {
        // TODO 获得dataTable的初始数据
        getData();
        // 初始化滚动条
        MSConfig.Gdt("#searchInput");
    });
    $('#searchIfs').on('shown.bs.collapse', showSearchIfs);
    $('#searchIfs').on('hidden.bs.collapse', hideSearchIfs);
    $(".dataTables-show").on("click", "input[name='checkbox_name[]']", singleSelect);
    $(".dataTables-show").on("click", ".userList_check_control", allSelect);
    $(".dataTables-show ").on("click", ".control-btn .btn.dataTab-del", delOneLine);
    $(".ding-control-container").hover(hoverIn, hoverOut);
    $('.dataTables-show').on('length.dt', dataDraw);
    $("#searchIfs").on("click", "#ms-search", refData);
})(window, document, jQuery);
