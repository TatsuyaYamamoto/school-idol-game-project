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
  width: number;
  height: number;
  hasMoreItem: boolean;
  isLoading: boolean;
  list: JSX.Element[];
  loadMoreItem: (params: IndexRange) => Promise<any>;
}

const RankingList: React.SFC<Props> = props => {
  const { width, height, list, isLoading, hasMoreItem, loadMoreItem } = props;

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
    >
      {({ onRowsRendered, registerChild }) => (
        <List
          height={height}
          width={width}
          onRowsRendered={onRowsRendered}
          ref={registerChild}
          rowCount={rowCount}
          rowHeight={100}
          rowRenderer={rowRenderer}
          overscanRowCount={0}
        />
      )}
    </InfiniteLoader>
  );
};

export default RankingList;
