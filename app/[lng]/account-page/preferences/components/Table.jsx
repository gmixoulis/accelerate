import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material"

// ###### STYLING CELLS & ROWS (MUI WAY) ######
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "12px 20px",
  },

  "&:nth-of-type(1)": {
    width: "50%",
    "@media (min-width:1536px)": {
      width: "60%",
    },
  },
  "&:nth-of-type(2)": {
    width: "50%",
    "@media (min-width:1536px)": {
      width: "40%",
    },
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },

  " &:last-child th": {},
}))

const CustomTable = ({ rows }) => (
  <div className="flex md:min-w-[49vw]">
    <TableContainer style={{ overflow: "visible" }}>
      <Table aria-label="simple table">
        <TableBody className="dark:bg-gray-700">
          {rows.map((row, index) => (
            <StyledTableRow
              key={row.name}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                ...(index === 0 && {
                  "th:first-of-type": { borderTopLeftRadius: "15px" },
                  "td:last-child, th:last-child": {
                    borderTopRightRadius: "15px",
                  },
                }),
                ...(index === rows.length - 1 && {
                  "th:first-of-type": { borderBottomLeftRadius: "15px" },
                  "td:last-child, th:last-child": {
                    borderBottomRightRadius: "15px",
                  },
                }),
              }}
            >
              <StyledTableCell component="th" scope="row">
                <span className="font-regular text-md dark:text-gainsboro-400">
                  {row.name}
                </span>
              </StyledTableCell>
              <StyledTableCell align="right">{row.content}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

export default CustomTable
