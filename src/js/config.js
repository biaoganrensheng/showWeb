var MSConfig=(function($,doc,win){
        var Config={};
        Config.Toastr=function (state,content,time,pos){
            toastr.clear();
            toastr.options = {
                "closeButton": true, // true/false
                "debug": false, // true/false
                "newestOnTop": false, // true/false
                "progressBar": false, // true/false
                "positionClass": pos||"toast-top-right", // toast-top-right / toast-top-left / toast-bottom-right / toast-bottom-left/toast-top-full-width/toast-bottom-full-width
                "preventDuplicates": false, //true/false
                 "onclick": null,
                "showDuration": "300", // in milliseconds
                "hideDuration": "1000", // in milliseconds
                "timeOut": time||"5000", // in milliseconds
                "extendedTimeOut": "1000", // in milliseconds
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };
            toastr[state](content);
        };
        Config.SwalConfirm=function(icon,title,text,fn1){
           swal({
               title: title||"友情提示",
               text: text||"",
               icon: icon||"info",
               button: true,
               dangerMode: true
           }).then(
               function(willDelete){
                   if (willDelete) {
                       fn1&&fn1();
                   }
               }
           )
        };
        Config.SwalAlert=function(state,title,content,time){
            swal(title,content, {
                icon:state||"success",
                buttons: false,
                timer: 2000||time
            });
        };
        Config.Loading=function(show,dom,text,icon,content){
            dom=dom||"body";
            $(dom).mLoading({
                text:text||"加载中...",//加载文字，默认值：加载中...
                icon:icon||"",//加载图标，默认值：一个小型的base64的gif图片
                html:false,//设置加载内容是否是html格式，默认值是false
                content:content||"",//忽略icon和text的值，直接在加载框中显示此值
                mask:true//是否显示遮罩效果，默认显示
            });
            if(show=="show"){
                $(dom).mLoading("show");
            }else if(show=="hide"){
                $(dom).mLoading("hide");
            }
        };
        Config.Gdt=function(dom){
            setTimeout(function(){
                $(dom).mCustomScrollbar("destroy");
                $(dom).mCustomScrollbar({
                    autoHideScrollbar:true,
                    theme:"dark"
                });
            },100);
        };
        Config.Open=function (skin,html,width, height,defineTitle,pop) {
        null != width && "" != width || (width = 800);
        null != height && "" != height || (height= $(window).height() - 300);
        var title="",isFadeIN=0;
        switch(skin){
            case "add":
                title="增加";
                isFadeIN=.4;
                break;
            case "edit":
                title="编辑";
                isFadeIN=.4;
                break;
            case "look":
                title="查看";
                break;
            case "detail":
                title="详情";
                break;
            case "others":
                title=defineTitle;
                break;
        }
        full= layer.open({
            skin:skin,
            type: 2,
            area: [width + "px", height + "px"],
            fix: !1,
            maxmin: !0,
            shade:isFadeIN,
            title:[title,'color:#fff;font-size:16px;font-weight:bold;letter-spacing:4px;'],
            content: [html,'yes'],
            zIndex: layer.zIndex,
            min:function(dom){
                setTimeout(function(){
                    var _left=Math.round(Math.random()*20+30)+"%";
                    var _top=Math.round(Math.random()*20+20)+"%";
                    dom.css({left:_left,top:_top})
                },0);
                var modaHide='layui-layer-shade'+dom.attr("id").split('layer')[1];
                $(".layui-layer-shade#"+modaHide).css("display","none");

            },
            restore:function (dom) {
                var modaHide='layui-layer-shade'+dom.attr("id").split('layer')[1];
                $(".layui-layer-shade#"+modaHide).css("display","block");
            },
            cancel: function(index1){
                layer.close(index1);
                return false;
            },
            success: function(layero){
                layer.setTop(layero);
            }
        });
        pop&&layer.full(full);
    };

        Config.FormAjax=function(formDom,closeInfo){
        var isThrought=false;
        var showResponse=function(responseText, statusText){
            if(responseText.status){
                if(closeInfo){
                    $("#ms-submit").attr("class","btn btn-light-grey disabled");
                    var suc2=function(){
                        MSConfig.SwalAlert("success","成功!","你已关闭成功");
                        setTimeout(function(){
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                        },500);
                    };
                    var suc=function(){
                        MSConfig.SwalConfirm("info","提示","您确定要关闭当前提交页吗？",suc2);
                    };
                    MSConfig.SwalConfirm("success",'成功','您已成功提交',suc);
                }else{
                    MSConfig.SwalAlert("success","成功!","你已关闭成功");
                    setTimeout(function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                    },500);
                }

            }else{
                MSConfig.SwalAlert("error","错误!","发生错误,请检查后重新提交!")
            }
        };
        var options = {
            success:showResponse, // 提交后
           // clearForm:false,        // 成功提交后，清除所有的表单元素的值.
            // resetForm:false,        // 成功提交后，重置所有的表单元素的值.
            timeout:   3000
        };
        if($(formDom).find("input[data-easyform]").length>0){
            var eafm=$(formDom).easyform();
            eafm.success = function(ef){
                isThrought=true;
            };
            eafm.error = function(ef,dom){
                $(dom).addClass("invalid");
                isThrought=false;
            };
        }
        $(formDom+" #ms-submit").click(function(e){
            if(isThrought){
                $(formDom).ajaxSubmit(options);
            }
        });

    };
        Config.Ajax=function(reqUrl,reqData,reqType,resType,contentType,reqTime){
        var AJAX=$.ajax({
            url:reqUrl,
            type:reqType||"GET",
            dataType:resType||"json",
            data:reqData||{},
            crossDomain: true,
            contentType:contentType||"application/x-www-form-urlencoded",
            timeout:reqTime||3000,
            beforeSend:function (XHR) {
                Config.Loading("show");
            },
            complete:function(XHR, TS){
                Config.Loading("hide");
            }
        });
        return AJAX;
    };
        Config.JumpPage=function (url,flag) {
            if(typeof url !="string"){
                Config.SwalAlert("error","提示","类型错误,必须是字符串类型");
                return;
            }
            flag=="blank"?window.open(url):(window.location.href=url);
        };
        Config.Tpl=function(htmlUrl,domid,sendData){
            if(htmlUrl == '') return;
            $.get(htmlUrl, function(data) {
                //console.log(data);
                var render = template.compile(data);
                var html = render(sendData);
               // console.log(html);
                document.getElementById(domid).innerHTML = html;
            });
        };
        return Config;
})(jQuery,document,window);

$('.mdb-select').material_select();
$('.datepicker').pickadate({
    monthsFull: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
    monthsShort: [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二' ],
    weekdaysFull: [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
    weekdaysShort: [ '日', '一', '二', '三', '四', '五', '六' ],
    today: '今日',
    clear: '清除',
    close: '关闭',
    firstDay: 1,
    format: 'yyyy-mm-dd',
    formatSubmit: 'yyyy/mm/dd',
    selectMonths: true,
    selectYears: true,
    weekdaysLetter: [ '日', '一', '二', '三', '四', '五', '六' ],
    labelMonthNext: '下一个月',
    labelMonthPrev: '上一个月',
    labelMonthSelect: '月份选择',
    labelYearSelect: '年份选择',
    min: new Date('1992-1-1'),
    max: new Date('9999/12/12')
});
$('.initEasyForm .inputIsNull').on("focus",function(e){
   e.preventDefault();
   $(this).removeClass("invalid");
   $(this).removeClass("valid");
});

