import * as React from "react";
import { default as Slider, Settings, CustomArrowProps } from "react-slick";
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
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
`;

const SliderItem = styled.div`
  text-align: center;
`;

const Image = styled.img`
  height: 300px;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: 30px;
`;

const arrowSize = 50;
const Arrow = styled.div`
  width: ${arrowSize}px;
  height: ${arrowSize}px;

  &::before {
    font-size: ${arrowSize}px;
    color: #ff767b;
  }
`;

const NextArrow: React.SFC<CustomArrowProps> = props => {
  const { className, style, onClick } = props;
  return <Arrow className={className} style={{ ...style }} onClick={onClick} />;
};

const PrevArrow: React.SFC<CustomArrowProps> = props => {
  const { className, style, onClick } = props;
  return <Arrow className={className} style={{ ...style }} onClick={onClick} />;
};

class GameSelector extends React.Component<Props> {
  private slickRef = React.createRef<Slider>();
  private pendingIdOfOnSelected: any = null;

  // TODO {@link https://github.com/akiran/react-slick/pull/1272}
  private beforeIndex: number = 0;

  componentDidMount() {
    this.beforeIndex = this.props.initialIndex;
  }

  render() {
    const { list, initialIndex, slickSettings } = this.props;

    const settings: Settings = {
      infinite: false,
      initialSlide: initialIndex,
      dots: true,
      arrows: true,
      beforeChange: this.beforeChange,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
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
    if (this.beforeIndex === next) {
      return;
    }

    this.beforeIndex = next;

    if (this.pendingIdOfOnSelected) {
      clearTimeout(this.pendingIdOfOnSelected);
    }

    this.pendingIdOfOnSelected = setTimeout(() => {
      this.props.onSelected(next);
    }, 500);
  };
}

export default GameSelector;
