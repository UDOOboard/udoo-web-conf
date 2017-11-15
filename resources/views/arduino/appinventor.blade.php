@extends('template')

@section('title', 'App Inventor')

@section('content')

    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>
                        APP INVENTOR
                    </h2>
                    <br>
                    Develop an Android application to control your {{ $_SESSION['board']['shortmodel'] }} using the UDOO IoT Cloud extension for App Inventor.
                </div>
                <div class="body">

                    <h4>What is App Inventor?</h4>
                    <p>MIT App Inventor is an intuitive, visual programming environment that allows everyone - even
                        children - to build fully functional apps for smartphones and tablets. Those new to MIT App
                        Inventor can have a simple first app up and running in less than 30 minutes. And what's more,
                        our blocks-based tool facilitates the creation of complex, high-impact apps in significantly
                        less time than traditional programming environments. The MIT App Inventor project seeks to
                        democratize software development by empowering all people, especially young people, to move
                        from technology consumption to technology creation.</p>
                    <br>

                    <h4>UDOO IoT Cloud Extension</h4>
                    <p>Download the UDOO IoT Cloud extension to develop App Inventor applications able to control your board.</p>
                    <p>Import the extension using the <i>Import Extension</i> link in the Components Palette.</p>

                    <div class="text-center m-t-30 m-b-10">
                        <a href="https://www.udoo.org/appinventor/udoo-iot-extension.aix" class="btn bg-pink waves-effect">DOWNLOAD UDOO EXTENSION</a>
                        &nbsp; &nbsp; &nbsp;
                        <a href="http://ai2.appinventor.mit.edu" target="_blank" class="btn bg-pink waves-effect">OPEN APP INVENTOR 2</a>
                    </div>

                    @if (!$loggedin)
                        <div class="alert alert-warning m-t-30" role="alert">
                            Your board is not enrolled in the UDOO IoT Cloud.
                            <a href="{{ route('iot-register') }}">Register your board</a> before using it with App Inventor.
                        </div>
                    @endif

                </div>
            </div>
        </div>
    </div>

@endsection
