/**
 *
 * MediaPlayer
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { Spin } from 'antd';

// styles
import './style.scss';

import WaveSurfer from 'wavesurfer.js';
import peaksJson from './demo-peaks.json';
import { PlayButton, Wave, WaveformContainer } from './Waveform';

import useDeviceDetect from 'appHooks/useDeviceDetect';

import {
  ArrowDownOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
} from '@ant-design/icons';

// create a global array to hold our WaveSurfers
var WaveSurfers = [];

const MediaPlayer = ({ type, url, date, className, ...rest }) => {
  const childClassNames = classNames(`media-player-wrapper ${type}`, className);
  const { isMobile } = useDeviceDetect();

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const [playing, setPlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);

  const [volume, setVolume] = useState(0.5);

  const formWaveSurferOptions = ref => ({
    container: ref,
    waveColor: type === 'big' ? '#fff' : '#b2ced4',
    progressColor: '#CBA348',
    cursorColor: 'transparent',
    backend: 'MediaElement', // WebAudio, MediaElement, MediaElementWebAudio
    mediaType: 'audio',
    barWidth: type === 'big' ? 3 : 1,
    barRadius: type === 'big' ? 3 : 0,
    responsive: true,
    height: type === 'big' ? 70 : 52,
    // If true, normalize by the maximum peak instead of 1.0.
    normalize: true,
    // Use the PeakCache to improve rendering speed of large waveforms.
    partialRender: true,
    hideScrollbar: true,
    minPxPerSec: 300, // the benefits are visible in big zooms
    splitChannels: false,
    plugins: [],
  });

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

  const drawnWaveJson = ws => {
    ws.backend.setPeaks(peaksJson.data, ws.getDuration());
    ws.peakCache !== null && ws.peakCache.clearPeakCache();
    ws.drawBuffer();
  };

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setLoading(true);
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    // Init
    wavesurfer.current = WaveSurfer.create(options);

    // add the WaveSurfer to the global array so we can keep up with it
    WaveSurfers.push(wavesurfer.current);

    // Load audio from URL and set peaks
    wavesurfer.current.load(url, peaksInit);

    wavesurfer.current.on('loading', e => {
      setLoadingPercent(e);
    });

    // Show clip duration
    wavesurfer.current.on('ready', () => {
      setLoading(false);

      const wavesurferParent = wavesurfer.current.container.parentNode.closest(
          '.media-player-wrapper',
        ),
        currentDurationWrapper = wavesurferParent.querySelector(
          '.waveform-duration',
        ),
        currentDuration = formatTime(wavesurfer.current.getDuration());

      currentDurationWrapper &&
        (currentDurationWrapper.innerText = currentDuration);
    });

    // Show current time
    // if current time same as duration then stop playing
    wavesurfer.current.on('audioprocess', () => {
      const currentTimeSec = formatTime(wavesurfer.current.getCurrentTime()),
        currentDurationSec = formatTime(wavesurfer.current.getDuration());

      currentTimeSec == currentDurationSec && setPlay(false);

      if (type == 'big') {
        const wavesurferParent = wavesurfer.current.container.parentNode.closest(
            '.media-player-wrapper',
          ),
          currentTimeWrapper = wavesurferParent.querySelector(
            '.waveform-current-time',
          );

        currentTimeWrapper && (currentTimeWrapper.innerText = currentTimeSec);
      }
    });

    /*
    wavesurfer.current.on('ready', function() {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);
      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });
    */
  }, [url]);

  // Removes events, elements and disconnects Web Audio nodes.
  // when component unmount
  useEffect(() => {
    // destroy() – Removes events, elements and disconnects Web Audio nodes.
    // unAll() – Unsubscribes from all events.
    return () => wavesurfer.current.unAll();
  }, []);

  const formatTime = time => {
    return [
      Math.floor((time % 3600) / 60), // minutes
      ('00' + Math.floor(time % 60)).slice(-2), // seconds
    ].join(':');
  };

  const wsSetPause = (ws, type = 'pause') => {
    const parent = ws.container.parentNode.closest('.media-player-wrapper'),
      playBtn = parent.querySelector('.play-btn .play-pause-icon');
    
    type == 'pause' ? ws.pause() : ws.stop();
    ws.container.classList.remove('playing');

    if (playBtn) {
      playBtn.classList.remove('paused');
      playBtn.classList.add('play');
    }
  };

  const wsSetPlay = ws => {
    const parent = ws.container.parentNode.closest('.media-player-wrapper'),
      playBtn = parent.querySelector('.play-btn .play-pause-icon');

    ws.play();
    ws.container.classList.add('playing');

    if (playBtn) {
      playBtn.classList.remove('play');
      playBtn.classList.add('paused');
    }
  };

  // toggle play button
  const handlePlayPause = e => {
    if (loading === false) {
      const wavesurferContainer = wavesurfer.current.container,
        wavesurferParent = wavesurferContainer.parentNode.closest(
          '.media-player-wrapper',
        ),
        itemPlayBtn = wavesurferParent.querySelector(
          '.play-btn .play-pause-icon',
        );

      if (!playing || itemPlayBtn.classList.contains('play')) {
        setPlay(true);
        wsSetPlay(wavesurfer.current);

        // check all wavesurfer
        WaveSurfers.length > 1 &&
          WaveSurfers.map(waveSurferItem => {
            if (
              waveSurferItem.container.classList.contains('playing') &&
              waveSurferItem.container.id !== wavesurferContainer.id
            ) {
              wsSetPause(waveSurferItem, 'stop');
              waveSurferItem.unAll();
            }
          });
      } else if (playing || itemPlayBtn.classList.contains('paused')) {
        setPlay(false);
        wsSetPause(wavesurfer.current);
      }
    }
  };

  const onVolumeChange = e => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  return (
    url && (
      <div className={childClassNames} {...rest}>
        <div />
        {type === 'big' && isMobile && (
          <span className="waveform-data">{moment(date).format('ll')}</span>
        )}
        {/*   {loading && (
          <div className={'loadingaudio-podcast'}>
            <Spin size="large" />
            <span className={'loading-percent'}>{loadingPercent} %</span>
            <span className={'loading-text'}>
              {loadingPercent !== 100
                ? 'Loading the file...'
                : 'Loading the player...'}
            </span>
          </div>
        )} */}
        <WaveformContainer
          id={`waveform-container-${new Date().getTime()}`}
          className="waveform-container"
        >
          {/*{isMobile && type === 'big' && (*/}
          {/*  <a className="download-btn" href={url} target="_blank" download>*/}
          {/*    <ArrowDownOutlined />*/}
          {/*  </a>*/}
          {/*)}*/}
          <PlayButton
            id={`waveform-play-${new Date().getTime()}`}
            className={`play-btn ${
              isMobile && type === 'big' ? 'preview-btn' : ''
            }`}
            onClick={handlePlayPause}
          >
            <span className={`play-pause-icon play`} />
            {/*<span className="text">Listen</span>*/}
          </PlayButton>

          <Wave
            id={`waveform-${new Date().getTime()}`}
            className={`waveform ${
              isMobile && type === 'big' ? 'mobile-big' : ''
            }`}
            ref={waveformRef}
          />
        </WaveformContainer>
        <div className="waveform-details">
          {type === 'small' && date && (
            <span className="waveform-data">{moment(date).format('ll')} -</span>
          )}
          {type === 'big' && (
            <span className="waveform-current-time">0:00</span>
          )}
          <span className="waveform-duration" />
        </div>
      </div>
    )
  );
};

MediaPlayer.propTypes = {
  type: PropTypes.oneOf(['big', 'small', 'feed']).isRequired,
  date: PropTypes.string,
  url: PropTypes.string.isRequired,
};

export default memo(MediaPlayer);
