import React from 'react';
const TableFooter = ({ isFooter, footerGroups }) => {
  if (isFooter) {
    return (
      <tfoot>
        {footerGroups.map((group, index) => (
          <tr {...group.getFooterGroupProps()} key={'footerRow' + index}>
            {group.headers.map((column) => (
              <td
                {...column.getFooterProps()}
                key={'footerRowCell' + column.id}
                className={'u-padding-top-m knor-table-sum-result'}
              >
                {column.render('Footer')}
              </td>
            ))}
          </tr>
        ))}
      </tfoot>
    );
  } else {
    return <></>;
  }
};
export default TableFooter;
