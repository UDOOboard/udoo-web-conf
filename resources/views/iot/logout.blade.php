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
                    <div class="body">
                        <form id="sign_in">
                            <div class="msg m-t-30 m-b-50">To unbind this board from your UDOO IoT Cloud account, enter your details again:</div>
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

                            <div class="row m-t-40">
                                <div class="col-xs-offset-4 col-xs-4">
                                    <button class="btn btn-block bg-pink waves-effect" type="button" id="iotlogout">SIGN OUT</button>
                                </div>
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

@endsection

@section('scripts')
    <script type="text/javascript" src="/js/iot-logout.js"></script>
@endsection
