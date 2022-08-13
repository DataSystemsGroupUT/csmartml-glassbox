import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { GridRowParams, MuiEvent, GridCallbackDetails } from '@mui/x-data-grid';
;

const columns: GridColDef[] = [
  { field: 'id', headerName: '#', width: 20 },
  { field: 'n_clusters', headerName: 'clusters', width: 80 },
  {
    field: 'partition',
    headerName: 'partition',
    width: 150,
    editable: true,
  },
  {
    field: 'fitness',
    headerName: 'fitness',
    width: 150,
    editable: true,
  }
];


export default function EnhancedTable(props: any) {

  const rows = props.topN
  const selectModel = props.selectModel

  const [pageSize, setPageSize] = React.useState<number>(5);

  const handleRowClick = (
    params: GridRowParams, 
    event: MuiEvent<React.MouseEvent>, 
    details: GridCallbackDetails) => {
      selectModel(params.id)
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        onRowClick={handleRowClick}
        rowsPerPageOptions={[5, 10, 15]}
        pagination
        rows={rows}
        columns={columns}
      />
    </div>
  );
}
