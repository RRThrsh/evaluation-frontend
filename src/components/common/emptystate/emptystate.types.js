import PropTypes from "prop-types";

export const EmptyStatePropTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    actionLabel: PropTypes.string,
    onAction: PropTypes.func,
    variant: PropTypes.oneOf(["default", "subtle"]),
};