$(document).ready(function () {

    $("#npwd").passwordRequirements({
        numCharacters: 8,
        maxNumCharacters: 20,
        useLowercase: true,
        useUppercase: true,
        useNumbers: true,
        useSpecial: true,
        inputSelector: "#npwd",
        fadeTime: 500
    });

    $("#cpwd").passwordRequirements({
        numCharacters: 8,
        maxNumCharacters: 20,
        useLowercase: true,
        useUppercase: true,
        useNumbers: true,
        useSpecial: true,
        inputSelector: "#cpwd",
        fadeTime: 500
    });

    var lowerCase = new RegExp('[a-z]'),
            upperCase = new RegExp('[A-Z]'),
            numbers = new RegExp('[0-9]'),
            specialCharacter = new RegExp('[!,%,&,@,#,$,^,*,?,_,~]');

    $.validator.addMethod("useLowercase", function (value, element) {
        return lowerCase.test(value);
    }, "Please input at least 1 lower case for the password");

    $.validator.addMethod("useUppercase", function (value, element) {
        return upperCase.test(value);
    }, "Please input at least 1 upper case for the password");

    $.validator.addMethod("useNumbers", function (value, element) {
        return numbers.test(value);
    }, "Please input at least 1 number for the password");

    $.validator.addMethod("useSpecial", function (value, element) {
        return specialCharacter.test(value);
    }, "Please input at least 1 special character for the password");

    $("#form-changepwd").validate({
        rules: {
            opwd: {required: true, minlength: 8},
            npwd: {required: true, minlength: 8, useLowercase: true, useUppercase: true, useNumbers: true, useSpecial: true},
            cpwd: {required: true, minlength: 8, equalTo: "#npwd", useLowercase: true, useUppercase: true, useNumbers: true, useSpecial: true}
        },
        messages: {
            opwd: {
                required: "Please enter your old password",
                minlength: "Your password must be at least 8 characters long"
            },
            npwd: {
                required: "Please enter your new password",
                minlength: "Your password must be at least 8 characters long"
            },
            cpwd: {
                required: "Please enter your confirm new password",
                minlength: "Your password must be at least 8 characters long",
                equalTo: "Your passwords do not match"
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
            let pageContext = $("#pageContext").val();
            $.ajax({
                url: pageContext + "/auth/cpwd",
                type: "POST",
                data: $(form).serializeArray(),
                success: function (sdata) {
                    var cptag = $("#changepwdTag").val();

                    if (cptag === "sysgen") {
                        $("#cpwdcontent").addClass("d-none");
                        $("#sysgen_pwdMod .btn-close").removeClass("d-none");
                        $("body").find("#global_modal #globalmodTag").val("sysgenpwd");
                        
                        if (sdata.errCode === 1) {
                            $("#sysgen_pwdMod").modal('hide');
                            $('#modal-accLocked').modal('show');
                            return false;
                        }
                    }

                    var atype = "info";
                    var aico = "bi-info-circle-fill";
                    var msg = "";
                    if (sdata.success == 1) {
                        aico = "bi-check-circle-fill";
                        atype = "success";
                        msg = "You have successfully changed your password.";
                        $("#hid_expwd", parent.document).val("0");
                        $("#daysleft", parent.document).text(sdata.DAYSLEFT);
                        updnotifs();
                    } else {
                        aico = "bi-exclamation-triangle-fill";
                        atype = "danger";
                        msg = sdata.errMsg;
                    }

                    $("#msg").alert_notif({
                        type: atype,
                        message: msg,
                        ico: aico,
                        containerSelector: "#msg",
                        dismissable: false,
                        autoClose: false
                    });
                    $(form).find(":reset").trigger("click");
                    $("#sysgen_pwdMod #msg").show();

                }
            });
            return false;
        }
    });
});

$("#sysgen_pwdMod .btn-close").click(function () {
    $("#sysgen_pwdMod").modal('hide');
    $("#msg").hide();
    $("#form-changepwd").show();
    $("#cpwdcontent").removeClass("d-none");
    $("#sysgen_pwdMod .btn-close").addClass("d-none");
    fetchSeshVars();
});



$('#form-changepwd #btn_pwdclear').click(function (form) {
    $("#form-changepwd #msg").hide();
    clearAll(form);
});

function clearAll() {
    $("#form-changepwd .form-control").removeClass("is-invalid");
    $("#form-changepwd .form-control").removeClass("is-valid");
    $("#form-changepwd .invalid-feedback").hide();
}