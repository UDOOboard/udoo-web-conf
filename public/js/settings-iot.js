var userId;
var email, password;
var isIoTServiceRunning;
var token='';

$(document).ready(function () {
    $('#btn-login').on('click', onLoginClick);
    $('#company-form').on('submit', onSaveDiplayNameSubmit);
    $('#toogle-iot').change(onButtonIoTServiceClick);
    $('#btn-iot-install').on('click', onButtonIoTServiceInstallClick);
    
    
    
    $('#iot-start-login').on('click', onIotStartLoginClick);
    $('#code-form').on('submit', onSaveCodeSubmit);
    initIoTPage();
});

function onIotStartLoginClick() {

	var url = URL_PATH+"/board-login/"+token;
	window.open(url);
	
	$('#code-box').removeClass('hidden');
	$('#register-box').addClass('hidden');
	$('#iot-external-link').attr('target', '_blank');
	$('#iot-external-link').attr('href', url);
}

function getTokenFromServer(){
	
	$.ajax({
		type: "GET",
		url:"/board/info",
		success: function(response){
			console.log(response);
			$.ajax({
			type: "POST",
			data:{
				boardId: response.boardId,
				macAddress: response.macAddress,
				hostname: response.hostname,
				boardType: response.boardType 
			},
			url: URL_PATH + '/board-login/pre-auth',
			success: function (response) {
				token = response.token;
			},
			});
		}
	});

};

function onSaveCodeSubmit(e) {
    e.preventDefault();
    var code = $("#codes").val();
    var codePanel = $("#code-box");
    $.ajax({
	type: "get",
	url: '/settings/iot/redis/' + code,
	success: function (response) {
		if (!response.err) {
			codePanel.addClass("hidden");
			setIoTServiceCommand('start');
			retryStatus();
		} else {
		    	alert("Error: response getGrantCode not saved");
		}
	}
    });


}


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
                if (response.oauth_secret) {
                    $.ajax({
                        type: "GET",
                        url: '/settings/iot/redisOauth/' + response.oauth_secret
                    });
                }
			getGrantCode(boardId);
            } else {
                alert("Error: response /api/gateway success false");
            }
        }
    });
}

function onButtonIoTServiceClick(e) {
    e.preventDefault();
    setIoTServiceCommand(isIoTServiceRunning ? "stop" : "start");
}

function onButtonIoTServiceInstallClick(e) {
    e.preventDefault();
    $('#waitDialog div.loading').removeClass("hidden");
    $('#waitDialog div.loaded').addClass("hidden");
    $('#waitDialog div.error').addClass("hidden");
    $('#waitDialog').modal('show');

    $.ajax({
        type: "GET",
        url: '/settings/iot/install',
        success: function (response) {
            $('#waitDialog div.loading').addClass("hidden");
            if (response.status) {
                $('#waitDialog div.loaded').removeClass("hidden");
                setStateIoTPage(response.service);
            } else {
                $('#waitDialog div.error').html(response.message).removeClass("hidden");
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
                if (response.oauth_secret) {
                    $.ajax({
                        type: "GET",
                        url: '/settings/iot/redisOauth/' + response.oauth_secret
                    });
                }
            } else {
                addCompaniesToView(null, companies);
            }
        }
    });
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
        var html = ['<div class="radio"><input type="radio" name="companyId" class="list-group-item" value="' + company.company_id + '">' + company.displayName + '</input></div>'];
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
                setStateIoTPage(response.service);
            } else {
                alert("Error: response getGrantCode not saved");
            }
        }
    });
}

function initIoTPage() {
    $.ajax({
        type: "GET",
        url: '/settings/iot/service/status',
        success: function (response) {
            if (!response.err) {
                setStateIoTPage(response.service);
            } else {
                isIoTServiceRunning = false;
                alert("Error: response getGrantCode not saved");
            }
        },
    });
}

function setStateIoTPage(iotState) {
    if (iotState) {
        if (iotState.started) {
            // $('#toogle-iot').bootstrapToggle('on');            
            if(iotState.state.init){
                $('#install-panel').addClass('hidden');
                $('#iot-status-panel').removeClass('hidden');
                $('#login-panel').addClass('hidden');
                $('#code-panel').addClass("hidden");
                retryStatus();
                isIoTServiceRunning = true;
            }
            else if (iotState.state.wait) {
                $('#register-panel').removeClass('hidden');
                isIoTServiceRunning = true;
                getTokenFromServer();
            } else {
                isIoTServiceRunning = true;
                $('#login-panel').addClass('hidden');
                $('#code-panel').addClass("hidden");
            }
        } else {
            isIoTServiceRunning = false;
            if (!iotState.installed) {
                $('#install-panel').removeClass('hidden');
                $('#iot-status-panel').addClass('hidden');
            }
            else {
                $('#iot-status-panel').removeClass('hidden');
            }
        }
    } else {
        isIoTServiceRunning = false;
    }
}

function retryStatus(){
    setTimeout(function(){
        setIoTServiceCommand('status');
    }, 5000);
}


