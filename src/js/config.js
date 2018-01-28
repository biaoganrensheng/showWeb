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
                console.log(data);
                var render = template.compile(data);
                var html = render(sendData);
                console.log(html);
                document.getElementById(domid).innerHTML = html;
            });
        };
        return Config;
})(jQuery,document,window);

