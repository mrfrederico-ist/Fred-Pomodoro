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
            //.text(time_format(_pomodoro_duration))
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
            path: 'static/sounds/',
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
