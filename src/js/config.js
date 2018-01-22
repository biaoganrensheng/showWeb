var MSConfig=(function($,doc,win){
        /**
         * 初始化ALERT
         * **/
        var MSConfig={};
            MSConfig.Toastr=function (state,content,time,pos){
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
        return MSConfig;
})(jQuery,document,window);
