var MSConfig=(function($,doc,win){
        var Config={};
        Config.Toastr=function (state,content,time,pos){
            toastr.clear();
            toastr.options = {
                "closeButton": true, // true/false
                "debug": false, // true/false
                "newestOnTop": false, // true/false
                "progressBar": false, // true/false
                "positionClass": pos||"toast-top-right", // toast-top-right / toast-top-left / toast-bottom-right / toast-bottom-left
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
        var title="";
        switch(skin){
            case "add":
                title="增加";
                break;
            case "edit":
                title="编辑";
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
            shade:.4,
            title:[title,'color:#fff;font-size:16px;font-weight:bold;letter-spacing:4px;'],
            content: [html,'yes'],
            min:function(e){
                $(".layui-layer-shade").css("display","none");
            },
            restore:function () {
                $(".layui-layer-shade").css("display","block");
            }
        });
        pop&&layer.full(full);
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

