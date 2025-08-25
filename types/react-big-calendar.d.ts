declare module 'react-big-calendar' {
  import { ComponentType } from 'react';

  export interface Event {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    id?: string;
    color?: string;
    monitor?: string;
    room?: string;
    maxCapacity?: number;
    description?: string;
  }

  export interface CalendarProps {
    localizer: any;
    events: Event[];
    defaultView?: string;
    views?: string[];
    date?: Date;
    culture?: string;
    selectable?: boolean;
    onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
    onSelectEvent?: (event: Event) => void;
    onNavigate?: (newDate: Date) => void;
    startAccessor: string;
    endAccessor: string;
    style?: React.CSSProperties;
    formats?: any;
    step?: number;
    timeslots?: number;
    min?: Date;
    max?: Date;
    messages?: Record<string, string>;
    eventPropGetter?: (event: Event) => any;
    components?: any;
  }

  export const Calendar: ComponentType<CalendarProps>;
  export const dateFnsLocalizer: (config: any) => any;
}
