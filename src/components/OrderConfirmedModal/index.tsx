import { Modal } from 'react-native';
import { Text } from '../Text';

import * as S from './styles';
import { CheckCircle } from '../Icons/CheckCircle';

interface OrderConfirmedModalProps {
  visible: boolean;
  onOK: () => void;
}

export function OrderConfirmedModal({ visible, onOK }:OrderConfirmedModalProps) {
  return (
    <Modal
      visible={visible}
      animationType='fade'
    >
      <S.Container>
        <CheckCircle />

        <Text style={{ marginTop: 12 }} color="#fff" size={20} weight="600" >
          Pedido confirmado
        </Text>

        <Text style={{ marginTop: 4 }}  color="#fff" opacity={0.9} >
          O pedido já entrou na fila de produção!
        </Text>

        <S.OkButton onPress={onOK}>
          <Text color="#D73035" weight="600">OK</Text>
        </S.OkButton>
      </S.Container>
    </Modal>
  );
}
