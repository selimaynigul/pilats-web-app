import React from "react";
import styled from "styled-components";
import AddButton from "components/AddButton";
import { CompanyDropdown } from "components";

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const CountContainer = styled.div`
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.bodyBg};
  padding: 10px 20px;
  gap: 6px;
  border-radius: 50px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
  background: ${({ theme }) => theme.bodyBg};
  height: 50px;
  border-radius: 50px;
  align-items: center;
  padding: 10px;

  @media (max-width: 768px) {
    margin-left: auto;
  }
`;

const CountNumber = styled.span`
  color: ${({ theme }) => theme.primary};
`;
interface EntityToolbarProps {
  count: number;
  entityLabel: string;
  selectedCompany?: any;
  setSelectedCompany?: (company: any) => void;
  onAddClick: () => void;
  showCompanyDropdown?: boolean;
  showAddButton?: boolean;
  extra?: React.ReactNode;
}

const EntityToolbar: React.FC<EntityToolbarProps> = ({
  count,
  entityLabel,
  selectedCompany,
  setSelectedCompany,
  onAddClick,
  showCompanyDropdown = true,
  showAddButton = true,
  extra,
}) => {
  return (
    <ToolbarContainer>
      <CountContainer>
        <CountNumber>{count}</CountNumber> {entityLabel}
      </CountContainer>
      {(showCompanyDropdown || showAddButton || extra) && (
        <ActionContainer>
          {showCompanyDropdown && (
            <CompanyDropdown
              selectedItem={selectedCompany}
              onSelect={(company) => {
                setSelectedCompany && setSelectedCompany(company);
              }}
            />
          )}
          {extra && extra}
          {showAddButton && <AddButton onClick={onAddClick} />}
        </ActionContainer>
      )}
    </ToolbarContainer>
  );
};

export default EntityToolbar;
