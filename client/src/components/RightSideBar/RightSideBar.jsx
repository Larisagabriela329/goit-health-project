import React from 'react';
import {
  Box,
  List,
  ListTitle,
  PreContent,
  Item,
  BoxList,
  Container,
  Title,
  Content,
  ContainerItem,
} from './RightSideBar.styled';
import { useSelector } from 'react-redux';
import { getDaySummary } from '../../redux/day/day-selectors';
import { getNotAllowedProducts } from '../../redux/day/day-selectors';
import { nanoid } from 'nanoid';

const RightSideBar = () => {
  const daySummary = useSelector(getDaySummary);
  const notAllowedProducts = useSelector(getNotAllowedProducts);

  const normalizedSelectedDate = new Date(daySummary?.date || new Date())
    .toISOString()
    .split('T')[0];

  return (
    <Box>
      <BoxList>
        <ListTitle>
        Summary for {normalizedSelectedDate}
        </ListTitle>
        <Container>
          <ContainerItem>
            <Title>Left</Title>
            <Content>
              {daySummary?.dailyRate > 0 ? Math.round(daySummary.kcalLeft) : 0}{' '}
              kcal
            </Content>{' '}
          </ContainerItem>
          <ContainerItem>
            <Title>Consumed</Title>
            <Content>
              {daySummary?.dailyRate > 0
                ? Math.round(daySummary.kcalConsumed)
                : 0}{' '}
              kcal
            </Content>
          </ContainerItem>
          <ContainerItem>
            <Title>Daily rate </Title>
            <Content>
              {' '}
              {daySummary?.dailyRate > 0
                ? Math.round(daySummary.dailyRate)
                : 0}{' '}
              kcal{' '}
            </Content>
          </ContainerItem>
          <ContainerItem>
            <Title>% of normal</Title>
            <Content>
              {daySummary?.dailyRate > 0
                ? Math.round(daySummary.percentsOfDailyRate)
                : 0}{' '}
              %
            </Content>
          </ContainerItem>
        </Container>
      </BoxList>
      <BoxList>
      <ListTitle>Food not recommended</ListTitle>
{notAllowedProducts.length > 0 ? (
  <List>
    {notAllowedProducts.map((product, idx) => (
      <Item key={nanoid()}>
        {idx + 1}. {product}
      </Item>
    ))}
  </List>
) : (
  <PreContent>No restricted products found</PreContent>
)}
      </BoxList>
    </Box>
  );
};

export default RightSideBar;

