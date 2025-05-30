import React from "react";
import type { SVGProps } from "react";

const MainLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props: SVGProps<SVGSVGElement>) => (
    <svg width={128} height={128} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" overflow="hidden" {...props}>
        <defs>
            <clipPath id="clip0">
                <rect x={0} y={0} width={512} height={512} />
            </clipPath>
            <clipPath id="clip1">
                <rect x={60} y={64} width={326} height={326} />
            </clipPath>
            <clipPath id="clip2">
                <rect x={60} y={64} width={326} height={326} />
            </clipPath>
            <clipPath id="clip3">
                <rect x={60} y={64} width={326} height={326} />
            </clipPath>
            <clipPath id="clip4">
                <rect x={126} y={122} width={326} height={326} />
            </clipPath>
            <clipPath id="clip5">
                <rect x={126} y={122} width={326} height={326} />
            </clipPath>
            <clipPath id="clip6">
                <rect x={126} y={122} width={326} height={326} />
            </clipPath>
        </defs>
        <g clipPath="url(#clip0)">
            <g clipPath="url(#clip1)">
                <g clipPath="url(#clip2)">
                    <g clipPath="url(#clip3)">
                        <path
                            d="M325.554 226.66C324.535 226.66 323.177 226.66 322.158 226.66 322.158 226.66 322.158 226.66 322.158 226.66 322.158 210.021 314.008 194.74 300.765 185.231 287.181 175.723 269.862 173.346 254.242 178.779 241.337 153.65 212.812 140.746 185.646 147.198 158.479 153.65 138.783 178.1 138.783 206.285 138.783 206.285 138.783 206.625 138.783 206.965 120.106 203.908 101.429 211.719 89.8833 226.66 78.6771 241.942 76.6396 261.977 84.45 278.956 92.6 295.935 109.579 307.142 128.256 308.16L128.256 308.5 325.215 308.5C347.627 308.5 365.965 290.162 365.965 267.75 365.965 245.337 347.967 226.66 325.554 226.66Z"
                            fill="#FFD340"
                        />
                    </g>
                </g>
            </g>
            <g clipPath="url(#clip4)">
                <g clipPath="url(#clip5)">
                    <g clipPath="url(#clip6)">
                        <path
                            d="M391.554 284.66C390.535 284.66 389.177 284.66 388.158 284.66 388.158 284.66 388.158 284.66 388.158 284.66 388.158 268.021 380.008 252.74 366.765 243.231 353.181 233.723 335.862 231.346 320.242 236.779 307.337 211.65 278.812 198.746 251.646 205.198 224.479 211.65 204.783 236.1 204.783 264.285 204.783 264.285 204.783 264.625 204.783 264.965 186.106 261.908 167.429 269.719 155.883 284.66 144.677 299.942 142.64 319.977 150.45 336.956 158.6 353.935 175.579 365.142 194.256 366.16L194.256 366.5 391.215 366.5C413.627 366.5 431.965 348.162 431.965 325.75 431.965 303.337 413.967 284.66 391.554 284.66Z"
                            fill="#3473A4"
                        />
                    </g>
                </g>
            </g>
        </g>
    </svg>
);

export default MainLogo;
