import * as React from "react";
import styled from "styled-components";

interface Props {
  time: Date;
}

const Root = styled.div`
  text-align: right;

  margin-top: 10px;
  margin-bottom: 10px;
`;

const Time = styled.span`
  background: linear-gradient(transparent 60%, rgba(255, 132, 0, 0.54) 60%);
  padding-right: 50px;
`;

const DateValue = styled.span``;

const LastUpdateTime: React.SFC<Props> = (props) => {
  const { time } = props;

  const yyyy = time.getFullYear();
  const MM = ("00" + (time.getMonth() + 1)).slice(-2);
  const dd = ("00" + time.getDate()).slice(-2);
  const hh = ("00" + time.getHours()).slice(-2);
  const mm = ("00" + time.getMinutes()).slice(-2);

  return (
    <Root>
      <Time>
        {`Last updated at `}
        {`${yyyy}/${MM}/${dd} ${hh}:${mm}`}
      </Time>
    </Root>
  );
};

export default LastUpdateTime;
