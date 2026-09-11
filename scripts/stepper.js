$("form[data-stepper='1'] button.submit").click(function () {
    var elemid = $(this).data("parent-id");
    var contentid = $(this).data("contentid");
    stepNavi(elemid, contentid);
});