//let totop = document.getElementById("back-to-top");
function updateTime() {
    var currentDate = new Date();
    const options = {
        timeZone: "Asia/Manila",
        dateStyle: "full",
        timeStyle: "medium"
    };

    const pstTime = currentDate.toLocaleString("en-US", options);

    $(".pst").text(pstTime);
    setTimeout(updateTime, 1000);
}

var sqtag = "";
var blktag = "";
var uciTag = "";
var exppwdTag = "";
var sysgenpwdTag = "";

function gotoPage(element, path, type) {
    var ind = $(element).data("ind");

    if (typeof ind === "undefined") {
        fetchSeshVars();
        if (exppwdTag === "1") {
            $("#expired_pwd").modal("show");
        } else if (sysgenpwdTag === "1") {
            $("#sysgen_pwdMod").modal("show");
        } else {
            iniModals();
            callPage(element, path, type);
        }
    } else if (ind === "exppwd") {
        callPage(element, path, type);
    }



}

function callPage(element, path, type) {
    $.ajax({
        type: type,
        url: path,
        dataType: "html",
        success: function (data) {
            $('#maincontent').html(data);

            var dataModValue = $(element).data("mod");
            var dataModParent = $(element).data("modparent");

            //profile dropdown menu
            if (typeof dataModValue !== "undefined") {
                $('.nav-link[data-mod="' + dataModValue + '"]').addClass("active");
                $('.main.menu-item').removeClass("active");
                $('.main.menu-item[data-menuid="' + dataModParent + '"]').addClass("active");
                $('.dropdown-menu').removeClass("show");

                if (dataModValue === 61 || dataModValue === 81) { //avatar dropdown
                    $("#meminfonbar-wrapper").addClass("d-none");
                } else {
                    $("#meminfonbar-wrapper").removeClass("d-none");
                }
            }

            $('.nav-link[data-mod="' + dataModValue + '"]').addClass("active");
            $("[data-bs-dismiss='offcanvas']").trigger("click");
        }
    });
}

function closeToast(id) {
    $("#" + id).toast("hide");
}

//window.onscroll = function () {
//    scrollFunction();
//};
//
//function scrollFunction() {
//    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
//        totop.style.display = "block";
//    } else {
//        totop.style.display = "none";
//    }
//}

//totop.addEventListener("click", backToTop);
//
//function backToTop() {
//    document.body.scrollTop = 0;
//    document.documentElement.scrollTop = 0;
//}

function goBack(path) {
    window.location.href = path;
}

function clearForm(form) {
    $(form)[0].reset();
}

function stepNavi(elemid, contentid) { // elemid - pagetogo, contentid - mycontent
    $("body").find(".ws-stepper-content .content").removeClass("active");
    $("body").find(elemid).addClass("active");
    $("body").find(".ws-stepper-header .step").removeClass("active");
    $("body").find('.ws-stepper-header .step[data-target="' + elemid + '"]').removeClass("crossed").addClass("active");
    $("body").find('.ws-stepper-header .step[data-target="' + contentid + '"]').addClass("crossed");

    if ($("#otp").is(":visible")) {
        $("#otp").focus();
    }

//    $('html, body').animate({ scrollTop: 0 }, 'slow');

}


function mfa(otps, content, parent) {
    $("#err-mfa-mod").addClass("d-none");

    if (typeof (otps) !== "undefined") {
        otps = otps.filter(function (item) {
            return !(item.challengeType === "sms" && item.prompt === "0");
        });

        var optlist = '';
        var mfacnt = otps.length;

        otps.forEach(function (item, index) {
            var divider = (index < otps.length - 1) ? '<li><hr class="dropdown-divider"></li>' : '';
            var otp_type = item.prompt;
            var ico = "bi bi-qr-code-scan";

            if (item.prompt === 'Totp') {
                otp_type = 'Authenticator App';
            }

            if (item.challengeType === "sms") {
                ico = "bi bi-chat-square-dots";
            } else if (item.challengeType === "email") {
                ico = "bi bi-envelope-at";
                mfacnt = mfacnt === 1 ? 0 : mfacnt;
            }

            if (item.challengeType !== 'email') {
                optlist += '<li class="liotp" data-channel="' + item.challengeType + '" ' +
                        'data-opt="' + item.challengeMsg + '" data-opttype = "' + otp_type + '" data-ico="' + ico + '">' +
                        '<a class="dropdown-item text-wrap d-flex justify-content-start" href="#"> ' +
                        '<i class="' + ico + ' me-2"></i>' +
                        '<span>' + item.challengeMsg +
                        '<span class="badge bg-label-primary nodecor ms-2">' + otp_type + '</span>' +
                        '</span>' +
                        '</a>' +
                        '</li>' + divider;
            }



        });

        if (mfacnt === 0) {
            $("#mfa-container").empty();
            $("#mfa-container").html("<div class=\"alert alert-info d-flex align-items-start\" role=\"alert\">" +
                    "<i class=\"ico-info me-2 mt-1\"></i> " +
                    "<span>" +
                    "Kindly visit the nearest SSS branch to update your contact details as soon as possible. Keeping your information current helps us ensure the security of your transactions." +
                    "</span>" +
                    "</div>");

        } else {
            $('#toggle-authoptlist').empty();
            $('#toggle-authoptlist').append(optlist + '</ul>');

            if ($("#toggle-authoptlist").hasClass("d-none")) {
                $("#toggle-authoptlist").removeClass("d-none");
            }

            $("#step-content").val(content);
            $("#step-parent").val(parent);

        }

        $("#modal-mfa").modal("show");
    } else {
        $("#mfa-container").empty();
        $("#mfa-container").html("<div class=\"alert alert-info d-flex align-items-start\" role=\"alert\">" +
                "<i class=\"ico-info me-2 mt-1\"></i> " +
                "<span>" +
                "You currently do not have any available Multi-Factor Authentication (MFA) option. You may set up a Time-based One-Time Password (TOTP) in your My.SSS account or visit the nearest SSS branch to update your contact details as soon as possible. Keeping your information current helps us ensure the security of your transactions." +
                "</span>" +
                "</div>");
        $("#modal-mfa").modal("show");
    }

}

function updnotifs() {
    $.ajax({
        url: "/member/auth/notif/updnotiflist",
        type: "POST",
        success: function (response) {
            $("#notiflistctnr").html(response);
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", error);
        }
    });
}

$(document).ready(function () {
    $('.toggle-password').off('click').on('click', function () {
        // Find the closest container that has the input
        let container = $(this).closest('.input-group, .form-float-wrapper, .form-floating');

        if (!container.length) return; // Exit if no container found

        // Find the input inside the container (password or text type)
        let input = container.find('input[type="password"], input[type="text"]');

        if (!input.length) return; // Exit if no input found

        if (input.attr("type") === "password") {
            input.attr("type", "text");
            $(this).prop("title", "Hide");
            $(this).text("Hide");
        } else {
            input.attr("type", "password");
            $(this).prop("title", "Show");
            $(this).text("Show");
        }
    });
});


window.scrollToElement = function ($el, offset = 0, duration = 300) {
    if (!$el.length)
        return;

    // find nearest scrollable parent
    var $scrollParent = $el.parents().filter(function () {
        var overflowY = $(this).css('overflow-y');
        var canScroll = (overflowY === 'auto' || overflowY === 'scroll') && this.scrollHeight > this.clientHeight;
        return canScroll;
    }).first();

    if ($scrollParent.length) {
        // scroll that container
        $scrollParent.animate({
            scrollTop: $scrollParent.scrollTop() + $el.position().top - offset
        }, duration);
    } else {
        // fallback to page scroll
        $('html, body').animate({scrollTop: $el.offset().top - offset}, duration);
}
};
