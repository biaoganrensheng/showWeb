;(function($){
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
            $(this).find(".fa").attr("class","fa fa-expand");
            if($(".btn-container-items .btn").size()>1){
                $("#content-box").css("paddingTop","152px");
                $("#change-size").css({"left":15,"top":"152px"});
            }else{
                $("#content-box").css("paddingTop","88px");
                $("#change-size").css({"left":15,"top":"88px"});
            }
            $(this).removeClass("sizeFlag");
            $(".page-footer").show();
        }else{
            $(this).addClass("sizeFlag");
            $("#changeContainer").removeClass("container-fluid");
            $(".g-header").addClass("hidden");
            $("#content-box").css("paddingTop",0);
            $(this).find(".fa").attr("class","fa fa-compress");
            $(this).css({"left":0,"top":0});
            $(".page-footer").hide();
        }
    };
    pageScroll();
    /*
    * select
    * */
    $('.mdb-select').material_select();
    $("body").on("click","#change-size",changeFull)
})(jQuery);

