import PropTypes from "prop-types";

export const CardPropTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node,
    onPress: PropTypes.func,
    variant: PropTypes.oneOf([
        "default",
        "elevated",
        "outlined",
        "primary",
    ]),
    className: PropTypes.string,
};