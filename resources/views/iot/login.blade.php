@extends('template')

@section('title', 'UDOO IoT Cloud')

@section('content')

    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        </div>
    </div>

    @if ($online)
    <div class="row iot-login m-t-100">
        <div class="col-md-offset-4 col-md-4 col-sm-offset-3 col-sm-6">
            <div class="login-box">
                <div class="card">
                    <div class="header noborders">
                        <ul class="header-dropdown m-r--5">
                            <li class="dropdown">
                                <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                    <i class="material-icons">more_vert</i>
                                </a>
                                <ul class="dropdown-menu pull-right">
                                    <li><a href="javascript:void(0);" id="setIoTserver">Set IoT Server</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="body">
                        <form id="sign_in">
                            <div class="msg m-t-10 m-b-50">Your board is not registered in the UDOO IoT Cloud.<br>
                                <br>
                                Register your {{ $hostname }} board now:</div>
                            <div class="input-group">
                                <span class="input-group-addon">
                                    <i class="material-icons">person</i>
                                </span>
                                <div class="form-line">
                                    <input type="text" class="form-control" name="username" placeholder="Username" required value="">
                                </div>
                            </div>
                            <div class="input-group">
                                <span class="input-group-addon">
                                    <i class="material-icons">lock</i>
                                </span>
                                <div class="form-line">
                                    <input type="password" class="form-control" name="password" placeholder="Password" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xs-offset-4 col-xs-4">
                                    <button class="btn btn-block bg-pink waves-effect" type="button" id="iotlogin">SIGN IN</button>
                                </div>
                            </div>

                            <div class="m-t-30 m-b-20">
                                <a href="{{ $iotbaseurl }}/forgot" target="_blank">I forgot my password</a><br>
                                <a href="{{ $iotbaseurl }}/signup" target="_blank">Register a new membership</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @else
    <div class="row iot-login m-t-100">
        <div style="width: 625px !important; margin: 0 auto;">
            <div class="login-box">
                <div class="card">
                    <div class="body">
                        <h2 class="m-t-0">You are offline!</h2>
                        <h4>Please connect your board to the Internet to continue.</h4>
                        <img src="/images/offline.png">
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endif

    <div class="modal fade" id="waitDialog" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{{ $_SESSION['board']['shortmodel'] }}</h4>
                </div>
                <div class="modal-body">
                    <div class="loading">Please wait...
                        <br><br><br>
                        <div class="text-center">
                            <div class="preloader">
                                <div class="spinner-layer pl-pink">
                                    <div class="circle-clipper left">
                                        <div class="circle"></div>
                                    </div>
                                    <div class="circle-clipper right">
                                        <div class="circle"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br><br>
                    </div>
                    <div class="done-message hidden"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">CLOSE</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="waitDialog2" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{{ $_SESSION['board']['shortmodel'] }}</h4>
                </div>
                <div class="modal-body">
                    <div class="loading">Please wait...
                        <br><br><br>
                        <div class="text-center">
                            <div class="preloader">
                                <div class="spinner-layer pl-pink">
                                    <div class="circle-clipper left">
                                        <div class="circle"></div>
                                    </div>
                                    <div class="circle-clipper right">
                                        <div class="circle"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br><br>
                    </div>
                    <div class="done-message hidden"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">CLOSE</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="setServerDialog" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">UDOO IoT Server</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal m-t-20">
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label for="iotserver_ip">Hostname/IP</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <input type="text" name="iotserver_ip" id="iotserver_ip" class="form-control" placeholder="udoo.cloud" value="{{ $iotserver['ip'] }}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label for="iotserver_port">Port</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <input type="text" name="iotserver_port" id="iotserver_port" class="form-control" placeholder="80" value="{{ $iotserver['port'] }}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label for="iotserver_protocol">Protocol</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <select id="iotserver_protocol" class="form-control" name="language">
                                            <option value="http"
                                                    @if ($iotserver['protocol'] == 'http')
                                                    selected="selected"
                                                    @endif
                                            >HTTP</option>
                                            <option value="https"
                                                    @if ($iotserver['protocol'] == 'https')
                                                    selected="selected"
                                                    @endif
                                            >HTTPS</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row clearfix m-t-20">
                            <div class="col-lg-offset-3 col-md-offset-3 col-sm-offset-4 col-xs-offset-5">
                                <button type="button" id="change-iotserver" class="btn btn-primary m-t-15 m-b-20 waves-effect">SAVE SETTINGS</button>
                                <button type="button" class="btn m-t-15 m-b-20 m-r-30 waves-effect pull-right" data-dismiss="modal">CLOSE</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('scripts')
    <script type="text/javascript" src="/js/iot-login.js"></script>
@endsection
