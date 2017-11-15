<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>UDOO Board - Reboot</title>
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
    <div class="card">
        <div class="body">
            <div class="logo">
                <a style="color:black;">{{ $_SESSION['board']['shortmodel'] }}</a>
                <small style="color:black;">Please wait...</small>
            </div>
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
            <br>
        </div>
    </div>
</div>

<script src="/plugins/jquery/jquery.min.js"></script>
<script src="/plugins/bootstrap/js/bootstrap.min.js"></script>
<script>
    $(function() {
        $.ajax({
            type: "GET",
            url: '/power/reboot-action'
        });
        setTimeout(function() {
            setInterval(checkConnection, 10000);
        }, 25000);
    });

    function checkConnection() {
        $.ajax({
            type: "GET",
            url: '/login',
            success: function(response) {
                if (response.indexOf("/login") > 0) {
                    window.location.href = document.location.origin;
                }
            }
        });
    }
</script>
</body>

</html>
