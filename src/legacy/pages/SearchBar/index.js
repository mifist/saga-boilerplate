/**
 *
 * SearchBar
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { compose } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './style.scss';

// HOC
import withRedux from 'HOC/withRedux';

// algolia stuff
import algoliasearch from 'algoliasearch';
import { connectHighlight, InstantSearch } from 'react-instantsearch-dom';

// assets
import CustomIcons from 'legacy/components/CustomIcons';

// antd component
import { Col, Row } from 'antd';
// components
import LinkWrapper from 'legacy/components/LinkWrapper';

// utils
import {
  DEVELOPMENT_INDEX_SEARCH,
  PRODUCTION_INDEX_SEARCH,
  STAGING_INDEX_SEARCHL,
} from 'utils/constants';
import { isWeb } from 'utils/capacitorHelper';

let indexName = 'dev_beemed';
if (process.env.BASE_ENV === 'production') {
  indexName = PRODUCTION_INDEX_SEARCH;
} else if (process.env.BASE_ENV === 'staging') {
  indexName = STAGING_INDEX_SEARCHL;
} else if (process.env.BASE_ENV === 'development') {
  indexName = DEVELOPMENT_INDEX_SEARCH;
}

// init Client Algolia
const searchClient = algoliasearch(
  '3KYRUMOM9Z',
  'b7dfd42f2cf1b791349aa3651a0366e2',
);

const index = searchClient.initIndex(indexName);

// For searching query into url
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function SearchBar({ 
  history,
  // default props
  className,
  // core
  state,
  dispatch
}) {
  const { 
    searchBar
  } = state.SearchBar;

  const query = useQuery();
  const { t, i18n } = useTranslation();

  const [searchString, setSearchString] = useState(query.get('query') || '');
  const [searchFace, setSearchFace] = useState(query.get('type') || 'all');
  const [hits, setHits] = useState([]);
  const [facetHits, setFacetHits] = useState([]);

  const categories = [
    { label: t('common.all'), key: 'all' },
    // { label: 'Comments', key: 'comment' },
    { label: t('common.posts'), key: 'post' },
    { label: t('common.articles'), key: 'article' },
    { label: t('common.podcasts'), key: 'podcast' },
    { label: t('common.cases'), key: 'case' },
    { label: t('common.events'), key: 'event' },
    // { label: 'Members', key: 'user' },
  ];

  const searchToAlgolia = () => {
    let filters;

    if (searchFace === 'all') {
      filters = '';
    } else {
      filters = `type:"${searchFace}"`;
    }

    index
      .search(searchString, {
        filters,
        hitsPerPage: 8,
      })
      .then((result) => {
        setHits(result.hits);
      });
  };

  useEffect(() => {
    history.replace({
      pathname: `/search/?query=${searchString}&type=${searchFace}`,
    });
  }, [searchFace, searchString]);

  useEffect(() => {
    if (searchString.length >= 3 || searchString !== 'all') {
      searchToAlgolia();
    }
  }, [searchString]);

  useEffect(() => {
    searchToAlgolia();
  }, [searchFace]);

  // CDM
  useEffect(() => {
    // Get number data
    index
      .searchForFacetValues('type', '')
      .then((result) => setFacetHits(result.facetHits));
  }, []);

  const Highlight = ({ highlight, attribute, hit }) => {
    const parsedHit = highlight({
      highlightProperty: '_highlightResult',
      attribute,
      hit,
    });

    let maxLength = 200;
    let currentLength = 0;
    return (
      <span className="highlight">
        {parsedHit.map((part, index) => {
          currentLength += part.value.length;

          // First too long
          if (index === 0 && currentLength >= maxLength) {
            return <span key={index}>{part.value.slice(0, maxLength)}</span>;
          }

          if (currentLength <= maxLength) {
            return part.isHighlighted ? (
              <mark key={index}>{part.value}</mark>
            ) : (
              <span key={index}>{part.value}</span>
            );
          } else {
            return null;
          }
        })}
      </span>
    );
  };

  // 2. Connect the component using the connector
  const CustomHighlight = connectHighlight(Highlight);

  const commentRender = (hitData) => {
    return (
      <div className={'commentRender'} key={'commentrender'}>
        <h3>Comments</h3>
        <Row className={'render_content'}>
          {hitData.length === 0 && (
            <p className={'no_results'}>There are no results for this query.</p>
          )}
          {hitData.map((hit) => (
            <Col sm={24} md={12} className={'hit_content'}>
              <div className={'hit_bg'}>
                <span
                  className={'custom_highlightResult'}
                  dangerouslySetInnerHTML={{
                    __html: hit._highlightResult.content.value,
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  const eventRender = (hitData, type) => {
    return (
      <div className={'eventRender'} key={'eventrender' + type}>
        <h3>{t(`common.${type + 's'}`)}</h3>
        <Row className={'render_content'}>
          {hitData.length === 0 && (
            <>
              <p className={'no_results'}>{t('common.noQueryResults')}</p>
              <br />
              <LinkWrapper type={'event'}>
                {t('common.exploreEvents')}
              </LinkWrapper>
            </>
          )}
          {hitData.map((hit) => (
            <Col sm={24} md={12} className={'hit_content'}>
              <div className={'hit_bg'}>
                <LinkWrapper
                  _id={hit.id}
                  type={type}
                  goBackName="common.backToSearch"
                >
                  <h4>{hit.name}</h4>
                </LinkWrapper>
                <span>
                  {hit.date_from} | {hit.date_to}
                </span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  const postRender = (hitData, type) => {
    return (
      <div className={'postRender'} key={'postrender' + type}>
        <h3>{t(`common.${type + 's'}`)}</h3>
        <Row className={'render_content'}>
          {hitData.length === 0 && (
            <p className={'no_results'}>{t('common.noQueryResults')}</p>
          )}
          {hitData.map((hit) => (
            <Col sm={24} md={12} className={'hit_content'}>
              <div className={'hit_bg'}>
                <LinkWrapper
                  _id={hit.objectID}
                  type={type}
                  goBackName="common.backToSearch"
                >
                  <h4>{hit.title !== '' ? hit.title : 'Post'}</h4>
                </LinkWrapper>
                <span
                  className={'custom_highlightResult'}
                  dangerouslySetInnerHTML={{
                    __html: hit._highlightResult.content.value.slice(0, 400),
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  const otherRender = (hitData) => {
    return;
    return (
      <div className={'otherRender'}>
        <h3>Others</h3>
        <Row className={'render_content'}>
          {hitData.length === 0 && (
            <p className={'no_results'}>There are no results for this query.</p>
          )}
        </Row>
      </div>
    );
  };

  const Hits = ({ hits }) => {
    const orderedHits = {
      case: [],
      article: [],
      event: [],
      podcast: [],
      post: [],
      comment: [],
      other: [],
    };

    // populate data into hits
    hits.forEach((hit) => {
      if (hit.type !== undefined) {
        orderedHits[hit.type].push(hit);
      } else {
        orderedHits.other.push(hit);
      }
    });

    // Entries will do on each object.key
    // Then sort by value.length
    const sortableByResultsNumber = Object.entries(orderedHits).sort(
      ([, a], [, b]) => {
        return b.length - a.length;
      },
    );

    let filtered = sortableByResultsNumber;

    if (searchFace !== 'all') {
      let finder = sortableByResultsNumber.find((e) => e[0] === searchFace);
      filtered = [finder];
    }

    return filtered.map(([key, items]) => {
      switch (key) {
        // case 'comment':
        //   return commentRender(items, key);
        case 'case':
        case 'article':
        case 'podcast':
        case 'post':
          return postRender(items, key);
        case 'event':
          return eventRender(items, key);
        default:
          return otherRender(items, key);
      }
    });
  };

  const onChangeSearch = (e) => {
    setSearchString(e.target.value);
  };

  const categorieFiltering = ({ label, key }) => {
    return (
      <a
        className={`categorie_label ${
          searchFace === key && 'categorie_label_active'
        }`}
        key={'categorie-' + key}
        onClick={() => setSearchFace(key)}
      >
        {label}
        {key !== 'all' && (
          <span className={'category_count'}>{/*({count})*/}</span>
        )}
      </a>
    );
  };

  const onClickGoBack = () => {
    history.goBack();
  };

  // const CustomHits = connectHits(Hits);

  const onClickSubmit = (e) => {
    e.preventDefault();
  };

  const onClickReset = (e) => {
    e.preventDefault();
    setSearchString('');
  };

  const renderCustomSearch = () => {
    return (
      <div className="ais-SearchBox">
        <form className="ais-SearchBox-form" noValidate>
          <button
            className="ais-SearchBox-submit"
            type="submit"
            title="Submit the search query."
            onClick={onClickSubmit}
          >
            <CustomIcons type="search" />
          </button>
          <input
            autoFocus
            className="ais-SearchBox-input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={t('common.searchHere')}
            spellCheck="false"
            maxLength="512"
            type="search"
            onChange={onChangeSearch}
            value={searchString}
          />

          <button
            className="ais-SearchBox-reset"
            type="reset"
            onClick={onClickReset}
            hidden={!searchString.length > 0}
          >
            <CustomIcons type="close" />
          </button>
        </form>
      </div>
    );
  };

  const renderCategories = () => {
    return categories.map((cat) => categorieFiltering(cat));
  };

  // render function
  return (
    <div
      className={classNames(
        'search_algolia',
        i18n.language === 'ar' && 'search_algolia--rtl',
      )}
    >
      <div className={'search-content'}>
        <a className={'close_button'} onClick={onClickGoBack}>
          <CustomIcons type="close" />
          <span>{t('common.close')}</span>
        </a>
        <InstantSearch indexName="dev_beemed" searchClient={searchClient}>
          <div className={'search_categories'}>{renderCategories()}</div>
          {renderCustomSearch()}
          <div className="right-panel">
            <Hits hits={hits} />
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}


export default compose(withRedux, memo)(SearchBar);
