const Server = {
    'tasks_api': 'http://fredmbp:8000/api/tasks/'
};

//Helper functions
function submit_form($form, url, callback) {
    var data=$form.serialize();
    $.ajax({
        url:url,
        type:'POST',
        data:data,
        success:function() {
            callback();
        },
        error: function (error) {
            console.log(error.responseText);
        }
    });
}

function del_remote(url, callback) {
    $.ajax({
        url:url,
        type:'DELETE',
        success:function() {
            callback();
        },
        error: function (error) {
            console.log(error.responseText);
        }
    });
}

//Init
$(function(){
    var csrftoken = Cookies.get('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
});

//Tasks
$(function() {
    $('#tab-tasks').one( "click", function() {
        init();
    });

    $('#form-input-new-task').submit(function (e) {
        e.preventDefault();
        submit_form($(this), Server.tasks_api, init);
    });

    $('#btn-add-task').on('click', function() {
        toggle_add_task();
        $('#input-new-task').val('');
    });
    $('#btn-cancel-input-task').on('click', function() {
        toggle_add_task();
    });

    $('#tasks-content').delegate('.btn-del-task', 'click', function() {
        var id = $(this).data('task-id');

        // Because delegate method may be called more then once
        if( id !== undefined) {
            var url = Server.tasks_api + $(this).data('task-id');

            del_remote(url, init);
        }
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

    function init() {
        $('#tasks-content').empty();
        $('#btn-add-task').removeClass('hidden');
        $('#form-input-new-task').addClass('hidden');

        $.ajax({
            url: Server.tasks_api
        }).then(function (data) {
            data.forEach(function (task) {
                $('#tasks-content').append(
                    html_tasks_detail(task.id, task.name, task.pomodoros.length)
                );
            })
        });
    }

    function init_modal() {
        $('#modal-tasks-body').empty();
        $('#modal-input-task-pomodoros').prop('disabled', true);
        $('#col-modal-task-btns').addClass('hidden');
        $('#btn-modal-edit-task').removeClass('hidden');
    }

    function toggle_add_task() {
        $('#btn-add-task').toggleClass('hidden');
        $('#form-input-new-task').toggleClass('hidden');
    }

    function toggle_modal_edit_task() {
        $('#col-modal-task-btns').toggleClass('hidden');
        $('#btn-modal-edit-task').toggleClass('hidden');
    }

    function html_pomodoro_detail(id, enddate, duration) {
        return '' +
        '<div id=pomodoro-'+ id +' class="row top-gap">' +
            '<div class="col-md-6 col-sm-6 col-xs-6">' +
                '<span>' + enddate + '</span>' +
            '</div>' +
            '<div class="col-md-6 col-sm-6 col-xs-6 group right">' +
                '<span>' + duration + '</span>' +
            '</div>' +
        '</div>' +
        '<hr/>';
    }

    function html_tasks_detail(id, name, num_pomodoros) {
        return ''+
        '<div class="panel panel-default">' +
            '<div class="panel-body">' +
                '<div class="row">' +
                    '<div class="col-md-6 col-sm-6 col-xs-12 text-left col-task-detail">' +
                        '<span class="task-name">'+name+'</span>' +
                    '</div>' +
                    '<div class="col-md-6 col-md-pull-0 col-sm-6 col-xs-12 text-right col-task-detail col-task-detail-btns group-action-btns">' +
                        '<span class="badge">'+num_pomodoros+'</span>' +
                            '<a class="btn-done-task" href="#" data-task-id="'+id+'">' +
                                '<i class="material-icons">done</i></a>' +
                            '<a class="btn-edit-task" data-task-id="'+id+'" data-toggle="modal" data-target="#model-task-options">' +
                                '<i class="material-icons" data-toggle="modal" data-target="model-task-options">info</i></a>' +
                            '<a class="btn-del-task" href="#" data-task-id="'+id+'"><i class="material-icons">delete</i></a> ' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

});

//Pomodoro
$(function() {
    //Constants
    const Timer = {
        UNITS: 'm',
        ADD_VAL: 60,
        SUB_VAL: 60,
        IDLE_COLOR: 'inherit',
        POMODORO_COLOR: '#e51c23',
        BREAK_COLOR: '#ff9800',
        LONG_BREAK_COLOR: '#4caf50'
    };

    var _timer_instance;
    var _seq_pomodoros;
    var _break_next;

    var _pomodoro_duration;
    var _break_duration;
    var _long_break_duration;

    init();

    $('#btn-start-pomodoro').on('click', function() {
        toggle_btn_timer_ctl();
        start_timer(get_next_duration());
    });
    $('#btn-stop-pomodoro').on('click', function() {
        toggle_btn_timer_ctl();
        init();
    });
    $('#btn-next-pomodoro-break').on('click', function() {
        _seq_pomodoros = 0;

        if (_timer_instance === null) {
            _break_next = true;
            toggle_btn_timer_ctl();
        }

        start_timer(get_next_duration());
    });
    $('#btn-plus-pomodoro').on('click', function() {
        if (_timer_instance) {
            var upper_limit = _break_next ? _pomodoro_duration*60 : _break_duration*60;

            var new_durr = _timer_instance.config.duration + Timer.ADD_VAL;

            if (new_durr > upper_limit) {
                reset_timer();
            } else {
                _timer_instance.config.duration = new_durr;
            }
        }
    });
    $('#btn-minus-pomodoro').on('click', function() {
        if (_timer_instance) {
            var new_durr = _timer_instance.config.duration - Timer.SUB_VAL;

            if (new_durr > 0) {
                _timer_instance.config.duration = new_durr;
            }
        }
    });

    function init() {
        _timer_instance = null;
        _seq_pomodoros = 0;
        _break_next = false;
        _pomodoro_duration = $('#setting-duration').val();
        _break_duration = $('#setting-break-duration').val();
        _long_break_duration = $('#setting-long-break-duration').val();

        $('#timer-container')
            .timer('remove')
            .text(time_format(_pomodoro_duration))
            .css('color', Timer.IDLE_COLOR);

        //Notification Sound
        ion.sound({
            sounds: [
                {
                    name: 'bell_ring'
                },
                {
                    name: 'bell_ring',
                    volume: 0.2
                },
                {
                    name: 'bell_ring',
                    volume: 0.3,
                    preload: false
                }
            ],
            volume: 0.5,
            path: SOUNDS_FOLDER_URL,
            preload: true
        });
    }

    function time_format(n){
        return n > 9 ? '' + n + ':00' : '0' + n + ':00';
    }

    function toggle_btn_timer_ctl() {
        $('#btn-start-pomodoro').toggleClass('hidden');
        $('#btn-stop-pomodoro').toggleClass('hidden');
    }

    function start_timer(p_duration) {
        _timer_instance = $('#timer-container')
            .timer('remove')
            .timer({
                countdown: true,
                duration: p_duration + Timer.UNITS,
                format: '%M:%S',
                callback: function() {
                    ion.sound.play('bell_ring');

                    if (_break_next) {
                        _seq_pomodoros++;

                        var completed = parseInt($('#pomodoro-completed').text()) + 1;
                        $('#pomodoro-completed').text(completed + ' ');
                    }

                    start_timer(get_next_duration());
                }
            })
            .data('timer');
    }

    function reset_timer() {
        _timer_instance = $("#timer-container")
            .timer('reset')
            .data('timer');
    }

    function get_next_duration() {
        var seq_to_long_break =
            parseInt($('#setting-pomodoros-to-long-break').val());

        if (_seq_pomodoros === seq_to_long_break) {
            _seq_pomodoros = 0;
            _break_next = false;
            $('#timer-container').css('color', Timer.LONG_BREAK_COLOR);

            return _long_break_duration;
        } else if (_break_next) {
            _break_next = false;
            $('#timer-container').css('color', Timer.BREAK_COLOR);

            return _break_duration;
        }  else {
            $('#timer-container').css('color', Timer.POMODORO_COLOR);
            _break_next = true;

            return _pomodoro_duration;
        }
    }
});

//Settings
$(function(){
    var _old_settings = [];

    $('#btn-add-setting').on('click', function() {
        toggle_settings_actions();

        $('#input-setting-name')
            .prop('disabled', false)
            .val('');

        $('#form-settings').find('.input-number').each(function() {
            _old_settings.push($(this).val());
            $(this).prop('disabled', false).val('');
        });
    });
    $('#btn-cancel-input-setting').on('click', function() {
        toggle_settings_actions();

        $('#form-settings').find('.input-number').each(function() {
            $(this).val(_old_settings.shift());
            $(this).prop('disabled', true);
        });
    });
    $('#btn-edit-setting').on('click', function() {
        toggle_settings_actions();

        $('#input-setting-name')
            .val($('#btn-dropdown-settings').text())
            .prop('disabled', true);

        $('#form-settings').find('.input-number').each(function() {
            _old_settings.push($(this).val());
            $(this).prop('disabled', false);
        });
    });

    function toggle_settings_actions() {
        $('#row-settings-action-btns').toggleClass('hidden');
        $('#row-settings-dropdown').toggleClass('hidden');
        $('#row-settings-form-actions').toggleClass('hidden');
    }
});