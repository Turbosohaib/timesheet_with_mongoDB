
$(document).ready(function () {
    $('.parent').on('click', function (e) {
        if (!$(e.target).parents('.noClickZone').length) {
            $(this).find('.child').toggleClass('hidden');
        }
    });
});
