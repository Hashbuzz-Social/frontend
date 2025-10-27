import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Alert, Box, Chip, CircularProgress, Tooltip } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import {
  BotException,
  useGetBotExceptionsQuery,
  useRemoveBotExceptionMutation,
} from '../../../API/botExceptions';
import { AddBotExceptionModal } from './AddBotExceptionModal';
import {
  AddButton,
  BotExceptionsContainer,
  EmptyState,
  HeaderSection,
  LoadingContainer,
  SearchBox,
  StatusChip,
  TableContainer,
  Title,
} from './BotExceptions.styles';

export const BotExceptionsScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedException, setSelectedException] =
    useState<BotException | null>(null);

  // API Hooks
  const {
    data: exceptionsResponse,
    isLoading,
    error,
    refetch,
  } = useGetBotExceptionsQuery();

  const [removeBotException, { isLoading: isRemoving }] =
    useRemoveBotExceptionMutation();

  // Data processing
  const exceptions = useMemo(() => {
    if (!exceptionsResponse?.data || !Array.isArray(exceptionsResponse.data)) {
      return [];
    }
    return exceptionsResponse.data;
  }, [exceptionsResponse]);

  const filteredExceptions = useMemo(() => {
    if (!searchTerm) return exceptions;

    const term = searchTerm.toLowerCase();
    return exceptions.filter(
      exception =>
        exception.twitter_user_id.toLowerCase().includes(term) ||
        exception.twitter_username?.toLowerCase().includes(term) ||
        exception.reason.toLowerCase().includes(term) ||
        exception.notes?.toLowerCase().includes(term)
    );
  }, [exceptions, searchTerm]);

  // Event handlers
  const handleAddNew = () => {
    setSelectedException(null);
    setAddModalOpen(true);
  };

  const handleRemove = async (twitterUserId: string) => {
    if (
      !window.confirm('Are you sure you want to remove this bot exception?')
    ) {
      return;
    }

    try {
      const result = await removeBotException({
        twitter_user_id: twitterUserId,
      }).unwrap();

      if (result.status === 'success') {
        toast.success(result.message || 'Bot exception removed successfully');
        refetch();
      } else {
        toast.error(result.message || 'Failed to remove bot exception');
      }
    } catch (error) {
      console.error('Remove bot exception error:', error);
      toast.error('Failed to remove bot exception. Please try again.');
    }
  };

  const handleView = (exception: BotException) => {
    setSelectedException(exception);
    setAddModalOpen(true);
  };

  // DataGrid columns definition
  const columns: GridColDef[] = [
    {
      field: 'twitter_user_id',
      headerName: 'Twitter User ID',
      width: 140,
      renderCell: params => (
        <Tooltip title={params.value}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'twitter_username',
      headerName: 'Username',
      width: 120,
      renderCell: params => (
        <span style={{ fontWeight: 500 }}>
          {params.value ? `@${params.value}` : 'N/A'}
        </span>
      ),
    },
    {
      field: 'reason',
      headerName: 'Reason',
      width: 200,
      renderCell: params => (
        <Tooltip title={params.value}>
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 100,
      renderCell: params => (
        <StatusChip isActive={params.value}>
          {params.value ? 'Active' : 'Inactive'}
        </StatusChip>
      ),
    },
    {
      field: 'added_by_admin',
      headerName: 'Added By',
      width: 140,
      renderCell: params => (
        <span style={{ fontSize: '13px' }}>
          {params.row.added_by_admin?.name || 'System'}
        </span>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Added Date',
      width: 120,
      renderCell: params => (
        <span style={{ fontSize: '12px' }}>
          {new Date(params.value).toLocaleDateString()}
        </span>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params: GridRowParams<BotException>) => [
        <GridActionsCellItem
          icon={
            <Tooltip title='View Details'>
              <ViewIcon />
            </Tooltip>
          }
          label='View'
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title='Remove Exception'>
              <DeleteIcon />
            </Tooltip>
          }
          label='Remove'
          onClick={() => handleRemove(params.row.twitter_user_id)}
          disabled={isRemoving}
        />,
      ],
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <BotExceptionsContainer>
        <LoadingContainer>
          <CircularProgress className='loading-spinner' size={40} />
        </LoadingContainer>
      </BotExceptionsContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <BotExceptionsContainer>
        <Alert severity='error' sx={{ mb: 2 }}>
          Failed to load bot exceptions. Please try again later.
        </Alert>
      </BotExceptionsContainer>
    );
  }

  return (
    <BotExceptionsContainer>
      <HeaderSection>
        <Title>
          <SecurityIcon sx={{ color: '#667eea' }} />
          Bot Detection Exceptions
          <Chip
            label={`${exceptions.length} total`}
            size='small'
            sx={{ ml: 1, background: '#e6f3ff', color: '#1565c0' }}
          />
        </Title>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchBox
            size='small'
            placeholder='Search exceptions...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#718096', mr: 1 }} />,
            }}
            sx={{ minWidth: 250 }}
          />

          <AddButton
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            variant='contained'
          >
            Add Exception
          </AddButton>
        </Box>
      </HeaderSection>

      {filteredExceptions.length === 0 ? (
        <EmptyState>
          <SecurityIcon className='empty-icon' />
          <h3>No Bot Exceptions Found</h3>
          <p>
            {searchTerm
              ? 'No exceptions match your search criteria.'
              : 'No bot detection exceptions have been added yet.'}
          </p>
        </EmptyState>
      ) : (
        <TableContainer>
          <DataGrid
            rows={filteredExceptions}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: 'created_at', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f0f0f0',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                fontWeight: 600,
              },
            }}
          />
        </TableContainer>
      )}

      {/* Add/Edit Modal */}
      <AddBotExceptionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        exception={selectedException}
        onSuccess={() => {
          refetch();
          setAddModalOpen(false);
        }}
      />
    </BotExceptionsContainer>
  );
};
