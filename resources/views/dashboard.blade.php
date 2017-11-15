@extends('template')

@section('title', 'UDOO Web Control Panel')

@section('content')

    <div class="block-header">
        <h2>DASHBOARD</h2>
    </div>

    <div class="row clearfix">
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
            <div class="info-box bg-light-blue hover-zoom-effect">
                <div class="icon">
                    <i class="material-icons">wifi</i>
                </div>
                <div class="content">
                    <div class="text">Wi-Fi <b>{{ $ssid }}</b></div>
                    <div class="number">{{ $wlan }}</div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
            <div class="info-box bg-green hover-zoom-effect">
                <div class="icon">
                    <i class="material-icons">swap_horiz</i>
                </div>
                <div class="content">
                    <div class="text">Ethernet</div>
                    <div class="number">{{ $ethernet }}</div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
            <div class="info-box bg-amber hover-zoom-effect">
                <div class="icon">
                    <i class="material-icons">usb</i>
                </div>
                <div class="content">
                    <div class="text">USB</div>
                    <div class="number">{{ $usb }}</div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
            <div class="info-box bg-orange hover-zoom-effect">
                <div class="icon">
                    <i class="material-icons">cloud</i>
                </div>
                <div class="content">
                    <div class="text">UDOO IoT Cloud</div>
                    <div class="number">{{ $iot['status'] }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="row clearfix">
        <div class="col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>BOARD INFO</h2>
                </div>
                <div class="body">
                    <div class="row">
                        <div class="col-md-4 hidden-sm hidden-xs boardimg">
                            <img class="img-responsive" src="/images/boards/{{ $board['image'] }}" alt="{{ $board['model'] }}">
                        </div>
                        <div class="col-md-4 col-sm-6 col-xs-12 boardinfo">
                            <div class="table-responsive">
                                <table class="table table-hover dashboard-task-infos">
                                    <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td class="text-right">{{ $board['name'] }}</td>
                                    </tr>
                                    <tr>
                                        <td>Model</td>
                                        <td class="text-right">{{ $board['model'] }}</td>
                                    </tr>
                                    <tr>
                                        <td>Serial Number</td>
                                        <td class="text-right">{{ $board['id'] }}</td>
                                    </tr>
                                    <tr>
                                        <td>OS</td>
                                        <td class="text-right">{{ $board['os'] }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="col-md-4 col-sm-6 col-xs-12 boardinfo">
                            <div class="table-responsive">
                                <table class="table table-hover dashboard-task-infos">
                                    <tbody>
                                    <tr>
                                        <td>Uptime</td>
                                        <td class="text-right">{{ $board['uptime'] }}</td>
                                    </tr>
                                    <tr>
                                        <td>Display</td>
                                        <td class="text-right">{{ $board['display'] }}</td>
                                    </tr>
                                    <tr>
                                        <td>CPU Temperature</td>
                                        <td class="text-right">{{ $board['temp'] }} °C</td>
                                    </tr>
                                    <tr>
                                        <td>Internet</td>
                                        <td class="text-right">{{ $board['online'] }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="row clearfix">
        <div class="col-xs-12">
            <div class="card">
                <div class="body home-tips">
                    @if ($default_password)
                        <div class="alert bg-red alert-dismissible" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                            Warning! You have logged in with the default password. Anyone with physical or network access to your board could get in.
                            <a href="{{ route('settings-base') }}">Change board passwords</a> now!
                        </div>
                    @endif

                    @if (!$iot['clientavailable'])
                        <div class="alert bg-teal alert-dismissible" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                            UDOO IoT Cloud service is not ready.
                            <a href="{{ route('iot-service') }}">Install the service</a> to manage your board remotely.
                        </div>
                    @else
                        @if (!$iot['loggedin'])
                            <div class="alert bg-teal alert-dismissible" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                                Your board is not enrolled in the UDOO IoT Cloud.
                                <a href="{{ route('iot-login') }}">Register your board</a> now to control it remotely.
                            </div>
                        @endif
                    @endif

                    <div class="alert alert-warning alert-dismissible updates-checking" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                        Checking updates for {{ $board['os'] }}...
                    </div>

                    <div class="alert bg-green alert-dismissible no-updates hidden" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                        {{ $board['os'] }} is updated.
                    </div>

                    <div class="alert alert-warning alert-dismissible updates-available hidden" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                        There are <span class="nr">0</span> updates available for {{ $board['os'] }}.
                        <a href="{{ route('updates-install') }}">Install the updates</a> now.
                    </div>
               </div>
            </div>
        </div>

    </div>

    <div class="row clearfix">

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div class="card equalheight">
                <div class="header">
                    <h2>SD CARD</h2>
                </div>
                <div class="body">
                    <div id="sdcard_chart" class="graph"></div>
                </div>
            </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div class="card equalheight">
                <div class="header">
                    <h2>RAM MEMORY</h2>
                </div>
                <div class="body">
                    <div id="ram_chart" class="graph"></div>
                </div>
            </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div class="card equalheight">
                <div class="body">
                    <ul class="nav nav-tabs tab-nav-right" role="tablist">
                        <li role="presentation" class="active"><a href="#motionsensors" data-toggle="tab" aria-expanded="true">9-AXIS SENSORS</a></li>
                        <li role="presentation" class=""><a href="#motionsensorsmod" data-toggle="tab" aria-expanded="false">MODULUS</a></li>
                    </ul>
                    <div class="tab-content sensors-padding">
                        <div role="tabpanel" class="tab-pane fade active in sensors-bars" id="motionsensors">
                            <div class="row">
                                <div class="col-xs-2"><img class="iconnet" src="/images/iconacc.png" alt=""></div>
                                <div class="col-xs-10">
                                    <div class="progress accelerometer-x">
                                        <div class="progress-bar progress-bar-success" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                    <div class="progress accelerometer-y">
                                        <div class="progress-bar progress-bar-success" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                    <div class="progress accelerometer-z">
                                        <div class="progress-bar progress-bar-success" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xs-2"><img class="iconnet" src="/images/icongyro.png" alt=""></div>
                                <div class="col-xs-10">
                                    <div class="progress gyroscope-x">
                                        <div class="progress-bar progress-bar-warning" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                    <div class="progress gyroscope-y">
                                        <div class="progress-bar progress-bar-warning" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                    <div class="progress gyroscope-z">
                                        <div class="progress-bar progress-bar-warning" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xs-2"><img class="iconnet" src="/images/iconmagn.png" alt=""></div>
                                <div class="col-xs-10">
                                    <div class="progress magnetometer-x">
                                        <div class="progress-bar progress-bar-danger" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                    <div class="progress magnetometer-y">
                                        <div class="progress-bar progress-bar-danger" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                    <div class="progress magnetometer-z">
                                        <div class="progress-bar progress-bar-danger" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div role="tabpanel" class="tab-pane fade sensors-bars" id="motionsensorsmod">
                            <div class="row">
                                <div class="col-xs-2"><img class="iconnet" src="/images/iconacc.png" alt=""></div>
                                <div class="col-xs-10">
                                    <div class="progress accelerometer-modulus">
                                        <div class="progress-bar progress-bar-success" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xs-2"><img class="iconnet" src="/images/icongyro.png" alt=""></div>
                                <div class="col-xs-10">
                                    <div class="progress gyroscope-modulus">
                                        <div class="progress-bar progress-bar-warning" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xs-2"><img class="iconnet" src="/images/iconmagn.png" alt=""></div>
                                <div class="col-xs-10">
                                    <div class="progress magnetometer-modulus">
                                        <div class="progress-bar progress-bar-danger" role="progressbar" style="width: 0%">
                                            <span class="sr-only"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('scripts')
    <script src="/plugins/reconnecting-websocket.js"></script>
    <script src="/js/dashboard.js"></script>
    <script>
        $(function() {
            initDonut('sdcard_chart',
                [{
                    label: 'Free',
                    value: '{{ number_format($board['disk']['free']/1048576, 1) }} GB'
                }, {
                    label: 'Used',
                    value: '{{ number_format(($board['disk']['used'])/1048576, 1) }} GB'
                }],
                ['rgb(139, 195, 74)', 'rgb(76, 175, 80)']
            );

            initDonut('ram_chart',
                [{
                    label: 'Free',
                    value: '{{ number_format(($board['ram']['total']-$board['ram']['used'])/1024) }} MB'
                }, {
                    label: 'Used',
                    value: '{{ number_format($board['ram']['used']/1024) }} MB'
                }],
                ['rgb(255, 193, 7)', 'rgb(255, 152, 0)']
            );
        });
    </script>
@endsection
