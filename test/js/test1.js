var options = {
    beforeSubmit:  validate,  // 提交前
    success:showResponse // 提交后
    //另外的一些属性:
    //url:       url         // 默认是form的action，如果写的话，会覆盖from的action.
    //type:      type        // 默认是form的method，如果写的话，会覆盖from的method.('get' or 'post').
    //dataType:  null        // 'xml', 'script', or 'json' (接受服务端返回的类型.)
    //clearForm: true        // 成功提交后，清除所有的表单元素的值.
    //resetForm: true        // 成功提交后，重置所有的表单元素的值.
    //由于某种原因,提交陷入无限等待之中,timeout参数就是用来限制请求的时间,
    //当请求大于3秒后，跳出请求.
    //timeout:   3000
};
function validate(formData, jqForm, options) { //在这里对表单进行验证，如果不符合规则，将返回false来阻止表单提交，直到符合规则为止
    var usernameValue = $('.initEasyForm .inputIsNull').fieldValue();
    var valiedFail=false;
    usernameValue.map(function(v,i){
        if(v==""||v==null){
            $('.initEasyForm .inputIsNull').eq(i).addClass("invalid");
            valiedFail=true;
        }
    });
    if(valiedFail){
        return false;
    }
    $('.initEasyForm .inputIsNull').addClass("valid");
    var queryString = $.param(formData); //组装数据//类似 ： name=1&add=2
    return true;
}
function showResponse(responseText, statusText){
    if(responseText.status){
        console.log(responseText.result);
        MSConfig.SwalAlert("success","成功!","您已成功提交!");
        setTimeout(function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },800);
    }else{
        MSConfig.SwalAlert("error","错误!","发生错误,请检查后重新提交!")
    }
}
