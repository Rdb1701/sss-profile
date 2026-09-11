(function ($) {
    $.fn.extend({
        alert_notif: function (options) {
            var defaults = {
                type: "light", //success, info, warning, danger, primary, secondary, dark, light
                ico: "my ico", // bi-check-circle-fill, ico-info, ico-warning
                message: "my message",
                containerSelector: "#alert",
                dismissable: true,
                autoClose: true,
                delayBeforeFade: 2000,
                fadeTime: 1000 // FadeIn / FadeOut in milliseconds
            };

            options = $.extend(defaults, options);

            return this.each(function () {
                var o = options;
                var pref = '<div id="alert" class="alert alert-' + o.type + ' alert-dismissable w-100 d-flex align-items-start" style="display: none; font-size: 11pt;">',
                        btn = '<button type="button" class="close" data-dismiss="alert" style="line-height: 15px;">&times;</button>',
                        ico = '<i class="font-weight-medium me-2 ' + o.ico + '"></i>',
                        cont = '<span class="alert-msg font-weight-medium table-responsive">' + o.message + '</span>',
                        suff = '</div>',
                        bsalert = '',
                        alertSel = o.containerSelector + " #alert",
                        dismiss = false;

                if (o.fadeTime === 0) {
                    dismiss = true;
                } else {
                    dismiss = o.dismissable;
                }

                if (dismiss === true) {
                    bsalert = pref + btn + ico + cont + suff;
                } else {
                    pref.replace(' alert-dismissable', '');
                    bsalert = pref + ico + cont + suff;
                }

                $(this).html(bsalert);

                if (o.autoClose === true) {
                    $(alertSel).show().delay(o.delayBeforeFade).fadeOut(o.fadeTime);
                } else {
                    $(alertSel).show();
                }
            });
        }
    });
})(jQuery);