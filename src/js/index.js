;(function($,doc,win){
    var _sumWidth=$(".btn-container-overflow").outerWidth();
    var _initGd=false;
    var _btnArr=[];
    $(function(){
        $("#trigger_index a").trigger("click");
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
                }
            })
        }else{
            $("#click_navbar .nav-item").removeClass("active");
            $("#trigger_index").addClass("active");
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
            $("#activeTab").val("");
            hightOneTab();
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
        if(_btnArr.indexOf(_btnJudge)==-1){
            if(_btnJudge=="IF_0"){
                _allBtn+='<button type="button"  class="btn btn-cyan btn-none '+_btnJudge+'">'
                    +_btnText+
                    '<i class="fa fa-times ml-2"></i></button>';
            }else{
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
            showTab(_btnJudge);
            $(".btn-container-items .btn").css("backgroundColor","#45526E");
            $(".btn-container-items ."+_btnJudge).css("backgroundColor","#00d3ee");
        }
    };
    // 初始化标签页滚动条
    var initTabScroll=function(pos){
        var _totalW=0;
        $(".btn-container-items .btn").each(function (i,v) {
            _totalW+=($(v).outerWidth()+4);
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
        var _btnText=$(this).text().trim();
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
    // 高亮tab 页
    var heightTab=function(){
        $("#click_navbar .nav-item").removeClass("active");
        $(this).addClass("active");
    };
    // more 更多的选择页切换
    var moreTab=function(event,dom){
        var _moreBtnText=$(dom).text().trim();
        var _moreBtnJudge=$(dom).data("changeif");
        var _moreTabHref=$(dom).data("href");
        appendBtnIframe(_moreBtnText,_moreBtnJudge,_moreTabHref);
        initTabScroll();
    };
    // 关闭当前标签页
    var closeCur=function(e){
        e.preventDefault();
        var tarBtn=$("#activeTab").val();
       if(tarBtn!="IF_0"){
           $(".btn-container-items ."+tarBtn+" i").trigger("click");
           MSConfig.Toastr("success","当前标签页已关闭!","2000");
       }
    };
    var closeOther=function(e){
        e.preventDefault();
        var tarBtn=$("#activeTab").val();
        $(".btn-container-items .btn i").not(".btn-container-items ."+tarBtn+" i").trigger("click");
        MSConfig.Toastr("success","其他标签页已关闭!","2000");
    };
    var closeAll=function(e){
        $(".btn-container-items .btn i").trigger("click");
        $("#trigger_index a").trigger("click");
        MSConfig.Toastr("success","标签页已全部关闭!","2000");
    };
    $("#navbarSupportedContent").on("click",".topic",initGD);
    $(".btn-container-items").on("click",".btn i",delBtn);
    $(".btn-container-items").on("click",".btn",changeTabIframe);
    $("#click_navbar").on("click",".nav-item",heightTab);
    $("#li_more>div a").on('toolbarItemClick',moreTab);
    $("body").on("click","#close_cur",closeCur);
    $("body").on("click","#close_other",closeOther);
    $("body").on("click","#close_all",closeAll);
})(jQuery,document,window);
