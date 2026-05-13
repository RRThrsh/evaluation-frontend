import PropTypes from "prop-types";

export const SpinnerPropTypes = {
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    variant: PropTypes.oneOf(["default", "light", "primary", "danger"]),
    fullscreen: PropTypes.bool,
};