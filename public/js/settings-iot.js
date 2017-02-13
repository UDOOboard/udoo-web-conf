var URL_PATH = 'http://192.168.1.112:6969';

var userId;
var email, password;
var isIoTServiceRunning;

$(document).ready(function () {
    $('#buttonLogin').on('click', onLoginClick);
    $('#company-form').on('submit', onSaveDiplayNameSubmit);
    $('#code-form').on('submit', onSaveCodeSubmit);
    $('#button-iot').on('click', onButtonIoTServiceClick);
    initIoTPage();
});

function onLoginClick(e) {
    e.preventDefault();
    var login_progress = $('#login-progress');
    login_progress.removeClass("hidden");
    email = $("#email").val();
    password = $('#password').val();
    console.log(' email ', email);
    console.log(' password ', password);

    $.ajax({
        type: "POST",
        url: URL_PATH + '/board-login/',
        data: "email=" + email + "&password=" + password,
        dataType: "json",
        success: function (response) {
            login_progress.addClass("hidden");
            if (response.status) {
                userId = response.user;
                getCompanyFromUser(email);
            } else {
                alert("Error: response board-login success false");
            }
        }
    });
}

function onSaveDiplayNameSubmit(e) {
    e.preventDefault();
    var displayName = $("#displayName").val();
    var boardId = $('#boardId').val();
    var company_id = $('input[name$=companyId]:checked').val();
    console.log('disp ', displayName);
    console.log('boardId ', boardId);
    console.log('company_id ', company_id);

    var req_json = {
        'gateway': {
            'gateway_id': boardId,
            'company': company_id,
            'displayName': displayName,
            'email': email,
            'nodes': []
        }
    }

    $.ajax({
        type: "PUT",
        url: URL_PATH + '/api/gateway',
        data: req_json,
        dataType: "json",
        success: function (response) {
            if (!response.err) {
                getGrantCode(boardId);
            } else {
                alert("Error: response /api/gateway success false");
            }
        }
    });
}


function onSaveCodeSubmit(e) {
    e.preventDefault();
    var grantCode = $("#grantCode").val();

    $.ajax({
        type: "GET",
        url: '/settings/iot/redis/' + grantCode,
        success: function (response) {
            if (!response.err) {
                setIoTServiceCommand('start');
            } else {
                alert("Error: response getGrantCode not saved");
            }
        },
    });
}

function onButtonIoTServiceClick(e) {
    e.preventDefault();
    setIoTServiceCommand(isIoTServiceRunning ? "stop" : "start");
}

function getCompanyFromUser(email) {
    $.ajax({
        type: "GET",
        url: URL_PATH + '/api/company/' + email,
        success: function (response) {
            if (!response.err) {
                if (response.length > 0) {
                    getGateway(response);
                } else {
                    alert("Error: companys not found");
                }

            } else {
                alert("Error: response getCompanyFromUser success false");
            }
        }
    });
}

function getGateway(companies) {
    var boardId = $('#boardId').val();
    $.ajax({
        type: "GET",
        url: URL_PATH + '/api/gateway/' + boardId,
        success: function (response) {
            var found = false;
            if (response) {
                for (var i = 0; i < companies.length; i++) {
                    if (response.company === companies[i].company_id) {
                        found = true;
                    }
                }
            }
            if (found) {
                getGrantCode(boardId);
            } else {
                addCompaniesToView(null, companies);
            }
        }
    });
}

function getGrantCode(boardId) {
    $('#code-panel').removeClass("hidden");
    $('#login-panel').addClass("hidden");
    $('#company-panel').addClass("hidden");
    var url = URL_PATH + "/auth/start?client_id=" + boardId + "&response_type=code&scope=view_account&redirect_uri=" + URL_PATH + "/auth/board-login/finish";
    window.open(url, '_blank');
}

function formCode(req_json) {
    var req_finish =
        "transaction_id=" + req_json.transaction_id +
        "&client_id=" + req_json.client_id +
        "&email=" + email +
        "&password=" + password +
        "&scope=" +
        "&response_type=code" +
        "&auth_url=" + encodeURIComponent(req_json.auth_url);

    console.log(req_finish);

    $.ajax({
        type: "POST",
        url: URL_PATH + '/auth/finish',
        data: req_finish,
        dataType: "json",
        success: function (response) {
            console.log('dd' + response);
        }
    });
}

function addCompaniesToView(error, companies) {
    $('#login-panel').addClass("hidden");
    $('#company-panel').removeClass("hidden");
    $('.list-group.company').empty();

    for (var i = 0; i < companies.length; i++) {
        var company = companies[i];
        var html = ['<input type="radio" name="companyId" class="list-group-item" value="' + company.company_id + '">' + company.displayName + '</input>'];
        $(".list-group.company").append(html.join(''));
    }
}

function isServiceIoTLaunched() {
    $.ajax({
        type: "GET",
        url: '/settings/iot/service/status',
        success: function (response) {
            if (!response.err) {
                console.log('status ' + response);
            } else {
                alert("Error: response getGrantCode not saved");
            }
        },
    });
}

function setIoTServiceCommand(command) {
    $.ajax({
        type: "GET",
        url: '/settings/iot/service/' + command,
        success: function (response) {
            if (!response.err) {
                if (command === 'start') {
                    if (response.response.indexOf("start/running") > 0) {
                        isIoTServiceRunning = true;
                        $('#iotstatus').text('ON');
                        $('#code-panel').addClass('hidden');
                        $('#button-iot').removeClass('btn-success');
                        $('#button-iot').addClass('btn-danger');
                    } else {
                        isIoTServiceRunning = false;
                        $('#iotstatus').text('OFF');
                        $('#button-iot').removeClass('btn-danger');
                        $('#button-iot').addClass('btn-success');
                    }
                } else if ("stop") {
                    if (response.response.indexOf("stop/waiting") > 0) {
                        isIoTServiceRunning = false;
                        $('#iotstatus').text('OFF');
                        $('#button-iot').removeClass('btn-danger');
                        $('#button-iot').addClass('btn-success');

                    } else {
                        isIoTServiceRunning = false;
                        $('#iotstatus').text('ON');
                        $('#button-iot').removeClass('btn-success');
                        $('#button-iot').addClass('btn-danger');
                    }
                }
            } else {
                alert("Error: response getGrantCode not saved");
            }
        },
    });
}

function initIoTPage() {
    $.ajax({
        type: "GET",
        url: '/settings/iot/service/status',
        success: function (response) {
            if (!response.err) {
                if (response.response.indexOf("start/running") > 0) {
                    isIoTServiceRunning = true;
                    $('#iotstatus').text('ON');
                    $('#button-iot').removeClass('btn-success');
                    $('#button-iot').addClass('btn-danger');
                }
                else {
                    isIoTServiceRunning = false;
                    $('#iotstatus').text('OFF');
                    $('#button-iot').removeClass('btn-danger');
                    $('#button-iot').addClass('btn-success');
                    $('#login-panel').removeClass('hidden');
                }
            } else {
                isIoTServiceRunning = false;
                alert("Error: response getGrantCode not saved");
            }
        },
    });
}