import * as React from "react";
import { default as Slider, Settings } from "react-slick";
import styled from "styled-components";

interface Props {
  list: {
    imageUrl: string;
    title: string;
  }[];
  initialIndex: number;
  slickSettings: Settings;
  onSelected: (index: number) => void;
}

const Root = styled.div`
  margin: 40px;
`;

const SliderItem = styled.div`
  text-align: center;
`;

const Image = styled.img`
  height: 300px;
  margin: 0 auto;
`;

const Title = styled.div``;

class GameSelector extends React.Component<Props> {
  private slickRef = React.createRef<Slider>();
  private pendingIdOfOnSelected: any = null;

  componentDidMount() {
    if (this.slickRef.current) {
      this.slickRef.current.slickGoTo(this.props.initialIndex);
    }
  }

  render() {
    const { list, slickSettings } = this.props;

    const settings: Settings = {
      infinite: false,
      dots: true,
      beforeChange: this.beforeChange,
      ...slickSettings
    };

    return (
      <Root>
        <Slider ref={this.slickRef} {...settings}>
          {list.map(item => {
            return (
              <SliderItem key={item.title}>
                <Image src={item.imageUrl} />
                <Title>{item.title}</Title>
              </SliderItem>
            );
          })}
        </Slider>
      </Root>
    );
  }

  private beforeChange = (current: number, next: number) => {
    if (this.pendingIdOfOnSelected) {
      clearTimeout(this.pendingIdOfOnSelected);
    }

    this.pendingIdOfOnSelected = setTimeout(() => {
      this.props.onSelected(next);
    }, 500);
  };
}

export default GameSelector;
