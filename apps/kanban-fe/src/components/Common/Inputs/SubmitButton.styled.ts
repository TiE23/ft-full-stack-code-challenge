import styled from 'styled-components/macro';

interface SubmitButtonProps {
  disabled?: boolean;
}
export const SubmitButton = styled.button<SubmitButtonProps>`
  color: #fff;
  text-align: center;

  padding: 6px 12px;

  background-color: ${({
    disabled,
    theme: {
      design: {
        common: {
          input: { button },
        },
      },
    },
  }) => (disabled ? button.disabledColor : button.submit.activeColor)};
  border: none;
  border-radius: ${(p) => p.theme.design.newEntity.radiusPx}px;
  box-shadow: none;
  cursor: pointer;
`;
export default SubmitButton;
