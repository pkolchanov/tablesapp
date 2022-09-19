import React from "react";
import ReactDOM from "react-dom";
import styled, {createGlobalStyle} from "styled-components";

import HorizontalScroll from "./horizontal-scroll";

const Main = styled.main`
`;

const HorizontalSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
`;

const CardsContainer = styled.div`
  position: relative;
  height: 100%;
  padding-right: 150px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const SampleCard = styled.div`
  position: relative;
  padding-top: 30px;
  margin-right: 100px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: normal;
`;

const CardCaption = styled.div`
  display: flex;
  flex-direction: row;
`
const CaptionItem = styled.span`
  margin-right: 15px;
`

const CaptionLink = styled.a`
  border-bottom: 1px solid #969696;
  &:hover {
    border-bottom: 1px solid #009ADE;
  }
`

const Card = React.memo((props) =>
    <SampleCard>
        <img src={props.src} style={{"width": props.width}}></img>
        <CardCaption>
            <CaptionItem>{props.description}</CaptionItem>
            <CaptionItem><CaptionLink href={props.href} target='_blank'>Open in new tab</CaptionLink></CaptionItem>
        </CardCaption>
    </SampleCard>
)

const App = () => (
    <Main>
        <HorizontalSection>
            <HorizontalScroll>
                <CardsContainer>
                    <Card src='/img/GPL.png' description='Comparison table' width='60vw' href='https://tables-c30c4.firebaseapp.com/efb34f6b-6d23-461b-b342-cf8e95cd8299'></Card>
                    <Card src='/img/movieList.png' description='Rating list' width='32vw' href='https://tables-c30c4.firebaseapp.com/2ad7d178-e7aa-49b1-a835-05d05b122e9a'></Card>
                    <Card src='/img/timeline.png' description='Timeline' width='35vw' href='https://tables-c30c4.firebaseapp.com/035cdf26-544e-4c4f-88a8-0464fc54c905'></Card>
                </CardsContainer>
            </HorizontalScroll>
        </HorizontalSection>
    </Main>
);

const rootElement = document.getElementById("carousel");
console.log(rootElement);
ReactDOM.render(<App/>, rootElement);
