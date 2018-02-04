/*
        这是整个后台插件的配置文件(采用命名空间的形式封装，页面调用方法：1.引入config.js 2.MSConfig.方法名)
 */
var MSConfig = (function($, doc, win) {
    var Config = {};
    /**
     * [用作内容的提示，可自定义显示时间和位置]
     * @param  {[string]} state   [代表当前提示框的状态 分别是成功、失败、警告、提示(success/error/warning/info) 缺省:必填]
     * @param  {[string]} content [定义提示的内容支持html 缺省:必填]
     * @param  {[string Number]} time    [定义提示框显示的时间 单位毫秒 缺省:5000 注：如果这个值为0 则弹框不消失]
     * @param  {[string]} pos     [定义提示框出现的位置 支持左上、左下、右上、右下、全屏上、全屏下(toast-top-left/toast-bottom-left/toast-top-right/toast-bottom-right/toast-top-full-width/toast-bottom-full-width/) 缺省:toast-top-right]
     */

    Config.Toastr = function(state, content, time, pos) {
        toastr.clear();
        if(time==0){
            var time2;
            time2=time;
        }
        toastr.options = {
            "closeButton": true, // true/false
            "debug": false, // true/false
            "newestOnTop": false, // true/false
            "progressBar": false, // true/false
            "positionClass": pos || "toast-top-right",
            "preventDuplicates": false, //true/false
            "onclick": null,
            "showDuration": "300", // in milliseconds
            "hideDuration": "1000", // in milliseconds
            "timeOut": time||"5000", // in milliseconds
            "extendedTimeOut":time2||"1000", // in milliseconds
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "tapToDismiss":false
        };
        toastr[state](content);
    };

    /**
     * [用作弹框的确认]
     * @param  {[string]} icon   [代表当前弹框的状态 分别是成功、失败、警告、提示(success/error/warning/info) 缺省:提示状态]
     * @param  {[string]} title [定义提示框的title 缺省:‘友情提示’]
     * @param  {[string]} text    [定义提示框内容 缺省:为空]
     * @param  {[string]} fn1     [点击确定(ok)以后的回调函数 缺省:空]
     */
    Config.SwalConfirm = function(state, title, content, fn1) {
        swal({
            title: title || "友情提示",
            text: content || "",
            icon: state || "info",
            button: true,
            dangerMode: true
        }).then(
            function(willDelete) {
                if (willDelete) {
                    fn1 && fn1();
                }
            }
        )
    };
    /**
     * [用作自动消失弹框]
     * @param  {[string]} state   [代表当前弹框的状态 分别是成功、失败、警告、提示(success/error/warning/info) 缺省:成功]
     * @param  {[string]} title [定义提示框的title 缺省:必填]
     * @param  {[string]} content    [定义提示框内容 缺省:必填]
     * @param  {[number]} time     [代表消失的时间，单位毫秒 缺省:2000]
     */
    Config.SwalAlert = function(state, title, content, time) {
        swal(title, content, {
            icon: state || "success",
            buttons: false,
            timer: 2000 || time
        });
    };
    /**
     * [用作ajax的load动画 ，也可以用在页面的loading]
     * @param  {[string]} show   [代表当前loading的状态是(show or hide) 缺省:必填(show or hide)]
     * @param  {[string]} dom [显示loading 的dom 元素("#id"or".class") 缺省:'body']
     * @param  {[string]} text    [定义提示框内容 缺省:'加载中....']
     * @param  {[string]} icon     [加载图标，一个小型的base64的gif图片 缺省：为空]
     * @param  {[string]} content     [忽略icon和text的值，直接在加载框中显示此值 缺省:为空]
     */
    Config.Loading = function(show, dom, text, icon, content) {
        dom = dom || "body";
        $(dom).mLoading({
            text: text || "加载中...",
            icon: icon || "",
            html: false, //设置加载内容是否是html格式，默认值是false
            content: content || "",
            mask: true //是否显示遮罩效果，默认显示
        });
        if (show == "show") {
            $(dom).mLoading("show");
        } else if (show == "hide") {
            $(dom).mLoading("hide");
        }
    };
    /**
     * [用作初始化滚动条]
     * @param  {[string]} dom   [代表当前要初始化滚动条的dom元素("#id"or".class") 缺省：必填]
     * @param  {[number]} time   [代表当前要初始化滚动条延迟的时间数 单位(毫秒) 缺省:100]
     */
    Config.Gdt = function(dom, time) {
        time = time || 100;
        setTimeout(function() {
            $(dom).mCustomScrollbar("destroy");
            $(dom).mCustomScrollbar({
                autoHideScrollbar: true,
                theme: "dark"
            });
        }, time);
    };
    /**
     * [用作初始化layer 弹框(主要用于模板页面)]
     * @param  {[string]} skin   [用于确定弹框的类型(增加(add)、编辑(edit)、查看(look)、自定义(others)) 缺省：必填]
     * @param  {[string]} html   [用于确定弹框的地址 缺省：必填]
     * @param  {[number]} width   [用于确定弹框的宽度(实际应用中视情况而定) 缺省:800]
     * @param  {[number]} height   [用于确定弹框的高度 (实际应用中视情况而定) 缺省:$(window).height() - 300)]
     * @param  {[string]} defineTitle   [用于个性化的传入自定义的title(例如:'张三的寻滩轨迹'而不传'寻滩轨迹') 缺省:空]
     * @param  {[string]} pop   [用于弹框是否全屏化 缺省:空]
     */
    Config.Open = function(skin, html, width, height, defineTitle, pop) {
        null != width && "" != width || (width = 800);
        null != height && "" != height || (height = $(window).height() - 300);
        var title = "",
            isFadeIN = 0;
        switch (skin) {
            case "add":
                title = "增加";
                isFadeIN = .4;
                break;
            case "edit":
                title = "编辑";
                isFadeIN = .4;
                break;
            case "look":
                title = "查看";
                break;
            case "others":
                title = defineTitle;
                break;
        }
        full = layer.open({
            skin: skin,
            type: 2,
            area: [width + "px", height + "px"],
            fix: !1,
            maxmin: !0,
            shade: isFadeIN,
            title: [title, 'color:#fff;font-size:16px;font-weight:bold;letter-spacing:4px;'],
            content: [html, 'yes'],
            zIndex: layer.zIndex,
            min: function(dom) {
                setTimeout(function() {
                    var _left = Math.round(Math.random() * 20 + 30) + "%";
                    var _top = Math.round(Math.random() * 20 + 20) + "%";
                    dom.css({
                        left: _left,
                        top: _top
                    })
                }, 0);
                var modaHide = 'layui-layer-shade' + dom.attr("id").split('layer')[1];
                $(".layui-layer-shade#" + modaHide).css("display", "none");

            },
            restore: function(dom) {
                var modaHide = 'layui-layer-shade' + dom.attr("id").split('layer')[1];
                $(".layui-layer-shade#" + modaHide).css("display", "block");
            },
            cancel: function(index1) {
                layer.close(index1);
                return false;
            },
            success: function(layero) {
                layer.setTop(layero);
            }
        });
        pop && layer.full(full);
    };
    /**
     * [用作表单的提交和验证]
     * @param  {[string]} formDom   [传入表单form的唯一标识(最好为id("#id") 缺省：必填]
     * @param  {[string]} closeInfo   [根据不同的业务场景确定是否要手动触发关闭 缺省:空]
     */
    Config.FormAjax = function(formDom, closeInfo) {
        var isThrought = false;
        var showResponse = function(responseText, statusText) {
            if (responseText.status) {
                if (closeInfo) {
                    $("#ms-submit").attr("class", "btn btn-light-grey disabled");
                    var suc2 = function() {
                        MSConfig.SwalAlert("success", "成功!", "你已关闭成功");
                        setTimeout(function() {
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                        }, 500);
                    };
                    var suc = function() {
                        MSConfig.SwalConfirm("info", "提示", "您确定要关闭当前提交页吗？", suc2);
                    };
                    MSConfig.SwalConfirm("success", '成功', '您已成功提交', suc);
                } else {
                    MSConfig.SwalAlert("success", "成功!", "你已关闭成功");
                    setTimeout(function() {
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                    }, 500);
                }

            } else {
                MSConfig.SwalAlert("error", "错误!", "发生错误,请检查后重新提交!")
            }
        };
        var options = {
            success: showResponse, // 提交后
            // clearForm:false,        // 成功提交后，清除所有的表单元素的值.
            // resetForm:false,        // 成功提交后，重置所有的表单元素的值.
            timeout: 3000
        };
        if ($(formDom).find("input[data-easyform]").length > 0) {
            var eafm = $(formDom).easyform();
            eafm.success = function(ef) {
                isThrought = true;
            };
            eafm.error = function(ef, dom) {
                $(dom).addClass("invalid");
                isThrought = false;
            };
        }
        $(formDom + " #ms-submit").click(function(e) {
            if (isThrought) {
                $(formDom).ajaxSubmit(options);
            }
        });
        $(formDom + ' .inputIsNull').on("focus", function(e) {
            e.preventDefault();
            $(this).removeClass("invalid");
            $(this).removeClass("valid");
        });

    };
    /**
     * [用作调整iframe的高度]
     */
    Config.ResizeIframeHeight=function(){
        var _height = $('body').outerHeight();
        var iframe = window.frameElement;
        iframe.style.height = _height + 'px';
    };
    /**
     * [用作ajax的封装]
     * @param  {[string]} reqUrl   [请求的url地址 缺省：必填]
     * @param  {[string]} reqData   [请求传递的参数对象 缺省:空]
     * @param  {[string]} reqType   [请求类型 缺省:'GET']
     * @param  {[string]} resType   [返回的数据格式 缺省:'json']
     * @param  {[string]} contentType   [请求头文件格式 缺省:'application/x-www-form-urlencoded']
     * @param  {[string]} reqTime   [超时时间 单位(毫秒) 缺省:3000]
     */
    Config.Ajax = function(reqUrl, reqData, reqType, resType, contentType, reqTime) {
        var AJAX = $.ajax({
            url: reqUrl,
            type: reqType || "GET",
            dataType: resType || "json",
            data: reqData || {},
            crossDomain: true,
            contentType: contentType || "application/x-www-form-urlencoded",
            timeout: reqTime || 3000,
            beforeSend: function(XHR) {
                Config.Loading("show");
            },
            complete: function(XHR, TS) {
                Config.Loading("hide");
            }
        });
        return AJAX;
    };
    /**
     * [用作跳转url地址]
     * @param  {[string]} url   [要跳转的url地址 缺省：必填]
     * @param  {[string]} flag   [是否在新页面打开窗口 缺省:覆盖本页面]
     */
    Config.JumpPage = function(url, flag) {
        if (typeof url != "string") {
            Config.SwalAlert("error", "提示", "类型错误,必须是字符串类型");
            return;
        }
        flag == "blank" ? window.open(url) : (window.location.href = url);
    };
    /**
     * [用作art 模板的封装]
     * @param  {[string]} htmlUrl   [模板页的url地址 缺省：必填]
     * @param  {[string]} domid   [页面模板元素的id值('id') 缺省：必填]
     * @param  {[obj]} sendData   [渲染的数据 缺省:必填]
     */
    Config.Tpl = function(htmlUrl, domid, sendData) {
        if (htmlUrl == '') return;
        $.get(htmlUrl, function(data) {
            //console.log(data);
            var render = template.compile(data);
            var html = render(sendData);
            // console.log(html);
            document.getElementById(domid).innerHTML = html;
        });
    };
    return Config;
})(jQuery, document, window);

$('.mdb-select').material_select();

$('.datepicker').pickadate({
    monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthsShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    weekdaysFull: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
    today: '今日',
    clear: '清除',
    close: '关闭',
    firstDay: 1,
    format: 'yyyy-mm-dd',
    formatSubmit: 'yyyy/mm/dd',
    selectMonths: true,
    selectYears: true,
    weekdaysLetter: ['日', '一', '二', '三', '四', '五', '六'],
    labelMonthNext: '下一个月',
    labelMonthPrev: '上一个月',
    labelMonthSelect: '月份选择',
    labelYearSelect: '年份选择',
    min: new Date('1992-1-1'),
    max: new Date('9999/12/12')
});
