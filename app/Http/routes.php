<?php

$app->get('/', [
    'as' => 'index', 'uses' => 'IndexController@index'
]);

$app->get('/startwebsocket', [
    'as' => 'startwebsocket', 'uses' => 'IndexController@startwebsocket'
]);

$app->get('/dashboard', [
    'as' => 'dashboard', 'uses' => 'IndexController@dashboard'
]);

$app->get('/terminal', [
    'as' => 'terminal', 'uses' => 'TerminalController@index'
]);

$app->get('/terminal/start', [
    'as' => 'terminal-start', 'uses' => 'TerminalController@start'
]);


/* LOGIN */
$app->get('/login', [
    'as' => 'login', 'uses' => 'LoginController@index'
]);

$app->post('/login', [
    'as' => 'login', 'uses' => 'LoginController@login'
]);

$app->get('/logout', [
    'as' => 'logout', 'uses' => 'LoginController@logout'
]);


/* ARDUINO */
$app->get('/arduino/samples', [
    'as' => 'arduino-samples', 'uses' => 'ArduinoController@samples'
]);

$app->get('/arduino/webide', [
    'as' => 'arduino-webide', 'uses' => 'ArduinoController@webide'
]);

$app->get('/arduino/appinventor', [
    'as' => 'arduino-appinventor', 'uses' => 'ArduinoController@appinventor'
]);

$app->get('/arduino/ardublockly', [
    'as' => 'arduino-ardublockly', 'uses' => 'ArduinoController@ardublockly'
]);

$app->post('/arduino/ardublocklycompile', [
    'as' => 'arduino-ardublocklycompile', 'uses' => 'ArduinoController@ardublocklycompile'
]);

$app->get('/arduino/uploadsketch/{sketch:[A-Za-z]+}', [
    'as' => 'arduino-upload', 'uses' => 'ArduinoController@uploadsketch'
]);

$app->post('/arduino/compilesketch', [
    'as' => 'arduino-compilesketch', 'uses' => 'ArduinoController@compilesketch'
]);


/* SETTINGS */
$app->get('/settings/base', [
    'as' => 'settings-base', 'uses' => 'SettingsController@base'
]);

$app->post('/settings/change-password', [
    'as' => 'settings-changepassword', 'uses' => 'SettingsController@changepassword'
]);

$app->post('/settings/set-hostname', [
    'as' => 'settings-sethostname', 'uses' => 'SettingsController@sethostname'
]);

$app->get('/settings/network', [
    'as' => 'settings-network', 'uses' => 'SettingsController@network'
]);

$app->get('/settings/wifi-networks', [
    'as' => 'settings-wifinetworks', 'uses' => 'SettingsController@wifinetworks'
]);

$app->post('/settings/wifi-connect', [
    'as' => 'settings-wificonnect', 'uses' => 'SettingsController@wificonnect'
]);

$app->get('/settings/regional', [
    'as' => 'settings-regional', 'uses' => 'SettingsController@regional'
]);

$app->get('/settings/regional-languages/{lang:[A-Za-z]+}', [
    'as' => 'settings-regionallanguages', 'uses' => 'SettingsController@regionallanguages'
]);

$app->post('/settings/regional-update', [
    'as' => 'settings-regionalupdate', 'uses' => 'SettingsController@regionalupdate'
]);

$app->get('/settings/advanced', [
    'as' => 'settings-advanced', 'uses' => 'SettingsController@advanced'
]);

$app->post('/settings/set-video', [
    'as' => 'settings-setvideo', 'uses' => 'SettingsController@setvideo'
]);

$app->post('/settings/set-m4', [
    'as' => 'settings-setm4', 'uses' => 'SettingsController@setm4'
]);

$app->post('/settings/set-http-port', [
    'as' => 'settings-sethttpport', 'uses' => 'SettingsController@sethttpport'
]);

$app->post('/settings/set-autostart', [
    'as' => 'settings-setautostart', 'uses' => 'SettingsController@setautostart'
]);


/* IOT */
$app->get('/iot', [
    'as' => 'iot-index', 'uses' => 'IotController@index'
]);

$app->get('/iot/login', [
    'as' => 'iot-login', 'uses' => 'IotController@login'
]);

$app->get('/iot/logout', [
    'as' => 'iot-logout', 'uses' => 'IotController@logout'
]);

$app->post('/iot/register', [
    'as' => 'iot-register', 'uses' => 'IotController@register'
]);

$app->post('/iot/unregister', [
    'as' => 'iot-unregister', 'uses' => 'IotController@unregister'
]);

$app->post('/iot/set-server', [
    'as' => 'iot-setserver', 'uses' => 'IotController@setserver'
]);

$app->get('/iot/service', [
    'as' => 'iot-service', 'uses' => 'IotController@service'
]);

$app->get('/iot/log', [
    'as' => 'iot-log', 'uses' => 'IotController@log'
]);

$app->get('/iot/log-server', [
    'as' => 'iot-logserver', 'uses' => 'IotController@logserver'
]);


/* POWER */
$app->get('/power/reboot', [
    'as' => 'power-reboot', 'uses' => 'PowerController@reboot'
]);

$app->get('/power/reboot-action', [
    'as' => 'power-reboot-action', 'uses' => 'PowerController@rebootaction'
]);

$app->get('/power/poweroff', [
    'as' => 'power-poweroff', 'uses' => 'PowerController@poweroff'
]);

$app->get('/power/poweroff-action', [
    'as' => 'power-poweroff-action', 'uses' => 'PowerController@poweroffaction'
]);


/* UPDATES */
$app->get('/updates/update', [
    'as' => 'updates-update', 'uses' => 'UpdatesController@update'
]);

$app->get('/settings/advanced-install', [
    'as' => 'updates-install', 'uses' => 'UpdatesController@install'
]);

$app->get('/updates/installed', [
    'as' => 'updates-installed', 'uses' => 'UpdatesController@installed'
]);

$app->get('/updates/dist-upgrade', [
    'as' => 'updates-distupgrade', 'uses' => 'UpdatesController@distupgrade'
]);
