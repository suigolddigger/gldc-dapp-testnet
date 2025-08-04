// Footer.tsx
import { Div, Text, Image } from 'atomize';

const Footer = () => {
  return (
    <Div bg="white" p={{ x: '4rem', y: '1rem' }} textAlign="center" shadow="2" borderTop="1px solid #d1d5db">
      <Div d="flex" justify="center" m={{ b: '0.5rem' }}>
        <a href="https://x.com/GldcWorld" style={{ marginRight: '2rem' }}>
          <Div d="flex" align="center">
            <Image src="/xlogo7.png" w="30px" h="30px" m={{ r: '0.5rem' }} bg="transparent" />
          </Div>
        </a>
        <a href="https://t.me/+EVR3Dtd94KphMzIx" style={{ marginRight: '2rem' }}>
          <Div d="flex" align="center">
            <Image src="/telegram9.png" w="30px" h="30px" m={{ r: '0.5rem' }} bg="transparent" />
          </Div>
        </a>
        <a href="https://github.com/suigolddigger" target="_blank" rel="noopener noreferrer">
          <Div d="flex" align="center">
            <Image src="/github.png" w="30px" h="30px" m={{ r: '0.5rem' }} bg="transparent" />
          </Div>
        </a>
      </Div>
      <Text textSize="tiny" textColor="#111827" style={{ fontStyle: 'italic' }}></Text>
    </Div>
  );
};

export default Footer;