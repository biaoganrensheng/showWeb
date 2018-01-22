;(function($){
    $(function(){
    /*
    * 初始化全局的滚动插件
    * **/
        $(window).load(function(){
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
        });
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

    });
})(jQuery);
