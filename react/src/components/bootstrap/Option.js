import React from 'react';
import PropTypes from 'prop-types';

export const Options = ({ list }) => {
	return list?.map((i) => (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<Option key={i.value} value={i.value} {...i}>
			{i.text || i.label}
		</Option>
	));
};
Options.propTypes = {
	list: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		}),
	),
};
Options.defaultProps = {
	list: null,
};

const Option = ({ children, value, disabled, ariaLabelledby, selected, ...props }) => {
	return (
		<option
			value={value}
			disabled={disabled}
			aria-labelledby={ariaLabelledby || children}
            selected={selected}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}>
			{children}
		</option>
	);
};
Option.propTypes = {
	children: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	disabled: PropTypes.bool,
	ariaLabelledby: PropTypes.string,
    selected: PropTypes.bool,
};
Option.defaultProps = {
	value: null,
	disabled: false,
	ariaLabelledby: null,
    selected: false,
};

export default Option;
