import * as React from "react";
import {
  Index,
  IndexRange,
  ListRowProps,
  InfiniteLoader,
  List,
  AutoSizer,
  WindowScroller
} from "react-virtualized";

import RankItem from "./RankItem";

interface Props {
  hasMoreItem: boolean;
  isLoading: boolean;
  list: JSX.Element[];
  loadMoreItem: (params: IndexRange) => Promise<any>;
}

const RankingList: React.SFC<Props> = props => {
  const { list, isLoading, hasMoreItem, loadMoreItem } = props;

  const rowCount = hasMoreItem ? list.length + 5 : list.length;

  const loadMoreRows = isLoading
    ? async (params: IndexRange) => {}
    : loadMoreItem;

  const isRowLoaded = ({ index }: Index) => !hasMoreItem || index < list.length;

  const rowRenderer = ({ key, index, style }: ListRowProps) => {
    const item = list[index];

    return (
      <div
        key={key}
        style={{
          ...style
        }}
      >
        {item || <RankItem point={0} rank={0} userName={""} member={""} />}
      </div>
    );
  };

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
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
