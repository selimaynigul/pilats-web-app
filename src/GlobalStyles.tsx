import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  .ant-layout {
  background-color: ${({ theme }) => theme.bodyBg};
}

/* .ant-modal-content {
  background-color: transparent !important;
  backdrop-filter: blur(8px);
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0.5) !important;
  border-radius: 20px !important;
  }
  
  */
 
 .ant-modal-content {
  border-radius: 20px !important;
  }
/* 
  .ant-menu {
    background: ${({ theme }) => theme.bodyBg} !important;
  }

 */
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

.ant-menu {
  background:  ${({ theme }) => theme.bodyBg}!important;

}
.ant-menu-item {
  color:  ${({ theme }) => theme.primary}!important;
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

   
 @keyframes expandWidth {
  0% {
    width: 40px; /* Icon only */
  }
  50% {
    width: 40px; /* Midway expansion */
  }
  100% {
    width: 170px; /* Full width for content */
  }
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(-10px); /* Start slightly to the left */
  }
  100% {
    opacity: 1;
    transform: translateX(0); /* End in normal position */
  }
}

.ant-message-notice-content {
 
/*  padding: 0 12px !important;
  margin: auto !important; */
  border-radius: 50px !important;
  background-color: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid white; 
 
}

.ant-message-custom-slide .ant-message-content {
 
}


/* For WebKit browsers (Chrome, Safari) */
&::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

&::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
 
}

&::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 2px solid #f0f0f0;
}

&::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

`;

export default GlobalStyle;
