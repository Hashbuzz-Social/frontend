import { useNavigate } from "react-router-dom";
import { cardData } from "../../../Data/Cards";
import PrimaryButton from "../../Buttons/PrimaryButton";
import SecondaryButton from "../../Buttons/SecondaryButton";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import StatusCard from "../../StatusCard/StatusCard";
import {
  CardSection,
  TableSection,
  StatusSection,
} from "./CreateTwitterPage.styles";
import { TableRow, TableBody } from "@mui/material";
import { tableData, tableHeadRow } from "../../../Data/TwitterTable";
import {
  CustomRowHead,
  CustomTable2,
  CustomTableBodyCell,
  CustomTableHeadCell,
} from "../../Tables/CreateTable.styles";

export const CreateTwitterPage = () => {
  let navigate = useNavigate();
  const handleTemplate = () => {
    navigate("/template");
  };
  const handleTran = () => {
    navigate("/invoice");
  };
  return (
    <ContainerStyled align="center" justify="space-between">
      <CardSection>
        {cardData.map((item) => (
          <StatusCard
            title={item.title}
            content={item.content}
            buttonTag={item.buttonTag}
            isButton={item.isButton}
          />
        ))}
      </CardSection>
      <TableSection>
        <CustomTable2 stickyHeader aria-label="simple table">
          <CustomRowHead>
            <TableRow>
              {tableHeadRow.map((item) => (
                <CustomTableHeadCell
                  key={item.id}
                  align={item.align}
                  style={{ minWidth: item.minWidth, width: item.width }}
                >
                  {item.label}
                </CustomTableHeadCell>
              ))}
            </TableRow>
          </CustomRowHead>
          <TableBody>
            {tableData.map((item) => (
              <TableRow>
                <CustomTableBodyCell
                  key={item.id}
                  align={item.align}
                  style={{ minWidth: item.minWidth, width: item.width }}
                >
                  {item.cardNo}
                </CustomTableBodyCell>
                <CustomTableBodyCell>{item.name}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.stats}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.spent}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.claimed}</CustomTableBodyCell>
                <CustomTableBodyCell>
                  {item.isbutton ? (
                    item.actions.map((element) => (
                      <SecondaryButton text={element} margin="5%" />
                    ))
                  ) : (
                    <a onClick={handleTran}>{item.actions}</a>
                  )}
                </CustomTableBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </CustomTable2>
      </TableSection>
      <StatusSection>
        we charge one time X hbars per twitter card campaign (unlimited free
        topups).
      </StatusSection>
      <PrimaryButton
        text="Create Twitter Card"
        variant="contained"
        onclick={handleTemplate}
      />
    </ContainerStyled>
  );
};
