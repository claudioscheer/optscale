import Box from "@mui/material/Box";
import ActionBar from "components/ActionBar";
import SearchInput from "components/SearchInput";
import ColumnsSelector from "../ColumnsSelector";
import useStyles from "./TableActions.styles";

const TableActionBar = ({ actionBarDefinition, tableContext, selectedRowsCount }) => {
  const getActionBarItems = () =>
    actionBarDefinition.items.map((item) => {
      const { enableIfSelectedRows, ...rest } = typeof item === "function" ? item(tableContext) : item;

      return {
        /**
         * TODO: enableIfSelectedRows looks to specific, perhaps we could create a function and pass a set of properties there
         * and then let the action bar item decide if is has to be disabled
         * For example:
         * ```
         *   disabled: item.isDisabled({ selectedRowsCount })
         * ```
         */
        disabled: enableIfSelectedRows && selectedRowsCount === 0,
        ...rest
      };
    });

  return (
    <Box>
      <ActionBar
        isPage={false}
        data={{
          items: getActionBarItems()
        }}
      />
    </Box>
  );
};

const TableActions = ({
  selectedRowsCount = 0,
  actionBar = {},
  withSearch,
  onSearchChange,
  searchValue = "",
  tableContext,
  columnsSelectorUID,
  dataTestIds = {}
}) => {
  const { classes } = useStyles();

  const { columnsSelector: columnsSelectorTestIds = {} } = dataTestIds;
  const { show: showActionBar = false, definition: actionBarDefinition } = actionBar;

  const showColumnsSelector = !!columnsSelectorUID;

  const gotSomethingToDisplay = showActionBar || withSearch || showColumnsSelector;

  /**
   * TODO: Do not render TableActions completely if there is nothing to display
   */
  if (!gotSomethingToDisplay) {
    return null;
  }

  return (
    <Box className={classes.actionsWrapper}>
      {showActionBar && (
        <TableActionBar
          actionBarDefinition={actionBarDefinition}
          tableContext={tableContext}
          selectedRowsCount={selectedRowsCount}
        />
      )}
      <Box style={{ marginLeft: showActionBar ? "" : "auto", display: "flex", flexWrap: "nowrap" }}>
        {withSearch && <SearchInput onSearch={onSearchChange} initialSearchText={searchValue} dataTestIds={dataTestIds} />}
        {showColumnsSelector && <ColumnsSelector tableContext={tableContext} dataTestIds={columnsSelectorTestIds} />}
      </Box>
    </Box>
  );
};

export default TableActions;
