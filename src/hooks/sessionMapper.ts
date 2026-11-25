export interface RawSchedule {
  schedule_id?: string;
  id?: string;
  course_id?: string;
  session_number?: number;
  start_time?: string | Date | null;
  startTime?: string | Date | null;
  end_time?: string | Date | null;
  endTime?: string | Date | null;
  day_of_week?: string | number | null;
  dayOfWeek?: string | number | null;
  status?: string | null;
  course?: {
    course_id?: string;
    title?: string;
    type?: string;
    tutor?: {
      user?: {
        full_name?: string;
        avatar_url?: string;
      };
      full_name?: string;
      avatar_url?: string;
    };
  };
  courseTitle?: string;
  tutorName?: string;
  tutorAvatar?: string;
  meeting_link?: string;
  meetingLink?: string;
  [key: string]: unknown;
}

export interface ScheduleDisplayItem {
  session_id: string;
  id: string;
  course_id?: string;
  type?: 'online' | 'offline';
  courseTitle: string;
  tutorName: string;
  tutorAvatar: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink: string;
  dayOfWeek: string;
  date: string;
  timeRange: string;
  formattedTime: string;
  displayTime: string;
  formattedSchedule: string;
  formattedDate: string;
  hasValidTime: boolean;
  toString(): string;
  valueOf(): string;
}

const VIETNAMESE_DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const DAY_MAP: Record<string, string> = {
  mon: 'Thứ Hai',
  tue: 'Thứ Ba',
  wed: 'Thứ Tư',
  thu: 'Thứ Năm',
  fri: 'Thứ Sáu',
  sat: 'Thứ Bảy',
  sun: 'Chủ Nhật',
  monday: 'Thứ Hai',
  tuesday: 'Thứ Ba',
  wednesday: 'Thứ Tư',
  thursday: 'Thứ Năm',
  friday: 'Thứ Sáu',
  saturday: 'Thứ Bảy',
  sunday: 'Chủ Nhật',
  'thứ 2': 'Thứ Hai',
  'thứ 3': 'Thứ Ba',
  'thứ 4': 'Thứ Tư',
  'thứ 5': 'Thứ Năm',
  'thứ 6': 'Thứ Sáu',
  'thứ 7': 'Thứ Bảy',
  'thứ hai': 'Thứ Hai',
  'thứ ba': 'Thứ Ba',
  'thứ tư': 'Thứ Tư',
  'thứ năm': 'Thứ Năm',
  'thứ sáu': 'Thứ Sáu',
  'thứ bảy': 'Thứ Bảy',
  'chủ nhật': 'Chủ Nhật',
  cn: 'Chủ Nhật'
};

/**
 * Helper function: mapScheduleToDisplayItem
 * Chuyển dữ liệu schedule từ backend API thành dữ liệu hiển thị an toàn và định dạng ngày giờ tiếng Việt.
 * Format chuẩn: "Thứ Hai, 10/12/2026 (19:30 - 21:00)"
 */
export const mapScheduleToDisplayItem = (schedule?: RawSchedule | null): ScheduleDisplayItem => {
  const fallbackFormattedTime = 'Chưa có lịch';

  // Fallback defaults for missing schedule or missing start_time
  const baseFallback: ScheduleDisplayItem = {
    session_id: schedule?.schedule_id || schedule?.id || '',
    id: schedule?.schedule_id || schedule?.id || '',
    course_id: schedule?.course_id || schedule?.course?.course_id,
    type: (schedule?.course?.type as 'online' | 'offline') || 'online',
    courseTitle: schedule?.course?.title || schedule?.courseTitle || 'Khóa học',
    tutorName:
      schedule?.course?.tutor?.user?.full_name ||
      schedule?.course?.tutor?.full_name ||
      schedule?.tutorName ||
      'Chưa phân công',
    tutorAvatar:
      schedule?.course?.tutor?.user?.avatar_url ||
      schedule?.course?.tutor?.avatar_url ||
      schedule?.tutorAvatar ||
      '',
    startTime: '',
    endTime: '',
    status: (schedule?.status as 'scheduled' | 'ongoing' | 'completed' | 'cancelled') || 'scheduled',
    meetingLink: schedule?.meetingLink || schedule?.meeting_link || '',
    dayOfWeek: 'Chưa xác định',
    date: 'Chưa xác định',
    timeRange: 'Chưa có thời gian',
    formattedTime: fallbackFormattedTime,
    displayTime: fallbackFormattedTime,
    formattedSchedule: fallbackFormattedTime,
    formattedDate: fallbackFormattedTime,
    hasValidTime: false,
    toString() {
      return fallbackFormattedTime;
    },
    valueOf() {
      return fallbackFormattedTime;
    }
  };

  const rawStart = schedule?.start_time ?? schedule?.startTime;
  if (!rawStart) {
    return baseFallback;
  }

  const startDate = new Date(rawStart);
  if (isNaN(startDate.getTime())) {
    return baseFallback;
  }

  const padZero = (n: number) => String(n).padStart(2, '0');

  // Determine Day of Week
  let dayOfWeek = '';
  const rawDay = schedule?.day_of_week ?? schedule?.dayOfWeek;
  if (rawDay !== undefined && rawDay !== null) {
    if (typeof rawDay === 'number') {
      dayOfWeek = VIETNAMESE_DAYS[rawDay] || VIETNAMESE_DAYS[startDate.getDay()];
    } else {
      const lower = String(rawDay).trim().toLowerCase();
      dayOfWeek = DAY_MAP[lower] || String(rawDay).trim();
    }
  } else {
    dayOfWeek = VIETNAMESE_DAYS[startDate.getDay()];
  }

  // Format Date (DD/MM/YYYY)
  const day = padZero(startDate.getDate());
  const month = padZero(startDate.getMonth() + 1);
  const year = startDate.getFullYear();
  const dateStr = `${day}/${month}/${year}`;

  // Format Time (HH:mm)
  const startHours = padZero(startDate.getHours());
  const startMinutes = padZero(startDate.getMinutes());
  const startTimeStr = `${startHours}:${startMinutes}`;

  let timeRangeStr = startTimeStr;
  const rawEnd = schedule?.end_time ?? schedule?.endTime;
  if (rawEnd) {
    const endDate = new Date(rawEnd);
    if (!isNaN(endDate.getTime())) {
      const endHours = padZero(endDate.getHours());
      const endMinutes = padZero(endDate.getMinutes());
      timeRangeStr = `${startTimeStr} - ${endHours}:${endMinutes}`;
    }
  }

  const formattedResult = `${dayOfWeek}, ${dateStr} (${timeRangeStr})`;

  return {
    ...baseFallback,
    startTime: startDate.toISOString(),
    endTime: rawEnd && !isNaN(new Date(rawEnd).getTime()) ? new Date(rawEnd).toISOString() : '',
    dayOfWeek,
    date: dateStr,
    timeRange: timeRangeStr,
    formattedTime: formattedResult,
    displayTime: formattedResult,
    formattedSchedule: formattedResult,
    formattedDate: `${dayOfWeek}, ${dateStr}`,
    hasValidTime: true,
    toString() {
      return formattedResult;
    },
    valueOf() {
      return formattedResult;
    }
  };
};
