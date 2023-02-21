import React, { useState, useEffect } from 'react';
import { VoiceRecorder } from 'capacitor-voice-recorder';

const initialState = {
  recordingMinutes: 0,
  recordingSeconds: 0,
  isRecording: false,
  audio: null,
};

const useRecorder = () => {
  const [recorder, setRecorder] = useState(initialState);

  useEffect(() => {
    const MAX_RECORDER_TIME = 5;
    let recordingInterval = null;

    if (recorder.isRecording) {
      recordingInterval = setInterval(() => {
        setRecorder(prevState => {
          if (
            prevState.recordingMinutes === MAX_RECORDER_TIME &&
            prevState.recordingSeconds === 0
          ) {
            clearInterval(recordingInterval);
            stopRecording();
            return {
              ...prevState,
              recordingMinutes: MAX_RECORDER_TIME,
              recordingSeconds: MAX_RECORDER_TIME*60,
            };
          }

          if (
            prevState.recordingSeconds >= 0 &&
            prevState.recordingSeconds < 59
          )
            return {
              ...prevState,
              recordingSeconds: prevState.recordingSeconds + 1,
            };

          if (prevState.recordingSeconds === 59)
            return {
              ...prevState,
              recordingMinutes: prevState.recordingMinutes + 1,
              recordingSeconds: 0,
            };
        });
      }, 1000);
    } else {
      clearInterval(recordingInterval);
    }

    return () => {
      clearInterval(recordingInterval);
    };
  }, [recorder.isRecording]);

  const startRecording = () => {
    if (recorder.isRecording) return;

    setRecorder({ ...initialState, isRecording: true });
    VoiceRecorder.startRecording();
  };

  const stopRecording = () => {
    if (!recorder.isRecording) return;

    VoiceRecorder.stopRecording().then(async ({ value }) => {
      console.log({value})
      if (value && value.recordDataBase64) {
        const recordData = value.recordDataBase64;
      /*   const audioArrayBuffer = decode(recordData);
        const audioBlob = new Blob([audioArrayBuffer], {
          type: value.mimeType,
        }); */

        const recordUrl = `data:${value.mimeType};base64,${recordData}`;
        const base64Response = await fetch(recordUrl);
        const blob = await base64Response.blob();

        setRecorder(state => ({
          ...state,
          isRecording: false,
          audio: blob,
          duration: value?.msDuration || 0,
        }));
      }
    });
  };

  const deleteRecording = () => {
    if (recorder.audio) {
      setRecorder(initialState);
    }
  };

  return {
    ...recorder,
    startRecording,
    stopRecording,
    deleteRecording,
  };
};

export default useRecorder;
