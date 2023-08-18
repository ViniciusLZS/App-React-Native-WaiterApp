import { FlatList, TouchableOpacity } from 'react-native';
import { Text } from '../Text';
import { CartItem } from '../../types/cartItem';

import * as S from './styles';
import { formatCurrent } from '../../utils/formatCurrency';
import { PlusCircle } from '../Icons/PlusCircle';
import { MinusCircle } from '../Icons/MinusCircle';
import { Button } from '../Button';
import { Product } from '../../types/Product';
import { OrderConfirmedModal } from '../OrderConfirmedModal';
import { useState } from 'react';
import { api } from '../../utils/api';

interface CartProps {
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onConfirmOrder: () => void;
  selectedTable: string;
}

export function Cart({ cartItems, onAdd, onDecrement, onConfirmOrder, selectedTable }: CartProps) {
  const [isVisibleOrderConfirmedModal, setIsVisibleOrderConfirmedModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const total = cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.quantity * cartItem.product.price;
  }, 0);

  async function handleConfirmOrder() {
    setIsLoading(true);
    const payload = {
      table: selectedTable,
      products: cartItems.map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
      })),
    };

    await api.post('/orders', payload);

    setIsLoading(false);

    setIsVisibleOrderConfirmedModal(true);
  }

  function handleOk() {
    onConfirmOrder();
    setIsVisibleOrderConfirmedModal(false);
  }

  return (
    <>
      <OrderConfirmedModal
        visible={isVisibleOrderConfirmedModal}
        onOK={handleOk}
      />

      {cartItems.length > 0 && (
        <FlatList
          data={cartItems}
          keyExtractor={cartItem => cartItem.product._id}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 20, maxHeight: 150 }}
          renderItem={({ item: cartItem }) => (
            <S.Item>
              <S.ProductContainer>
                <S.Image
                  source={{
                    uri: `http://192.168.18.7:3001/uploads/${cartItem.product.imagePath}`
                  }}
                />

                <S.QuantityContainer>
                  <Text size={14} color="#666">
                    {cartItem.quantity}x
                  </Text>
                </S.QuantityContainer>

                <S.ProductDetails>
                  <Text size={14} weight="600">{cartItem.product.name}</Text>
                  <Text size={14} color="#666">
                    {formatCurrent(cartItem.product.price)}
                  </Text>
                </S.ProductDetails>
              </S.ProductContainer>

              <S.Actions>
                <TouchableOpacity
                  onPress={() => onAdd(cartItem.product)}
                >
                  <PlusCircle />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onDecrement(cartItem.product)}>
                  <MinusCircle />
                </TouchableOpacity>
              </S.Actions>
            </S.Item>
          )}
        />
      )}

      <S.Summary>
        <S.TotalContainer>
          {cartItems.length > 0 ? (
            <>
              <Text color="#666">Total</Text>
              <Text size={20} weight="600">{formatCurrent(total)}</Text>
            </>
          ) : (
            <Text color="#999">Seu carrinho está vazio</Text>
          )}
        </S.TotalContainer>

        <Button
          disabled={cartItems.length === 0}
          onPress={handleConfirmOrder}
          isLoading={isLoading}
        >
          Confirmar pedido
        </Button>
      </S.Summary>
    </>
  );
}
