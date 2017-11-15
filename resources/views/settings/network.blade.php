@extends('template')

@section('title', 'Wi-Fi')

@section('content')

    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="card">
                <div class="header">
                    <div class="wifi-spinner preloader pl-size-xs pull-right">
                        <div class="spinner-layer pl-pink">
                            <div class="circle-clipper left">
                                <div class="circle"></div>
                            </div>
                            <div class="circle-clipper right">
                                <div class="circle"></div>
                            </div>
                        </div>
                    </div>
                    <h2>
                        CONNECT TO WI-FI
                    </h2>
                </div>
                <div class="body">
                    <p>Double-click the Wireless Network you want to connect to.</p>

                    <div class="row">
                        <div class="col-md-6 col-md-offset-3">
                            <div class="wifi-ct m-t-20">
                                <div class="list-group wifi">
                                    Scanning Wi-Fi networks...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>



    <div class="modal fade" id="wifiPassword" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">{{ $_SESSION['board']['shortmodel'] }}</h4>
                </div>
                <div class="modal-body">
                    <div class="pre-message">
                        <p>Insert the password for the network <strong></strong>:</p>
                        <div class="form-horizontal m-t-20">
                            <div class="row clearfix">
                                <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                    <label for="password">Password</label>
                                </div>
                                <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                    <div class="form-group">
                                        <div class="form-line">
                                            <input type="hidden" name="ssid" id="ssid">
                                            <input type="password" name="password" id="password" class="form-control">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row clearfix">
                                <div class="col-lg-offset-3 col-md-offset-3 col-sm-offset-4 col-xs-offset-5">
                                    <button type="button" id="connect" class="btn btn-primary m-t-15 m-b-20 waves-effect">CONNECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
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

@endsection

@section('scripts')
    <script type="text/javascript" src="/js/settings-network.js"></script>
@endsection