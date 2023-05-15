import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Dropdown, Menu, Space, message } from 'antd';

import { Share } from '@capacitor/share';
// icons
import CustomIcons from 'legacy/components/CustomIcons';
import { LinkOutlined, ShareAltOutlined } from '@ant-design/icons';

import { getBaseDomainOrigin } from 'utils/capacitorHelper';

const ShareAction = ({ type, title, url, content, className, icon }) => {
  const defaultClass =
    type == 'dropdown' ? 'share-action-dropdown' : 'share-action-list';
  const childClassNames = classNames(defaultClass, className);

  const { t } = useTranslation();

  const domain = getBaseDomainOrigin();
  const shareUrl = url ? domain + url : domain + location.pathname;

  const [isCopied, setIsCopied] = useState(false);
  const [isItemSharable, setIsItemSharable] = useState(false);

  useEffect(() => {
    if (isCopied) {
      message.success(t('common.copied'));
    }
  }, [isCopied]);

  // check is shareable API is available
  useEffect(() => {
    let cs = Share.canShare();
    cs.then(r => {
      if (r.value) {
        setIsItemSharable(true);
      }
    });
  }, []);

  const shareAPI = async () => {
    let contentTemp = '';

    if (title) {
      contentTemp = title;
    } else {
      contentTemp = content.replace(/(<([^>]+)>)/gi, '');
      if (contentTemp.length > 150) {
        contentTemp = contentTemp.slice(0, 150) + ' ...';
      }
    }

    return await Share.share({
      title: title,
      text: contentTemp,
      url: shareUrl,
      dialogTitle: t('shareOutsideBeemed'),
    });
  };

  /* Settings for Shared:
   * https://www.npmjs.com/package/react-share
   */
  const shareAction = (
    <Menu>
      <Menu.Item key="0">
        <span
          className="share-action-CopyToClipboard"
          style={{ width: '101px' }}
        >
          <CopyToClipboard
            text={shareUrl}
            onCopy={() => setIsCopied(!isCopied)}
          >
            <Space>
              {t('common.copyLink')}
              <LinkOutlined />
            </Space>
          </CopyToClipboard>
        </span>
      </Menu.Item>
      {isItemSharable && (
        <Menu.Item key="1">
          <span
            className="share-action-CopyToClipboard"
            style={{ width: '100px' }}
            onClick={() => shareAPI()}
          >
            <Space>
              {t('common.share')}
              <ShareAltOutlined />
            </Space>
          </span>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      {type == 'dropdown' && (
        <Dropdown
          className={childClassNames}
          overlay={shareAction}
          trigger={['click']}
          getPopupContainer={trigger => trigger.parentElement}
        >
          <a className="share-action" onClick={e => e.preventDefault()}>
            <CustomIcons type={icon} />
          </a>
        </Dropdown>
      )}
      {type == 'list' && (
        <div className={childClassNames}>
          <span className="label">{t('common.share')}:</span>
          {shareAction}
        </div>
      )}
    </>
  );
};

ShareAction.defaultProps = {
  type: 'dropdown',
  icon: 'share',
  url: '',
  title: '',
};

ShareAction.propTypes = {
  type: PropTypes.oneOf(['list', 'dropdown']).isRequired,
  icon: PropTypes.oneOf(['share2', 'share']),
  url: PropTypes.string,
  title: PropTypes.string,
  actions: PropTypes.object,
};

export default memo(ShareAction);
