
$(document).ready(function () {
    $(document).on('click', '.parent', function (e) {
        if (!$(e.target).parents('.noClickZone').length) {
            $(this).find('.child').toggleClass('hidden');
        }
    });
});
