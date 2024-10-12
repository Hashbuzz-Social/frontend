import { TableBody, TableRow } from "@mui/material";
import templateHeadRow from "../../../Data/Template.json";
import * as SC from "./styled";

import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useStore } from "@store/hooks";

interface TemplateTableProps {
  handleReply: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRetweet: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLike: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFollow?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  reply: number;
  retweet: number;
  selectedToken: string;
  like: number;
  download: number;
  follow: number;
  quote: number;
}

export const TemplateTable: React.FC<TemplateTableProps> = ({ handleReply, handleRetweet, handleLike, handleDownload, handleFollow, type, reply, retweet, selectedToken, like, download, follow, quote }) => {
  const store = useStore();
  const [editIdx, setEditIdx] = useState<number>(-1);
  const [icon, setIcon] = useState<string>("ℏ");

  const startEditing = (i: number) => {
    setEditIdx(i);
  };

  const stopEditing = () => {
    console.log("stopping...");
    setEditIdx(-1);
  };

  useEffect(() => {
    let currentToken = store?.balances?.find((item) => item?.entityId === selectedToken);
    setIcon(type === "HBAR" ? "ℏ" : ((currentToken?.entityIcon ?? "ℏ") as string));
  }, [type, selectedToken, store?.balances]);

  return (
    <SC.CustomTable stickyHeader aria-label="simple table">
      <SC.CustomRowHead>
        <TableRow>
          {templateHeadRow.map((item) => (
            <SC.BorderlessHead
              key={item.id}
              //Text align is set to center
              align={item.align as "center" | "inherit" | "left" | "right" | "justify"}
              style={{ width: item.width }}
            >
              {item.label}
            </SC.BorderlessHead>
          ))}
        </TableRow>
      </SC.CustomRowHead>
      <TableBody>
        <SC.CustomTableRow>
          <SC.BorderlessCell>
            {editIdx === -1 ? (
              <SC.NumberInput
                type="number"
                onKeyPress={(event) => {
                  if (event.code === "Minus") {
                    event.preventDefault();
                  }
                }}
                step="0.1"
                min="0"
                name="like"
                onChange={handleLike}
                placeholder={like.toString()}
              />
            ) : (
              like + `${icon}`
            )}
          </SC.BorderlessCell>
          <SC.BorderlessCell>
            {editIdx === -1 ? (
              <SC.NumberInput
                type="number"
                min="0"
                onKeyPress={(event) => {
                  if (event.code === "Minus") {
                    event.preventDefault();
                  }
                }}
                step="0.1"
                name="repost"
                onChange={handleRetweet}
                placeholder={retweet.toString()}
              />
            ) : (
              retweet + `${icon}`
            )}
          </SC.BorderlessCell>

          <SC.BorderlessCell>
            {editIdx === -1 ? (
              <SC.NumberInput
                type="number"
                min="0"
                onKeyPress={(event) => {
                  if (event.code === "Minus") {
                    event.preventDefault();
                  }
                }}
                step="0.1"
                name="quote"
                onChange={handleDownload}
                placeholder={quote.toString()}
              />
            ) : (
              quote + `${icon}`
            )}
          </SC.BorderlessCell>
          <SC.BorderlessCell>
            {editIdx === -1 ? (
              <SC.NumberInput
                type="number"
                min="0"
                onKeyPress={(event) => {
                  if (event.code === "Minus") {
                    event.preventDefault();
                  }
                }}
                step="0.1"
                name="comment"
                onChange={handleReply}
                placeholder={reply.toString()}
              />
            ) : (
              reply + `${icon}`
            )}
          </SC.BorderlessCell>

          <SC.BorderlessCell>{editIdx === -1 ? <EditIcon onClick={() => startEditing(0)} /> : <CheckIcon onClick={stopEditing} />}</SC.BorderlessCell>
        </SC.CustomTableRow>
      </TableBody>
    </SC.CustomTable>
  );
};

export default TemplateTable;
