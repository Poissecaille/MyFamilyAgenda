import React, { useContext } from 'react';
import { SafeArea } from './SafeArea';
import styled from 'styled-components/native';
import { List, Avatar } from 'react-native-paper';
import { AuthenticationContext } from '../src/components/Authentication';
import { Text } from './Text';
import { Spacer } from './Spacer';
import { theme } from '../src/utility/Global';

const SettingsItem = styled(List.Item)`
  padding: ${theme.space[3]};
`;
const AvatarContainer = styled.View`
  align-items: center;
`;

export const SettingsScreen = () => {
  const { onLogout, user } = useContext(AuthenticationContext);
  return (
    <SafeArea color={theme.themeColors.Primary_Color}>
      <AvatarContainer>
        <Avatar.Icon size={180} icon="human" />
        <Spacer position="top" size="large">
          <Text variant="label">{user.email}</Text>
        </Spacer>
      </AvatarContainer>
      <List.Section>
        <SettingsItem
          style={{ padding: 16 }}
          title="Logout"
          left={props => <List.Icon {...props} color="black" icon="door" />}
          onPress={onLogout}
        />
      </List.Section>
    </SafeArea>
  );
};
