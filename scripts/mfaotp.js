$(document).ready(function () {
    const url = "/member/pbl/otp/";

    $("#authotp-wrap #pin").on("input", function () {
        var textLength = $(this).val().length;
        $("#btn-proceed").prop("disabled", textLength !== 6);
    });

    $("#authotp-wrap #pin").on("keypress", function (event) {
        if (event.which < 48 || event.which > 57) {
            event.preventDefault();
        }
    });


    $("#btn-proceed").click(function () {
        let channel = $("#channel").val();
        let pin = $("#authotp-wrap #pin").val();
        let correlationId = $("#correlationId").val();

        let elemid = $("#step-parent").val();
        let contentid = $("#step-content").val();

        let uid = null;
        if ("#mfa-uid:visible") {
            uid = $("#mfa-uid").val();
        }

        let data = (uid !== null) ?
                {"channel": channel, "pin": pin, "correlationId": correlationId, "mfa-uid": uid} :
                {"channel": channel, "pin": pin, "correlationId": correlationId};

//        const pageName = "<%= request.getServletPath() %>";
//
//        document.querySelector("form").addEventListener("submit", function () {
//            console.log("Form:", this.name);
//            console.log("Page:", pageName);
//        });

        $.ajax({
            url: url + "validateOTP",
            type: "POST",
            data: data,
            success: function (data) {
                if (data.errorCD === '0') {
                    otptimer(0);

                    if ("#fpwd-userid:visible") {
                        $("#fpwd-userid").val(data.userid);
                    }

                    $(".encpin").addClass("d-none");
                    $('#modal-mfa').modal('hide');
                    stepNavi(elemid, contentid);
                    $("#npwd").val();
                    $("#cpwd").val();

                    if (sqtag === "0") {
                        submitSQs();
                    }

                } else {
                    $("#err-mfa-mod").alert_notif({
                        type: "danger",
                        message: data.errMsg,
                        ico: "bi-exclamation-triangle-fill",
                        containerSelector: "#err-mfa-mod",
                        dismissable: false,
                        autoClose: false

                    });
                    $("#err-mfa-mod").removeClass("d-none");
                    if (data.lockAccount) {
                        $('#modal-accLocked').modal('show');
                        $('#modal-mfa').modal('hide');
                    }
                }
            }
        });
    });

    function resetOtp() {
        $(".encpin").addClass("d-none");
        $("#btn-retopt").addClass("d-none");
        $("#selopt").attr("disabled", false);
        $("#btn-getpin").attr("disabled", true);
        $("#err-mfa-mod").addClass("d-none");
        $("#selopt").val("-");
        $("#selopt").removeClass("is-valid");

        $("#toggle-authopt").removeClass("disabled");
        $("#authopt-ico").removeClass();
        $("#authopt").text("Choose Authentication");
    }

    $("#btn-retopt").click(function () {
        otptimer(0);
        resetOtp();
    });

    $(".btn-ex").click(function () {
        otptimer(0);
        resetOtp();
        $("#toggle-authopt").removeClass("disabled");
    });

    $("#toggle-authoptlist").on("change", '#selopt', function () {
        var selval = $(this).val();

        if (selval !== 'totp' && selval !== '-') {
            $("#btn-getpin").prop("disabled", false);
        } else {
            $("#btn-getpin").prop("disabled", selval !== 'totp');
        }
    });

    $("#toggle-authoptlist").on("click", '.liotp', function () {
        var channel = $(this).data("channel");
        $("#authopt-ico").removeClass();
        $("#authopt-ico").addClass($(this).data("ico") + " me-2");
        $("#authopt").text($(this).data("opt") + " (" + $(this).data("opttype") + ")");

        let src = $("#formtag").val();
        let ssnum = $(".fpwd-form.email #ssnum").val();
        const ua = [
            `userAgent=${navigator.userAgent}`,
            `platform=${navigator.userAgentData?.platform || navigator.platform}`,
            `mobile=${navigator.userAgentData?.mobile || /Mobi|Android|iPhone/i.test(navigator.userAgent)}`,
            `brands=${JSON.stringify(navigator.userAgentData?.brands || [])}`
        ].join('; ');

        $.ajax({
            url: url + "createOTP",
            type: "POST",
            data: {"channel": channel, "src": src, "ssnum": ssnum, "ua": ua},
            success: function (data) {
                $("#channel").val();
                $("#correlationId").val();
                if (data.errorCD === '0') {
                    $(".dv-pin").next(".invalid-feedback").remove();
                    $("#authotp-wrap #pin").removeClass("is-invalid");
                    $(".encpin").removeClass("d-none");
                    $("#authotp-wrap #pin").val("");
                    $("#channel").val(channel);
                    $("#correlationId").val(data.otpMap.correlationId);
                    $("#selopt").attr("disabled", true);
                    $("#btn-getpin").attr("disabled", true);
                    $("#toggle-authopt").addClass("disabled");
                    otptimer(300);
                } else {
                    var errmsg = "The following problem(s) were found in trying to submit this form:";
                    errmsg += '<ul style="list-style-type: disc;" class="mb-0">';
                    errmsg += '<li>' + data.errMsg + '</li>';

                    $("#err-mfa-mod").alert_notif({
                        type: "danger",
                        message: errmsg,
                        ico: "bi-exclamation-triangle-fill",
                        containerSelector: "#err-mfa-mod",
                        dismissable: false,
                        autoClose: false
                    });
                    $("#err-mfa-mod").removeClass("d-none");

                }

            }
        });
    });


    let timerInterval = null;
    function otptimer(timelimit) {
        let TIME_LIMIT = timelimit;
        let timePassed = 0;

        if (TIME_LIMIT === 0) {
            clearInterval(timerInterval);
            $("#otptimer").html("");
        } else {
            onTimesUp();
            timeLeft = TIME_LIMIT;
            $("#otptimer").html(`<span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>`);
            startTimer();
        }

        function onTimesUp() {
            clearInterval(timerInterval);
        }

        function startTimer() {
            timerInterval = setInterval(() => {
                timePassed = timePassed += 1;
                timeLeft = TIME_LIMIT - timePassed;
                document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);

                if (timeLeft === 180) {
                    $("#toggle-authopt").removeClass("disabled");
                }

                if (timeLeft === 0) {
                    onTimesUp();
                    resetOtp();
                }
            }, 1000);
        }

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            return `${minutes}:${seconds}`;
        }

    }

});
