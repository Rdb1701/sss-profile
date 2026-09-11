$(document).ready(function () {
    var pageContext = $("#pageContext").val();
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.navbar-dropdown').length) {
//            $(".dropdown-menu").removeClass("show");
        }
    });

    $('.navbar-dropdown').click(function () {
        var dropdownMenu = $(this).find('.dropdown-menu');
        $(".menu-item").removeClass("open");
    });

    //navbar notif list click event
    $("#dashNotifList li.dropdown-notifications-item").click(function () {
//        console.log("hereee");
        $("#dashnotif-mod").modal("show");
        $(".dropdown-menu").removeClass("show");
        $("#dashmod-title").text($(this).data("title"));
        $("#dashmod-trno").text($(this).data("trno"));
        $("#dashmod-createdt").text($(this).data("createdt"));
        var body = $(this).find("[id^='list-group-item-']");
        $("#dashmod-body").html(body.html());
        var id = $(this).data('id');
        var tag = $(this).data("tag");
        var trno = tag === "txn" ? $(this).data("trno") : $(this).data("id");
        var postData = {tag: tag, transno: trno};

        $.ajax({
            url: pageContext + "/auth/notif/update/?pagePath=NO",
            type: "POST",
            data: postData,
            success: function (response) {
                $(".badge-notifications").html(response);
                $("#badge-notifrd-" + id).remove();

                if (response === "0") {
                    $("#notifcnt").hide();
                }
            }
        });
    });

    //inside notif module - notif list click event
    $(".email-list .email-list-item").click(function () {
        $(".email-list-item, .emails-list-header").hide();
        $(".app-email-view").show();

        $("#notif-title").html($(this).data("title"));
        $("#notif-createdt").html($(this).data("createdt"));

        var notifid = $(this).data("notifid");
        var tag = $(this).data("tag");
        var trno = tag === "txn" ? $(this).data("trno") : $(this).data("id");
        var postData = {tag: tag, transno: trno};
        $(".ico-action.back").attr("data-target", "#accordion-notifs-" + notifid);
        $("#accordion-notifs-" + notifid).toggleClass("d-none");
        $(this).addClass("marked-read");
        $.ajax({
            url: pageContext + "/auth/notif/update/?pagePath=NO",
            type: "POST",
            data: postData,
            success: function (response) {
                if (response === "0") {
                    $(".badge-notifications").remove();
                } else {
                    $(".badge-notifications").html(response);
                    var targetElement = $('#flush-' + notifid);
                    var containerTop = targetElement.position().top; // Get the position relative to the parent

                    // Assuming the parent container is scrollable
                    var parentContainer = targetElement.closest(".email-list");
                    if (parentContainer.length > 0) {
                        parentContainer.animate({
                            scrollTop: parentContainer.scrollTop() + containerTop
                        }, 1000); // 1000 milliseconds for the duration of the scroll
                    } else {
                        // Fallback if no scrollable parent container is found
                        $('html, body').animate({
                            scrollTop: containerTop
                        }, 1000);
                    }
                }
                $("#badge-dot-" + notifid).remove();
            }
        });
    });

    $(".app-email-view-header .ico-action.back").click(function () {
        var target = $(this).data("target");
        $(".email-list-item, .emails-list-header").show();
        $(target).toggleClass("d-none");

    });

    // Click event for the Notifications type (All, Transactions, Announcements)
    $(".email-filter-folders li").on("click", function () {
        var target = $(this).data("target");

        // Remove active class from all and add to the clicked one
        $(".email-filter-folders li").removeClass("active");
        $(this).addClass("active");

        // Filter items
        if (target === "allnotif") {
            $("#app-email-view .email-list-item").show();
        } else {
            $("#app-email-view .email-list-item").each(function () {
                if ($(this).data("tag") === target) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    });


    $("#email-search-input").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#app-email-view li").each(function () {
            var listItem = $(this);
            var notifId = listItem.data("notifid");

            // Get the corresponding bodymsg div using the notifId
            var bodyMsg = $("#bodymsg-" + notifId).text().toLowerCase();

            // Check if either the li or the associated bodymsg contains the search value
            var itemText = listItem.text().toLowerCase();
            var match = itemText.indexOf(value) > -1 || bodyMsg.indexOf(value) > -1;

            // Toggle visibility based on match
            listItem.toggle(match);
        });
    });

    // Click event for the Notifications type (All, Transactions, Announcements)
    $("#email-search-input").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#app-email-view li").each(function () {
            var listItem = $(this);
            var notifId = listItem.data("notifid");

            // Get the corresponding bodymsg div using the notifId
            var bodyMsg = $("#bodymsg-" + notifId).text().toLowerCase();

            // Check if either the li or the associated bodymsg contains the search value
            var itemText = listItem.text().toLowerCase();
            var match = itemText.indexOf(value) > -1 || bodyMsg.indexOf(value) > -1;

            // Toggle visibility based on match
            listItem.toggle(match);
        });
    });

    // Click event for the LABELS
    $(".email-filter-labels li").on("click", function () {
        var target = $(this).data("target");

        // Remove active class from all and add to the clicked one
        $(".email-filter-labels li").removeClass("active");
        $(this).addClass("active");

        // Filter items
        if (target === "unread") {
            $("#app-email-view .email-list-item").each(function () {
                if ($(this).find("span[id^='badge-dot-']").length > 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else if (target === "all") {
            $("#app-email-view .email-list-item").show();
        } else {
            $("#app-email-view .email-list-item").each(function () {
                if ($(this).data("tag") === target || $(this).find(`span[data-appcd='${target}']`).length > 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    });

    $(".email-list-item").click(function () {
        var title = $(this).data("title");
        $("[id^='flush-'] #notifcontent-title").text(title);
    });

});