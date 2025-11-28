import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import { testGateway } from './gatewayTest';

export default function GatewayTestButton() {
  const [res, setRes] = useState<null | string>(null);

  return (
    <>
      <Button
        title="Test gateway (no auth)"
        onPress={async () => {
            console.log('Starting gateway test (no auth)...');
          const r = await testGateway('/post/12345');
          setRes(`${r.status} ${r.ok} - ${r.text?.slice(0,200) ?? ''}`);
          console.log('Gateway test result', r);
        }}
      />
      {res && <Text>{res}</Text>}
    </>
  );
}