import { TablePagination } from "@mui/material";
import type { NewHomeTheme } from "../../new_home/newHomeTheme";

interface ResultsPaginationProps {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  nh: NewHomeTheme;
  isMobile: boolean;
  sx?: { mb?: number; mt?: number };
}

export function ResultsPagination({
  count,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  nh,
  isMobile,
  sx,
}: ResultsPaginationProps) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      showFirstButton
      showLastButton
      onPageChange={(_, next) => onPageChange(next)}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(e) => {
        onPageSizeChange(parseInt(e.target.value, 10));
        onPageChange(0);
      }}
      rowsPerPageOptions={[10, 25, 50, 100]}
      sx={{
        border: "0 !important",
        bgcolor: "transparent",
        mb: sx?.mb,
        mt: sx?.mt,
        color: nh.muted,
        "& .MuiIconButton-root": { color: nh.white },
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
          color: nh.muted,
        },
        "& .MuiSelect-select, & .MuiInputBase-input": { color: nh.white },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: nh.border },
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255,255,255,0.35)",
        },
        "& .MuiTablePagination-toolbar": {
          minHeight: isMobile ? 72 : 44,
          px: 0,
        },
      }}
    />
  );
}
