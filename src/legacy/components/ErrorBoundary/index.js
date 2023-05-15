/**
 *
 * ErrorBoundary
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import classNames from 'classnames';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Mettez à jour l'état, de façon à montrer l'UI de repli au prochain rendu.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez aussi enregistrer l'erreur au sein d'un service de rapport.
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez afficher n'importe quelle UI de repli.
      return <p>Something went wrong.</p>;
    }

    return this.props.children;
  }
}

ErrorBoundary.defaultProps = {};
ErrorBoundary.propTypes = {};

export default memo(ErrorBoundary);
