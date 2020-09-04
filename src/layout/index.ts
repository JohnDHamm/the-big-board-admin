import styled from 'styled-components';
import PageLayout from './PageLayout/PageLayout';

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentItem = styled.div`
  margin: 1rem 0;
`;

const RowContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

const RadioBlock = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  margin: 0 1rem;
`;

const DeleteBtn = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const SelectBlock = styled.div`
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

export {
  Content,
  ContentItem,
  DeleteBtn,
  PageLayout,
  RadioBlock,
  RowContent,
  SelectBlock,
};
