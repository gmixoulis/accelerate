"use client"
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';

let SpeechRecognition;
let recognition;

if (typeof window !== 'undefined') {
  SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

}

const SpeechToText = ({listening, setListening, setInterimTranscript, setTranscript, color = "text-dimgray-200 dark:text-gray-400 dark:hover:text-white"}) => {
    recognition.continuous = true;
    recognition.interimResults = true;


    recognition.onresult = (event) => {
        for (var i = event.resultIndex; i < event.results.length; ++i) {      
            if (event.results[i].isFinal) { //Final results
                console.log("final results: " + event.results[i][0].transcript);   
                setTranscript(event.results[i][0].transcript);
            } else {   //i.e. interim...
                console.log("interim results: " + event.results[i][0].transcript);  
                setInterimTranscript(event.results[i][0].transcript);
            } 
        }
    }

    recognition.onend = () => {
        setInterimTranscript("");
    }

    recognition.onerror = (event) => {
        // Handle errors
        console.error(event.error);
    };

    const startListening = () => {
        setInterimTranscript("");
        setListening(true);
        recognition.start();
    }

    const stopListening = () => {
        setListening(false);
        recognition.stop();
        setInterimTranscript("");
    }

    return (
        <button type='button' onClick={() => {
            if (listening) {
                console.log("stop")
                stopListening();
            } else {
                console.log("start")
                startListening();
            }
        }}>
            {listening ? (
              <StopIcon
                className={`h-8 w-8 hover:cursor-pointer p-1 ${color} hover:opacity-80`}
              />
            ) : (
              <MicrophoneIcon
                className={`h-8 w-8 hover:cursor-pointer p-1 ${color} hover:opacity-80`}
              />
            )}
          </button>
    );
};


export default SpeechToText;

