<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>@yield('title')</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link href="/fonts/roboto/roboto.css" rel="stylesheet" type="text/css">
    <link href="/fonts/iconfont/material-icons.css" rel="stylesheet" type="text/css">
    <link href="/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="/plugins/node-waves/waves.min.css" rel="stylesheet" />
    <link href="/plugins/animate-css/animate.min.css" rel="stylesheet" />
    <link href="/plugins/morrisjs/morris.css" rel="stylesheet" />
    <link href="/css/style.css" rel="stylesheet">
    <link href="/css/udoo.css" rel="stylesheet">
    <link href="/css/themes/theme-pink.min.css" rel="stylesheet" />
</head>

<body class="theme-pink">
<div class="overlay"></div>
<nav class="navbar">
    <div class="container-fluid">
        <div class="navbar-header">
            <a href="javascript:void(0);" class="navbar-toggle collapsed" aria-expanded="false"></a>
            <a href="javascript:void(0);" class="bars"></a>
            <a class="navbar-brand" href="/dashboard">{{  $_SESSION['board']['model'] }} - Web Control Panel</a>
        </div>
    </div>
</nav>

<section>
    <aside id="leftsidebar" class="sidebar">
        <div class="user-info">
            <div class="image">
                <img src="/images/user.jpg" width="48" height="48" alt="User" />
            </div>
            <div class="info-container">
                <div class="name" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">UDOO User</div>
                <div class="email">udooer</div>
                <div class="btn-group user-helper-dropdown">
                    <i class="material-icons" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">keyboard_arrow_down</i>
                    <ul class="dropdown-menu pull-right">
                        <li><a href="/logout"><i class="material-icons">input</i>Sign Out</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="menu">
            <ul class="list">
                <li>
                    <a href="/dashboard">
                        <i class="material-icons">dashboard</i>
                        <span>Dashboard</span>
                    </a>
                </li>

                <li>
                    <a href="javascript:void(0);" class="menu-toggle">
                        <i class="material-icons">all_inclusive</i>
                        <span>Arduino</span>
                    </a>
                    <ul class="ml-menu">
                        <li>
                            <a href="/arduino/samples"><span>Samples</span></a>
                        </li>
                        <li>
                            <a href="/arduino/webide"><span>Web Editor</span></a>
                        </li>
                        <li>
                            <a href="/arduino/ardublockly"><span>Ardublockly</span></a>
                        </li>
                        <li>
                            <a href="/arduino/appinventor"><span>App Inventor</span></a>
                        </li>
                    </ul>
                </li>

                <li>
                    <a href="/terminal">
                        <i class="material-icons">subject</i>
                        <span>Terminal</span>
                    </a>
                </li>

                <li>
                    <div class="dropdown">
                        <a class="dropdown-toggle" type="button" id="powermenu" data-toggle="dropdown">
                            <i class="material-icons">settings_power</i>
                            <span>Shut Down</span>
                        </a>
                        <ul class="dropdown-menu pull-right" role="menu" aria-labelledby="powermenu">
                            <li><a href="/power/poweroff">Power off</a></li>
                            <li><a href="/power/reboot">Reboot</a></li>
                        </ul>
                    </div>
                </li>

                <li class="header">SETTINGS</li>

                <li>
                    <a href="/settings/base">
                        <i class="material-icons">vpn_key</i>
                        <span>Password and Board Name</span>
                    </a>
                </li>
                <li>
                    <a href="/settings/network">
                        <i class="material-icons">network_wifi</i>
                        <span>Connect to Wi-Fi</span>
                    </a>
                </li>
                <li>
                    <a href="/iot">
                        <i class="material-icons">cloud</i>
                        <span>UDOO IoT Cloud</span>
                    </a>
                </li>
                <li>
                    <a href="/settings/regional">
                        <i class="material-icons">language</i>
                        <span>Region and Language</span>
                    </a>
                </li>
                <li>
                    <a href="/settings/advanced">
                        <i class="material-icons">settings</i>
                        <span>Advanced</span>
                    </a>
                </li>

                <li class="header">SUPPORT</li>

                <li>
                    <a href="/docs/Introduction/Introduction.html" target="_blank">
                        <i class="material-icons">help</i>
                        <span>Documentation</span>
                    </a>
                </li>
                <li>
                    <a href="https://www.udoo.org/tutorials/" target="_blank">
                        <i class="material-icons">class</i>
                        <span>Tutorials</span>
                    </a>
                </li>
                <li>
                    <a href="https://www.udoo.org/forum" target="_blank">
                        <i class="material-icons">comment</i>
                        <span>Forums</span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
</section>

<section class="content">
    <div class="container-fluid">
        @yield('content')
    </div>
</section>


<script src="/plugins/jquery/jquery.min.js"></script>
<script src="/plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="/plugins/jquery-slimscroll/jquery.slimscroll.js"></script>
<script src="/plugins/node-waves/waves.min.js"></script>
<script src="/plugins/morrisjs/morris.min.js"></script>
<script src="/plugins/raphael/raphael.min.js"></script>
<script src="/js/admin.js"></script>
@yield('scripts')
</body>

</html>
