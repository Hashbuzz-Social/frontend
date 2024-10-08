import React from 'react'

const calculateDimensions = (width?: number, height?: number) => {
	const aspectRatio = 300 / 150; // 2:1 aspect ratio

	if (width && !height) {
		return { width, height: width / aspectRatio };
	} else if (height && !width) {
		return { width: height * aspectRatio, height };
	} else if (width && height) {
		return { width, height };
	} else {
		return { width: 300, height: 150 }; // Default dimensions
	}
};

interface Props extends React.SVGProps<SVGSVGElement> { }

const InfiniteLoop = ({ width, height, ...restProps }: Props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"
			width={height ? calculateDimensions(undefined, +height).width : width} height={width ? calculateDimensions(+width).height : height} {...restProps}>
			<path fill="none" stroke="#5265FF" stroke-width="15" stroke-linecap="round" stroke-dasharray="300 385" stroke-dashoffset="0" d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z">
				<animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite">
				</animate>
			</path>
		</svg>
	)
}

export default InfiniteLoop;