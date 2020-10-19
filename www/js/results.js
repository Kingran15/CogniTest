document.addEventListener('deviceready', onDeviceReady, false);
var devReady;
var addToScore = true;

function onDeviceReady() {
    const queryStr = window.location.search;
    const urlParams = new URLSearchParams(queryStr);
    const score = urlParams.get('score');
    document.getElementById('score_report').innerHTML = score;
    devReady = true;
}

function beginScoring() {
    document.getElementById('step_0').style.display = 'none';
    document.getElementById('step_1').style.display = 'block';

    numbers();
}

function numbers() {
    var responses = [];
    sessionStorage.setItem('responses',responses);
    
    document.getElementById('q1').style.display = 'block';
}

function allowContinue(step) {
    document.getElementById('continue_' + step).style.opacity = '1';
}

function continueTo(step) {
    var previous = step-1;
    if(document.getElementById('continue_'+previous).style.opacity != 1) {
        return;
    }
    document.getElementById('q' + previous).style.display = 'none';
    document.getElementById('q'+step).style.display = 'block';
    if(addToScore) {
        addToScore = !document.getElementById('no_'+previous).checked;
    }
}

function finalize() {
    document.getElementById('q7').style.display = 'none';
    var report = document.getElementById('score_report');
    if(addToScore) {
        report.innerHTML = Number(report.innerHTML) + 2;
    }
    report.style.display = 'block';
    document.getElementById('step_2').style.display = 'block';

    switch(Number(report.innerHTML)) {
        case 5:
            document.getElementById('5_row').style.backgroundColor = '#66fa9f';
            break;
        case 4: 
            document.getElementById('4_row').style.backgroundColor = '#66fa9f';
            break;
        default: 
            document.getElementById('3_row').style.backgroundColor = '#66fa9f';
    }
}