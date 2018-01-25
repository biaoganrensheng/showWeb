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
    /*
    * 设置定制框高度*/
    initDefinedTab();
    pageScroll();
    initGooey();
    /*
    * select
    * */
    $('.mdb-select').material_select();
})(jQuery);

