import styled from 'styled-components/native';

const defaultTextStyles = theme => `
  font-family: Oswald_400Regular;
  font-weight: 400;
  color: #C8D6F6;
  flex-wrap: wrap;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const body = theme => `
    font-size:  16px;
`;

const hint = theme => `
    font-size: 16px;
`;

const error = theme => `
    color: red;
`;

const caption = theme => `
    font-size: 12px;
    font-weight: 700;
`;

const label = theme => `
    font-family: Lato_400Regular;
    font-size: 16px;
    font-weight: 500;
`;

const variants = {
  body,
  label,
  caption,
  error,
  hint,
};

export const Text = styled.Text`
  ${({theme}) => defaultTextStyles(theme)}
  ${({variant, theme}) => variants[variant](theme)}
`;

Text.defaultProps = {
  variant: 'body',
};
