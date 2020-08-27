import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const RowContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

export const ContentItem = styled.div`
  margin: 1rem 0;
`;

export const ScoringTypeBlock = styled.div`
  margin-right: 4rem;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

export const RadioBlock = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  margin: 0 1rem;
`;

export const DraftOrderBlock = styled.div`
  margin-bottom: 1rem;
  display: flex;
`;

export const DraftOrderNum = styled.div`
  width: 36px;
  height: 36px;
  background-color: grey;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const OwnerName = styled.div`
  border: 1px solid lightgrey;
  width: 400px;
  padding: 0.5rem 1rem;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

export const SelectBlock = styled.div`
  border: 1px solid lightgray;
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  width: 360px;
  display: flex;
  color: gray;
  &:hover {
    cursor: pointer;
  }
`;

export const DeleteBtn = styled.div`
  &:hover {
    cursor: pointer;
  }
`;
