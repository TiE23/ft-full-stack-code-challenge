import { createGlobalStyle, ThemeProps } from 'styled-components/macro';

export const theme = {
  fonts: {
    regular: {
      'font-family': 'Ubuntu, sans-serif',
      'font-weight': '400',
      'font-size': '16px',
    },
  },
  design: {
    app: {
      bgColor: '#3179ba',
    },
    board: {
      bgColor: '#c3ceda',
      paddingPx: 15,
      radiusPx: 15,
    },
    category: {
      bgColor: '#ebecf0',
      widthPx: 300, // Used by multiple components.
      radiusPx: 6,
    },
    task: {
      bgColor: '#fff',
      expandedBgColor: '#f7f7f7',
      fadedTextColor: '#404040',
      radiusPx: 3,
    },
    newEntity: {
      radiusPx: 3,
    },
  },
};

export type MainThemeProps = ThemeProps<typeof theme>;
export const GlobalStyle = createGlobalStyle<MainThemeProps>`
  body {
    margin: 0;
    ${(p) => p.theme.fonts.regular};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *,
  *::after,
  *::before { box-sizing: border-box; touch-action: none; }

  h1, h2, h3, h4, h5, h6 { margin: 0; }

  input,
  textarea,
  button {
    ${(p) => p.theme.fonts.regular};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* This makes the ground elements of the page take up the entire viewport. */
  html,
  body,
  #root {
    height: 100%;
  }
`;
