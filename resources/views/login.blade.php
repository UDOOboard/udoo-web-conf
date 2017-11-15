<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>UDOO Board - Login</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link href="/fonts/roboto/roboto.css" rel="stylesheet" type="text/css">
    <link href="/fonts/iconfont/material-icons.css" rel="stylesheet" type="text/css">
    <link href="/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="/plugins/node-waves/waves.min.css" rel="stylesheet" />
    <link href="/plugins/animate-css/animate.min.css" rel="stylesheet" />
    <link href="/css/style.css" rel="stylesheet">
</head>

<body class="login-page">
<div class="login-box">
    <div class="logo">
        <a>{{ $_SESSION['board']['shortmodel'] }}</a>
        <small>Web Control Panel</small>
    </div>
    <div class="card">
        <div class="body">
            <form id="sign_in" method="POST" action="{{ route('login') }}">
                <div class="msg">Sign in to start your session</div>
                <div class="input-group">
                        <span class="input-group-addon">
                            <i class="material-icons">person</i>
                        </span>
                    <div class="form-line">
                        <input type="text" class="form-control" name="username" placeholder="Username" required value="udooer">
                    </div>
                </div>
                <div class="input-group">
                        <span class="input-group-addon">
                            <i class="material-icons">lock</i>
                        </span>
                    <div class="form-line">
                        <input type="password" class="form-control" name="password" placeholder="Password" required autofocus>
                    </div>
                </div>

                @if (isset($message))
                    <div class="row m-t-15 m-b--20">
                        <div class="col-xs-12">
                            <div class="alert alert-danger alert-dismissible" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                                <strong>Error!</strong> {{ $message }}
                            </div>
                        </div>
                    </div>
                @endif

                <div class="row">
                    <div class="col-xs-offset-4 col-xs-4">
                        <button class="btn btn-block bg-pink waves-effect" type="submit">SIGN IN</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="/plugins/jquery/jquery.min.js"></script>
<script src="/plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="/plugins/node-waves/waves.min.js"></script>
<script src="/js/admin.js"></script>
</body>

</html>
