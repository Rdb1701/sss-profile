$(document).ready(function () {

    $("#pin").on("keypress", function (event) {
        var allowedKeys = [8, 46]; // Backspace and Delete
        for (var i = 48; i <= 57; i++) {
            allowedKeys.push(i);
        }
        if ($.inArray(event.which, allowedKeys) === -1) {
            event.preventDefault();
        }
    });

    const totp_url = $("#pageContext").val() + "/auth/totp/";
    const otp_url = $("#pageContext").val() + "/pbl/otp/";

    $("#form-gentotp").validate({
        rules: {
            pwd: {required: true, minlength: 8}
        },
        messages: {
            pwd: {
                required: "Please enter your Password.",
                minlength: "The Password must be at least 8 characters long."
            }
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            if (element.closest(".input-group").length) {
                error.insertAfter(element.closest(".input-group"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        },
        submitHandler: function (form) {

            var elemid = $(form).find(".btn-next").data("parent-id");
            var contentid = $(form).find(".btn-next").data("contentid");

            $.ajax({
                url: totp_url + "valPwd",
                type: "POST",
                data: $(form).serializeArray(),
                success: function (data) {
                    $("#err-totp").addClass("d-none");

                    if (data.errorCD === '0') {
                        $("#qrImg").attr({'src': 'data:image/gif;base64,' + data.qrCode});
                        $("#skey").val(data.secKey);

                        stepNavi(elemid, contentid);
                    } else if (data.errorCD === '1') {

                        if ($("#err-totp").hasClass("d-none")) {
                            $("#err-totp").removeClass("d-none");
                        }

                        var errmsg = "The following problem(s) were found in trying to submit this form:";
                        errmsg += '<ul style="list-style-type: disc;" class="mb-0">';

                        data.errors.forEach(function (error) {
                            errmsg += '<li>' + error + '</li>';
                        });
                        errmsg += '</ul>';

                        $("#err-totp").alert_notif({
                            type: "danger",
                            message: errmsg,
                            ico: "ico-warning mt-1",
                            containerSelector: "#err-totp",
                            dismissable: false,
                            autoClose: false
                        });
                    } else if (data.errorCD === '2') {
                        $("#err-totp").removeClass("d-none");

                        $("#err-totp").alert_notif({
                            type: "danger",
                            message: data.errMsg,
                            ico: "ico-warning mt-1",
                            containerSelector: "#err-totp",
                            dismissable: false,
                            autoClose: false
                        });
                    }
                    return false;
                }
            });
            return false; // prevent default form submission
        }
    });

    $(".btn-act.btn-otp").click(function () {
        var elemid = $(this).data("parent-id");
        var contentid = $(this).data("contentid");
        $.ajax({
            url: otp_url + "createOTP",
            type: "POST",
            data: {"channel": "totp"},
            success: function (data) {
                $("#correlationId").val(data.otpMap.correlationId);
                stepNavi(elemid, contentid);
            }
        });
    });

    $("#form-validatetotp").validate({
        rules: {
            pin: {required: true, minlength: 6}
        },
        messages: {
            pin: {
                required: "Please enter 6-digit One Time Pin.",
                minlength: "The One Time Pin must be a 6-digit numeric code."
            }
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        },
        submitHandler: function (form) {
            var elemid = $(form).find(".btn-next").data("parent-id");
            var contentid = $(form).find(".btn-next").data("contentid");

            $.ajax({
                url: otp_url + "validateOTP",
                type: "POST",
                data: $(form).serializeArray(),
                success: function (data) {
                    $("#err-totp").addClass("d-none");
                    if (data.errorCD === '0') {
                        stepNavi(elemid, contentid);
                    } else if (data.errorCD === '1') {

                        if ($("#err-totp").hasClass("d-none")) {
                            $("#err-totp").removeClass("d-none");
                        }

                        var errmsg = "The following problem(s) were found in trying to submit this form:";
                        errmsg += '<ul style="list-style-type: disc;" class="mb-0">';

                        data.errors.forEach(function (error) {
                            errmsg += '<li>' + error + '</li>';
                        });
                        errmsg += '</ul>';

                        $("#err-totp").alert_notif({
                            type: "danger",
                            message: errmsg,
                            ico: "ico-warning mt-1",
                            containerSelector: "#err-totp",
                            dismissable: false,
                            autoClose: false
                        });
                    } else if (data.errorCD === '2') {

                        if ($("#err-totp").hasClass("d-none")) {
                            $("#err-totp").removeClass("d-none");
                        }

                        $("#err-totp").alert_notif({
                            type: "danger",
                            message: data.errMsg,
                            ico: "ico-warning mt-1",
                            containerSelector: "#err-totp",
                            dismissable: false,
                            autoClose: false
                        });
                        if (data.lockAccount) {
                            $('#setup-totp-body #modal-setup-accLocked').modal('show');
                        }
                    }

                }
            });
            return false; // prevent default form submission
        }
    });


    function stepNavi(elemid, contentid) {
        $(".ws-stepper-content .content").removeClass("active");
        $(elemid).addClass("active");

        $(".ws-stepper-header .step").removeClass("active");
        $('.ws-stepper-header .step[data-target="' + elemid + '"]').removeClass("crossed").addClass("active");
        $('.ws-stepper-header .step[data-target="' + contentid + '"]').addClass("crossed");

        if ($("#pin").is(":visible")) {
            $("#pin").focus();
        }
    }
});