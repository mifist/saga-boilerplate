import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const peaksInit = [
  0.0218,
  0.0183,
  0.0165,
  0.0198,
  0.2137,
  0.2888,
  0.2313,
  0.15,
  0.2542,
  0.2538,
  0.2358,
  0.1195,
  0.1591,
  0.2599,
  0.2742,
  0.1447,
  0.2328,
  0.1878,
  0.1988,
  0.1645,
  0.1218,
  0.2005,
  0.2828,
  0.2051,
  0.1664,
  0.1181,
  0.1621,
  0.2966,
  0.189,
  0.246,
  0.2445,
  0.1621,
  0.1618,
  0.189,
  0.2354,
  0.1561,
  0.1638,
  0.2799,
  0.0923,
  0.1659,
  0.1675,
  0.1268,
  0.0984,
  0.0997,
  0.1248,
  0.1495,
  0.1431,
  0.1236,
  0.1755,
  0.1183,
  0.1349,
  0.1018,
  0.1109,
  0.1833,
  0.1813,
  0.1422,
  0.0961,
  0.1191,
  0.0791,
  0.0631,
  0.0315,
  0.0157,
  0.0166,
  0.0108,
];

const useWaveSurfer = (refContainer, options = {}) => {
  var WaveSurfers = [];

  const waveSurferRef = useRef(null);
  const audioRef = useRef(null);

  const [playing, setPlay] = useState(false);
  const [pause, setPause] = useState(false);
  const [loading, setLoading] = useState(false);

  const formWaveSurferOptions = ref => {
    let mainOptions = {
      container: ref || '.waveform',
      backend: 'MediaElement', // WebAudio, MediaElement, MediaElementWebAudio
      mediaType: 'audio', // 'audio' or 'video'. Only used with backend MediaElement.
      waveColor: '#b2ced4',
      progressColor: '#CBA348',
      height: 30,
      // If true, normalize by the maximum peak instead of 1.0.
      normalize: true,
      cursorColor: '#CBA348',
      barWidth: 1,
      barRadius: 0,
      // Use the PeakCache to improve rendering speed of large waveforms.
      partialRender: false,
      hideScrollbar: true,
      minPxPerSec: 300, // the benefits are visible in big zooms
      splitChannels: false,
      plugins: [],
    };
    return mainOptions;
  };

  const formatTime = time => {
    return [
      Math.floor((time % 3600) / 60), // minutes
      ('00' + Math.floor(time % 60)).slice(-2), // seconds
    ].join(':');
  };

  useEffect(() => {
    if (!!waveSurferRef.current) {
      waveSurferRef.current.on('loading', e => {
        //console.log('loading', e);
      });
      waveSurferRef.current.on('play', e => {
        const dur = waveSurferRef.current.getDuration();
        console.log(e, waveSurferRef.current, dur);

        const newPeaks = waveSurferRef.current.drawBuffer();
        const rate = waveSurferRef.current.getPlaybackRate();
        console.log({ newPeaks, rate })

      });
      // 'waveform-ready' - Fires after the waveform is drawn when using the MediaElement backend.
      // If you're using the WebAudio backend, you can use 'ready'.
      waveSurferRef.current.on('ready', () => {
        setLoading(false);

        const newPeaks = waveSurferRef.current.drawBuffer();
        const rate = waveSurferRef.current.getPlaybackRate();
        console.log({newPeaks, rate})

        const wavesurferParent = waveSurferRef.current.container.parentNode.closest(
          '.media-player-wrapper',
        );
        const currentDurationWrapper = wavesurferParent.querySelector(
          '.waveform-duration',
        );
        const dur = waveSurferRef.current.getDuration();
        const currentDuration = dur != 'Infinity' && formatTime(dur);

        console.log({ currentDuration }, waveSurferRef.current);

        currentDurationWrapper &&
          !!currentDuration &&
          (currentDurationWrapper.innerText = currentDuration);
      });

      // Show current time
      // if current time same as duration then stop playing
      waveSurferRef.current.on('audioprocess', () => {
        const cDur = waveSurferRef.current.getDuration();
        const cTime = waveSurferRef.current.getCurrentTime();
        const currentTimeSec = formatTime(cTime);
        const currentDurationSec = cDur != 'Infinity' && formatTime(cDur);
        console.log({ cDur, cTime });
        console.log(waveSurferRef.current);
        if (cTime != 'Infinity') {
          const wavesurferParent = waveSurferRef.current.container.parentNode.closest(
              '.media-player-wrapper',
            ),
            currentTimeWrapper = wavesurferParent.querySelector(
              '.waveform-current-time',
            );
          currentTimeWrapper &&
            !!cTime &&
            (currentTimeWrapper.innerText = currentTimeSec);
        }
      });

      waveSurferRef.current.on('finish', e => {
        setPlay(false);
        setPause(false);
        onSetPause(waveSurferRef.current, 'stop');
      });
    }
  }, [waveSurferRef.current]);

  const onSetAudioRef = ( ref, url ) => {
    const initOptions = formWaveSurferOptions(ref);
    audioRef.current = ref;
    waveSurferRef.current = WaveSurfer.create({
      ...initOptions,
      ...options,
    });
    // add the WaveSurfer to the global array so we can keep up with it
    WaveSurfers.push(waveSurferRef.current);

    if (url) {
      waveSurferRef.current.load(url, peaksInit);
    }
  };

  const loadAudioBlob = blob => {
    waveSurferRef.current.loadBlob(blob);
    //   audioRef.current = blob;
  };

  const loadAudio = (ref, url, peaks) => {
    waveSurferRef.current.load(url, peaksInit);
    //  audioRef.current = url;
  };

  const onPlay = () => {
    waveSurferRef.current.play();
    setPlay(true);
    setPause(false);

    // check all wavesurfer
    WaveSurfers.length > 1 &&
      WaveSurfers.map(waveSurferItem => {
        if (
          waveSurferItem.container.classList.contains('playing') &&
          waveSurferItem.container.id !== wavesurferContainer.id
        ) {
          onSetPause(waveSurferItem, 'stop');
          waveSurferItem.unAll();
        }
      });
  };

  const onStop = () => {
    waveSurferRef.current.stop();
    setPlay(false);
    setPause(false);
  };

  const onPause = () => {
    waveSurferRef.current.pause();
    setPause(true);
    setPlay(false);
  };

  const onPlayPause = () => {
    waveSurferRef.current.playPause();
    setPause(prev => !prev);
    setPlay(prev => !prev);
  };

  const onSetPause = (ws, type) => {
    const parent = ws.container.parentNode.closest('.media-player-wrapper'),
      playBtn = parent.querySelector('.play-btn .play-pause-icon');

    type == 'pause' ? onPause() : onStop();
    ws.container.classList.remove('playing');

    if (playBtn) {
      playBtn.classList.remove('paused');
      playBtn.classList.add('play');
    }
  };

  const onSetPlay = () => {
    const parent = waveSurferRef.current.container.parentNode.closest(
      '.media-player-wrapper',
    );
    const playBtn = parent.querySelector('.play-btn .play-pause-icon');

    onPlay();
    waveSurferRef.current.container.classList.add('playing');

    if (playBtn) {
      playBtn.classList.remove('play');
      playBtn.classList.add('paused');
    }
  };

  const onTogglePlayPause = () => {
    if (!loading) {
      const wavesurferContainer = waveSurferRef.current.container;
      const wavesurferParent = wavesurferContainer.parentNode.closest(
        '.media-player-wrapper',
      );
      const itemPlayBtn = wavesurferParent.querySelector(
        '.play-btn .play-pause-icon',
      );

      if (!playing || itemPlayBtn.classList.contains('play')) {
        onSetPlay(waveSurferRef.current);

        // check all wavesurfer
        WaveSurfers.length > 1 &&
          WaveSurfers.map(waveSurferItem => {
            if (
              waveSurferItem.container.classList.contains('playing') &&
              waveSurferItem.container.id !== wavesurferContainer.id
            ) {
              onSetPause(waveSurferItem, 'stop');
              waveSurferItem.unAll();
            }
          });
      } else if (playing || itemPlayBtn.classList.contains('paused')) {
        onSetPause(waveSurferRef.current, 'pause');
      }
    } else {
      console.log('loading....');
    }
  };

  return {
    waveSurferRef,
    audioRef,
    onSetAudioRef,
    loadAudioBlob,
    loadAudio,
    onPlay,
    onStop,
    onPause,
    onSetPause,
    onSetPlay,
    onTogglePlayPause,
    isPlay: playing,
    isPause: pause,
    loading,
  };
};

export default useWaveSurfer;
