import { format, parseISO } from "date-fns"

const DateFormatter = ({ dateString }) => {
  const date = parseISO(dateString)
  if (isNaN(date)) {
    return null; // or some default value or message
  }
  return (
    <time className="text-slate-400" dateTime={dateString}>
      {format(new Date(date), "LLLL d, yyyy")}
    </time>
  )
}

export default DateFormatter
