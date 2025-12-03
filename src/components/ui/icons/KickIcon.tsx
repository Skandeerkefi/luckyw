// src/components/icons/KickIcon.tsx
import React from "react";

export const KickIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		{...props}
		viewBox='0 0 24 24'
		fill='currentColor'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path d='M4 4h4v16H4V4zm6 0h4v6h6v4h-6v6h-4V4z' />
	</svg>
);
