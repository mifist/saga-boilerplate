/**
 *
 * GalleryPDF
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Helmet } from 'react-helmet';
import VideoPlayer from '../VideoPlayer';
import './style.scss';
import { Image } from 'antd';
import LogoClient from 'images/logo.svg';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  FullscreenOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
// import { Document, Page } from 'react-pdf';
import { Document, Page, pdfjs, PDFDownloadLink } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import { PROXY_API_URL } from 'utils/constants';

import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { Capacitor } from '@capacitor/core';

function GalleryPDF({ content, selectionItem, noGallery }) {
  const [currentPDF, setCurrentPDF] = useState(content[0]);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [width, setWidth] = useState(600);
  const onDocumentLoadSuccess = _pdfInfo => {
    setNumPages(_pdfInfo.numPages);
  };

  useEffect(() => {
    if (content.includes(selectionItem)) {
      setCurrentPDF(selectionItem);
    }
  }, [selectionItem]);

  const handle = useFullScreenHandle();

  const reportChange = useCallback(
    (state, handleItem) => {
      let element = document.getElementById('full-screen-pdf');
      setWidth(element.clientWidth);
      setIsFullScreen(state);
    },
    [handle],
  );

  useEffect(() => {
    let element = document.getElementById('full-screen-pdf');
    setWidth(element.clientWidth);

    // document.onkeydown = checkKey;
  }, []);

  useEffect(() => {
    setPageNumber(1);
    // document.onkeydown = checkKey;
  }, [currentPDF]);

  // const checkKey = e => {
  //   e = e || window.event;
  //   if (e.keyCode == '37') {
  //     // left arrow
  //     console.log(pageNumber);
  //     if (pageNumber >= 1) {
  //       setPageNumber(pageNumber - 1);
  //     }
  //   } else if (e.keyCode == '39') {
  //     // right arrow
  //     if (pageNumber !== numPages) {
  //       setPageNumber(pageNumber + 1);
  //     }
  //   }
  // };

  return (
    <div>
      {!noGallery && (
        <FullScreen
          handle={handle}
          onChange={reportChange}
          className={'full-screen-pdf'}
        >
          <div className="pdf-box" id="full-screen-pdf">
            <div className="pagination-box">
              <div className="pages-box">
                {isFullScreen ? (
                  <img
                    className={'logo-client'}
                    src={LogoClient}
                    alt="Beemed"
                  />
                ) : null}

                <ArrowLeftOutlined
                  className="pagination-btn-prev"
                  onClick={() =>
                    pageNumber === 1 ? false : setPageNumber(pageNumber - 1)
                  }
                />
                {`${pageNumber}/${numPages}`}

                <ArrowRightOutlined
                  className="pagination-btn-next"
                  onClick={() =>
                    pageNumber === numPages
                      ? false
                      : setPageNumber(pageNumber + 1)
                  }
                />
              </div>
              <a href={currentPDF} download target={'_blank'}>
                <DownloadOutlined className="full-screen-icon" />
              </a>

              <FullscreenOutlined
                onClick={!isFullScreen ? handle.enter : handle.exit}
                className="full-screen-icon"
              />
            </div>
            <Document
              className="pdf"
              file={`${PROXY_API_URL}${currentPDF}`}
              onLoadError={console.error}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                pageNumber={pageNumber}
                width={Math.min(width * 0.9)}
                onClick={!isFullScreen ? handle.enter : handle.exit}
              />
            </Document>
          </div>
        </FullScreen>
      )}
      {noGallery && (
        <div className="pdf-box newsfeed-pdf" id="full-screen-pdf">
          <div className="pagination-box">
            <div className="pages-box">
              {isFullScreen ? (
                <img className={'logo-client'} src={LogoClient} alt="Beemed" />
              ) : null}

              <ArrowLeftOutlined
                className="pagination-btn-prev"
                onClick={() =>
                  pageNumber === 1 ? false : setPageNumber(pageNumber - 1)
                }
              />
              {`${pageNumber}/${numPages}`}

              <ArrowRightOutlined
                className="pagination-btn-next"
                onClick={() =>
                  pageNumber === numPages
                    ? false
                    : setPageNumber(pageNumber + 1)
                }
              />
            </div>
          </div>
          <Document
            className="pdf"
            file={`${PROXY_API_URL}${currentPDF}`}
            onLoadError={console.error}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page
              pageNumber={pageNumber}
              width={Math.min(width * 0.9)}
              onClick={!isFullScreen ? handle.enter : handle.exit}
            />
          </Document>
        </div>
      )}
      {!noGallery && (
        <div className={'gallery-image'}>
          {content &&
            content.map((item, index) => {
              return (
                <div
                  key={item}
                  className={`gallery-item ${
                    content[index] === currentPDF ? 'selected' : ''
                  }`}
                  onClick={() => setCurrentPDF(content[index])}
                >
                  <Document
                    className="pdf"
                    file={`${PROXY_API_URL}${item}`}
                    onLoadError={console.error}
                    // onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={1} />
                  </Document>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

GalleryPDF.propTypes = {};

export default memo(GalleryPDF);
