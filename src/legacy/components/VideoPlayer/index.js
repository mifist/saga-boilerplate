/**
 *
 * VideoPlayer
 *
 */

import React, { memo, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import ReactPlayer from 'react-player';
import { Button, Slider } from 'antd';
import { findDOMNode } from 'react-dom';
import './style.scss';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { url: props.url };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.url !== this.props.url && this.props.url !== null) {
      this.setState({ url: nextProps.url });
    }
  }

  state = {
    // url: 'https://vimeo.com/639057977',
    pip: false,
    playing: false,
    controls: false,
    light: true,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: true,
  };

  handleDuration = duration => {
    this.setState({ duration });
  };

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  handleStop = () => {
    this.setState({ url: null, playing: false });
  };

  handleToggleControls = () => {
    const { url } = this.state;
    this.setState(
      {
        controls: !this.state.controls,
        url: null,
      },
      () => this.load(url),
    );
  };

  handleToggleLight = () => {
    this.setState({ light: !this.state.light });
  };

  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  };

  handleVolumeChange = e => {
    this.setState({ volume: parseFloat(e) });
  };

  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };

  handleOnPlaybackRateChange = speed => {
    this.setState({ playbackRate: parseFloat(speed) });
  };

  handlePlay = () => {
    this.setState({ playing: true });
  };

  handlePause = () => {
    this.setState({ playing: false });
  };

  handleSeekChange = e => {
    this.setState({ played: parseFloat(e) });
    this.player.seekTo(parseFloat(e));
  };

  handleProgress = state => {
    // We only want to update time slider if we are not currently seeking
    this.setState(state);
  };

  handleEnded = () => {
    this.setState({ playing: this.state.loop });
  };

  formatSecond(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = this.pad(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${this.pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  pad(string) {
    return `0${string}`.slice(-2);
  }

  ref = player => {
    this.player = player;
  };

  render() {
    const {
      url,
      playing,
      controls,
      light,
      volume,
      muted,
      loop,
      played,
      loaded,
      duration,
      playbackRate,
      pip,
    } = this.state;

    return (
      <div className="player-wrapper">
        <ReactPlayer
          ref={this.ref}
          // className="video-play"
          width="auto"
          // height="100%"
          url={url}
          pip={pip}
          playing={playing}
          controls={controls}
          light={light}
          loop
          playbackRate={playbackRate}
          volume={volume}
          muted={muted}
          // onReady={() => console.log('onReady')}
          // onStart={() => console.log('onStart')}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          // onBuffer={() => console.log('onBuffer')}
          // onPlaybackRateChange={this.handleOnPlaybackRateChange}
          // onSeek={e => console.log('onSeek', e)}
          onEnded={this.handleEnded}
          // onError={e => console.log('onError', e)}
          onProgress={this.handleProgress}
          onDuration={this.handleDuration}
          config={{
            vimeo: {
              playerOptions: {
                color: 'CBA348',
                byline: false,
                controls: true,
                loop: true,
              },
            },
          }}
        />
      </div>
    );
  }
}

VideoPlayer.propTypes = {};

export default memo(VideoPlayer);
