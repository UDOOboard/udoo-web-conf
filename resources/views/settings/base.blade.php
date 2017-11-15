@extends('template')

@section('title', 'Settings')

@section('content')

    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>
                        BOARD NAME AND PASSWORDS
                    </h2>
                </div>
                <div class="body">
                    <p>Configure your UDOO board name and access passwords.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row clearfix">

        <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="card">
                <div class="header">
                    <h2>CHANGE UDOOER PASSWORD</h2>
                </div>
                <div class="body">
                    <p>Default user is <i>udooer</i> (default password: <i>udooer</i>).
                        <b>Never</b> use default passwords!</p>

                    <form class="form-horizontal m-t-20">
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label for="username_udooer">Username</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <input type="text" name="username_udooer" id="username_udooer" class="form-control" readonly value="udooer">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label for="password_udooer">Password</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <input type="password" name="password_udooer" id="password_udooer" class="form-control" placeholder="Enter your password">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label for="password2_udooer">Repeat password</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <input type="password" name="password2_udooer" id="password2_udooer" class="form-control" placeholder="Enter your password">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-offset-3 col-md-offset-3 col-sm-offset-4 col-xs-offset-5">
                                <button type="button" id="change-udooer" class="btn btn-primary m-t-15 m-b-20 waves-effect">CHANGE PASSWORD</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="card">
                <div class="header">
                    <h2>CHANGE ROOT PASSWORD</h2>
                </div>
                <div class="body">
                    <p>The system administrator is <i>root</i> (default password: <i>ubuntu</i>).
                        <b>Never</b> use default passwords!</p>

                    <form class="form-horizontal m-t-20">
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label for="username_root">Username</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <input type="text" name="username_root" id="username_root" class="form-control" readonly value="root">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label for="password_root">Password</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <input type="password" name="password_root" id="password_root" class="form-control" placeholder="Enter your password">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label for="password2_root">Repeat password</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <input type="password" name="password2_root" id="password2_root" class="form-control" placeholder="Enter your password">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-offset-3 col-md-offset-3 col-sm-offset-4 col-xs-offset-5">
                                <button type="button" id="change-root" class="btn btn-primary m-t-15 m-b-20 waves-effect">CHANGE PASSWORD</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="card">
                <div class="header">
                    <h2>BOARD NAME</h2>
                </div>
                <div class="body">
                    <p>Choose a unique hostname for your UDOO (a reboot is required).</p>

                    <form class="form-horizontal m-t-20">
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label for="hostname">Username</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <input type="text" name="hostname" id="hostname" class="form-control" value="{{ $hostname }}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-offset-3 col-md-offset-3 col-sm-offset-4 col-xs-offset-5">
                                <button type="button" id="change-hostname" class="btn btn-primary m-t-15 m-b-20 waves-effect">SAVE</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>

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
    <script type="text/javascript" src="/js/settings-base.js"></script>
@endsection
