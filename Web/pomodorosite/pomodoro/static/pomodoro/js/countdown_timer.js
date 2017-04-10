$(function ($) {
    $("#countdown-container").timer({
        countdown: true,
        duration: '60s',
        format: '%M:%S'
    });
});