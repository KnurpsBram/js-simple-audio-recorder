var startRecordingButton  = document.getElementsByClassName('start-recording-button')[0];
var stopRecordingButton   = document.getElementsByClassName('stop-recording-button')[0];
var audioPlayer           = document.getElementById("audio-player");
var deleteRecordingButton = document.getElementsByClassName('delete-recording-button')[0];
var startRecordingButtonContainer = document.getElementsByClassName('start-recording-button-container')[0];
var stopRecordingButtonContainer  = document.getElementsByClassName('stop-recording-button-container')[0];
var audioPlayerContainer          = document.getElementsByClassName("audio-player-container")[0];

function startAudioRecording() {
    audioRecorder.start();

    audioPlayerContainer.style.display          = "none";
    startRecordingButtonContainer.style.display = "none";
    stopRecordingButtonContainer.style.display  = "block";
}

function stopAudioRecording() { 
    audioRecorder.stop().then(audioAsBlob => {

        let audioUrl = URL.createObjectURL(audioAsBlob);
                
        audioPlayer.src = audioUrl;
        audioPlayer.load(); // this doesn't appear to be working
    });
    
    audioPlayerContainer.style.display          = "block";
    startRecordingButtonContainer.style.display = "none";
    stopRecordingButtonContainer.style.display  = "none";        
    
}

function deleteRecording() {
    audioRecorder.reset();

    audioPlayerContainer.style.display          = "none";
    startRecordingButtonContainer.style.display = "block";
    stopRecordingButtonContainer.style.display  = "none";
}

startRecordingButton.onclick  = startAudioRecording;
stopRecordingButton.onclick   = stopAudioRecording;
deleteRecordingButton.onclick = deleteRecording;
