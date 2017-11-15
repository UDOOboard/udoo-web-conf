@extends('template')

@section('title', 'Advanced Settings')

@section('content')

    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>
                        ADVANCED SETTINGS
                    </h2>
                </div>
                <div class="body">
                    <p>Change these settings carefully. Restart the board to apply the changes!</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row clearfix">

        <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="card">
                <div class="header">
                    <h2>VIDEO OUTPUT</h2>
                </div>
                <div class="body">
                    <p>Select the main video output:</p>

                    <form class="form-horizontal m-t-20">
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label>Video output</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <select class="form-control" name="video">
                                            <option value="hdmi"
                                                    @if ($video == 'hdmi')
                                                    selected="selected"
                                                    @endif
                                            >HDMI</option>
                                            <option value="lvds7"
                                                    @if ($video == 'lvds7')
                                                    selected="selected"
                                                    @endif
                                            >LVDS 7''</option>
                                            @if ($hasLvds15)
                                                <option value="lvds15"
                                                        @if ($video == 'lvds15')
                                                        selected="selected"
                                                        @endif
                                                >LVDS 15''</option>
                                            @endif
                                            <option value="headless"
                                                    @if ($video == 'headless')
                                                    selected="selected"
                                                    @endif
                                            >Disable screen output</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row clearfix">
                            <div class="col-lg-offset-3 col-md-offset-3 col-sm-offset-4 col-xs-offset-5">
                                <button type="button" id="video-output" class="btn btn-primary m-t-15 m-b-20 waves-effect">SAVE</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        @if ($hasM4)
        <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="card">
                <div class="header">
                    <h2>ARDUINO M4 CORE</h2>
                </div>
                <div class="body">
                    <p>Disabling the M4 core, it will be possible to access all SoC devices and pins from Linux.</p>

                    <form class="form-horizontal m-t-20">
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label>M4 Status</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <select class="form-control" name="m4">
                                            <option value="enabled"
                                                    @if ($m4 == 'enabled')
                                                    selected="selected"
                                                    @endif
                                            >Enabled</option>
                                            <option value="disabled"
                                                    @if ($m4 == 'disabled')
                                                    selected="selected"
                                                    @endif
                                            >Disabled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-offset-3 col-md-offset-3 col-sm-offset-4 col-xs-offset-5">
                                <button type="button" id="m4-status" class="btn btn-primary m-t-15 m-b-20 waves-effect">SAVE</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        @endif

        <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="card">
                <div class="header">
                    <h2>AUTOSTART SCRIPT</h2>
                </div>
                <div class="body">
                    <p>The following script will be executed at board startup with <b>root</b> privileges:</p>

                    <form class="form-horizontal m-t-20">
                        <pre style="height:87px;" id="editor">{{ $autostart }}</pre>

                        <div class="row clearfix">
                            <div class="col-lg-offset-3 col-md-offset-3 col-sm-offset-4 col-xs-offset-5">
                                <button type="button" id="autostart" class="btn btn-primary m-t-15 m-b-20 waves-effect">SAVE</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="card">
                <div class="header">
                    <h2>WEB CONTROL PANEL</h2>
                </div>
                <div class="body">
                    <p>Move this tool to a different port before installing a web server.<br>
                        You need to reboot your UDOO board to apply the changes.<br>
                        If you disable Web Control Panel, remove <code>/etc/init/udoo-wcp.override</code> to re-enable it.</p>

                    <form class="form-horizontal m-t-20">
                        <div class="row clearfix">
                            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-5 form-control-label">
                                <label>Listen on port</label>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-8 col-xs-7">
                                <div class="form-group">
                                    <div class="form-line">
                                        <select class="form-control" name="port">
                                            <option value="80"
                                                    @if ($port == 80)
                                                    selected="selected"
                                                    @endif
                                            >80</option>
                                            <option value="81"
                                                    @if ($port == 81)
                                                    selected="selected"
                                                    @endif
                                            >81</option>
                                            <option value="8080"
                                                    @if ($port == 8080)
                                                    selected="selected"
                                                    @endif
                                            >8080</option>
                                            <option value="8888"
                                                    @if ($port == 8888)
                                                    selected="selected"
                                                    @endif
                                            >8888</option>
                                            <option value="-1"
                                                    @if ($port == -1)
                                                    selected="selected"
                                                    @endif
                                            >Disable web configuration tool startup</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-offset-3 col-md-offset-3 col-sm-offset-4 col-xs-offset-5">
                                <button type="button" id="port" class="btn btn-primary m-t-15 m-b-20 waves-effect">SAVE</button>
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
    <script src="/plugins/ace/ace.js" type="text/javascript"></script>
    <script type="text/javascript" src="/js/settings-advanced.js"></script>
@endsection
