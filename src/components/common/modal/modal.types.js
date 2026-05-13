import PropTypes from "prop-types";

export const ModalPropTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(["default", "danger"]),

    primaryAction: PropTypes.shape({
        label: PropTypes.string,
        onPress: PropTypes.func,
    }),

    secondaryAction: PropTypes.shape({
        label: PropTypes.string,
        onPress: PropTypes.func,
    }),
};