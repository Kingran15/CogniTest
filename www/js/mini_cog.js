//const speechRecognition = require("../../platforms/android/app/build/intermediates/merged_assets/debug/out/www/plugins/cordova-plugin-speechrecognition/www/speechRecognition");
//var cv = require('../lib/opencv');

let wordBank = [['Banana','Sunrise','Chair'],['Leader','Season','Table'],['Village','Kitchen','Baby'],
['River','Nation','Finger'],['Captain','Garden','Picture'],['Daughter','Heaven','Mountain']];
let steps = ['',beginStepOne,beginStepTwo,beginStepThree,goToResults];
var words;
var heard;
var currentStep = 0;
var clockDrawBegan = false;
var interval;

var flags = {};

function nextStep(param) {
    let previous = document.getElementById('step_' + currentStep++);
    let next = document.getElementById('step_' + (currentStep));

    previous.style.display = 'none';
    if(next !== null && next !== undefined) {
        next.style.display = 'block';
    }

    steps[currentStep](param);
}

function beginStepOne(count) {
    document.getElementById('super_container').style.margin =  '0 40px';
    threeWords();
}

function beginStepTwo(count) {
    clockInstructions();
}

function beginStepThree(count) {
    requestRecall();
}

function goToResults(count) {
    const urlToResults = 'results.html?score=' + count;
    window.location.href = urlToResults;
}

function requestRecall() {
    const step3Text = document.getElementById('word_recall_prompt').innerHTML;
    TTS.speak({
        text: step3Text,
        locale: 'en-US',
        rate: .8
    }, function () { 
        document.getElementById('record_container_2').style.display = 'block';
    }, function (reason) {
        //console.log(reason);
    });
}

function recallComplete() {
    listenForWords(2);
}

function threeWords() {
    flags.saidThreeWords = false;
    phrases = wordBank[Math.floor(Math.random() * wordBank.length)];
    
    var instruct = document.getElementById('instructions_1');
    var str = instruct.innerHTML;

    var index = str.indexOf('[words]');
    phrases.push(str.substring(index + 7));
    phrases.splice(0,0,str.substring(0,index));

    instruct.innerHTML = phrases[0] + ': ' + phrases[1] + ', ' + phrases[2] + ', ' + phrases[3] + phrases[4];
    speak(phrases,0);
}

function listenForWords(num=1) {

    //console.log('started');
    let options = {
        language: 'en-US',
        matches: 5
    };

    var trial = window.plugins.speechRecognition.startListening(function (value) {
            //SUCCESS?
            
            display(value,num);
        }, function() {
            //console.log('Error');
        }, options);
}

function display(heardWords,num=1) {
    var strs = heardWords[0].split(' ');

    var list = document.getElementById('recognized_words_'+num);
    list.innerHTML = '';
    strs.forEach((item, i) => {
        list.innerHTML += '<li>' + strs[i].toUpperCase() + '</li>';
    });

    heard = heardWords;
}

function getResults() {
    var count = evaluate(heard);
//console.log('Count: ' + count);

    nextStep(count);
}

function evaluate(heardWords) {

    var count = 0;
    var noMoreCheck = [];
    for(var i = 0; i < heardWords.length;i++) {
        let item = heardWords[i];
        let all = item.split(' ');
        all.forEach((val, j) => {
            if(!noMoreCheck.includes(j)) {
                //console.log(val + ' === ' + words[j] + '?');
                if(j < words.length && val.toLowerCase() === words[j].toLowerCase()) {
                    count++;
                    noMoreCheck += j;
                }
            }
        });
        
        if(count === words.length) {
            //console.log('Good job!');
            return 3;
        }
    }

    //console.log('Nope!');
    return count;
}

function speak(phrases, i, speed = .8, flag) {
    if(i >= phrases.length) {
        flag = true;
        words = phrases.slice(1,phrases.length-1, flags.saidThreeWords);
        document.getElementById('record_container').style.display = 'block';
        return;
    }
    TTS.speak({
        text: phrases[i],
        locale: 'en-US',
        rate: speed
    }, function () {
        speak(phrases,i+1, speed);   
    }, function (reason) {
        //console.log(reason);
    });
}

//Instructional approach-for now
function clockInstructions() {
    var toSpeak = document.getElementById('clock_instructions').innerHTML;
    TTS.speak({
        text: toSpeak,
        locale: 'en-US',
        rate: .8
    }, function() {
        afterRecite();
    }, function(reason) {
        //console.log('Error in clock instructions bc of ' + reason);
    });
}

function afterRecite() {
    document.getElementById('begin_clock_draw').style.opacity = '1';
    clockDrawBegan = true;
}

function beginTimer() {
    if(!clockDrawBegan) {
        return false;
    }
    document.getElementById('begin_clock_draw').style.display = 'none';
    document.getElementById('clock_draw_ongoing_container').style.display = 'block';
    interval = setInterval(function() {
        var timer = document.getElementById('timer');
        var strTime = timer.innerHTML.split(':');
        var minute = Number(strTime[0]);
        var second = Number(strTime[1]);
      
        var pad = '';
      
        if(minute <= 0 && second <= 0) {
            finishClock();
        }
        else if(second <= 0)
        {
          minute--;
          second = 59;
        }
        else
        {
          second--;
        }
      
        if(second < 10)
        {
          pad = '0';
        }
      
        timer.innerHTML = minute.toFixed(0) + ':' + pad + second.toFixed(0);
      
      },1000);

      return true;
}

function finishClock() {
    clearInterval(interval);
    nextStep();
}

/* Computer Vision - Not yet a feasible solution due to lack of training data and stuff
function onOpenCvReady() {
    console.log('done loading cv');
}

function compare() {
        console.log('started');
    var srcImg = document.getElementById('reference_clock');
    var tempImg = document.getElementById('12_temp');
    let mat = cv.imread(srcImg);
    let template = cv.imread(tempImg);
    let res = new cv.Mat();
    let mask = new cv.Mat();
        console.log('b4');
    cv.matchTemplate(mat,template,res,cv.TM_CCOEFF,mask);
        console.log('after');

    let result = cv.minMaxLoc(res, mask);
    let maxPoint = result.maxLoc;
    let color = new cv.Scalar(255, 0, 0, 255);
    let point = new cv.Point(maxPoint.x + template.cols, maxPoint.y + template.rows);
    cv.rectangle(mat, maxPoint, point, color, 2, cv.LINE_8, 0);
    cv.imshow('clock_canvas', mat);
    mat.delete(); res.delete(); mask.delete();
}
*/