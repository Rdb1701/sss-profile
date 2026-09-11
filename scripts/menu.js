$(document).on('click', function (event) {
    if (!$(event.target).closest('.menu-item').length) {
        $(".menu-item").removeClass("open");
    }
});

$(".menu-item").on("click", function () {
    $(this).addClass("open");
    $(".menu-item").not(this).removeClass("open");
    $(".dropdown-menu").removeClass("show");
});

$(".menu-sub .menu-item .menu-link").on("click", function (e) {
    e.preventDefault();
    var ajx_url = $(this).attr("href");
    var dataModValue = $(this).data("mod");
    var dataModParent = $(this).data("parent");

    if (dataModValue === 117) {//appointment
        var modal = new bootstrap.Modal(document.getElementById('apptModal'));
        modal.show();
        return;
    }

    if (ajx_url === "#") {
        event.preventDefault();
        event.stopPropagation();
        return false;
    } else {
        $.ajax({
            type: 'GET',
            url: ajx_url,
            dataType: "html",
            success: function (data) {
                $('#maincontent').html(data);

                // Array of class names to disable
                var classesToDisable = $("#dsbldModBtns").val().replace(/\[|\]/g, '').split(",");
                if (classesToDisable.length > 0) {
                    var classesToDisableArr = $.map(classesToDisable, function (element) {
                        return element.replace(/'/g, '');
                    });

                    if (classesToDisableArr.length > 0 && classesToDisableArr[0] !== '') {
                        classesToDisableArr.map(function (className) {
                            $("." + $.trim(className)).addClass('d-none');
                        });
                    }
                }

                $(".menu-item").removeClass("open");
                $('.nav-link[data-mod="' + dataModValue + '"]').addClass("active");
                $('.main.menu-item').removeClass("active");
                $('.main.menu-item[data-menuid="' + dataModParent + '"]').addClass("active");
                $('#sidemenu [data-bs-dismiss="offcanvas"]').trigger('click');
                $('.nav-link[data-mod="' + dataModValue + '"]').addClass("active");
                fetchSeshVars();
                iniModals();
            }
        });
    }

});

// JavaScript for dynamic toggling (added Apr-11-2023)
window.addEventListener('resize', function () {
    const isMobileView = window.innerWidth <= 532;

    const mobileViewElement = document.querySelector('.mobile-view');
    const desktopViewElement = document.querySelector('.desktop-view');

    if (mobileViewElement) {
        mobileViewElement.style.display = isMobileView ? 'block' : 'none';
    } else {
//        console.error('Element with class ".mobile-view" not found.');
    }

    if (desktopViewElement) {
        desktopViewElement.style.display = isMobileView ? 'none' : 'block';
    } else {
//        console.error('Element with class ".desktop-view" not found.');
    }
});



//$("#sidebar-toggler").click(function(){
//    $("#menu").toggleClass("d-none")
//    $("#menu").removeClass("menu-horizontal").addClass("menu-vertical");
//});

// Function to close offcanvas on large screens
function closeOffcanvasOnLargeScreens() {
    if ($(window).width() >= 992) { // Adjust breakpoint as needed
        $('#sidemenu').offcanvas('hide'); // Close the offcanvas
    }
}

// Close offcanvas on page load (optional)
$(document).ready(closeOffcanvasOnLargeScreens);

// Close offcanvas on window resize
$(window).resize(closeOffcanvasOnLargeScreens);

$(".dropdown-notifications-list .dropdown-shortcuts-item.appoint a").click(function () {
    var dropdownMenu = $(this).closest('.dropdown-menu');
    if (dropdownMenu.length) {
        var dropdownToggle = dropdownMenu.prev('.dropdown-toggle');
        dropdownToggle.dropdown('hide');
    }
});

$("#calluci").click(function () {
    $.ajax({
        type: "GET",
        url: "/member/auth/navi/module/eeinfo/updateContactInfo/88/tree",
        dataType: "html",
        success: function (data) {
            $("#modal-ucicontent").html(data);
            $("#modal-uci").modal("show");
        }
    });
});