import React, { useState, useMemo } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams, GridSortModel, GridFilterModel } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  Typography,
  Paper,
  Stack,
  Card,
  CardContent,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

// ─── Types ───────────────────────────────────────────────────────────────────

type OrderStatus = "completed" | "pending" | "shipped" | "cancelled";

interface Order {
  id: number;
  orderId: string;
  customer: string;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: OrderStatus;
  date: string;
  region: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ORDERS: Order[] = [
  { id: 1,  orderId: "ORD-10041", customer: "Aria Chen",       product: "Pro Laptop 15\"",     category: "Electronics", quantity: 1,  unitPrice: 1299.99, total: 1299.99, status: "completed", date: "2024-03-01", region: "West"    },
  { id: 2,  orderId: "ORD-10042", customer: "James Rivera",    product: "Wireless Headset",    category: "Electronics", quantity: 3,  unitPrice: 89.99,   total: 269.97,  status: "shipped",   date: "2024-03-02", region: "East"    },
  { id: 3,  orderId: "ORD-10043", customer: "Priya Patel",     product: "Ergonomic Chair",     category: "Furniture",   quantity: 2,  unitPrice: 399.00,  total: 798.00,  status: "pending",   date: "2024-03-03", region: "Central" },
  { id: 4,  orderId: "ORD-10044", customer: "Sam O'Brien",     product: "Standing Desk",       category: "Furniture",   quantity: 1,  unitPrice: 649.50,  total: 649.50,  status: "completed", date: "2024-03-04", region: "West"    },
  { id: 5,  orderId: "ORD-10045", customer: "Leila Nassar",    product: "USB-C Hub",           category: "Accessories", quantity: 5,  unitPrice: 49.99,   total: 249.95,  status: "cancelled", date: "2024-03-05", region: "East"    },
  { id: 6,  orderId: "ORD-10046", customer: "Tom Nguyen",      product: "Mechanical Keyboard", category: "Electronics", quantity: 2,  unitPrice: 129.00,  total: 258.00,  status: "shipped",   date: "2024-03-06", region: "West"    },
  { id: 7,  orderId: "ORD-10047", customer: "Dana Kowalski",   product: "Monitor 27\"",        category: "Electronics", quantity: 1,  unitPrice: 529.00,  total: 529.00,  status: "completed", date: "2024-03-07", region: "Central" },
  { id: 8,  orderId: "ORD-10048", customer: "Marco Ferretti",  product: "Notebook Bundle",     category: "Stationery",  quantity: 10, unitPrice: 12.50,   total: 125.00,  status: "completed", date: "2024-03-08", region: "East"    },
  { id: 9,  orderId: "ORD-10049", customer: "Sophie Laurent",  product: "Webcam HD",           category: "Electronics", quantity: 2,  unitPrice: 79.99,   total: 159.98,  status: "pending",   date: "2024-03-09", region: "West"    },
  { id: 10, orderId: "ORD-10050", customer: "Chris Park",      product: "Cable Management",    category: "Accessories", quantity: 4,  unitPrice: 24.99,   total: 99.96,   status: "shipped",   date: "2024-03-10", region: "Central" },
  { id: 11, orderId: "ORD-10051", customer: "Nina Yamamoto",   product: "Pro Laptop 15\"",     category: "Electronics", quantity: 2,  unitPrice: 1299.99, total: 2599.98, status: "completed", date: "2024-03-11", region: "East"    },
  { id: 12, orderId: "ORD-10052", customer: "Luis Morales",    product: "Desk Lamp",           category: "Furniture",   quantity: 3,  unitPrice: 39.00,   total: 117.00,  status: "cancelled", date: "2024-03-12", region: "West"    },
  { id: 13, orderId: "ORD-10053", customer: "Eva Rosenberg",   product: "Wireless Mouse",      category: "Accessories", quantity: 6,  unitPrice: 34.99,   total: 209.94,  status: "shipped",   date: "2024-03-13", region: "Central" },
  { id: 14, orderId: "ORD-10054", customer: "Kai Blackwell",   product: "Ergonomic Chair",     category: "Furniture",   quantity: 1,  unitPrice: 399.00,  total: 399.00,  status: "completed", date: "2024-03-14", region: "East"    },
  { id: 15, orderId: "ORD-10055", customer: "Yuna Kim",        product: "USB-C Hub",           category: "Accessories", quantity: 2,  unitPrice: 49.99,   total: 99.98,   status: "pending",   date: "2024-03-15", region: "West"    },
];

// ─── Inline SVG Icons (no @mui/icons-material needed) ────────────────────────

const IconRevenue: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconOrders: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconCompleted: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconPending: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ─── Status Chip ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: "success" | "warning" | "info" | "error" }> = {
  completed: { label: "Completed", color: "success" },
  pending:   { label: "Pending",   color: "warning" },
  shipped:   { label: "Shipped",   color: "info"    },
  cancelled: { label: "Cancelled", color: "error"   },
};

const StatusChip: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <Chip
      label={cfg.label}
      color={cfg.color}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.75rem", borderRadius: "6px" }}
    />
  );
};

// ─── Summary Card ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, icon, bgColor }) => (
  <Card variant="outlined" sx={{ flex: 1, minWidth: 160, borderRadius: 2 }}>
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: "14px !important" }}>
      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: bgColor, display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// ─── Column Definitions ───────────────────────────────────────────────────────

const COLUMNS: GridColDef<Order>[] = [
  {
    field: "orderId",
    headerName: "Order ID",
    width: 120,
    renderCell: (params: GridRenderCellParams<Order>) => (
      <Typography variant="body2" fontWeight={600} color="primary">
        {params.value as string}
      </Typography>
    ),
  },
  {
    field: "date",
    headerName: "Date",
    width: 115,
    type: "date",
    valueGetter: (_value: unknown, row: Order) => new Date(row.date),
  },
  { field: "customer", headerName: "Customer", width: 160, flex: 1 },
  { field: "product",  headerName: "Product",  width: 190, flex: 1 },
  {
    field: "category",
    headerName: "Category",
    width: 130,
    type: "singleSelect",
    valueOptions: ["Electronics", "Furniture", "Accessories", "Stationery"],
  },
  { field: "quantity", headerName: "Qty", width: 70, type: "number", align: "center", headerAlign: "center" },
  {
    field: "unitPrice",
    headerName: "Unit Price",
    width: 110,
    type: "number",
    align: "right",
    headerAlign: "right",
    valueFormatter: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    field: "total",
    headerName: "Total",
    width: 120,
    type: "number",
    align: "right",
    headerAlign: "right",
    renderCell: (params: GridRenderCellParams<Order>) => (
      <Typography variant="body2" fontWeight={600}>
        ${(params.value as number).toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Typography>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    type: "singleSelect",
    valueOptions: ["completed", "pending", "shipped", "cancelled"],
    renderCell: (params: GridRenderCellParams<Order>) => (
      <StatusChip status={params.value as OrderStatus} />
    ),
  },
  {
    field: "region",
    headerName: "Region",
    width: 100,
    type: "singleSelect",
    valueOptions: ["West", "East", "Central"],
  },
];

// ─── MUI Theme ────────────────────────────────────────────────────────────────

const theme = createTheme({
  palette: {
    mode: "light",
    primary:   { main: "#353638" },
    secondary: { main: "#7e3af2" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
  },
});

// ─── Main Component ───────────────────────────────────────────────────────────

const OrdersGrid: React.FC = () => {
  const [sortModel,   setSortModel]   = useState<GridSortModel>([{ field: "date", sort: "desc" }]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });

  const summary = useMemo(() => {
    const totalRevenue    = ORDERS.reduce((s, o) => s + o.total, 0);
    const totalOrders     = ORDERS.length;
    const completedOrders = ORDERS.filter(o => o.status === "completed").length;
    const pendingOrders   = ORDERS.filter(o => o.status === "pending").length;
    return { totalRevenue, totalOrders, completedOrders, pendingOrders };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Sales Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            March 2024 · {ORDERS.length} orders · Use the toolbar to sort, filter, and search
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap", gap: "16px !important" }}>
          <SummaryCard
            label="Total Revenue"
            value={`$${summary.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            icon={<IconRevenue color="#1a56db" />}
            bgColor="#eff6ff"
          />
          <SummaryCard
            label="Total Orders"
            value={String(summary.totalOrders)}
            icon={<IconOrders color="#7e3af2" />}
            bgColor="#f5f3ff"
          />
          <SummaryCard
            label="Completed"
            value={String(summary.completedOrders)}
            icon={<IconCompleted color="#059669" />}
            bgColor="#ecfdf5"
          />
          <SummaryCard
            label="Pending"
            value={String(summary.pendingOrders)}
            icon={<IconPending color="#d97706" />}
            bgColor="#fffbeb"
          />
        </Stack>

        {/* Data Grid */}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <DataGrid<Order>
            rows={ORDERS}
            columns={COLUMNS}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 200 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              border: 0,
              "& .MuiDataGrid-toolbarContainer": {
                px: 2,
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                gap: 1,
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#f1f5f9",
                borderRadius: 0,
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                },
              },
              "& .MuiDataGrid-row:hover": { bgcolor: "#d7ffe0" },
              "& .MuiDataGrid-cell": {
                borderColor: "divider",
                fontSize: "0.875rem",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid",
                borderColor: "divider",
              },
            }}
          />
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default OrdersGrid;