
var statusLine = $('#statusLine');

statusLine.slideUp(0);


$('#submitButton').on('click', () => {continueAuth('/login', '/');});
$('#signupButton').on('click', () => {continueAuth('/signup', '/login');});

function continueAuth(url, redirect)
{
    var userName = $('#usernameField').val(),
        password = $('#passwordField').val(),
        publicKey = $('#publicKey').val();

    password = _encrypt(password, publicKey);
    password = btoa(String.fromCharCode.apply(null, password));

    $.post(url, {username: userName, password: password})
        .done((data) => {
            displayMessage(data);
            setTimeout(() => {window.location = redirect;}, 1500);
        })
        .fail((jqXHR) => {
            displayMessage(jqXHR.statusCode().responseText, true);
        });
}

function displayMessage(message, fail)
{
    if(!fail) {
        statusLine.attr('class', 'StatusOk');
    } else {
        statusLine.attr('class', 'StatusFail');
    }

    statusLine.html(message);
    statusLine.slideDown();
    setTimeout(() => { statusLine.slideUp(); }, 5000);
}
