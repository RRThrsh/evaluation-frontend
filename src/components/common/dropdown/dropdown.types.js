import PropTypes from "prop-types";

export const DropdownPropTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    variant: PropTypes.oneOf(["default", "primary"]),
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
        })
    ),
};