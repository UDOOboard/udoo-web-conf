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
                    @if ($isinstalled)
                    <p>Please wait, UDOO IoT Cloud Client is starting...</p>
                    @else
                        <p>The UDOO IoT Cloud Client is not installed in your board. Install it now to join the Cloud!</p>
                    @endif
                </div>
            </div>
        </div>
    </div>

@endsection

@section('scripts')
    <script type="text/javascript" src="/js/iot-service.js"></script>
@endsection
