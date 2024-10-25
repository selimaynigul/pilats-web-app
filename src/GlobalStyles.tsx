import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
/*   body {
    margin: 0;
    padding: 0;
    background-color: #121212;
    color: white;
  }
 */
  .ant-layout {
  background-color: white;
}

.ant-menu-item-selected {
  background: #5d46e5 !important;
  .anticon,
  svg,
  path {
    color: #f6f5ff !important;
  }

  .ant-menu-title-content {
    color: #f6f5ff !important;
  }
}
.ant-menu-item {
  color: #5d46e5 !important;
  border-radius: 15px !important;
}
.ant-menu-item:hover {
  background: #f6f5ff !important;
}

.ant-layout-sider-children {
}

.ant-menu.ant-menu-inline-collapsed {
  width: 100% !important;
}

.ant-menu-item-selected:hover {
  background: #5d46e5 !important;
}

.ant-popover-inner {
  background-color: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid white;
  border-radius: 15px !important;
}

 /*  .ant-input-affix-wrapper,
  .ant-input {
    background: ${({ theme }) => theme.inputBg} !important;
    border-color: ${({ theme }) => theme.inputBorder} !important;

    &::placeholder {
      color: ${({ theme }) => theme.text} !important;
    }
  } */
`;

export default GlobalStyle;
