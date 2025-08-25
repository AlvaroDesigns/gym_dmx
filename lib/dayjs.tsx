import dayjs from 'dayjs';
import 'dayjs/locale/es';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(updateLocale);
dayjs.extend(weekOfYear);

dayjs.locale('es');
dayjs.updateLocale('es', { weekStart: 1 });

export { dayjs };
