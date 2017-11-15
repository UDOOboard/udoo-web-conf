@extends('template')

@section('title', 'Arduino Samples')

@section('content')

    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>
                        ARDUINO SAMPLES
                    </h2>
                </div>
                <div class="body">
                    <p>Two easy examples to get you started using UDOO Neo's integrated Arduino compatible microcontroller.</p>
                    <p>Just follow the instructions and hit run!</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row clearfix">

        <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="card">
                <div class="header">
                    <h2>BLINK <button type="button" id="blink" class="btn bg-pink waves-effect pull-right">RUN</button></h2>
                </div>
                <div class="body">
                    <p>Connect a LED to PIN 13 to see it blinking!</p>
                    <pre style="height:320px;" id="example-blink">
int led = 13;

void setup() {
  pinMode(led, OUTPUT);
}


void loop() {
  digitalWrite(led, HIGH);
  delay(1000);

  digitalWrite(led, LOW);
  delay(1000);
}
</pre>
                </div>
            </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="card">
                <div class="header">
                    <h2>FADE <button type="button" id="fade" class="btn bg-pink waves-effect pull-right">RUN</button></h2>
                </div>
                <div class="body">
                    <p>Connect a LED to PIN 9 to see it fade in and out!</p>
                    <pre style="height:320px;" id="example-fade">
int led = 9;
int brightness = 0;
int fadeAmount = 5;

void setup() {
  pinMode(led, OUTPUT);
}

void loop() {
  analogWrite(led, brightness);
  brightness = brightness + fadeAmount;
  if (brightness == 0 || brightness == 255) {
    fadeAmount = -fadeAmount;
  }

  delay(30);
}
</pre>
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
    <script src="/js/arduino-samples.js"></script>
@endsection
