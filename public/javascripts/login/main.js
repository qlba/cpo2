
var statusLine = $('#statusLine');
var button = $('#submitButton');

statusLine.slideUp(0);


button.on('click', () => {

    var userName = $('#usernameField').val(),
        password = $('#passwordField').val(),
        publicKey = $('#publicKey').val();

    button.attr('disabled', true);

    




    $.get('/login/encrypt', {username: userName}, (data) => {
            continueAuth(data);
        }).fail(() => {
            window.alert('Failed');
            button.attr('disabled', false);
        });
});

function continueAuth(data)
{
    var userName = $('#usernameField').val();
    var password = $('#passwordField').val();



    

    $.post('/login', {username: userName, password: password})
        .done((data, textStatus, jqXHR) => {
            displayMessage(data);
            setTimeout(() => {window.location = "/";}, 1500);
        })
        .fail((jqXHR) => {
            displayMessage(jqXHR.statusCode().responseText, true);
        });

    button.attr('disabled', false);
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
