$(function() {
    $('#btn-add-task').on('click', function() {
        toggle_add_task();
    });
    $('#btn-cancel-input-task').on('click', function() {
        toggle_add_task();
    });
    // Completed pomodoros in the form:
    // * id&date_time&pomodoro_duration&&id2&date_time2&pomodoro_duration2 ...
    $('.btn-edit-task').on('click', function() {
        init_modal();

        var $task_row = $(this).closest('.row');
        var intervals = $task_row.data('intervals');
        var pomodoros = $task_row.data('pomodoros').split('&&');

        $('#modal-task-name').text($task_row.find('.task-name').text());
        $('#modal-input-task-pomodoros').val(intervals);

        pomodoros.forEach(function(p) {
            var details = p.split('&');
            $('#modal-tasks-body').append(html_pomodoro_detail(details[0], details[1], details[2]));
        });
    });
    $('#btn-modal-edit-task').on('click', function() {
        $('#modal-input-task-pomodoros').prop('disabled', false);
        toggle_modal_edit_task();
    });
    $('#btn-modal-task-cancel').on('click', function() {
        $('#modal-input-task-pomodoros').prop('disabled', true);
        toggle_modal_edit_task();
    });

    function init_modal() {
        $('#modal-tasks-body').empty();
        $('#modal-input-task-pomodoros').prop('disabled', true);
        $('#modal-task-buttons').addClass('hidden');
        $('#btn-modal-edit-task').removeClass('hidden');
    }

    function toggle_add_task() {
        $('#btn-add-task').toggleClass('hidden');
        $('#form-input-new-task').toggleClass('hidden');
    }

    function toggle_modal_edit_task() {
        $('#modal-task-buttons').toggleClass('hidden');
        $('#btn-modal-edit-task').toggleClass('hidden');
    }

    function html_pomodoro_detail(pomo_id, pomo_enddate, pomo_duration) {
        return '' +
        '<div id=pomodoro-'+ pomo_id +' class="row top-gap">' +
            '<div class="col-md-6 col-sm-6 col-xs-6">' +
                '<span>' + pomo_enddate + '</span>' +
            '</div>' +
            '<div class="col-md-6 col-sm-6 col-xs-6 group right">' +
                '<span>' + pomo_duration + '</span>' +
            '</div>' +
        '</div>' +
        '<hr/>';
    }
});
