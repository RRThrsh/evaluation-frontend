import PropTypes from "prop-types";

export const BadgePropTypes = {
    label: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(["default", "success", "warning", "error"]),
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    onPress: PropTypes.func,
};