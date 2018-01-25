;(function($,doc,win){
    var _sumWidth=$(".btn-container-overflow").outerWidth();
    var _initGd=false;
    var _btnArr=[];
    $(function(){
        MSConfig.Toastr("success","欢迎来到艋顺后台!","3000");
        $("#trigger_index a").trigger("click");
        $(".btn-container").hide();
        $("#content-box").css("paddingTop","88px");
    });
    //iframe 展示
    var showTab=function(name){
        $(".tab-item").css("display","none");
        $("."+name).show();
    };
    //iframe 隐藏
    var hideTab=function(name) {
        $("#content-box ."+name).remove();
    };
    // 根据标签项高亮对应的一级标签(注意循环有点问题)
    var hightOneTab=function(){
        var tarBtn=$("#activeTab").val();
        if(tarBtn!=""){
            $("a[data-changeIf^='IF_'] ").each(function (i,v) {
                var _tar=$(v).data("changeif");
                if(_tar==tarBtn){
                    $("#click_navbar .nav-item").removeClass("active");
                    $(v).parents("li.nav-item").addClass("active");
                    if($(v).hasClass("more-tabs")){
                       $("#li_more").addClass("active");
                    }
                    return false;
                }
            })
        }
    };
    //初始化Iframe 的高度
    var heightIframe=function (dom) {
        dom.load(function () {
            var mainheight = $(this).contents().find("body").height() + 60;
            $(this).height(mainheight);
        });
    };
    //删除按钮的操作
    var delBtn=function(e){
        e.stopPropagation();
        var _targetIf=$(this).parents(".btn").attr("class");
        var _text=_targetIf.split(" ");
        var _name=_text[_text.length-1];
        var _index=_btnArr.indexOf(_name);
        _btnArr.splice(_index,1);
        if(_btnArr.length==0){
            $("#trigger_index a").trigger("click");
        }else{
            $(".btn-container-items ."+_btnArr[_btnArr.length-1]).trigger("click");
        }
        $(this).parents(".btn").remove();
        hideTab(_name);
        $("#activeTab").val(_btnArr[_btnArr.length-1]);
        $(".btn-container-overflow").mCustomScrollbar("update");
        $(".btn-container-items .btn").css("backgroundColor","#45526E");
        $(".btn-container-items ."+_btnArr[_btnArr.length-1]).css("backgroundColor","#00d3ee");
    };
    // 拼接按钮和iframe
    var appendBtnIframe=function(_btnText,_btnJudge,_tabHref){
        var _allBtn="";
        var _itemIframe="";
        $("#activeTab").val(_btnJudge);
        $("#content-box").css("paddingTop","152px");
        if(_btnArr.indexOf(_btnJudge)==-1){
            if(_btnJudge=="IF_0"){
                _allBtn+='<button type="button"  class="btn btn-cyan btn-none '+_btnJudge+'">'
                    +_btnText+
                    '<i class="fa fa-times ml-2"></i></button>';
            }else{
                $(".btn-container").show();
                _allBtn+='<button type="button"  class="btn btn-cyan '+_btnJudge+'">'
                    +_btnText+
                    '<i class="fa fa-times ml-2"></i></button>';
            }
            _itemIframe+='<div class="tab-item '+_btnJudge+'"><iframe onmousewheel="" width="100%" frameborder="0" src="'+_tabHref+'"></iframe></div>';
            $(".btn-container-items").append(_allBtn);
            $(".btn-container-items .btn").css("backgroundColor","#45526E");
            $(".btn-container-items ."+_btnJudge).css("backgroundColor","#00d3ee");
            $("#content-box").append(_itemIframe);
            var domH=$("#content-box ."+_btnJudge+" iframe");
            showTab(_btnJudge);
            heightIframe(domH);
            _btnArr.push(_btnJudge);
        }else{
            if(_btnArr.length==1){
                $(".btn-container").hide();
                $("#content-box").css("paddingTop","88px");
            }
            showTab(_btnJudge);
            $(".btn-container-items .btn").css("backgroundColor","#45526E");
            $(".btn-container-items ."+_btnJudge).css("backgroundColor","#00d3ee");
        }
        hightOneTab();
    };
    // 初始化标签页滚动条
    var initTabScroll=function(pos){
        var _totalW=0;
        $(".btn-container-items .btn").each(function (i,v) {
            _totalW+=($(v).outerWidth()+6);
        });
        if(_initGd){
            $(".btn-container-overflow").mCustomScrollbar("update");
            $(".btn-container-overflow").mCustomScrollbar("scrollTo",pos,{scrollInertia:200});
        }
        if(_totalW>=_sumWidth&&(!_initGd)){
            $(".btn-container-overflow").mCustomScrollbar({
                horizontalScroll:true,
                scrollButtons:{
                    enable:true
                },
                advanced:{
                    autoExpandHorizontalScroll:true
                },
                theme:"dark-thin"
            });
            _initGd=true;
        }
    };
    // 标签页联动
    var initGD=function (){
        var _btnText=($(this).text().trim())!=""?$(this).text().trim():$(this).data("content");
        var _btnJudge=$(this).data("changeif");
        var _tabHref=$(this).data("href");
        var _pos="."+_btnJudge;
        appendBtnIframe(_btnText,_btnJudge,_tabHref);
        initTabScroll(_pos);
    };
    // iframe 切换效果
    var changeTabIframe=function(){
        var _class=$(this).attr("class");
        var _text=_class.split(" ");
        var _name=_text[_text.length-1];
        var _pos="."+_name;
        $("#activeTab").val(_name);
        $(".btn-container-items .btn").css("backgroundColor","#45526E");
        $(".btn-container-items ."+_name).css("backgroundColor","#00d3ee");
        if(_initGd){
            $(".btn-container-overflow").mCustomScrollbar("scrollTo",_pos,{scrollInertia:200});
        }
        showTab(_name);
        hightOneTab();
    };

    // more 更多的选择页切换
    var moreTab=function(event,dom){
        var _moreBtnText=$(dom).text().trim();
        var _moreBtnJudge=$(dom).data("changeif");
        var _moreTabHref=$(dom).data("href");
        var _pos="."+_moreBtnJudge;
        appendBtnIframe(_moreBtnText,_moreBtnJudge,_moreTabHref);
        initTabScroll(_pos);
    };
    // 关闭标签页
    var closeCur=function(e){
        e.preventDefault();
        var tarBtn=$("#activeTab").val();
       if(tarBtn!="IF_0"){
           var suc=function(){
           var url="test/json/1.json";
               MSConfig.Aja(url,{},"POST")
                   .done(function(data){

                       MSConfig.SwalAlert("success","删除!","标签页已删除!");
                       $(".btn-container-items ."+tarBtn+" i").trigger("click");
                   })
                   .fail(function(error){
                       MSConfig.SwalAlert("error","OMG", "删除操作失败了!");
                    });
           };
            MSConfig.SwalConfirm("warning","友情提示","确定要删除当前标签页吗?",suc);
       }else{
           MSConfig.Toastr("info","没有可关闭的标签页","1500","toast-bottom-right");
       }
    };
    var closeOther=function(e){
        e.preventDefault();
        var tarBtn=$("#activeTab").val();
        if(_btnArr.length==1&&_btnArr[0]=="IF_0"){
            MSConfig.Toastr("info","没有可关闭的标签页","1500","toast-bottom-right");
        }else{
            var suc=function(){
                var url="test/json/1.json";
                MSConfig.Aja(url,{},"POST")
                    .done(function(data){
                        $(".btn-container-items .btn i").not(".btn-container-items ."+tarBtn+" i").trigger("click");
                        setTimeout(function () {
                            $(".btn-container-overflow").mCustomScrollbar("update");
                        },300);
                        MSConfig.SwalAlert("success","删除!","其他标签页已删除!");
                    })
                    .fail(function(error){
                        MSConfig.SwalAlert("error","OMG", "删除操作失败了!");
                    });
            };
            MSConfig.SwalConfirm("warning","友情提示","确定要删除其他标签页吗?",suc);
        }
    };
    var closeAll=function(e){
        if(_btnArr.length==1&&_btnArr[0]=="IF_0"){
            MSConfig.Toastr("info","没有可关闭的标签页","1500","toast-bottom-right");
        }else{
            var suc=function(){
                var url="test/json/1.json";
                MSConfig.Aja(url,{},"POST")
                    .done(function(data){
                        MSConfig.SwalAlert("success","删除!","所有标签页已被删除!");
                        $(".btn-container-items .btn i").trigger("click");

                    })
                    .fail(function(error){
                        MSConfig.SwalAlert("error","OMG", "删除操作失败了!");
                    });
            };
            MSConfig.SwalConfirm("warning","友情提示","确定要删除所有标签页吗?",suc);
        }
    };
    // 点击定制按钮
    var activeBtn=function(e){
        $(".defineBtn .btn").removeClass("activeB");
        $(this).addClass("activeB");
    };
    var initGooey=function(){
        /*
   *  draggable
   * */
        $('#gooey-v').udraggable();
        /*
        ** gooeymenu
         */
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
            active:'#dc3545',
            open: function() {
                $(this).find(".gooey-menu-item").css("background-color", "#ffc107");
                $(this).find(".open-button").css("background-color", "#ffc107");
            },
            close: function() {
                $(this).find(".gooey-menu-item").css("background-color", "#343a40");
                $(this).find(".open-button").css("background-color", "#343a40");
            }
        });
        /*
*  tooltip
* */
        $(".gooey-menu-item").tipso({
            useTitle: false,
            background:'#000000'
        });
    };
    // 点击保存按钮的事件
    var definedSave=function(e){
        e.preventDefault();
        var stroeDefinedObj={};
        var storePage=[];
        var toolTipstr="";
        var Flagcoming=true;
        $(".defineBtn .btn").each(function(i,v){
            var isChose=$(v).hasClass("activeB");
            if(isChose){
                var navbarBg=$(v).data("bg");
                var xiala=$(v).data("xiala");
                stroeDefinedObj.bg=navbarBg;
                stroeDefinedObj.xiala=xiala;
                if(navbarBg!="default"){
                    $("#changeNavbar").attr("class","mb-1 navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar "+navbarBg);
                    $("#click_navbar>li>.dropdown-menu").attr("class","dropdown-menu dropdown-menu-right "+xiala);
                }else{
                    $("#changeNavbar").attr("class","mb-1 navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar");
                    $("#click_navbar>li>.dropdown-menu").attr("class","dropdown-menu dropdown-menu-right dropdown-unique");
                }
                return false;
            }
        });
        $("#defineTab-pill input[type='checkbox']").each(function(i,v){
            if($(v).is(':checked')){
                var pageItem={};
                var iconArr=['fa-bookmark','fa-tags','fa-columns','fa-paw','fa-paper-plane','fa-meh-o'];
                pageItem.url=$(v).data("itemurl");
                pageItem.iframe=$(v).data("itemiframe");
                pageItem.text=$(v).val();
                if((storePage.indexOf(pageItem)==-1)&&(storePage.length<6)){
                    storePage.push(pageItem);
                    toolTipstr+='<a data-href="'+$(v).data("itemurl")+'" data-content="'+$(v).val()+'" data-changeIf="'+pageItem.iframe+'" class="gooey-menu-item topic" data-tipso="'+$(v).val()+'"><i class="fa fa-2x '+iconArr[storePage.length-1]+'"></i></a>';
                }else{
                    MSConfig.SwalAlert("error","友情提示","标签页最多可定制6个");
                    Flagcoming=false;
                }
            }
        });
        if(Flagcoming){
            if(storePage.length==0){
                toolTipstr+='<a data-href="test/html/0.html" data-content="主页" data-changeIf="IF_0" class="gooey-menu-item topic" data-tipso="主页"><i class="fa fa-bookmark fa-2x"></i> </a>';
                storePage=[{"url":"test/html/0.html","iframe":"IF_0","text":"主页"}];
            }
            $("#page-container").html(toolTipstr);
            initGooey();
            stroeDefinedObj.changeif=storePage;
            store.set("MS_definedTab",stroeDefinedObj);
            $("#definedCancle").trigger("click");
            MSConfig.Toastr("success","恭喜你,定制成功","2500","toast-top-right");
        }
    };
    // 个性化定制(初始化滚动条)
    var initScroll=function(e){
        var h=$(window).height()-160;
        $("#defined-sel").css("maxHeight",h);
        setTimeout(function(){
            var flag=store.get("MS_definedTab");
            $("#defined-sel").mCustomScrollbar("destroy");
            $("#defined-sel").mCustomScrollbar({
                autoHideScrollbar:false,
                theme:"dark"
            });
            if(!flag){
                $("#defineTab-pill input[type='checkbox']").each(function(i,v){
                    if($(v).data("chose")==true){
                        $(v).prop("checked",true);
                    }
                })
            }
        },500)
    };
    // 退出登录
    var signOut=function(e){
        var out=function(index){
            MSConfig.SwalAlert("success","退出","您已成功退出!",1000);
            setTimeout(function(){
                MSConfig.JumpPage("src/component/login/login.html");
            },1200)
        };
        MSConfig.SwalConfirm("warning","退出","您确定要退吗?",out);
    };
    $("body").on("click",".topic",initGD);
    $(".btn-container-items").on("click",".btn i",delBtn);
    $(".btn-container-items").on("click",".btn",changeTabIframe);
    $("#li_more>div a").on('toolbarItemClick',moreTab);
    $("body").on("click","#close_cur",closeCur);
    $("body").on("click","#close_other",closeOther);
    $("body").on("click","#close_all",closeAll);
    $(".defineBtn").on("click",".btn",activeBtn);
    $("#defineTheme").on("click","#definedSave",definedSave);
    $("body").on("click","#definedDz",initScroll);
    $(".g-header").on("click","#definedOut",signOut);
})(jQuery,document,window);
