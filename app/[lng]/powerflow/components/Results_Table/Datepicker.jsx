import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { el, enGB } from 'date-fns/locale';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import { UseTranslation } from '@/app/i18n/client';
import dayjs from 'dayjs';
import Calendar from '@mui/icons-material/Event';

export default function DatePicker({ startDate, endDate, setStartDate, setEndDate }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");

  const locale = lng === "el" ? el : enGB;

  const shortcutsItems = [
    {
      label: t("today"),
      getValue: () => {
        const today = dayjs().toDate();
        return [today, today];
      }
    },
    {
      label: t("yesterday"),
      getValue: () => {
        const yesterday = dayjs().subtract(1, 'day').toDate();
        return [yesterday, yesterday];
      }
    },
    {
      label: t("lastNumberDays", { number: 7 }),
      getValue: () => {
        const today = dayjs().toDate();
        const lastWeek = dayjs().subtract(7, 'day').toDate();
        return [lastWeek, today];
      }
    },
    {
      label: t("currentMonth"),
      getValue: () => {
        const today = dayjs().toDate();
        const firstDayOfMonth = dayjs().startOf('month').toDate();
        return [firstDayOfMonth, today];
      }
    },
    {
      label: t("pastMonth"),
      getValue: () => {
        const firstDayOfMonth = dayjs().subtract(1, 'month').startOf('month').toDate();
        const lastDayOfMonth = dayjs().subtract(1, 'month').endOf('month').toDate();
        return [firstDayOfMonth, lastDayOfMonth];
      }
    }
  ];
        

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (newValue) => {
    const [start, end] = newValue;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      //Get the current URL search params
      const currentSearchParams = new URLSearchParams(Array.from(searchParams.entries()));

      // Set the specified search parameters to the given values
      currentSearchParams.set("startDate", formatDate(start));
      currentSearchParams.set("endDate", formatDate(end));

      // Construct the new URL
      const newPathName = `${pathname}?${currentSearchParams.toString()}`;
      router.push(newPathName);
      router.refresh();
    } else if (!start && !end) {
      const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
      currentParams.delete("startDate");
      currentParams.delete("endDate");

      const newPathName = `${pathname}?${currentParams.toString()}`;

      router.push(newPathName);
      router.refresh();
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <DateRangePicker
          slots={{ field: SingleInputDateRangeField }}
          value={[startDate, endDate]} 
          onChange={handleDateChange}
          slotProps={{
            shortcuts: {
              items: shortcutsItems,
            },
            textField: {
              placeholder: `${t("placeholders.date")} - ${t("placeholders.date")}`,
              size: "small",
              InputProps: { endAdornment: <Calendar className='!text-gray-600'/> },
              fullWidth: true,
              sx: {
                width: '100px'
              }
            },
          }}
          clearable
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}