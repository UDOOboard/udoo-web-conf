@extends('template')

@section('title', 'Arduino Web Editor')

@section('content')

    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>
                        ARDUINO WEB EDITOR
                    </h2>
                </div>
                <div class="body">
                    <p>Use this Web IDE to upload your own Sketch. Write the code below and press the Upload button.</p>
                    <p>Be aware that it could take 30 seconds or more to verify and upload the sketch.</p>

                    <div class="row m-t-30">
                        <div class="col-xs-12">
                            <pre style="height:300px;" id="editor">{{ $last }}</pre>
                        </div>
                    </div>

                    <button id="upload-ide" type="button" class="btn bg-pink waves-effect">UPLOAD SKETCH</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="waitDialog" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Arduino</h4>
                </div>
                <div class="modal-body">
                    <div class="loading">Please wait, the sketch is being flashed...
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
                    <div class="loaded hidden">The sketch has been uploaded!</div>
                    <div class="error hidden"></div>
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
    <script src="/js/arduino-webide.js"></script>
@endsection
