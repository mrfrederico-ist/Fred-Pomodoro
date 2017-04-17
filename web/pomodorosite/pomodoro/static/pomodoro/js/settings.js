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