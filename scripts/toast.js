$(document).ready(function () {
    var toastElement = $('#toastMod #toastExpired');

    if (toastElement.length === 0) {
//        console.error('Element with selector "#toastMod #toastExpired" not found.');
        return;
    }

    var inactivityToast = new bootstrap.Toast(toastElement[0]);
    var timeout = 300;
    var idle = 59;
    var countdownInterval;
    var inactivityTimeout;

    function updateStartingCountdown() {
        $('.timer_label').text(timeout);
        timeout--;
        if (timeout == idle) {
            clearInterval(countdownInterval);
            inactivityTimeout = setTimeout(function () {
                inactivityToast.show();
                countdownInterval = setInterval(updateStartingCountdown, 1000); // Update countdown every second
            }, 1000);
        } else if (timeout < 1) {
            window.top.location.href = "/member/pbl/sessionexpired";
        }
    }

    countdownInterval = setInterval(updateStartingCountdown, 1000);

    $("#btn-stylogin").on("click", function () {
        timeout = 300; // Reset starting countdown value
        inactivityToast.hide();
        clearTimeout(inactivityTimeout);
        clearInterval(countdownInterval);
        countdownInterval = setInterval(updateStartingCountdown, 1000);
        $.ajax({
            url: '/employer/auth/keepSessAlive',
            method: 'GET',
            success: function () {
                // Session has been kept alive.
            },
            error: function () {
                // Handle errors if necessary.
            },
        });
    });

    $('#logoutBtn').click(function () {
        inactivityToast.hide();
        clearTimeout(inactivityTimeout);
        clearInterval(countdownInterval);
    });

    $(document).on('mousemove keydown', function () {
        clearTimeout(inactivityTimeout);
        clearInterval(countdownInterval);
        if (!toastElement.is(':visible')) {
            timeout = 300;
        }
        countdownInterval = setInterval(updateStartingCountdown, 1000);
    });
});
