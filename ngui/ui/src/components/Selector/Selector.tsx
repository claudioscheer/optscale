import { useState, forwardRef, useMemo } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useIntl } from "react-intl";
import Icon from "components/Icon";
import IconButton from "components/IconButton";
import Input from "components/Input";
import Tooltip from "components/Tooltip";
import { capitalize } from "utils/strings";
import useStyles from "./Selector.styles";

const MenuItemWithIcon = ({ item, menuItemIcon }) => {
  const { placement = "start", component: IconComponent = Icon, getComponentProps = {} } = menuItemIcon;

  const icon = (
    <IconComponent
      color="inherit"
      hasRightMargin={placement === "start"}
      hasLeftMargin={placement === "end"}
      {...getComponentProps(item)}
    />
  );

  return (
    <Box display="flex" alignItems="center">
      {placement === "start" && icon}
      {item.name}
      {placement === "end" && icon}
    </Box>
  );
};

const MenuItemContent = ({ item, menuItemIcon }) =>
  menuItemIcon ? <MenuItemWithIcon item={item} menuItemIcon={menuItemIcon} /> : item.name;

const Selector = forwardRef(
  (
    {
      data,
      labelId,
      customClass,
      onChange,
      children,
      helperText,
      error = false,
      required = false,
      breakpoint = "sm",
      menuItemIcon,
      dataTestId,
      isMobile = false,
      fullWidth = false,
      readOnly,
      shrinkLabel = undefined,
      sx,
      margin,
      value: selectedValue,
      ...rest
    },
    ref
  ) => {
    const { classes, cx } = useStyles();
    const [open, setOpen] = useState(false);

    const handleClose = () => {
      setOpen(false);
    };

    const handleOpen = () => {
      setOpen(true);
    };

    const handleChange = (event, child) => {
      const {
        props: { name }
      } = child;

      const { value } = event.target;
      // This prevents potentially saving 'undefined' into storage or/and settings it as selected
      if (value) {
        onChange(event.target.value, name);
      }
    };

    const { items: selectorItems = [], selected } = data;
    // There is a hidden bug. Originally, the actual value was coming from `rest` and overrode value={selectedItemValue} in Select below.
    // In the scope of OS-7177 it was taken out and broke the Selector. selectedItemValue is not the desired value. Needs to be investigated and fixed.
    const selectedItemValue = selectorItems.some((item) => item.value === selected) ? selected : selectedValue;

    const isItemSelected = (itemValue) => itemValue === selected;

    const getMenuItemClasses = ({ isSelected }) => cx(classes.menuItem, isSelected ? "" : classes.notSelectedItem);

    // We build selectors differenly using controlled/uncontrolled approach, see https://datatrendstech.atlassian.net/browse/OS-5830 to refactor.
    const readOnlyValue = selectorItems.find((item) => item.value === selectedValue || item.value === selectedItemValue);

    const selectionList = selectorItems.map((item) => {
      if (typeof item.render === "function") {
        return item.render({
          button: (menuItemProps) => {
            const { onClick, dataTestId: itemDataTestId, disabled, children: itemChildren, tooltip = {} } = menuItemProps;
            const { show: showTooltip = false, content: tooltipContent } = tooltip;

            const menuItem = (
              <MenuItem
                key={item.key}
                onClick={onClick}
                value={null}
                className={classes.menuItem}
                data-test-id={itemDataTestId}
                disabled={disabled}
              >
                {itemChildren}
              </MenuItem>
            );

            return showTooltip ? (
              <Tooltip title={tooltipContent} key={item.key}>
                <span>{menuItem}</span>
              </Tooltip>
            ) : (
              menuItem
            );
          },
          title: (titleProps) => (
            <MenuItem key={item.key} dataTestId={titleProps.dataTestId} className={classes.menuTitle}>
              {titleProps.children}
            </MenuItem>
          ),
          divider: () => <Divider key={item.key} />
        });
      }

      const { value, key, dataTestId: menuItemDataTestId, name, disabled, onClick } = item;
      const menuItemProps = {
        // TODO: There is always a value, but not an id for some cases, should migrate to 'key' field eventually
        key: `menuItem-${value || key}`,
        value,
        className: getMenuItemClasses({
          isSelected: isItemSelected(value)
        }),
        "data-test-id": menuItemDataTestId,
        name, // Name is used as the second parameter in the onChange handler, name is used when a selector has a read-only mode.
        disabled,
        onClick
      };

      return (
        <MenuItem key={menuItemProps.key} {...menuItemProps}>
          <MenuItemContent item={item} menuItemIcon={menuItemIcon} />
        </MenuItem>
      );
    });

    const formControlClasses = cx(
      classes.selector,
      isMobile ? classes["sectionDesktop".concat(capitalize(breakpoint))] : "",
      customClass || ""
    );

    const intl = useIntl();

    const label = labelId ? intl.formatMessage({ id: labelId }) : null;

    // Set min-width to something near floating label value https://github.com/mui/material-ui/issues/10917
    const memoizedPatchedSx = useMemo(() => {
      const labelApproximateWidth = (label?.length || 0) * 11;
      const userSx = sx || {};
      return { minWidth: `${labelApproximateWidth}px`, ...userSx };
    }, [label, sx]);

    return (
      <>
        <FormControl
          fullWidth={fullWidth}
          variant="outlined"
          className={formControlClasses}
          error={error}
          sx={memoizedPatchedSx}
          margin={margin}
        >
          {readOnly ? (
            <Input
              label={label}
              required={required}
              InputProps={{
                readOnly: true,
                startAdornment: menuItemIcon ? <MenuItemWithIcon item={readOnlyValue} menuItemIcon={menuItemIcon} /> : null
              }}
              value={readOnlyValue?.name}
            />
          ) : (
            <>
              {label && (
                <InputLabel shrink={shrinkLabel} id={`${labelId}-selector-label`} required={required}>
                  {label}
                </InputLabel>
              )}
              <Select
                notched={shrinkLabel}
                data-test-id={dataTestId}
                value={selectedItemValue}
                label={label}
                classes={{
                  root: cx(classes.selectRoot, rest.classes?.root),
                  icon: rest.endAdornment ? classes.iconPositionWithAdornment : ""
                }}
                IconComponent={ArrowDropDownIcon}
                onChange={handleChange}
                inputRef={ref}
                {...rest}
              >
                {selectionList}
              </Select>
              {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}{" "}
            </>
          )}
        </FormControl>
        {isMobile ? (
          <Box component="div" alignItems="center" className={classes["sectionMobile".concat(capitalize(breakpoint))]}>
            {children || null}
            <IconButton
              icon={<ExpandMoreOutlinedIcon />}
              customClass={classes.button}
              onClick={readOnly ? undefined : handleOpen}
            />
            <Select
              data-test-id={dataTestId}
              className={classes.mobileSelect}
              value={selectedItemValue}
              label={label}
              open={open}
              onClose={handleClose}
              onChange={handleChange}
              ref={ref}
              {...rest}
            >
              {selectionList}
            </Select>
          </Box>
        ) : null}
      </>
    );
  }
);

export default Selector;
