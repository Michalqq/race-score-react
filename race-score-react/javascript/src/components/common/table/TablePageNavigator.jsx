import React from 'react';
const TablePageNavigators = ({
  canPreviousPage,
  canNextPage,
  pageIndex,
  pageOptions,
  previousPage,
  nextPage,
}) => {
  if (pageOptions.length > 1) {
    return (
      <div className='l-col l-col-12 u-text-center u-padding-top-l  u-margin-l'>
        <div className='opl-pagination opl-pagination__with-input opl-pagination__radius u-inline-block'>
          <p className='opl-pagination__prev' title='Poprzednia'>
            <a
              role='prevBtn'
              className={'opl-pagination' + (canPreviousPage ? '' : '__disabled')}
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <span className='g-icon g-icon--only g-icon--xs g-icon--arrow-left'></span>
            </a>
          </p>
          <span className='u-no-padding'>
            Strona
            <span className='opl-input--size-s'>
              {pageIndex + 1} z {pageOptions.length}
            </span>
          </span>
          <p className='opl-pagination__next' title='Następna'>
            <a
              role='nextBtn'
              className={'opl-pagination' + (canNextPage ? '' : '__disabled')}
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <span className='g-icon g-icon--only g-icon--xs g-icon--arrow-right'></span>
            </a>
          </p>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
export default TablePageNavigators;
