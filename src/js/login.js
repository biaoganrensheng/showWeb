;(function($){
    $(function(){
        $("#login-btn").on("click",function(e){
            // e.preventDefault();
            var user=$("#login-user").val().trim();
            var pwd=$("#login-pwd").val().trim();
            if(user==""){
                $("#login-user").addClass("invalid");
            }
            if(pwd==""){
                $("#login-pwd").addClass("invalid");
            }
        $("#login-user,#login-pwd").on("focus",function(){
            $(this).removeClass("invalid");
            });
            // 发送ajax提交
            if(user&&pwd){
               // $("loginForm").ajaxSubmit();
                $("#modalLogin").modal("hide");
                setTimeout(function(){
                    MSConfig.JumpPage("../../../index.html");
                },300);
            }
        });
    })
})(jQuery);
