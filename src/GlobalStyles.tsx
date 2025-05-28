import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
 a {
 color: black;

 &:hover {
 color: black}
 }

 h1, h2, h3, h4, p {
 margin: 0;}
  .ant-layout {
  background-color: ${({ theme }) => theme.bodyBg};
}


 .ant-modal-content {
  border-radius: 20px !important;
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
 
  border-radius: 50px !important;
 
}

.ant-picker-cell-selected > .ant-picker-cell-inner {
  background: ${({ theme }) => theme.primary} !important;
  border-radius: 50px !important;
}

.ant-picker-cell-in-view:hover > .ant-picker-cell-inner { 
border-radius: 50px !important;
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

.highlighted-event {
  animation: highlight 2s ease-in-out;
}

@keyframes highlight {
  10% {
    background-color: #5d46e5; /* Original color */
  }

  30% {
    background-color:rgb(198, 192, 230);/* Highlight color */
  }

  50% {
    background-color: #5d46e5; /* Gradually return to the original color */
  }

   70% {
    background-color:rgb(198, 192, 230);/* Highlight color */
  }

  90% {
    background-color: #5d46e5; /* Gradually return to the original color */
  }

`;

export default GlobalStyle;
