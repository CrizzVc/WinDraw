import React from 'react';

const svgProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
};

const Icon = ({ children, ...props }) => (
    <svg {...svgProps} {...props} aria-hidden="true">
        {children}
    </svg>
);

export const BrushIcon = (props) => (
    <Icon {...props}>
        <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
        <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </Icon>
);

export const EraserIcon = (props) => (
    <Icon {...props}>
        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
        <path d="M22 21H7" />
        <path d="m5 11 9 9" />
    </Icon>
);

export const LayersIcon = (props) => (
    <Icon {...props}>
        <rect x="8" y="8" width="14" height="14" rx="2.5" />
        <path d="M4.5 16.5A2.5 2.5 0 0 1 4 14.5V5a2 2 0 0 1 2-2h9.5A2.5 2.5 0 0 1 18 5.5" />
    </Icon>
);

export const UndoIcon = (props) => (
    <Icon {...props}>
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </Icon>
);

export const RedoIcon = (props) => (
    <Icon {...props}>
        <path d="m15 14 5-5-5-5" />
        <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
    </Icon>
);

export const TrashIcon = (props) => (
    <Icon {...props}>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
    </Icon>
);

export const PlusIcon = (props) => (
    <Icon {...props}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
    </Icon>
);

export const CloseIcon = (props) => (
    <Icon {...props}>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </Icon>
);

export const CheckIcon = (props) => (
    <Icon {...props}>
        <path d="M20 6 9 17l-5-5" />
    </Icon>
);
