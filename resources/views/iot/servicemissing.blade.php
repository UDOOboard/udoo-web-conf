@extends('template')

@section('title', 'UDOO IoT Cloud Service')

@section('content')

    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>UDOO IoT CLOUD CLIENT</h2>
                </div>
                <div class="body">
                    <p>The <code>udoo-iot-cloud-client</code> package is required to access UDOO IoT Client.</p>
                    <p>Do you want to install the package now?</p>

                    <div class="iotservice-installer text-center">
                        <button id="installservice" class="btn btn-primary waves-effect centered-button">
                            <i class="material-icons">extension</i>
                            <span>Install IoT Cloud Client Package</span>
                        </button>
                    </div>

                    <div class="iotservice-preloader text-center hidden">
                        <div class="preloader pl-size-xl">
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

                    <iframe id="terminal" class="hidden"></iframe>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('scripts')
    <script type="text/javascript" src="/js/iot-service-install.js"></script>
@endsection
