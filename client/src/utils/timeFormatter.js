import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatRelativeTime = (timestamp) => {
  return dayjs(timestamp).fromNow();
};
