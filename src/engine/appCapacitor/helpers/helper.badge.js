import { Badge } from '@robingenz/capacitor-badge';

const getBadgeCount = async () => {
  const result = await Badge.get();
  return result.count;
};

const setBadgeCount = async (count) => {
  await Badge.set({ count });
};

const increaseBadge = async () => {
  await Badge.increase();
};

const decreaseBadge = async () => {
  await Badge.decrease();
};

const clearBadge = async () => {
  await Badge.clear();
};

const isSupportedBadge = async () => {
  const result = await Badge.isSupported();
  return result.isSupported;
};

const checkPermissionsBadge = async () => {
  const result = await Badge.checkPermissions();
 // console.debug('checkPermissionsBadge', JSON.stringify(result));
  return result;
};

const requestPermissionsBadge = async () => {
  const result = await Badge.requestPermissions();
 // console.debug('requestPermissionsBadge', JSON.stringify(result));
  return result;
};

export default {
  getBadgeCount,
  setBadgeCount,
  increaseBadge,
  decreaseBadge,
  clearBadge,
  isSupportedBadge,
  checkPermissionsBadge,
  requestPermissionsBadge
}
