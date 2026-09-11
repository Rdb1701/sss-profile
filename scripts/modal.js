(function ($) {
    $.fn.extend({
        modal_notif: function (options) {
            
            var defaults = {
                header: "Information",
                type: "light", //success, info, warning, danger, primary, secondary, dark, light
                ico: "my ico", // bi-check-circle-fill, ico-info, ico-warning
                mod_type: "alert", // alert, confirm
                body: "Content Here",
                footer: "My button" //
            };

            options = $.extend(defaults, options);

            return this.each(function () {
                var o = options;
                var header = '<div class="modal-header border-bottom-0"><h5 class="modal-title">' + o.header + '</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>';
                var body = '<div class="modal-body m-4 p-4"><div class="modpwdex-body"><div id="alert" class="alert alert-'+ o.type +' alert-dismissable w-100 d-flex align-items-start"><i class="mnotif-ico font-weight-medium me-2 '+ o.ico +'"></i>' + o.body + '</div></div></div>';
                var footer = '<div class="modal-footer text-center">' + o.footer + '</div>';

                if (o.mod_type !== "alert") {
                    body = '<div class="modal-body m-4 p-4"><div class="modpwdex-body" align="center">' + o.body + '</div></div>';
                }

                bsmodal = header + body + footer;
                $(this).html(bsmodal);
            });
        }
    });
})(jQuery);