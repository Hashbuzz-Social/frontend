import { GridRenderCellParams } from '@mui/x-data-grid';
import { useStore } from '../../../../../Store/StoreProvider';
import { CampaignCards } from '../../../../../types';
import { getSymbol } from '../../../../../Utilities/helpers';

// Moved RenderSymbol to a separate function
export function RenderSymbol(
  props: GridRenderCellParams<CampaignCards, CampaignCards, CampaignCards>
) {
  const store = useStore();
  const entities = store.balances;
  return (
    <span>
      {props.row?.type === 'HBAR'
        ? 'HBAR'
        : getSymbol(entities, props.row?.fungible_token_id ?? '')}
    </span>
  );
}
