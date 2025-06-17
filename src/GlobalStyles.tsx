import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

input,
textarea,
button,
select,
a {
    -webkit-tap-highlight-color: transparent;
}


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

  .ant-card-meta-description {
  color:  ${({ theme }) => theme.text}70 !important; 
  }
  
  .ant-input-filled, .ant-picker-filled, .ant-select-filled, .ant-input-number-input{
    height: 40px;
    border-radius: 8px;
   color:  ${({ theme }) => theme.text}; 
    &::placeholder {
    color:  ${({ theme }) => theme.formPlaceholder}; 
    }
  }

  .ant-input-filled:focus-within {
  border-color:  ${({ theme }) => theme.primary}; 
  }

  .ant-select-dropdown {
  background:  ${({ theme }) => theme.cardBg}; ;
  }

  .ant-select-focused:where(.css-dev-only-do-not-override-5wsri9).ant-select-filled:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer) .ant-select-selector {
background: ${({ theme }) => theme.menuItemHover}; 
  }

  .ant-select-item .ant-select-item-option-content{
  color:  ${({ theme }) => theme.text}; 
  }
  .ant-select-item:hover {
  background:  ${({ theme }) => theme.menuItemHover} !important; 
  }
  
  .ant-select-item-option-active {
    background:  ${({ theme }) => theme.menuItemHover} !important; 
}
  .country-code.ant-select-single .ant-select-selector  {
    border-radius: 8px 0 0 8px;
    
  }    

  .ant-select-selection-item {
  
  color: ${({ theme }) => theme.text};
  }
   .ant-select-arrow > *, .ant-picker-suffix > * {
  color: ${({ theme }) => theme.formPlaceholder};
   }
  
    .ant-modal-content {
      border-radius: 20px !important;
      background-color: ${({ theme }) => theme.bodyBg} !important;
  }


  .ant-modal-wrap {
  backdrop-filter: blur(2px);
  }

  
.ant-btn-variant-link > span {
  color: ${({ theme }) => theme.primary} !important;

}

 .ant-checkbox-checked .ant-checkbox-inner,
 .ant-radio-wrapper .ant-radio-checked .ant-radio-inner  {
    background-color: ${({ theme }) => theme.primary} !important;
    border-color: ${({ theme }) => theme.primary} !important;
  }


  .ant-menu-item-selected {
  background: ${({ theme }) => theme.menuItemSelected} !important;
  .anticon,
  svg,
  path {
    color: #f6f5ff !important;
  }

  .ant-menu-title-content {
    color: #f6f5ff !important;
  }
}

.ant-dropdown .ant-dropdown-menu {
  background-color:  ${({ theme }) => theme.cardBg} !important;
  
 
  }

   .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-title-content {
    color:  ${({ theme }) => theme.text} !important;
  
  }

.ant-menu {
  background:  ${({ theme }) => theme.bodyBg}!important;

}
.ant-menu-item {
  color:  ${({ theme }) => theme.menuItemText}!important;
  border-radius: 15px !important;
}
.ant-menu-item:hover {
  background: ${({ theme }) => theme.menuItemHover}  !important;
}

.ant-menu.ant-menu-inline-collapsed {
  width: 100% !important;
}

.ant-menu-item-selected:hover {
  background:  ${({ theme }) => theme.menuItemSelected} !important;
}

.ant-popover-inner {
  background-color:  ${({ theme }) => theme.cardBg} !important;
/*   border: 1px solid white; */
  border-radius: 15px !important;
}

  .ant-alert-info  .ant-alert-icon {
    color: ${({ theme }) => theme.primary} !important;
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

.ant-picker-cell-today > .ant-picker-cell-inner::before {
  
  border-color: ${({ theme }) => theme.primary} !important;
  border-radius: 20px !important;
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
