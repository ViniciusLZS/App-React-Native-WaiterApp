import { FlatList, Modal } from 'react-native';
import { Text } from '../Text';
import { Product } from '../../types/Product';

import * as S from './styles';
import { Close } from '../Icons/Close';
import { formatCurrent } from '../../utils/formatCurrency';
import { Button } from '../Button';

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({ visible, onClose, product, onAddToCart }: ProductModalProps) {
  if(!product) {
    return null;
  }

  function handleAddToCart() {
    onAddToCart(product!);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <S.Image
        source={{
          uri: `http://192.168.18.7:3001/uploads/${product.imagePath}`
        }}
      >
        <S.CloseButton onPress={onClose}>
          <Close />
        </S.CloseButton>
      </S.Image>

      <S.ModalBody>
        <S.Header>
          <Text size={24} weight="600">{product.name}</Text>
          <Text color="#666" style={{ marginTop: 8 }}>
            {product.description}
          </Text>
        </S.Header>

        {product.ingredients.length > 0 && (
          <>
            <S.IngredientsContainer>
              <Text weight="600" color="#666">Ingredientes</Text>
            </S.IngredientsContainer>

            <FlatList
              data={product.ingredients}
              keyExtractor={ingredients => ingredients._id}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 16 }}
              renderItem={({ item: ingredient }) => (
                <S.Ingredient>
                  <Text>{ingredient.icon}</Text>
                  <Text size={14} color="#666">
                    {ingredient.name}
                  </Text>
                </S.Ingredient>
              )}
            />
          </>
        )}
      </S.ModalBody>

      <S.Footer>
        <S.FooterContainer>
          <S.PriceContainer>
            <Text color="#666">Preço</Text>
            <Text size={20} weight="600">{formatCurrent(product.price)}</Text>
          </S.PriceContainer>

          <Button onPress={handleAddToCart}>
            Adicionar ao pedido
          </Button>
        </S.FooterContainer>
      </S.Footer>
    </Modal>
  );
}
