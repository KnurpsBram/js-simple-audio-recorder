var gumStream; // stream from getUserMedia()
var rec;       // Recorder.js object
var input;     // MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var audioPlayer           = document.getElementById("audio-player");
var audioPlayerContainer  = document.getElementById("audio-player-container");
var recordButton          = document.getElementsByClassName('record-button')[0];
var stopButton            = document.getElementsByClassName('stop-button')[0];
var deleteButton          = document.getElementsByClassName('delete-button')[0];
var recordButtonContainer = document.getElementById("record-button-container");
var stopButtonContainer   = document.getElementById('stop-button-container');

// add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
deleteButton.addEventListener("click", deleteRecording);

function startRecording() {
    console.log("recordButton clicked");

    // Simple constraints object, for more advanced audio features see
    // https://addpipe.com/blog/audio-constraints-getusermedia/
    var constraints = { audio: true, video: false }

    // Disable the record button until we get a success or fail from getUserMedia() 
    recordButton.disabled = true;
    stopButton.disabled = false;

    recordButtonContainer.style.display = "none";
    stopButtonContainer.style.display = "block";
    
    // We're using the standard promise based getUserMedia() 
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia 
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        // create an audio context after getUserMedia is called
        // sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
        // the sampleRate defaults to the one set in your OS for your playback device
        audioContext = new AudioContext();

        // assign to gumStream for later use
        gumStream = stream;

        input = audioContext.createMediaStreamSource(stream);
        rec = new Recorder(input,{numChannels:1})
        rec.record()

        console.log("Recording started");
    }).catch(function(err) {
        // enable the record button if getUserMedia() fails
        recordButton.disabled = false;
        stopButton.disabled = true;
    });
}

function stopRecording() {
    console.log("stopButton clicked");

    // disable the stop button, enable the record too allow for new recordings
    stopButton.disabled = true;
    recordButton.disabled = false;

    recordButtonContainer.style.display = "none";
    stopButtonContainer.style.display   = "none";      

    console.log(rec);

    // tell the recorder to stop the recording
    rec.stop();

    // stop microphone access
    gumStream.getAudioTracks()[0].stop();

    // // create the wav blob and pass it on to createDownloadLink
    // rec.exportWAV(createDownloadLink);
    rec.exportWAV(buildAudioPlayer);

    audioPlayerContainer.style.display  = "block";
}

function buildAudioPlayer(audioBlob) {
    console.log("building audioPlayer...");

    let audioUrl = URL.createObjectURL(audioBlob);

    audioPlayer.controls = true;
    audioPlayer.src = audioUrl;
}

function deleteRecording() {
    console.log("deleteButton clicked");

    audioPlayerContainer.style.display  = "none";
    recordButtonContainer.style.display = "block";
    stopButtonContainer.style.display   = "none";
}