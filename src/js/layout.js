;(function($){
    /*
   * 初始化全局的滚动插件
   * **/
 /*  $(window).load(function(){
        $("body").mCustomScrollbar({
            theme:"dark",
            scrollInertia:200,
            scrollEasing:"easeOutCirc",
            mouseWheel:true,
            autoDraggerLength:true,
            scrollButtons:{
                enable:true
            },
           advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(ros){onScroll(ros)},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){scrollTop()},
                onTotalScrollOffset:40,
                onTotalScrollBackOffset:20
            }
        });
        $(".go-back").on("click",function(){
            $("body").mCustomScrollbar("scrollTo","top");
        });
        function scrollTop(){
            $(".scrolling-navbar").css({"paddingTop":".5rem","paddingBottom":".5rem"});
            $(".btn-container").css({"top":'80px'});
        }
        function onScroll(ros){
            if(ros.topPct>=40){
                $(".go-back").show();
            }else{
                $(".go-back").hide();
            }
            $(".scrolling-navbar").css({"paddingTop":"5px","paddingBottom":"5px"});
            $(".btn-container").css({"top":"74px"});
        }
    });*/
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
            $(this).find(".gooey-menu-item").css("background-color", "#007bff");
            $(this).find(".open-button").css("background-color", "#007bff");
        },
        close: function() {
            $(this).find(".gooey-menu-item").css("background-color", "#343a40");
            $(this).find(".open-button").css("background-color", "#343a40");
        }
    });
    /*
    *  tooltip
    * */
    $('[data-toggle="tooltip"]').tooltip();
    /*
    * select
    * */
    $('.mdb-select').material_select();
})(jQuery);

