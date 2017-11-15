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
                <a style="color:black;">{{ $_SESSION['board']['shortmodel'] }} is shutting down</a>
                <br><br>
                <small style="color:black;">Wait a moment before unplugging the power cord.</small>
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
            url: '/power/poweroff-action'
        });
    });
</script>
</body>

</html>
