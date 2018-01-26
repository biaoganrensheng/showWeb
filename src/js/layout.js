;(function($){
    /*
       tool tip (#click_navbar>li .dropdown-menu a:not('#li_more a'))
   * */
    $("#li_more .dropdown-menu a").each(function(i,v){
        var id=$(v).attr("id").trim();
        $('#'+id).toolbar({
            content: '#toolbar-options-'+id,
            position: 'right',
            style: 'primary',
            animation: 'flip',
            event: 'hover'
        })
    });
    var initGooey=function(){
        /*
   *  draggable
   * */
        var _pos=$(window).width()-100;
        $('#gooey-v').udraggable({containment: [ 40, 40, _pos,_pos]});
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
    /** 初始化定制的导航和标签
     */
    var initDefinedTab=function(){
        var his=store.get("MS_definedTab");
        if(his){
            var bg=his.bg;
            var checkedItem=his.changeif;
            var xiala=his.xiala;
            var lovePage="";
            var iconArr=['fa-bookmark','fa-tags','fa-columns','fa-paw','fa-paper-plane','fa-meh-o'];
            $(".defineBtn .btn[data-bg="+bg+"]").addClass("activeB");
            checkedItem.forEach(function(v,i){
                var tarChecked=v.iframe;
                $("#defineTab-pill input[data-itemiframe='"+tarChecked+"']").prop("checked",true);
                lovePage+='<a data-href="'+v.url+'" data-content="'+v.text+'" data-changeIf="'+v.iframe+'" class="gooey-menu-item topic" data-tipso="'+v.text+'"><i class="fa fa-2x '+iconArr[i]+'"></i></a>';
            });
            $("#changeNavbar").attr("class","mb-1 navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar "+bg);
            $("#click_navbar>li>.dropdown-menu").attr("class","dropdown-menu dropdown-menu-right "+xiala);
            $("#page-container").html(lovePage);
            initGooey();
        }

    };
    var pageScroll=function(){
        $(window).scroll(function(){
            var _top=$(this).scrollTop();
            if(_top==0){
                $(".btn-container").css({"top":'88px'});
            }else{
                if(_top>=840){
                    $(".go-back").show();
                }else{
                    $(".go-back").hide();
                }
                $(".btn-container").css({"top":"74px"});
            }
        });
        $(".go-back").on("click",function(){
            $("html,body").animate({scrollTop:"0px"},500);
        });
    };
    var changeFull=function(e){
        e.preventDefault();
        if($(this).hasClass("sizeFlag")){
            $("#changeContainer").addClass("container-fluid");
            $(".g-header").removeClass("hidden");
            $("#content-box").css("paddingTop","88px");
            $(this).find(".fa").attr("class","fa fa-expand");
            if($(".btn-container-items .btn").size()>1){
                $("#change-size").css({"left":15,"top":"152px"});
            }else{
                $("#change-size").css({"left":15,"top":"88px"});
            }
            $(this).removeClass("sizeFlag");
        }else{
            $(this).addClass("sizeFlag");
            $("#changeContainer").removeClass("container-fluid");
            $(".g-header").addClass("hidden");
            $("#content-box").css("paddingTop",0);
            $(this).find(".fa").attr("class","fa fa-compress");
            $(this).css({"left":0,"top":0});
        }
    };
    /*
    * 设置定制框高度*/
    initDefinedTab();
    pageScroll();
    initGooey();
    /*
    * select
    * */
    $('.mdb-select').material_select();
    $("body").on("click","#change-size",changeFull)
})(jQuery);

