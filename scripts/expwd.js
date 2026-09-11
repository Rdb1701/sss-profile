$("#btn_pwdchange").click(function () {
    $('#expired_pwd').modal('hide');
});

$("#btn_pwdwaived").click(function (e) {
    let pageContext = $("#pageContext").val();
    e.preventDefault();
    $.ajax({
        url: pageContext + "/auth/waivepwd",
        type: "GET",
        success: function (sdata) {
            $('#global_modal').modal('show');
            if (sdata.success == 0) {
                $("#modalMsg").modal_notif({
                    header: "My.SSS Password",
                    type: "success",
                    mod_type: "alert",
                    ico: "bi-check-circle-fill",
                    body: "You have successfully waived your password.",
                    footer: "<button id=\"gmbtn\" type=\"button\" class=\"btn btn-primary\" data-bs-dismiss=\"modal\">Ok</button>"
                });
                $("body").find("#hid_expwd").val("0");
                $("body").find("#daysleft").text(sdata.DAYSLEFT);
                $("body").find("#global_modal #globalmodTag").val("exppwd");
            }
        }
    });
});

 $('#global_modal').on('hidden.bs.modal', function () {
    var globalmodTag = $("body").find("#global_modal #globalmodTag").val();
    if (globalmodTag === "exppwd" || globalmodTag === "sysgenpwd") {
        fetchSeshVars();
    }
});