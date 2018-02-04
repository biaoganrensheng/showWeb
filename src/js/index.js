;
(function($, doc, win) {
    // 获取操作按钮的总宽度
    var _sumWidth = $(".btn-container-overflow").outerWidth();
    // 操作按钮滚动条的初始化状态置为false
    var _initGd = false;
    // 定义是否点击的其他标签的变量
    var _clickOther = false;
    // 定义操作按钮的数组
    var _btnArr = [];
    $(function() {
        // TODO 初始化 页面的滚动条(回到顶部)
        pageScroll();
        // TODO 请求模板数据渲染模板
        MSConfig.Ajax("test/json/navbar.json")
            .done(function(data) {
                if (data.res == 200) {
                    // TODO 渲染导航条组件 渲染更多按钮组件 渲染自定义的快捷菜单 渲染标签页选择列表
                    MSConfig.Tpl("src/component/tpl/navbar.html", "navbarContainer", data.list);
                    MSConfig.Tpl("src/component/tpl/moreTab.html", "tooltip-defined", data.list);
                    (!store.get("MS_definedTab")) && (MSConfig.Tpl("src/component/tpl/controlBar.html", "page-container", data.list));
                    MSConfig.Tpl("src/component/tpl/definedTab.html", "defineTab-pill", data.list);
                    setTimeout(function() {
                        // TODO 显示欢迎弹框 模拟触发首页的点击 不显示操作按钮栏
                        MSConfig.Toastr("success", "欢迎来到艋顺后台!", "1000");
                        $("#trigger_index a").trigger("click");
                        $(".btn-container").hide();
                        $("#content-box").css("paddingTop", "88px");
                        // TODO 初始化 更多列表的选项
                        $("#li_more .dropdown-menu a").each(function(i, v) {
                            var id = $(v).attr("id").trim();
                            $('#' + id).toolbar({
                                content: '#toolbar-options-' + id,
                                position: 'right',
                                style: 'primary',
                                animation: 'flip',
                                event: 'hover'
                            })
                        });
                        // TODO 读取本地缓存 并且初始化快捷操作菜单
                        var his = store.get("MS_definedTab");
                        if (his) {
                            var bg = his.bg;
                            var checkedItem = his.changeif;
                            var xiala = his.xiala;
                            var lovePage = "";
                            var iconArr = ['fa-bookmark', 'fa-tags', 'fa-columns', 'fa-paw', 'fa-paper-plane', 'fa-meh-o'];
                            $(".defineBtn .btn").removeClass("activeB");
                            $(".defineBtn .btn[data-bg=" + bg + "]").addClass("activeB");
                            checkedItem.forEach(function(v, i) {
                                var tarChecked = v.iframe;
                                $("#defineTab-pill input[data-itemiframe='" + tarChecked + "']").prop("checked", true);
                                lovePage += '<a data-href="' + v.url + '" data-content="' + v.text + '" data-changeIf="' + v.iframe + '" class="gooey-menu-item topic" data-tipso="' + v.text + '"><i class="fa fa-2x ' + iconArr[i] + '"></i></a>';
                            });
                            $("#changeNavbar").attr("class", "mb-1 navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar " + bg);
                            $("#click_navbar>li>.dropdown-menu").attr("class", "dropdown-menu dropdown-menu-right " + xiala);
                            $("#page-container").html(lovePage);
                        }
                        initGooey();
                    }, 100)
                }
            })
            .fail(function(error) {
                MSConfig.SwalAlert("error", "错误", "抱歉!发生错误!请联系管理员!", 1000)
            });
    });
    //iframe 展示
    var showTab = function(name) {
        $(".tab-item").css("display", "none");
        $("." + name).show();
    };
    //iframe 隐藏
    var hideTab = function(name) {
        $("#content-box ." + name).remove();
    };
    // 根据标签项高亮对应的一级标签(注意循环有点问题)
    var hightOneTab = function() {
        var tarBtn = $("#activeTab").val();
        if (tarBtn != "") {
            $("a[data-changeIf^='IF_'] ").each(function(i, v) {
                var _tar = $(v).data("changeif");
                if (_tar == tarBtn) {
                    $("#click_navbar .nav-item").removeClass("active");
                    $(v).parents("li.nav-item").addClass("active");
                    if ($(v).hasClass("more-tabs")) {
                        $("#li_more").addClass("active");
                    }
                    return false;
                }
            })
        }
    };
    //初始化Iframe 的高度
    var heightIframe = function(dom) {
        var Wheight = $(window).height() - $(".g-header").outerHeight();
        dom.load(function() {
            var mainheight = $(this).contents().find("body").height() + 108;
            var realH = (mainheight < Wheight ? Wheight : mainheight);
            $(this).height(realH);
        });
    };
    //删除按钮的操作
    var delBtn = function(e) {
        e.stopPropagation();
        var _targetIf = $(this).parents(".btn").attr("class");
        var _text = _targetIf.split(" ");
        var _name = _text[_text.length - 1];
        var _index = _btnArr.indexOf(_name);
        _btnArr.splice(_index, 1);
        if (_btnArr.length == 0) {
            $("#trigger_index a").trigger("click");
        } else {
            $(".btn-container-items ." + _btnArr[_btnArr.length - 1]).trigger("click");
        }
        if (!_clickOther) {
            if (_btnArr.length == 1) {
                $(".btn-container").hide();
                $("#content-box").css("paddingTop", "88px");
                $("#change-size").css({
                    "left": 15,
                    "top": "88px"
                });
            }
        } else {
            if (_btnArr[0] == "IF_0") {
                $(".btn-container").hide();
                $("#content-box").css("paddingTop", "88px");
                $("#change-size").css({
                    "left": 15,
                    "top": "88px"
                });
                _clickOther = false;
            }
        }
        $(this).parents(".btn").remove();
        hideTab(_name);
        $("#activeTab").val(_btnArr[_btnArr.length - 1]);
        $(".btn-container-overflow").mCustomScrollbar("update");
        $(".btn-container-items .btn").css("backgroundColor", "#45526E");
        $(".btn-container-items ." + _btnArr[_btnArr.length - 1]).css("backgroundColor", "#00d3ee");
    };
    // 拼接按钮和iframe
    var appendBtnIframe = function(_btnText, _btnJudge, _tabHref) {
        var _allBtn = "";
        var _itemIframe = "";
        $("#activeTab").val(_btnJudge);
        if (_btnArr.indexOf(_btnJudge) == -1) {
            if (_btnJudge == "IF_0") {
                _allBtn += '<button type="button"  class="btn btn-cyan btn-none ' + _btnJudge + '">' +
                    _btnText +
                    '<i class="fa fa-times ml-2"></i></button>';
            } else {
                $(".btn-container").show();
                $("#content-box").css("paddingTop", "152px");
                $("#change-size").css({
                    "left": 15,
                    "top": "152px"
                });
                _allBtn += '<button type="button"  class="btn btn-cyan ' + _btnJudge + '">' +
                    _btnText +
                    '<i class="fa fa-times ml-2"></i></button>';
            }
            _itemIframe += '<div class="tab-item ' + _btnJudge + '"><iframe onmousewheel="" width="100%" frameborder="0" src="' + _tabHref + '"></iframe></div>';
            $(".btn-container-items").append(_allBtn);
            $(".btn-container-items .btn").css("backgroundColor", "#45526E");
            $(".btn-container-items ." + _btnJudge).css("backgroundColor", "#00d3ee");
            $("#content-box").append(_itemIframe);
            var domH = $("#content-box ." + _btnJudge + " iframe");
            showTab(_btnJudge);
            heightIframe(domH);
            _btnArr.push(_btnJudge);
        } else {
            showTab(_btnJudge);
            $(".btn-container-items .btn").css("backgroundColor", "#45526E");
            $(".btn-container-items ." + _btnJudge).css("backgroundColor", "#00d3ee");
        }
        hightOneTab();
    };
    // 初始化标签页滚动条
    var initTabScroll = function(pos) {
        var _totalW = 0;
        $(".btn-container-items .btn").each(function(i, v) {
            _totalW += ($(v).outerWidth() + 6);
        });
        if (_initGd) {
            $(".btn-container-overflow").mCustomScrollbar("update");
            $(".btn-container-overflow").mCustomScrollbar("scrollTo", pos, {
                scrollInertia: 200
            });
        }
        if (_totalW >= _sumWidth && (!_initGd)) {
            $(".btn-container-overflow").mCustomScrollbar({
                horizontalScroll: true,
                scrollButtons: {
                    enable: true
                },
                advanced: {
                    autoExpandHorizontalScroll: true
                },
                theme: "dark-thin"
            });
            _initGd = true;
        }
    };
    // 标签页联动
    var initGD = function() {
        var _btnText = ($(this).text().trim()) != "" ? $(this).text().trim() : $(this).data("content");
        var _btnJudge = $(this).data("changeif");
        var _tabHref = $(this).data("href");
        var _pos = "." + _btnJudge;
        appendBtnIframe(_btnText, _btnJudge, _tabHref);
        initTabScroll(_pos);
    };
    // iframe 切换效果
    var changeTabIframe = function() {
        var _class = $(this).attr("class");
        var _text = _class.split(" ");
        var _name = _text[_text.length - 1];
        var _pos = "." + _name;
        $("#activeTab").val(_name);
        $(".btn-container-items .btn").css("backgroundColor", "#45526E");
        $(".btn-container-items ." + _name).css("backgroundColor", "#00d3ee");
        if (_initGd) {
            $(".btn-container-overflow").mCustomScrollbar("scrollTo", _pos, {
                scrollInertia: 200
            });
        }
        showTab(_name);
        hightOneTab();
    };
    // more 更多的选择页切换
    var moreTab = function(event, dom) {
        var _moreBtnText = $(dom).text().trim();
        var _moreBtnJudge = $(dom).data("changeif");
        var _moreTabHref = $(dom).data("href");
        var _pos = "." + _moreBtnJudge;
        appendBtnIframe(_moreBtnText, _moreBtnJudge, _moreTabHref);
        initTabScroll(_pos);
    };
    // moreTab hover 事件
    var moreHover=function(dom){
        $("#li_more>div a").removeClass("pressed");
        $("#"+dom.target.id).addClass("pressed");
        var index=$(this).index();
        $(".tool-container.tool-right.toolbar-primary.animate-flip").css("display","none");
        $(".tool-container.tool-right.toolbar-primary.animate-flip:eq("+index+")").css("display","block");
    };
    // 关闭标签页
    var closeCur = function(e) {
        e.preventDefault();
        var tarBtn = $("#activeTab").val();
        if (tarBtn != "IF_0") {
            var suc = function() {
                var url = "test/json/1.json";
                MSConfig.Ajax(url, {}, "POST")
                    .done(function(data) {

                        MSConfig.SwalAlert("success", "删除!", "标签页已删除!");
                        $(".btn-container-items ." + tarBtn + " i").trigger("click");
                        setTimeout(function() {
                            $(".btn-container-overflow").mCustomScrollbar("update");
                        }, 300);
                    })
                    .fail(function(error) {
                        MSConfig.SwalAlert("error", "OMG", "删除操作失败了!");
                    });
            };
            MSConfig.SwalConfirm("warning", "友情提示", "确定要删除当前标签页吗?", suc);
        } else {
            MSConfig.Toastr("info", "没有可关闭的标签页", "1500", "toast-bottom-right");
        }
    };
    var closeOther = function(e) {
        e.preventDefault();
        var tarBtn = $("#activeTab").val();
        _clickOther = true;
        if (_btnArr.length == 1 && _btnArr[0] == "IF_0") {
            MSConfig.Toastr("info", "没有可关闭的标签页", "1500", "toast-bottom-right");
        } else {
            var suc = function() {
                var url = "test/json/1.json";
                MSConfig.Ajax(url, {}, "POST")
                    .done(function(data) {
                        $(".btn-container-items .btn i").not(".btn-container-items ." + tarBtn + " i").trigger("click");
                        setTimeout(function() {
                            $(".btn-container-overflow").mCustomScrollbar("update");
                        }, 300);
                        MSConfig.SwalAlert("success", "删除!", "其他标签页已删除!");
                    })
                    .fail(function(error) {
                        MSConfig.SwalAlert("error", "OMG", "删除操作失败了!");
                    });
            };
            MSConfig.SwalConfirm("warning", "友情提示", "确定要删除其他标签页吗?", suc);
        }
    };
    var closeAll = function(e) {
        if (_btnArr.length == 1 && _btnArr[0] == "IF_0") {
            MSConfig.Toastr("info", "没有可关闭的标签页", "1500", "toast-bottom-right");
        } else {
            var suc = function() {
                var url = "test/json/1.json";
                MSConfig.Ajax(url, {}, "POST")
                    .done(function(data) {
                        MSConfig.SwalAlert("success", "删除!", "所有标签页已被删除!");
                        $(".btn-container-items .btn i").trigger("click");
                        setTimeout(function() {
                            $(".btn-container-overflow").mCustomScrollbar("update");
                        }, 300);
                    })
                    .fail(function(error) {
                        MSConfig.SwalAlert("error", "OMG", "删除操作失败了!");
                    });
            };
            MSConfig.SwalConfirm("warning", "友情提示", "确定要删除所有标签页吗?", suc);
        }
    };
    // 点击定制按钮
    var activeBtn = function(e) {
        $(".defineBtn .btn").removeClass("activeB");
        $(this).addClass("activeB");
    };
    var initGooey = function() {
        // 初始化 拖动插件
        var _pos = $(window).width() - 100;
        $('#gooey-v').udraggable({
            containment: [40, 140, _pos, _pos]
        });
        // 初始化 快捷操作菜单
        $("#gooey-v").gooeymenu({
            bgColor: "#343a40",
            contentColor: "white",
            style: "circle",
            circle: {
                radius: 65
            },
            margin: "small",
            size: 60,
            bounce: true,
            bounceLength: "small",
            transitionStep: 100,
            hover: "#dc3545",
            active: '#dc3545',
            open: function() {
                $(this).find(".gooey-menu-item").css("background-color", "#ffc107");
                $(this).find(".open-button").css("background-color", "#ffc107");
            },
            close: function() {
                $(this).find(".gooey-menu-item").css("background-color", "#343a40");
                $(this).find(".open-button").css("background-color", "#343a40");
            }
        });
        // 初始化 tooltip
        $(".gooey-menu-item").tipso({
            useTitle: false,
            background: '#000000'
        });
    };
    // 点击保存按钮的事件
    var definedSave = function(e) {
        e.preventDefault();
        var stroeDefinedObj = {};
        var storePage = [];
        var toolTipstr = "";
        var Flagcoming = true;
        $(".defineBtn .btn").each(function(i, v) {
            var isChose = $(v).hasClass("activeB");
            if (isChose) {
                var navbarBg = $(v).data("bg");
                var xiala = $(v).data("xiala");
                stroeDefinedObj.bg = navbarBg;
                stroeDefinedObj.xiala = xiala;
                if (navbarBg != "default") {
                    $("#changeNavbar").attr("class", "mb-1 navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar " + navbarBg);
                    $("#click_navbar>li>.dropdown-menu").attr("class", "dropdown-menu dropdown-menu-right " + xiala);
                } else {
                    $("#changeNavbar").attr("class", "mb-1 navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar");
                    $("#click_navbar>li>.dropdown-menu").attr("class", "dropdown-menu dropdown-menu-right dropdown-unique");
                }
                return false;
            }
        });
        $("#defineTab-pill input[type='checkbox']").each(function(i, v) {
            if ($(v).is(':checked')) {
                var pageItem = {};
                var iconArr = ['fa-bookmark', 'fa-tags', 'fa-columns', 'fa-paw', 'fa-paper-plane', 'fa-meh-o'];
                pageItem.url = $(v).data("itemurl");
                pageItem.iframe = $(v).data("itemiframe");
                pageItem.text = $(v).val();
                if ((storePage.indexOf(pageItem) == -1) && (storePage.length < 6)) {
                    storePage.push(pageItem);
                    toolTipstr += '<a data-href="' + $(v).data("itemurl") + '" data-content="' + $(v).val() + '" data-changeIf="' + pageItem.iframe + '" class="gooey-menu-item topic" data-tipso="' + $(v).val() + '"><i class="fa fa-2x ' + iconArr[storePage.length - 1] + '"></i></a>';
                } else {
                    MSConfig.SwalAlert("error", "友情提示", "标签页最多可定制6个");
                    Flagcoming = false;
                }
            }
        });
        if (Flagcoming) {
            if (storePage.length == 0) {
                toolTipstr += '<a data-href="test/html/0.html" data-content="主页" data-changeIf="IF_0" class="gooey-menu-item topic" data-tipso="主页"><i class="fa fa-bookmark fa-2x"></i> </a>';
                storePage = [{
                    "url": "test/html/0.html",
                    "iframe": "IF_0",
                    "text": "主页"
                }];
            }
            $("#page-container").html(toolTipstr);
            initGooey();
            stroeDefinedObj.changeif = storePage;
            store.set("MS_definedTab", stroeDefinedObj);
            $("#definedCancle").trigger("click");
            MSConfig.Toastr("success", "恭喜你,定制成功", "2500", "toast-top-right");
        }
    };
    // 个性化定制(初始化滚动条)
    var initScroll = function(e) {
        var h = $(window).height() - 160;
        $("#defined-sel").css("maxHeight", h);
        setTimeout(function() {
            MSConfig.Gdt("#defined-sel");
            var flag = store.get("MS_definedTab");
            if (!flag) {
                $("#defineTab-pill input[type='checkbox']").each(function(i, v) {
                    if ($(v).data("chose") == true) {
                        $(v).prop("checked", true);
                    }
                });
            }
        }, 500);
    };
    // 退出登录
    var signOut = function(e) {
        var out = function(index) {
            MSConfig.SwalAlert("success", "退出", "您已成功退出!", 1000);
            setTimeout(function() {
                MSConfig.JumpPage("src/component/login/login.html");
            }, 1200);
        };
        MSConfig.SwalConfirm("warning", "退出", "您确定要退吗?", out);
    };
    // 改变缩放
    var changeFull = function(e) {
        e.preventDefault();
        if ($(this).hasClass("sizeFlag")) {
            $("#changeContainer").addClass("container-fluid");
            $(".g-header").removeClass("hidden");
            $(this).find(".fa").attr("class", "fa fa-expand");
            if ($(".btn-container-items .btn").size() > 1) {
                $("#content-box").css("paddingTop", "152px");
                $("#change-size").css({
                    "left": 15,
                    "top": "152px"
                });
            } else {
                $("#content-box").css("paddingTop", "88px");
                $("#change-size").css({
                    "left": 15,
                    "top": "88px"
                });
            }
            $(this).removeClass("sizeFlag");
            $(".page-footer").show();
        } else {
            $(this).addClass("sizeFlag");
            $("#changeContainer").removeClass("container-fluid");
            $(".g-header").addClass("hidden");
            $("#content-box").css("paddingTop", 0);
            $(this).find(".fa").attr("class", "fa fa-compress");
            $(this).css({
                "left": 0,
                "top": 0
            });
            $(".page-footer").hide();
        }
    };
    // 页面滚动条
    var pageScroll = function() {
        $(window).scroll(function() {
            var _top = $(this).scrollTop();
            if (_top == 0) {
                $(".btn-container").css({
                    "top": '88px'
                });
            } else {
                if (_top >= 840) {
                    $(".go-back").show();
                } else {
                    $(".go-back").hide();
                }
                $(".btn-container").css({
                    "top": "74px"
                });
            }
        });
        $(".go-back").on("click", function() {
            $("html,body").animate({
                scrollTop: "0px"
            }, 500);
        });
    };
    $("body").on("click", ".topic", initGD);
    $(".btn-container-items").on("click", ".btn i", delBtn);
    $(".btn-container-items").on("click", ".btn", changeTabIframe);
    $("body").on('toolbarItemClick', "#li_more>div a", moreTab);
    $("body").on('toolbarShown', "#li_more>div a", moreHover);
    $("body").on("click", "#close_cur", closeCur);
    $("body").on("click", "#close_other", closeOther);
    $("body").on("click", "#close_all", closeAll);
    $(".defineBtn").on("click", ".btn", activeBtn);
    $("#defineTheme").on("click", "#definedSave", definedSave);
    $("body").on("click", "#definedDz", initScroll);
    $(".g-header").on("click", "#definedOut", signOut);
    $("body").on("click", "#change-size", changeFull);
})(jQuery, document, window);
