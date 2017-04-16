//Appearance
$(function() {
    $(window).resize(function(){
        if ($(window).width() <= 767){
            $('.btn-group').addClass('btn-group-vertical');
        } else {
            $('.btn-group').removeClass('btn-group-vertical');
        }
    });
});


//Tasks
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
        $('#model-input-task-pomodoros').val(intervals);
        
        pomodoros.forEach(function(p) {
            var details = p.split('&');
            $('#modal-tasks-body').append(html_pomodoro_detail(details[0], details[1], details[2]));
        }); 
    });
    $('#btn-model-edit-task').on('click', function() {
        $('#model-input-task-pomodoros').prop('disabled', false);
        toggle_modal_edit_task();
    });
    $('#btn-model-task-cancel').on('click', function() {
        $('#model-input-task-pomodoros').prop('disabled', true);
        toggle_modal_edit_task();
    });
    
    function init_modal() {
        $('#modal-tasks-body').empty();
        $('#model-input-task-pomodoros').prop('disabled', true);
        $('#model-task-buttons').addClass('hidden');
        $('#btn-model-edit-task').removeClass('hidden');
    }
    
    function toggle_add_task() {
        $('#btn-add-task').toggleClass('hidden');
        $('#form-input-new-task').toggleClass('hidden');
    }
    
    function toggle_modal_edit_task() {
        $('#model-task-buttons').toggleClass('hidden');
        $('#btn-model-edit-task').toggleClass('hidden');
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