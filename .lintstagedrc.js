module.exports = {
    "*.{md,json,css,scss}": "prettier --write",
    "*.{js,jsx,ts,tsx}": [
        "prettier --write",
        "eslint . --no-warn-ignored --format=stylish --max-warnings=0",
    ],
    "*.{ts,tsx}": () => "tsc --noEmit --skipLibCheck",
    "*.{css,scss,sass}": "stylelint --fix",
};
