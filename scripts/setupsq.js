function secInitialPassQS(message) {
    var validator = $("#form-ini-pwd").validate();
    validator.showErrors({
        "inipassword": message
    });
}

function question1Change() {
    var secQues1 = document.getElementById("QST1").value;
    if (secQues1 != 0) {
        var validator = $("#form-Initial-Question").validate();
        validator.showErrors({
            "QST1": ""
        });
    }
}

function question2Change() {
    var secQues2 = document.getElementById("QST2").value;
    if (secQues2 != 0) {
        var validator = $("#form-Initial-Question").validate();
        validator.showErrors({
            "QST2": ""
        });
    }
}

$(document).ready(function () {
    $("#form-Initial-Question").validate({
        rules: {
            ANS1: {required: true},
            ANS2: {required: true}
        },
        messages: {
            ANS1: {required: "Please supply an answer to the selected security question 1."},
            ANS2: {required: "Please supply an answer to the selected security question 2."},
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            var icon = $("<i class='fas fa-times'></i>").addClass("invalid-icon");
            error.insertAfter(element);
            icon.insertAfter(error);
        }
    });
});

function secQuestionInitial(message1, message2) {
    var validator = $("#form-Initial-Question").validate();
    validator.showErrors({
        "ANS1": message1,
        "ANS2": message2
    });
}

$(document).ready(function () {
    $("#form-Initial-Question").validate({
        rules: {
            QST1: {required: true},
            QST2: {required: true}
        },
        messages: {
            QST1: {required: ""},
            QST2: {required: ""}
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            var icon = $("<i class='fas fa-times'></i>").addClass("invalid-icon");
            error.insertAfter(element);
            icon.insertAfter(error);
        }
    });
});

function secQuestion(message1, message2) {
    var validator = $("#form-Initial-Question").validate();
    validator.showErrors({
        "QST1": message1,
        "QST2": message2
    });

}
$(document).ready(function () {
    $('#secondForm').hide();
    $('#thirdForm').hide();

    $('#submitSetUpQS').click(function () {
        $('#form-Initial').hide();  // Hide the first form (form element)
        $('#firstForm').hide();     // Hide the div with id="firstForm"
        $('#secondForm').show();    // Show the second form
        $('#thirdForm').hide();     // Hide the third form (just to be sure)
        $('#submitSetUpQS').hide(); // Hide the 'Setup Security Questions' button
    });
});

$(document).ready(function () {
    $("#eye").click(function () {
        $(this).toggleClass("ico-show ico-hide");
        var input = $("#inipassword");

        if ($("#inipassword").attr("type") === "password") {
            input.attr("type", "text");
            $(this).prop("title", "Hide");
        } else {
            input.attr("type", "password");
            $(this).prop("title", "Show");
        }
    });


    $("#form-ini-pwd").validate({
        rules: {
            inipassword: {required: true}
        },
        messages: {
            inipassword: {required: "Please enter your Password"}
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element);
            $("#eye").addClass("eye-err").removeClass("eye-def eye-val");
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
            $("#eye").addClass("eye-err").removeClass("eye-def eye-val");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
            $("#eye").addClass("eye-val").removeClass("eye-def eye-err");
        }
    });

//    document.addEventListener('contextmenu', function (e) {
//        e.preventDefault();
//    }, false);

//    $('#secQuesInitial-1').modal({
//        backdrop: 'static',
//        keyboard: false
//    }).modal('show');

    $('#secQuesValidMessage').hide();
    $.ajax({
        type: 'POST',
        url: '/member/auth/getSecInitialList',
        contentType: 'application/json',
        success: function (response) {
            $('#QST1').find('option:not(:first)').remove();
            $('#QST2').find('option:not(:first)').remove();
            responseSecQuesList = response;
            $.each(response, function (index, item) {
                $('#QST1').append(
                        $('<option></option>').attr('value', item.CODE).text(item.SEC_QUESTION)
                        );
                $('#QST2').append(
                        $('<option></option>').attr('value', item.CODE).text(item.SEC_QUESTION)
                        );
            });

        }
    });

});

var selectedSecQues1 = null;
var selectedSecQues2 = null;

function updateDropdown(dropdownId, selectedValue) {
    $('#' + dropdownId).find('option').not(':first').remove();
    $.each(responseSecQuesList, function (index, item) {
        var option = $('<option></option>')
                .attr('value', item.CODE)
                .text(item.SEC_QUESTION);
        if (item.CODE === selectedValue) {
            option.attr('disabled', 'disabled');
        }
        $('#' + dropdownId).append(option);
    });
}

function secQues1Func(value) {
    if (value != 0) {
        var validator = $("#form-Initial-Question").validate();
        validator.showErrors({
            "QST1": ""
        });
    }

    selectedSecQues1 = value;
    $('#QST2').prop('disabled', false);
    updateDropdown('QST2', selectedSecQues1);

    if (selectedSecQues2) {
        $('#QST2').val(selectedSecQues2).change();
    }
}

function secQues2Func(value) {
    if (value != 0) {
        var validator = $("#form-Initial-Question").validate();
        validator.showErrors({
            "QST2": ""
        });
    }

    selectedSecQues2 = value;
    $('#QST1').prop('disabled', false);
    updateDropdown('QST1', selectedSecQues2);

    if (selectedSecQues1) {
        $('#QST1').val(selectedSecQues1).change();
    }
}

$(document).ready(function () {
    if (selectedSecQues1) {
        secQues1Func(selectedSecQues1);
    }
    if (selectedSecQues2) {
        secQues2Func(selectedSecQues2);
    }
});

var secQ1;
var secQ2;
var secA1;
var secA2;

$(document).ready(function () {
    $('#submitInitialSec').click(function () {
        var secQues1 = document.getElementById("QST1").value;
        var secAns1 = document.getElementById("ANS1").value;
        var secQues2 = document.getElementById("QST2").value;
        var secAns2 = document.getElementById("ANS2").value;

        var sucessIndi;
        secAns1 = secAns1.trim();
        secAns2 = secAns2.trim();

        if (secQues1 == 0 && secQues2 == 0) {
            secQuestion("Please choose a security question 1.", "Please choose a security question 2.");
        } else if (secQues1 != 0 && secQues2 != 0) {
            if (secAns1.trim() === "" && secAns2.trim() === "") {
                let message1 = "Please supply an answer to the selected security question 1.";
                let message2 = "Please supply an answer to the selected security question 2.";
                secQuestionInitial(message1, message2);
            } else if (secAns1.trim() !== "" && secAns2.trim() === "") {
                secQuestionInitial("", "Please supply an answer to the selected security question 2.");
            } else if (secAns1.trim() === "" && secAns2.trim() !== "") {
                secQuestionInitial("Please supply an answer to the selected security question 1.", "");
            } else {
                sucessIndi = "1";
            }
        } else if (secQues1 != 0 && secQues2 == 0) {
            let message1 = "Please supply an answer to the selected security question 1.";
            let message2 = "Please choose a security question 2.";
            if (secAns1.trim() === "" && secAns2.trim() !== "") {
                secQuestionInitial(message1, "");
                secQuestion("", message2);
            } else if (secAns1.trim() === "" && secAns2.trim() === "") {
                secQuestionInitial(message1, "Please supply an answer to the selected security question 2");
                secQuestion("", message2);
            } else if (secAns1.trim() !== "" && secQues2 == 0) {
                secQuestion("", "Please choose a security question 2."); //ITO
            } else {
                sucessIndi = "1";
            }
        } else if (secQues2 != 0 && secQues1 == 0) {
            secQuestion("Please choose a security question 1.");
            let message1 = "Please choose a security question 1."; //PROBLEMA
            let message2 = "Please supply an answer to the selected security question 2.";
            if (secAns1.trim() === "" && secAns2.trim() === "") {
                secQuestionInitial(message1, message2);
            } else if (secAns2.trim() === "" && secAns1.trim() !== "") {
                secQuestionInitial("", message2);
                secQuestion(message1, "");
            } else if (secAns2.trim() !== "" && secQues1 == 0) {
                secQuestion("Please choose a security question 1.");
            } else {
                $('#secQuesValidMessage').hide();
                sucessIndi = "1";
            }
        } else {
            $('#secQuesValidMessage').hide();
            sucessIndi = "1";
        }

        if (sucessIndi === "1") {

            secQ1 = secQues1;
            secA1 = secAns1;
            secQ2 = secQues2;
            secA2 = secAns2;

            $('#modal-mfa').modal('show');
        }
    });
});

$(document).ready(function () {
    $('#modal-mfa').on('show.bs.modal', function () {
        $.ajax({
            url: '/member/auth/getAuthMTF',
            type: "GET",
            success: function (data) {
                if (data.errorCD === '0') {
                    var otps = data.otpList;
                    mfa(otps, "#account-details", "#step-content");

                    $("#err-fpwd").addClass("d-none");
                } else {
//                    setError("ssnum", data.errMsg);
                }
            }
        });
    });

});

function submitSQs() {
    var requestData = {
        secQues1: secQ1,
        secAns1: secA1,
        secQues2: secQ2,
        secAns2: secA2
    };

    var jsonData = JSON.stringify(requestData);
    $.ajax({
        type: 'POST',
        url: '/member/auth/getSubmitSecInitial',
        contentType: 'application/json',
        data: jsonData,
        success: function (response) {

            document.getElementById('secTransactNumber').innerHTML = response.transno;
            document.getElementById("transnoDate").innerHTML = response.creationdt;

            $('#modal-mfa').modal('hide');
            $('#firstForm').hide();
            $('#secondForm').hide();
            $('#thirdForm').show();
        }
    });
}

function validateMFA() {
    var otp = $('#authotp-wrap #pin').val();
    var otpPattern = /^\d{6}$/;

    if (otpPattern.test(otp)) {
        return true;
    } else {
        return false;
    }
}



