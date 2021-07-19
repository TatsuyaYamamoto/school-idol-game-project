import { FC } from "react";
import {
  Index,
  IndexRange,
  ListRowProps,
  InfiniteLoader,
  List,
  AutoSizer,
  WindowScroller,
} from "react-virtualized";

import RankItem from "../molecules/RankItem";
import { Member } from "../../utils/tmp_mikan";

interface RankingListProps {
  hasMoreItem: boolean;
  list: {
    rank: number;
    userName: string;
    point: number;
    member: Member;
  }[];
  loadMoreItem: (params: IndexRange) => Promise<any>;
}

const RankingList: FC<RankingListProps> = (props) => {
  const { list, hasMoreItem, loadMoreItem } = props;

  const rowCount = hasMoreItem ? list.length + 5 : list.length;

  const isRowLoaded = ({ index }: Index) => !hasMoreItem || index < list.length;

  const rowRenderer = ({ key, index, style }: ListRowProps) => {
    const item = list[index];

    return (
      <div
        key={key}
        style={{
          ...style,
        }}
      >
        {item ? (
          <RankItem
            rank={item.rank}
            userName={item.userName}
            point={item.point}
            member={item.member}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  };

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreItem}
      rowCount={rowCount}
      threshold={10}
    >
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  ref={registerChild}
                  autoHeight
                  height={height}
                  width={width}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  rowCount={rowCount}
                  rowHeight={100}
                  rowRenderer={rowRenderer}
                  onRowsRendered={onRowsRendered}
                  overscanRowCount={0}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  );
};

export default RankingList;
